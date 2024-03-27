import { definePlugin } from "@cms-local/plugin-interface";
import { $loadFileToString$ } from "@cms-local/plugin-interface/macros" with { type: "macro" };

import elementType from "./elementType.js";

const cookies = ["performance", "statistic", "marketing", "functional"];

export default definePlugin(async (ctx) => {
    const allData = await ctx.storage.getAll();
    let db_id = allData.at(0)?.id;
    if (allData.length === 0) {
        db_id = await ctx.storage.createOne().id;
    }

    console.log("ID", db_id);

    const actionHandler = ctx.registerHandler(["POST", "GET"], "/cookiebanner", async (req) => {
        const fromDb = await ctx.storage.getOne(db_id);
        if (req.method === "GET") {
            return fromDb.data;
        }
        if (req.method === "POST") {
            const { data } = await ctx.storage.updateOne(db_id, req.body);
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
        const dataFromDb = await ctx.storage.getOne(db_id);
        const data = dataFromDb.data;
        if (!data || !data.active) return;

        console.log("DATA", data);
        for (const cookie of cookies) {
            rewriter.on(data.categories[cookie].blockedResources, {
                element(el) {
                    if (data.categories[cookie].active) {
                        switch (el.tagName.toLowerCase()) {
                            // Add other Elements Here
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
                                el.setAttribute("blocked-src", el.getAttribute("src"));
                                el.setAttribute("data-type", "script");
                                el.removeAttribute("src");
                                break;
                            default:
                                break;
                        }
                    }
                },
            });
        }
    });
});
