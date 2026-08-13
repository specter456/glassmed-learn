/**
 * Generates the PWA icon PNGs from public/app-icon.svg.
 *
 * Run with: bun run scripts/gen-icons.ts
 * Produces: app-icon.png (512), app-icon-192.png, app-icon-512.png,
 *           app-icon-512-maskable.png (full-bleed), apple-touch-icon.png (180).
 */
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync("public/app-icon.svg", "utf8");

function render(svg: string, size: number, out: string) {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: size } });
  const png = resvg.render().asPng();
  writeFileSync(out, png);
  console.log(`wrote ${out} (${png.length} bytes)`);
}

render(source, 512, "public/app-icon-512.png");
render(source, 512, "public/app-icon.png");
render(source, 192, "public/app-icon-192.png");
render(source, 180, "public/apple-touch-icon.png");
// Maskable icons must fill the whole tile (no rounded corners) so the OS
// crop never shows transparent gaps.
render(source.replace(/rx="118"/, 'rx="0"'), 512, "public/app-icon-512-maskable.png");

console.log("done");
