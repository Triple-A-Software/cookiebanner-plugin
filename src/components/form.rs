use std::fmt::Display;

use serde_json::json;
use ssr_html::prelude::*;
use ssr_html_macros::{component, html};

#[component(slots = [default])]
pub async fn FormField(label: String, id: String) -> String {
    html! {
        <div class="text-sm">
            <div class="">
                <div class="flex content-center items-center justify-between">
                    <label r#for={id} class="block font-medium text-default">{label}</label>
                </div>
            </div>
            <div class="mt-1 relative">
                <div class="relative inline-flex items-center">
                    <slot />
                </div>
            </div>
        </div>
    }
}

pub trait Id
where
    Self::TId: IntoAttribute + PartialEq + Send + Sync,
{
    type TId;
    fn id(&self) -> Self::TId;
}
#[component]
pub async fn InputSelect<T>(options: Vec<T>, value: Option<<T as Id>::TId>, id: String) -> String
where
    T: Display + Id + 'static + Sync + Send,
{
    html! {
        <select id={id.clone()} name={id} class="relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-highlighted bg-default ring ring-inset ring-accented focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary pe-9 w-48">
            <option
                x-for={option in options}
                value={option.id()}
                selected={value.as_ref().map(|p| option.id() == *p)}
            >
                {option.to_string()}
            </option>
        </select>
    }
}

#[component]
pub async fn InputCheckbox(value: bool, id: String) -> String {
    html! {
        <button
            class="rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary size-4"
            role="checkbox"
            r#type="button"
            aria-checked={value}
            aria-required="false"
            v-scope={json!({
                "checked": value
            })}
            @click="checked = !checked"
        >
            <input r#type="checkbox" class="hidden pointer-events-none" id={id.clone()} name={id} :checked="checked" />
            <span
                :class="{
                    'flex items-center justify-center size-full text-inverted pointer-events-none': true,
                    'bg-primary': checked,
                }"
            >
                <span class="i-tabler-check shrink-0 size-full" aria-hidden="true" v-if="checked"></span>
            </span>
        </button>
    }
}
