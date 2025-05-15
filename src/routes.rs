use std::fmt::Display;

use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::Redirect;
use axum::routing::post;
use axum::{Router, response::IntoResponse, routing::get};
use serde::Deserialize;
use sqlx::prelude::*;
use ssr_html::HtmlStream;
use ssr_html::prelude::*;
use ssr_html_macros::html;
use tower_http::services::ServeDir;

use crate::components::button::{Button, ButtonProps};
use crate::components::form::{
    FormField, FormFieldProps, Id, InputCheckbox, InputCheckboxProps, InputSelect, InputSelectProps,
};
use crate::model::Settings;
use crate::{AppState, macros};

pub fn ui() -> Router<AppState> {
    Router::new()
        .route("/", get(ui_page))
        .nest_service("/public", ServeDir::new("public"))
}

pub fn api() -> Router<AppState> {
    Router::new().route("/settings", post(update_settings))
}

#[derive(FromRow)]
struct Page {
    id: i32,
    title: String,
}

impl Id for Page {
    type TId = i32;

    fn id(&self) -> Self::TId {
        self.id
    }
}

impl Display for Page {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.title)
    }
}

async fn ui_page(State(state): State<AppState>) -> impl IntoResponse {
    let pages: Vec<Page> = sqlx::query_as(r#"select * from not_deleted.page"#)
        .fetch_all(&state.cms_db)
        .await
        .unwrap();
    let settings: Settings = sqlx::query_as(r#"select * from settings where id = 'settings'"#)
        .fetch_one(&state.db)
        .await
        .unwrap();
    HtmlStream(html! {
        <html lang="en" class="dark">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <script src={macros::ui_path!("/public/htmx.min.js")}></script>
            <script src={macros::ui_path!("/public/json-enc-custom.js")}></script>
            <link rel="stylesheet" href={macros::ui_path!("/public/main.css")} />
            <title>"Cookie banner ui"</title>
        </head>
        <body class="bg-default" hx-ext="json-enc-custom">
            <form
                action={macros::api_path!("/settings")}
                parse-types="true"
                method="POST"
                hx-boost={true}
                class="flex flex-col gap-2"
            >
                <label r#for="enabled">"Enabled:"</label>
                <InputCheckbox id={"enabled".to_string()} value={settings.enabled} />

                <br />

                <FormField id={"privacy_policy_page_id".to_string()} label={"Choose a Privacy Policy Page:".to_string()}>
                    <InputSelect
                        options={pages}
                        value={settings.privacy_policy_page_id}
                        id={"privacy_policy_page_id".to_string()}
                    />
                </FormField>

                <Button label={Some("Save".to_string())} icon={Some("i-tabler-device-floppy".to_string())} />
            </form>
        </body>
        </html>
    })
}

#[derive(Deserialize, Debug)]
struct SettingsUpdateBody {
    enabled: bool,
    privacy_policy_page_id: i32,
}
async fn update_settings(
    State(state): State<AppState>,
    Json(body): Json<SettingsUpdateBody>,
) -> impl IntoResponse {
    let settings: Settings = sqlx::query_as(
        r#"update settings set enabled = $1, privacy_policy_page_id = $2 returning *"#,
    )
    .bind(body.enabled)
    .bind(body.privacy_policy_page_id)
    .fetch_one(&state.db)
    .await
    .unwrap();
    Redirect::to("/ui")
}
