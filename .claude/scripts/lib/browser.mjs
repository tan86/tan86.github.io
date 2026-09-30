// Shared Playwright setup for the site scripts in .claude/scripts.
//
// - Finds Playwright in the project or the global npm root (cloud sessions ship it globally).
// - Behind the cloud sandbox's TLS-intercepting proxy, Chromium doesn't trust the proxy CA,
//   so external https requests (Google Fonts, jsDelivr) are fetched with curl instead, which
//   does trust it. TLS verification stays on. Off the sandbox (no HTTPS_PROXY) nothing is routed.
// - Collects every console message, page error and failed request per page.

import { createRequire } from "node:module"
import { execFileSync, execSync } from "node:child_process"

const require = createRequire(import.meta.url)

function loadPlaywright() {
  try {
    return require("playwright")
  } catch {
    const globalRoot = execSync("npm root -g").toString().trim()
    return require(`${globalRoot}/playwright`)
  }
}

export const { chromium } = loadPlaywright()

// Headless-Chromium GPU chatter that says nothing about the site.
const NOISE = [/software WebGL/i, /GPU stall due to ReadPixels/i, /GroupMarkerNotSet/i]

function fetchWithCurl(url) {
  let body = execFileSync("curl", ["-sSL", "-D", "-", "-A", "Mozilla/5.0 Chrome/140", url], {
    maxBuffer: 50e6,
  })
  let headers = ""
  // -D - prints one header block per redirect hop; the body follows the last one.
  for (;;) {
    const i = body.indexOf("\r\n\r\n")
    const block = body.subarray(0, i).toString()
    if (i < 0 || !/^HTTP\//.test(block)) break
    headers = block
    body = body.subarray(i + 4)
  }
  const status = Number(/^HTTP\/\S+ (\d+)/.exec(headers)?.[1] ?? 200)
  const contentType = /content-type:\s*([^\r\n]+)/i.exec(headers)?.[1] ?? "application/octet-stream"
  return { status, body, contentType }
}

/**
 * Open a browser page with logging attached.
 * Returns { browser, page, logs, report(), close() }.
 * `logs` entries: { kind: "console"|"pageerror"|"requestfailed"|"http", type, text, url, noise }
 */
export async function openPage({ width = 1400, height = 900, dark = false, useCurl } = {}) {
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width, height },
    colorScheme: dark ? "dark" : "light",
  })
  const logs = []
  const add = (entry) => logs.push({ ...entry, noise: NOISE.some((re) => re.test(entry.text)) })

  if (useCurl ?? Boolean(process.env.HTTPS_PROXY)) {
    await page.route(
      (url) => url.protocol === "https:",
      async (route) => {
        try {
          const { status, body, contentType } = fetchWithCurl(route.request().url())
          await route.fulfill({
            status,
            body,
            headers: { "content-type": contentType, "access-control-allow-origin": "*" },
          })
        } catch {
          await route.abort()
        }
      },
    )
  }

  page.on("console", (m) => {
    const loc = m.location()
    add({ kind: "console", type: m.type(), text: m.text(), url: loc?.url ? `${loc.url}:${loc.lineNumber}` : "" })
  })
  page.on("pageerror", (e) => add({ kind: "pageerror", type: "error", text: e.stack || e.message }))
  page.on("requestfailed", (r) =>
    add({ kind: "requestfailed", type: "error", text: `${r.failure()?.errorText} ${r.url()}` }),
  )
  page.on("response", (r) => {
    if (r.status() >= 400) add({ kind: "http", type: "error", text: `${r.status()} ${r.url()}` })
  })

  return {
    browser,
    page,
    logs,
    /**
     * Print logs; returns the number of real (non-noise) errors.
     * Errors and warnings are always printed. Plain console.log/info/debug lines are
     * only counted unless `verbose`; GPU noise is hidden unless `all`.
     */
    report({ all = false, verbose = false, since = 0 } = {}) {
      const entries = logs.slice(since)
      const loud = (l) => l.type === "error" || l.type === "warning"
      const shown = entries.filter((l) => (all || !l.noise) && (verbose || loud(l)))
      for (const l of shown) {
        const where = l.url ? `  (${l.url})` : ""
        console.log(`  [${l.kind}:${l.type}] ${l.text}${where}`)
      }
      const quiet = entries.filter((l) => !l.noise && !loud(l)).length
      const noise = entries.filter((l) => l.noise).length
      if (quiet && !verbose) console.log(`  (${quiet} console.log/info lines hidden; --verbose shows them)`)
      if (noise && !all) console.log(`  (${noise} headless GPU noise messages hidden; --all shows them)`)
      if (!entries.length) console.log("  (no console output)")
      return entries.filter((l) => !l.noise && l.type === "error").length
    },
    close: () => browser.close(),
  }
}
