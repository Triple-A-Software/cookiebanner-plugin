use std::collections::HashMap;

use axum::{Router, extract::State, http::StatusCode, response::IntoResponse, routing::post};
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
    #[ts(as = "Vec<CookieCategory>")]
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
    #[ts(as = "Vec<Selector>")]
    selectors: Option<Json<Vec<Selector>>>,
}

#[derive(Serialize, Deserialize, Debug, FromRow, TS)]
#[ts(export, export_to = "index.ts")]
struct Selector {
    id: Option<i32>,
    selector: String,
}

async fn update_settings(
    State(state): State<AppState>,
    axum::Json(body): axum::Json<Settings>,
) -> impl IntoResponse {
    sqlx::query(r#"update settings set enabled = $1 where id = 'settings'"#)
        .bind(body.enabled)
        .execute(&state.db)
        .await
        .unwrap();
    if let Some(mut cookie_categories) = body.cookie_categories {
        for category in cookie_categories.iter_mut() {
            if let Some(id) = category.id {
                sqlx::query(
                    r#"update cookie_category set
                    enabled = $1,
                    label = $2,
                    description = $3,
                    placeholder_html = $4
                where id = $5
            "#,
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
                        r#"insert into selector (cookie_category_id, selector) values ($1, $2)"#,
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
    StatusCode::OK
}

async fn get_settings(State(state): State<AppState>) -> impl IntoResponse {
    let settings: Settings = sqlx::query_as(
        r#"
        select * from settings
        left join lateral (
            select row_to_json(c) as cookie_categories from cookie_category c
            left join lateral (
                select row_to_json(s) as selectors from selector s where cookie_category_id = c.id
            ) on true
        ) on true
        where settings.id = 'settings'
        "#,
    )
    .fetch_one(&state.db)
    .await
    .unwrap();
    axum::Json(settings)
}
