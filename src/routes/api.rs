use std::collections::HashMap;

use axum::{
    Router,
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::post,
};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, types::Json};
use ts_rs::TS;

use crate::{AppState, model};

pub fn router() -> Router<AppState> {
    Router::new().route("/settings", post(update_settings).get(get_settings))
}

#[derive(Serialize, Deserialize, Debug, FromRow, TS)]
#[ts(export, export_to = "index.ts")]
struct Settings {
    #[serde(default)]
    enabled: bool,
    #[ts(as = "Option<Vec<CookieCategory>>")]
    cookie_categories: Option<Json<Vec<CookieCategory>>>,
}

#[derive(Serialize, Deserialize, Debug, FromRow, TS)]
#[ts(export, export_to = "index.ts")]
struct CookieCategory {
    id: Option<i32>,
    enabled: bool,
    #[ts(type = "Record<string, string>")]
    label: Json<HashMap<String, String>>,
    #[ts(type = "Record<string, string>")]
    description: Json<HashMap<String, String>>,
    placeholder_html: Option<String>,
    #[ts(as = "Option<Vec<Selector>>")]
    selectors: Option<Json<Vec<Selector>>>,
}

#[derive(Serialize, Deserialize, Debug, FromRow, TS)]
#[ts(export, export_to = "index.ts")]
struct Selector {
    id: Option<i32>,
    selector: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "index.ts")]
struct ApiError {
    message: String,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (StatusCode::BAD_REQUEST, axum::Json(self)).into_response()
    }
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "index.ts")]
struct StatusResponse {
    success: bool,
}
impl StatusResponse {
    pub fn success() -> Self {
        Self { success: true }
    }
}

async fn update_settings(
    State(state): State<AppState>,
    axum::Json(body): axum::Json<Settings>,
) -> Result<Response, Response> {
    if body
        .cookie_categories
        .as_ref()
        .map(|categories| {
            categories
                .iter()
                .any(|c| c.placeholder_html.as_ref().is_none_or(|s| s.is_empty()))
        })
        .unwrap_or_default()
    {
        return Err(ApiError {
            message: "placeholder_missing".to_string(),
        }
        .into_response());
    }
    sqlx::query(r#"update settings set enabled = $1 where id = 'settings'"#)
        .bind(body.enabled)
        .execute(&state.db)
        .await
        .unwrap();
    if let Some(mut cookie_categories) = body.cookie_categories {
        sqlx::query(r#"delete from cookie_category where not (id = ANY($1))"#)
            .bind(cookie_categories.iter().map(|c| c.id).collect::<Vec<_>>())
            .execute(&state.db)
            .await
            .unwrap();
        for category in cookie_categories.iter_mut() {
            if let Some(id) = category.id {
                sqlx::query(
                    r#"update cookie_category set
                        enabled = $1,
                        label = $2,
                        description = $3,
                        placeholder_html = $4
                    where id = $5"#,
                )
                .bind(category.enabled)
                .bind(&category.label)
                .bind(&category.description)
                .bind(&category.placeholder_html)
                .bind(id)
                .execute(&state.db)
                .await
                .unwrap();
            } else {
                let inserted: model::CookieCategory = sqlx::query_as(
                    r#"insert into cookie_category
                        (enabled, label, description, placeholder_html)
                    values
                        ($1, $2, $3, $4)
                    returning *"#,
                )
                .bind(category.enabled)
                .bind(&category.label)
                .bind(&category.description)
                .bind(&category.placeholder_html)
                .fetch_one(&state.db)
                .await
                .unwrap();
                category.id = Some(inserted.id);
            }
            if let Some(selectors) = category.selectors.as_ref() {
                sqlx::query(r#"delete from selector where not (id = ANY($1))"#)
                    .bind(selectors.iter().map(|s| s.id).collect::<Vec<_>>())
                    .execute(&state.db)
                    .await
                    .unwrap();
                for selector in selectors.iter() {
                    if let Some(id) = selector.id {
                        sqlx::query(r#"update selector set selector = $1 where id = $2 "#)
                            .bind(&selector.selector)
                            .bind(id)
                            .execute(&state.db)
                            .await
                            .unwrap();
                    } else {
                        sqlx::query(
                            r#"insert into selector (
                                cookie_category_id, selector
                            ) values ($1, $2)"#,
                        )
                        .bind(category.id)
                        .bind(&selector.selector)
                        .execute(&state.db)
                        .await
                        .unwrap();
                    }
                }
            }
        }
    }
    Ok(axum::Json(StatusResponse::success()).into_response())
}

async fn get_settings(State(state): State<AppState>) -> impl IntoResponse {
    let settings: Settings = sqlx::query_as(
        r#"
        SELECT
            s.*,
            cookie_categories_data.cookie_categories
        FROM
            settings s
        LEFT JOIN LATERAL (
            SELECT
                coalesce(json_agg(
                    jsonb_set(
                        to_jsonb(c),
                        '{selectors}',
                        (
                            SELECT coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb)
                            FROM selector s
                            WHERE s.cookie_category_id = c.id
                        )
                    )
                ), '[]'::json) AS cookie_categories
            FROM
                cookie_category c
        ) AS cookie_categories_data ON true
        WHERE
            s.id = 'settings';
        "#,
    )
    .fetch_one(&state.db)
    .await
    .unwrap();
    axum::Json(settings)
}
