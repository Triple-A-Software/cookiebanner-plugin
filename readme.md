# Cookie-banner-plugin

This is a plugin for [neleto](https://neleto.io/) to add a GDPR-compliant cookie consent banner to your site. It lets visitors accept or reject cookie categories, and blocks the matching scripts and embeds until consent is given.

## Overview

### Banner

The plugin ships a `cookie-banner` component that renders the consent banner on your published site. Visitors use it to accept or reject the cookie categories you've defined. Until a visitor consents to a category, every script or embed assigned to that category stays blocked.

### Cookie categories

In the settings you define your own cookie categories (for example *Necessary*, *Statistics* or *Marketing*). Each category has a label and a description that are shown to the visitor in the banner. Labels and descriptions are localized, so you can maintain them in every language your site supports. Categories can be enabled or disabled individually.

### Selectors

Each category holds a list of CSS selectors. The plugin's rewriter scans the rendered HTML and blocks any element matching one of these selectors until the visitor consents to that category. This is how you bind third-party scripts and embeds — analytics, maps, video players, marketing tags — to the right consent category without touching your templates.

### Placeholder content

For blocked embeds you can define placeholder HTML per category. Instead of an empty space, the visitor sees your placeholder (for example a note explaining that an external service is blocked) until they consent, at which point the original content loads.

### Settings

The settings page is where you manage everything above: the global enabled toggle, your cookie categories with their localized labels and descriptions, the selectors per category, and the placeholder HTML. The settings API is available to the admin, developer, editor and author roles.
