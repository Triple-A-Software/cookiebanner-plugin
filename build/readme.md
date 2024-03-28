# cookiebanner-plugin

Currently this Plugin uses some Styles from [flowbite](https://flowbite.com/).  
If you want to use the Default stylings etc. you need to integrate the Flowbite CDN into your site.  
You can do this, by adding the following link to your `<head>`-tag

`<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />`

## Blocked Resources

Query Selectors (sperated by ,) to Block those Elements for the Specified Cookie.  
If you want to block a Element Tag i.e "iframe", you need to add the following line:  
`[data-type=iframe],iframe`

it's important to add both selectors, one is for the sever, the other is for the Client.

## Link to Data privacy

Href to route to if clicked on the "see more"-link in the Cookie-banner

## Block HTML

HTML code, which is renderd, vor every blocked Resouce
