use std::fmt::Display;

use ssr_html::prelude::*;
use ssr_html_macros::{component, html};

#[component(slots = [default])]
pub fn FormField(label: String, id: String) {
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
pub fn InputSelect<T>(options: Vec<T>, value: Option<<T as Id>::TId>, id: String)
where
    T: Display + Id + 'static,
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
pub fn InputCheckbox(value: bool, id: String) {
    html! {
        <input r#type="checkbox" class="rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary size-4" id={id.clone()} name={id} checked={value}/>
    }
}
