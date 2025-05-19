use ssr_html::prelude::*;
use ssr_html_macros::{component, html};

#[derive(Default)]
pub enum Color {
    #[default]
    Primary,
    Secondary,
    Success,
    Info,
    Warning,
    Error,
    Neutral,
}

#[derive(Default)]
pub enum Variant {
    #[default]
    Solid,
    Outline,
    Subtle,
    Soft,
    Ghost,
    Link,
}

#[component]
pub async fn Button(
    #[prop(optional)] label: Option<String>,
    #[prop(optional)] color: Color,
    #[prop(optional)] variant: Variant,
    #[prop(optional)] icon: Option<String>,
) -> String {
    let color_class = match color {
        Color::Secondary => {
            "bg-secondary hover:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary focus-visible:outline-secondary"
        }
        Color::Success => {
            "bg-success hover:bg-success/75 disabled:bg-success aria-disabled:bg-success focus-visible:outline-success"
        }
        Color::Info => {
            "bg-info hover:bg-info/75 disabled:bg-info aria-disabled:bg-info focus-visible:outline-info"
        }
        Color::Warning => {
            "bg-warning hover:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning focus-visible:outline-warning"
        }
        Color::Error => {
            "bg-error hover:bg-error/75 disabled:bg-error aria-disabled:bg-error focus-visible:outline-error"
        }
        Color::Neutral => {
            "bg-inverted hover:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted focus-visible:outline-inverted"
        }
        Color::Primary => {
            "bg-primary hover:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-primary"
        }
    };
    html! {
        <button class={format!("rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-inverted focus-visible:outline-2 focus-visible:outline-offset-2 {color_class}")}>
            <span x-if={let Some(icon) = icon} class={icon}></span>
            {label.unwrap_or("".to_string())}
        </button>
    }
}
