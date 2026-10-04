// Commit header: a `git show` style line above each note's title.
// Hand-written ESM (no build step); Quartz imports it directly.
//
//   home:  ● commit 1a2b3c4  (HEAD → jay)
//   notes: ● commit 9f8e7d6  (poems)
//
// The hash is derived from the slug, so it is stable; it is decoration, not
// a real git object id. Lane = top-level folder when it is a known lane.

import { h } from "preact"

const DEFAULT_LANES = ["poems", "tech", "essays", "logs"]

function shortHash(text) {
  let x = 0x811c9dc5
  for (const ch of text) {
    x ^= ch.codePointAt(0)
    x = Math.imul(x, 0x01000193) >>> 0
  }
  return x.toString(16).padStart(8, "0").slice(0, 7)
}

export const CommitHeader = (opts = {}) => {
  const lanes = opts.lanes ?? DEFAULT_LANES
  const head = opts.head ?? "HEAD → jay"

  function CommitHeader({ fileData }) {
    const slug = fileData.slug ?? ""
    if (
      !slug ||
      slug === "404" ||
      slug.startsWith("tags/") ||
      slug.endsWith("/index") ||
      slug.endsWith("/")
    ) {
      return null
    }
    const top = slug.split("/")[0]
    const lane = slug.includes("/") && lanes.includes(top) ? top : null
    const isHome = slug === "index"

    const ref = isHome
      ? h("span", { class: "gm-ref gm-ref-head", style: { "--c": "var(--lane-main)" } }, head)
      : lane
        ? h(
            "span",
            { class: "gm-ref", "data-lane": lane, style: { "--c": `var(--lane-${lane})` } },
            lane,
          )
        : null

    return h("p", { class: "commit-line", "data-lane": lane ?? "main" }, [
      h("span", { class: "cl-node", "aria-hidden": "true" }),
      h("span", { class: "cl-word" }, "commit"),
      h("code", { class: "cl-hash" }, shortHash(slug)),
      ref,
    ])
  }

  return CommitHeader
}

export default CommitHeader
