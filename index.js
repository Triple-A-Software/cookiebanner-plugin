import { definePlugin } from "@cms-local/plugin-interface";
import { $loadFileToString$ } from "@cms-local/plugin-interface/macros" with { type: "macro" };

import elementType from "./elementType.js";

export default definePlugin((ctx) => {
    //...

    const actionHandler = ctx.registerHandler(["POST", "GET"], "/cookiebanner", async (req) => {
        const fromDb = await ctx.storage.getOne(ctx.storage.db_id);
        if (req.method === "GET") {
            return fromDb.data;
        }
        if (req.method === "POST") {
            const { data } = await ctx.storage.updateOne(ctx.storage.db_id, req.body);
            return data;
        }
        throw Error(`Method not allowed ${req.method}`);
    });

    // Needs Flowbite to Display Properly
    ctx.registerElementType({
        name: "Cookiebanner",
        icon: "i-tabler-cookie",
        template: $loadFileToString$("./element-type/template.html"),
        style: $loadFileToString$("./element-type/style.css"),
        script: $loadFileToString$("./element-type/script.js"),
        form: {
            label: {
                de: "Cookiebanner",
                en: "Cookie-banner",
            },
        },
    });

    ctx.registerSettingsPage("/cookie-banner", elementType(actionHandler));

    ctx.onRewrite(async (rewriter) => {
        const dataFromDb = await ctx.storage.getOne(ctx.storage.db_id);
        if (!dataFromDb) return;

        rewriter.on("[blocked-by]", {
            element(el) {
                const data = dataFromDb.data;
                if (data.active) {
                    const blockedResource = el.getAttribute("blocked-by");
                    if (data.categories[blockedResource].active) {
                        ctx.logger.info("Blocked", blockedResource, el.tagName);

                        switch (el.tagName.toLowerCase()) {
                            case "iframe": {
                                const rewriter = new HTMLRewriter();
                                let foundFirst = false;
                                rewriter.on("*:first-child", {
                                    element(el_) {
                                        if (foundFirst) return;
                                        for (const [key, value] of el.attributes) {
                                            if (key === "blocked-by") {
                                                el_.setAttribute(key, value);
                                                continue;
                                            }
                                            el_.setAttribute(`blocked-${key}`, value);
                                        }
                                        el_.setAttribute("data-type", "iframe");
                                        foundFirst = true;
                                    },
                                });
                                const replacer = rewriter.transform(data.html);
                                el.replace(replacer, { html: true });
                                break;
                            }
                            case "script":
                                el.setAttribute("data-src", el.getAttribute("src"));
                                el.removeAttribute("src");
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
        });
    });
});
