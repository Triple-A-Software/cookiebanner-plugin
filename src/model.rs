use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{prelude::*, types::Json};

#[derive(Clone, Serialize, Deserialize, FromRow, Debug)]
pub struct Settings {
    id: String,
    pub enabled: bool,
}

#[derive(Clone, Serialize, Deserialize, FromRow, Debug)]
pub struct CookieCategory {
    pub id: i32,
    pub enabled: bool,
    /// a map of locale -> translation
    pub label: Json<HashMap<String, String>>,
    /// a map of locale -> translation
    pub description: Json<HashMap<String, String>>,
    /// the html to replace blocked elements with
    pub placeholder_html: Option<String>,
}

#[derive(Clone, Serialize, Deserialize, FromRow, Debug)]
pub struct Selector {
    id: i32,
    pub cookie_category_id: i32,
    pub selector: String,
}

#[derive(Clone, Serialize, Deserialize, FromRow, Debug)]
pub struct SelectorWithCookieCategory {
    id: i32,
    pub cookie_category_id: i32,
    pub cookie_category: Json<CookieCategory>,
    pub selector: String,
}
