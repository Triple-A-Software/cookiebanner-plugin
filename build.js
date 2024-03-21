import fs from "node:fs";
import { join } from "node:path";
const built = await Bun.build({
	entrypoints: ["."],
	outdir: "./build",
	verbose: true,
});
for (const log of built.logs) {
	console.log(log);
}

fs.copyFileSync(
	join(process.cwd(), "plugin.json"),
	join(process.cwd(), "build", "plugin.json"),
);
fs.copyFileSync(
	join(process.cwd(), "readme.md"),
	join(process.cwd(), "build", "readme.md"),
);
