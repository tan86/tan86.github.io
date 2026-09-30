#!/usr/bin/env node
// Screenshot one URL and print everything the page logged.
//
//   node .claude/scripts/shot.mjs <url> [out.png] [--width 1400] [--height 900] [--dark] [--full] [--verbose] [--all]
//
// --dark   prefers-color-scheme: dark     --full  full-page screenshot
// --verbose also show console.log/info  --all  also show headless GPU noise
// Exit code 1 if the page logged real errors.

import { openPage } from "./lib/browser.mjs"

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : dflt
}
const positional = args.filter((a, i) => !a.startsWith("--") && !["--width", "--height"].includes(args[i - 1]))
const [url, out = "shot.png"] = positional
if (!url) {
  console.error("usage: shot.mjs <url> [out.png] [--width N] [--height N] [--dark] [--full] [--verbose] [--all]")
  process.exit(2)
}

const s = await openPage({ width: +opt("width", 1400), height: +opt("height", 900), dark: flag("dark") })
await s.page.goto(url, { waitUntil: "networkidle" }).catch((e) => console.log(`goto failed: ${e.message}`))
await s.page.waitForTimeout(1500)
await s.page.screenshot({ path: out, fullPage: flag("full") })
console.log(`${url} -> ${out}  (title: ${await s.page.title()})`)
const errors = s.report({ all: flag("all"), verbose: flag("verbose") })
await s.close()
process.exit(errors ? 1 : 0)
