import { definePlugin } from "@cms-local/plugin-interface";
import { $loadFileToString$ } from "@cms-local/plugin-interface/macros" with {
	type: "macro",
};
import elementType from "./elementType.js";

let DATA_ID = 0;
export default definePlugin((ctx) => {
	const actionHandler = ctx.registerHandler(
		["POST", "GET"],
		"/cookiebanner",
		async (req) => {
			const fromDb = await ctx.storage.getOne(DATA_ID);
			if (req.method === "GET") {
				return fromDb.data;
			}
			if (req.method === "POST") {
				if (fromDb) {
					const { data } = await ctx.storage.updateOne(DATA_ID, req.body);
					return data;
				} else {
					const { data, id } = await ctx.storage.createOne(req.body);
					DATA_ID = id;
					return data;
				}
			}
			throw Error(`Method not allowed ${req.method}`);
		},
	);

	// Needs Flowbite to Display Properly
	ctx.registerElementType({
		name: "Cookiebanner",
		icon: "i-tabler-cookie",
		template: $loadFileToString$("./element-type/template.html"),
		style: "",
		script: $loadFileToString$("./element-type/script.js"),
		form: {
			label: {
				de: "Cookiebanner",
				en: "Cookie-banner",
			},
		},
	});

	ctx.registerSettingsPage("/cookie-banner", elementType(actionHandler));
});
