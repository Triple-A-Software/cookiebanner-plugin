use std::{
    env,
    net::{IpAddr, SocketAddr},
};

use axum::Router;
use sqlx::PgPool;
use tokio::net::TcpListener;
use tower_http::{
    normalize_path::NormalizePathLayer,
    trace::{self, TraceLayer},
};
use tracing::Level;

mod model;
mod routes;

#[derive(Clone)]
struct AppState {
    db: PgPool,
    cms_db: PgPool,
}

#[cfg(debug_assertions)]
const API_PREFIX: &str = "";
#[cfg(not(debug_assertions))]
const API_PREFIX: &str = "/api/rest/plugins/cookie-banner/api";

#[cfg(debug_assertions)]
const UI_PREFIX: &str = "";
#[cfg(not(debug_assertions))]
const UI_PREFIX: &str = "/api/rest/plugins/cookie-banner";

pub mod macros {
    macro_rules! ui_path {
        ($path: expr) => {
            format!("{}/ui{}", crate::UI_PREFIX, $path)
        };
    }
    macro_rules! api_path {
        ($path: expr) => {
            format!("{}/api{}", crate::API_PREFIX, $path)
        };
    }
    pub(crate) use api_path;
    pub(crate) use ui_path;
}

async fn create_db() -> PgPool {
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db = sqlx::PgPool::connect(&db_url).await.unwrap();
    sqlx::migrate!("./migrations")
        .run(&db)
        .await
        .expect("Failed to run migrations");
    db
}

async fn connect_cms_db() -> PgPool {
    let db_url = env::var("CMS_DATABASE_URL").expect("CMS_DATABASE_URL must be set");
    sqlx::PgPool::connect(&db_url).await.unwrap()
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_target(false)
        .compact()
        .init();

    let db = create_db().await;
    let cms_db = connect_cms_db().await;

    sqlx::query(r#"insert into settings (id) values ('settings') on conflict do nothing"#)
        .execute(&db)
        .await
        .unwrap();

    let state = AppState { db, cms_db };
    let router = Router::new()
        .nest("/ui", routes::ui())
        .nest("/api", routes::api())
        .layer(NormalizePathLayer::trim_trailing_slash())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        )
        .with_state(state);

    let port = env::var("PORT").unwrap_or("3000".to_string());
    let listener = TcpListener::bind((
        "0.0.0.0".parse::<IpAddr>().unwrap(),
        port.parse::<u16>().unwrap(),
    ))
    .await
    .unwrap();
    tracing::info!("Listening on {}", listener.local_addr().unwrap());
    axum::serve(
        listener,
        router.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .unwrap();
}
