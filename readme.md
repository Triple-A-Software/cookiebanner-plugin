# cookiebanner-plugin

Currently this Plugin uses some Styles from [flowbite](https://flowbite.com/).  
If you want to use the Default stylings etc. you need to integrate the Flowbite CDN into your site.  
You can do this, by adding the following link to your `<head>`-tag

`<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />`

# Activate Cookiebanner

To activate the cookie banner, the checkbox 'Enabled' must be checked in the settings.
The plugin adds an element template called "Cookiebanner", which needs to be created and added to the layout of the page.  
The diffrent Categories can be switched on/off in ther corresponding Accordion Menu under "Settings".

## Blocked Resources

Query Selectors (sperated by ,) to Block those Elements for the Specified Cookie.  
If you want to block a Element Tag i.e "iframe", you need to add the following line:  
`[data-type=iframe],iframe`
it's important to add both selectors, one is for the sever, the other is for the Client.

Elements with the attribute `blocked-by='COOKIE_NAME'` are blocked by default by the corresponding set cookie.

## Link to Data privacy

`href` for the "see more" Anchor Tag in the Cookiebanner

## Block HTML

HTML code, which is renderd, for every blocked Resouce
