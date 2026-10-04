// Garden map: the home page's index of notes drawn as `git log --graph`.
// Hand-written ESM (no build step); Quartz imports it directly.
//
// Lanes are top-level content folders. Rows run newest first: one commit row
// per note on its lane, a stub row for each lane with no notes yet, and a root
// row where every lane forks from main. Lines and nodes are positioned by CSS
// (quartz/styles/custom.scss) from the --col of each element.

import { h } from "preact"

const DEFAULT_LANES = [
  { id: "poems", label: "poems" },
  { id: "tech", label: "tech notes" },
  { id: "essays", label: "essays" },
  { id: "logs", label: "logs & links" },
]

// Gutter geometry in px; must match --gm-pad / --gm-gap in custom.scss.
const PAD = 8
const GAP = 14

export function shortHash(text) {
  let x = 0x811c9dc5
  for (const ch of text) {
    x ^= ch.codePointAt(0)
    x = Math.imul(x, 0x01000193) >>> 0
  }
  return x.toString(16).padStart(8, "0").slice(0, 7)
}

function noteDate(file) {
  const d = file.dates?.created ?? file.dates?.published ?? file.dates?.modified
  return d ? new Date(d) : null
}

function isoDay(d) {
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function isNote(file) {
  const slug = file.slug ?? ""
  if (!slug || slug === "index" || slug === "404") return false
  if (slug.endsWith("/index") || slug.startsWith("tags/")) return false
  if (file.unlisted === true || file.frontmatter?.unlisted === true) return false
  if (file.frontmatter?.draft === true) return false
  return (file.filePath ?? "").endsWith(".md")
}

export const GardenMap = (opts = {}) => {
  const lanes = opts.lanes ?? DEFAULT_LANES
  const cols = lanes.length + 1 // column 0 is main, the trunk
  const width = PAD * 2 + (cols - 1) * GAP

  function GardenMap({ fileData, allFiles }) {
    if (fileData.slug !== "index") return null

    const laneIndex = new Map(lanes.map((lane, i) => [lane.id, i + 1]))
    const notes = allFiles
      .filter(isNote)
      .map((file) => {
        const top = file.slug.split("/")[0]
        const col = file.slug.includes("/") && laneIndex.has(top) ? laneIndex.get(top) : 0
        return {
          slug: file.slug,
          title: file.frontmatter?.title ?? file.slug.split("/").pop(),
          date: noteDate(file),
          col,
          lane: col === 0 ? "main" : top,
        }
      })
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))

    const counts = new Map(lanes.map((lane) => [lane.id, 0]))
    for (const note of notes)
      if (counts.has(note.lane)) counts.set(note.lane, counts.get(note.lane) + 1)

    // Rows, newest first: commits, then a stub per empty lane, then the root.
    const rows = notes.map((note) => ({ kind: "commit", ...note }))
    for (const lane of lanes) {
      if (counts.get(lane.id) === 0)
        rows.push({ kind: "stub", col: laneIndex.get(lane.id), lane: lane.id })
    }
    const home = allFiles.find((f) => f.slug === "index")
    const rootDate = home ? noteDate(home) : null
    rows.push({ kind: "root", col: 0, lane: "main" })

    // A lane's line runs from its tip (first row in that lane) down to the root.
    const tip = new Map()
    rows.forEach((row, i) => {
      if (row.col > 0 && !tip.has(row.col)) tip.set(row.col, i)
    })
    const rootRow = rows.length - 1
    const tipLabelled = new Set()

    const laneColor = (col) => (col === 0 ? "var(--lane-main)" : `var(--lane-${lanes[col - 1].id})`)
    const laneId = (col) => (col === 0 ? "main" : lanes[col - 1].id)
    const laneLabel = (id) => lanes.find((l) => l.id === id)?.label ?? id

    const gutter = (row, i) => {
      const parts = []
      if (row.kind === "root") {
        const cy = 50
        const x0 = PAD
        const paths = [
          h("path", {
            d: `M ${x0} 0 L ${x0} ${cy}`,
            "data-lane": "main",
            style: { stroke: laneColor(0) },
          }),
        ]
        for (const [col] of tip) {
          const x = PAD + col * GAP
          paths.push(
            h("path", {
              d: `M ${x0} ${cy} C ${x0} ${cy * 0.35}, ${x} ${cy * 0.65}, ${x} 0`,
              "data-lane": laneId(col),
              style: { stroke: laneColor(col) },
            }),
          )
        }
        parts.push(
          h(
            "svg",
            {
              class: "gm-fork",
              width,
              height: "100%",
              viewBox: `0 0 ${width} 100`,
              preserveAspectRatio: "none",
              "aria-hidden": "true",
            },
            paths,
          ),
        )
      } else {
        // trunk passes every row above the root
        parts.push(
          h("span", {
            class: "gm-line",
            "data-lane": "main",
            style: { "--col": 0, "--c": laneColor(0) },
          }),
        )
        for (const [col, t] of tip) {
          if (i < t) continue
          const part = i === t ? "bottom" : "full"
          parts.push(
            h("span", {
              class: "gm-line",
              "data-lane": laneId(col),
              "data-part": part,
              style: { "--col": col, "--c": laneColor(col) },
            }),
          )
        }
      }
      parts.push(
        h("span", { class: "gm-node", style: { "--col": row.col, "--c": laneColor(row.col) } }),
      )
      return h("span", { class: "gm-gutter", "aria-hidden": "true" }, parts)
    }

    const ref = (id) =>
      h(
        "span",
        { class: "gm-ref", "data-lane": id, style: { "--c": `var(--lane-${id})` } },
        laneLabel(id),
      )

    const items = rows.map((row, i) => {
      const style = { "--i": i }
      if (row.kind === "commit") {
        const showRef = row.col > 0 && !tipLabelled.has(row.col)
        if (showRef) tipLabelled.add(row.col)
        return h("li", { class: "gm-row gm-commit", "data-lane": row.lane, style }, [
          gutter(row, i),
          h("a", { class: "gm-msg internal", href: `./${row.slug}`, "data-slug": row.slug }, [
            h("code", { class: "gm-hash" }, shortHash(row.slug)),
            showRef ? ref(row.lane) : null,
            h("span", { class: "gm-title" }, row.title),
          ]),
          row.date
            ? h("time", { class: "gm-date", datetime: isoDay(row.date) }, isoDay(row.date))
            : null,
        ])
      }
      if (row.kind === "stub") {
        return h("li", { class: "gm-row gm-stub", "data-lane": row.lane, style }, [
          gutter(row, i),
          h("span", { class: "gm-msg" }, [
            ref(row.lane),
            h("span", { class: "gm-note" }, "branch created, nothing committed yet"),
          ]),
        ])
      }
      return h("li", { class: "gm-row gm-root", "data-lane": "main", style }, [
        gutter(row, i),
        h("span", { class: "gm-msg" }, [
          h("code", { class: "gm-hash" }, shortHash("garden-root")),
          h("span", { class: "gm-title" }, "garden planted"),
        ]),
        rootDate
          ? h("time", { class: "gm-date", datetime: isoDay(rootDate) }, isoDay(rootDate))
          : null,
      ])
    })

    return h("section", { class: "garden-map", "aria-labelledby": "garden-map-title" }, [
      h("header", { class: "gm-head" }, [
        h("h2", { id: "garden-map-title" }, "the garden"),
        h("p", { class: "gm-cmd" }, h("code", null, "git log --graph --all")),
      ]),
      h("ol", { class: "gm-log" }, items),
    ])
  }

  return GardenMap
}

export default GardenMap
