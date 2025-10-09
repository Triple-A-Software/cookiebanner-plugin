use std::borrow::Cow;
use std::str::FromStr;

use axum::Router;
use axum::extract::State;
use axum::routing::post;
use lol_html::html_content::{ContentType, Element};
use lol_html::{ElementContentHandlers, HtmlRewriter, Selector};

use crate::AppState;
use crate::model::{SelectorWithCookieCategory, Settings};

pub mod api;

pub fn internal() -> Router<AppState> {
    Router::new().route("/rewriter", post(internal_rewriter))
}

fn build_rewriter_handler(
    selector: SelectorWithCookieCategory,
) -> Box<dyn FnMut(&mut Element<'_, '_>) -> lol_html::HandlerResult> {
    Box::new(move |el| {
        let tag_name = el.tag_name_preserve_case();
        el.set_tag_name("template")?;
        el.set_attribute("data-original-tag", &tag_name)?;
        el.set_attribute("cookie-banner-blocked", "")?;
        if let Some(placeholder) = selector.cookie_category.placeholder_html.as_deref() {
            el.after(
                &format!(r#"<div style="display:contents;" class="cookie-banner-placeholder">{placeholder}</div>"#),
                ContentType::Html,
            );
        }
        Ok(())
    })
}

async fn internal_rewriter(State(state): State<AppState>, body: String) -> String {
    let settings: Settings = sqlx::query_as(r#"select * from settings where id = 'settings'"#)
        .fetch_one(&state.db)
        .await
        .unwrap();
    if !settings.enabled {
        return body;
    }
    let selectors: Vec<SelectorWithCookieCategory> = sqlx::query_as(
        r#"
        select * from selector
        left join lateral (
            select row_to_json(cookie_category) as cookie_category from cookie_category
                where cookie_category.id = selector.cookie_category_id
        ) on true"#,
    )
    .fetch_all(&state.db)
    .await
    .unwrap();
    let rewriter_handler = selectors
        .into_iter()
        .map(|selector| {
            (
                Cow::Owned(Selector::from_str(&selector.selector).unwrap()),
                ElementContentHandlers::default().element(build_rewriter_handler(selector)),
            )
        })
        .collect();
    let mut output = vec![];
    {
        let mut rewriter = HtmlRewriter::new(
            lol_html::Settings {
                element_content_handlers: rewriter_handler,
                ..lol_html::Settings::new()
            },
            |c: &[u8]| output.extend_from_slice(c),
        );
        let _ = rewriter.write(body.as_bytes());
        let _ = rewriter.end();
    }
    String::from_utf8(output).unwrap()
}
