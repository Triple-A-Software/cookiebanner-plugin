use axum::extract::State;
use axum::http::StatusCode;
use axum::routing::post;
use axum::{Router, response::IntoResponse, routing::get};
use sqlx::prelude::*;
use ssr_html::HtmlStream;
use ssr_html::prelude::*;
use ssr_html_macros::html;
use tower_http::services::ServeDir;

use crate::model::Settings;
use crate::{AppState, macros};

pub fn ui() -> Router<AppState> {
    Router::new()
        .route("/", get(ui_page))
        .nest_service("/public", ServeDir::new("public"))
}

pub fn api() -> Router<AppState> {
    Router::new().route("/", post(update_settings))
}

#[derive(FromRow)]
struct Page {
    id: i32,
    title: String,
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
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <script src={macros::ui_path!("/public/htmx.min.js")}></script>
            <link rel="stylesheet" href={macros::ui_path!("/public/main.css")} />
            <title>"Cookie banner ui"</title>
        </head>
        <body>
            <form action={macros::api_path!("/")} hx-boost={true}>
                <label r#for="enabled">"Enabled:"</label>
                <input r#type="checkbox" id="enabled" name="enabled" checked={settings.enabled}/>

                <br />

                <label r#for="privacy-policy">"Choose a Privacy Policy Page:"</label>
                <select id="privacy-policy" name="privacy-policy">
                    <option
                        x-for={page in pages}
                        value={page.id}
                        selected={settings.privacy_policy_page_id.map(|p| page.id == p)}
                    >
                        {page.title}
                    </option>
                </select>
            </form>
        </body>
        </html>
    })
}

async fn update_settings(State(state): State<AppState>) -> impl IntoResponse {
    StatusCode::OK
}
