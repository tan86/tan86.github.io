#!/usr/bin/env node
// Smoke-test a served build of the site in a real browser, step by step, printing
// every console message per step and saving a screenshot per step.
//
//   node .claude/scripts/check-site.mjs [base-url] [--out dir] [--password pw] [--verbose] [--all]
//
// base-url    default http://localhost:8091/ (see serve-preview.py)
// --out       screenshot directory (default .claude/scripts/out, gitignored)
// --password  try this password on encrypted pages
// --verbose   also print console.log/info lines (errors and warnings always print)
// --all       also print headless GPU noise
//
// Steps: load home (title, h1, body web font actually loaded), open every internal
// link on the home page via the SPA, unlock encrypted pages, return home via the
// site title, search, toggle dark mode and reader mode, mobile layout.
// Exit code 1 if any check failed or a page logged a real error.

import { mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { openPage } from "./lib/browser.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : dflt
}
const base = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--")) ?? "http://localhost:8091/"
const outDir = opt("out", join(here, "out"))
const password = opt("password")
const all = args.includes("--all")
const verbose = args.includes("--verbose")
mkdirSync(outDir, { recursive: true })

// The body font the site should render with, from quartz.config.yaml.
const config = readFileSync(join(here, "../../quartz.config.yaml"), "utf8")
// typography.body is either `body: Name` or an object with `name: Name` on the next lines
const bodyMatch = /^\s*body:[ \t]*(\S.*)?$(?:\n\s+name:\s*(.+)$)?/m.exec(config)
const bodyFont = (bodyMatch?.[1] || bodyMatch?.[2] || "").trim().replace(/^["']|["']$/g, "")

const s = await openPage()
const { page } = s
let failures = 0
let errors = 0
let n = 0
const check = (ok, msg) => {
  console.log(`  ${ok ? "ok  " : "FAIL"} ${msg}`)
  if (!ok) failures++
}
const settle = (ms = 1500) => page.waitForLoadState("networkidle").catch(() => {}).then(() => page.waitForTimeout(ms))
const rel = (u) => u.replace(new URL(base).origin, "")

async function step(name, fn) {
  const since = s.logs.length
  n++
  console.log(`\n${n}. ${name}`)
  try {
    await fn()
  } catch (e) {
    check(false, `step threw: ${e.message.split("\n")[0]}`)
  }
  const file = join(outDir, `${String(n).padStart(2, "0")}-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`)
  await page.screenshot({ path: file }).catch(() => {})
  console.log(`  screenshot: ${file}`)
  console.log("  console:")
  errors += s.report({ all, verbose, since })
}

async function pageState() {
  return page.evaluate((font) => {
    const p = document.querySelector("article p") ?? document.body
    return {
      h1: document.querySelector("h1.article-title")?.textContent?.trim() ?? null,
      fontStack: getComputedStyle(p).fontFamily,
      fontLoaded: font ? document.fonts.check(`16px "${font}"`) : null,
      theme: document.documentElement.getAttribute("saved-theme"),
    }
  }, bodyFont)
}

let homeH1 = null
let links = []

await step("home", async () => {
  await page.goto(base, { waitUntil: "networkidle" })
  await settle()
  const st = await pageState()
  homeH1 = st.h1
  console.log(`  url ${rel(page.url())}  title "${await page.title()}"  h1 "${st.h1}"`)
  check(Boolean(st.h1), "home page has an article title")
  check(st.fontStack.includes(bodyFont), `body text uses "${bodyFont}" (got ${st.fontStack.split(",")[0]})`)
  check(st.fontLoaded === true, `web font "${bodyFont}" loaded`)
  links = await page.$$eval("article a.internal[data-slug]", (as) => [
    ...new Set(as.map((a) => a.getAttribute("data-slug"))),
  ])
  console.log(`  internal links: ${links.join(", ") || "(none)"}`)
})

for (const slug of links) {
  await step(`open ${slug}`, async () => {
    await page.click(`article a.internal[data-slug="${slug}"]`)
    await settle()
    const st = await pageState()
    console.log(`  url ${rel(page.url())}  h1 "${st.h1}"`)
    check(Boolean(st.h1), `${slug} rendered a title`)
    if (await page.$(".encrypted-page")) {
      if (!password) return console.log("  encrypted page (pass --password to test unlocking)")
      await page.fill(".encrypted-page-input", password)
      await page.click(".encrypted-page-submit")
      await page.waitForSelector(".encrypted-page-input", { state: "detached", timeout: 15000 }).catch(() => {})
      await settle(500)
      const text = (await page.textContent("article").catch(() => "")) ?? ""
      check(!(await page.$(".encrypted-page-input")), `unlocked ${slug} with the password`)
      console.log(`  decrypted text: "${text.trim().slice(0, 80)}"`)
    }
  })
  await step(`back home from ${slug}`, async () => {
    await page.click("h2.page-title a")
    await settle()
    const st = await pageState()
    console.log(`  url ${rel(page.url())}  h1 "${st.h1}"`)
    check(st.h1 === homeH1, "site title link returns to the home page")
  })
}

await step("search", async () => {
  const term = (homeH1 ?? "").split(/\s+/)[0]
  await page.click(".search-button")
  await page.fill(".search-bar", term)
  await page.waitForTimeout(1000)
  const count = await page.$$eval(".result-card", (els) => els.length)
  console.log(`  "${term}" -> ${count} result(s)`)
  check(count > 0, "search returns results")
  await page.keyboard.press("Escape")
})

await step("dark mode", async () => {
  const before = (await pageState()).theme
  await page.click("button.darkmode")
  await page.waitForTimeout(800)
  const after = (await pageState()).theme
  console.log(`  theme ${before} -> ${after}`)
  check(before !== after, "dark mode toggle switches the theme")
  await page.click("button.darkmode")
})

await step("reader mode", async () => {
  const mode = () => page.evaluate(() => document.documentElement.getAttribute("reader-mode"))
  const before = await mode()
  await page.click("button.readermode")
  await page.waitForTimeout(500)
  const after = await mode()
  console.log(`  reader-mode ${before} -> ${after}`)
  check(before !== after, "reader mode toggle switches the mode")
  await page.click("button.readermode")
})

await step("mobile", async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base, { waitUntil: "networkidle" })
  await settle()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check(overflow <= 0, `no horizontal scroll at 390px (overflow ${overflow}px)`)
})

await s.close()
console.log(`\n${failures} failed check(s), ${errors} console error(s)`)
process.exit(failures || errors ? 1 : 0)
