---
name: Jay Parmar
description: A personal digital garden read as `git log --graph`; notes are commits on coloured lanes.
colors:
  pager: "#f4f6f5"
  rule-gray: "#dde2e0"
  muted-ink: "#626b68"
  body-ink: "#2b3133"
  ink: "#121618"
  link-blue: "#1f4fd1"
  tertiary-teal: "#0a7d6f"
  highlight-wash: "rgba(31, 79, 209, 0.08)"
  marker-yellow: "#ffd84a66"
  lane-main: "#121618"
  lane-poems: "#c42a5c"
  lane-tech: "#0a7d6f"
  lane-essays: "#9a6108"
  lane-logs: "#6a3dd1"
  pager-dark: "#111416"
  rule-gray-dark: "#262c30"
  muted-ink-dark: "#8d979c"
  body-ink-dark: "#cdd4d8"
  ink-dark: "#eef2f4"
  link-blue-dark: "#8fb0ff"
  tertiary-teal-dark: "#3ccfb9"
  highlight-wash-dark: "rgba(143, 176, 255, 0.1)"
  marker-yellow-dark: "#ffd84a40"
  lane-main-dark: "#eef2f4"
  lane-poems-dark: "#f0709a"
  lane-tech-dark: "#3ccfb9"
  lane-essays-dark: "#f2b648"
  lane-logs-dark: "#a98bf5"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.4rem + 2.6vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 600
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    letterSpacing: "-0.02em"
  site-name:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body-lead:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  focus: "3px"
  code: "4px"
  popover: "8px"
  sheet: "10px"
  pill: "999px"
spacing:
  rail: "1.5px"
  gm-pad: "8px"
  gm-gap: "14px"
  gm-gutter: "72px"
  gm-gutter-mobile: "1.25rem"
  column: "46rem"
  page-inline: "1.5rem"
  page-inline-mobile: "1.25rem"
  header-top: "3.5rem"
  header-top-mobile: "1.75rem"
  section: "3.5rem"
  commit-row: "2.9rem"
components:
  ref-pill:
    backgroundColor: "color-mix(in srgb, var(--c) 9%, transparent)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.3em 0.65em 0.3em 0.55em"
  commit-row:
    textColor: "{colors.body-ink}"
    height: "{spacing.commit-row}"
    padding: "0.55rem 0"
  link:
    textColor: "{colors.ink}"
  link-hover:
    textColor: "{colors.link-blue}"
  search-button:
    backgroundColor: "transparent"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.pill}"
    height: "2.2rem"
    padding: "0 0.85rem"
  explorer-drawer:
    backgroundColor: "{colors.pager}"
    width: "min(20rem, 100vw)"
    padding: "4.5rem 1.5rem 2rem"
  search-sheet:
    rounded: "{rounded.sheet}"
  popover:
    rounded: "{rounded.popover}"
---

# Design System: Jay Parmar

## Overview

**Creative North Star: "The Commit Graph"**

The garden is a repository history read as `git log --graph`. The home intro is the HEAD commit, each kind of writing is a branch lane, and each note is a commit row; a note page reads like `git show`. The ground is a light, slightly cool pager with near-black ink, and the only saturated colour on any screen belongs to the lanes: their lines, their nodes and their ref pills. With all text removed the site is still recognisable: thin coloured rails, filled round nodes and soft pills on a pale ground.

Everything sits in one centred reading column under a slim top bar (drawer toggle, name, search pill, theme and reader toggles). There are no sidebars of widgets: the explorer is a drawer at every width, and graph view, backlinks and the footer follow the note. Density is calm and literary; the git vocabulary is carried by structure (rails, nodes, hashes, header lines) rather than by terminal costume. The world refuses the stock three-column template and the green-on-black hacker terminal.

Motion is a single gesture: on load, main draws down from the HEAD node and the map's gutters reveal top to bottom in a stagger; pointing at a commit lights its lane and main while the other lanes recede. All of it switches off under reduced motion.

**Key Characteristics:**

- One 46rem reading column, slim top bar, explorer as an overlay drawer.
- Four lane inks, used only for rails, nodes and ref pills.
- Grotesque display, humanist body, mono only for machine text (hashes, dates, refs, graph commands, header lines).
- Flat: depth comes from hairlines and dashed rules, never shadows.
- Lowercase, playful voice carried by real git structure.

## Colors

A cool near-white pager and graphite inks, one blue for interaction, and four lane inks that never leave the graph.

### Primary

- **Link Blue** (link-blue / link-blue-dark): the interaction colour. Link underlines (at 45% strength, full on hover), hover text, focus rings, caret, selection wash (22%), form accent. Never a fill for surfaces.

### Tertiary

- **Tertiary Teal** (tertiary-teal / tertiary-teal-dark): Quartz's theme tertiary, kept equal to the tech lane ink so plugin surfaces that reach for it stay in-world.

### Lanes

- **Main** (lane-main): the trunk, the HEAD node, the root node, backlink dots. It is the ink colour in each mode.
- **Poems Rose** (lane-poems), **Tech Teal** (lane-tech), **Essays Mustard** (lane-essays), **Logs Indigo** (lane-logs): one per kind of writing. Note pages under a lane folder inherit their lane as `--lane`, which colours the commit-line node and folder listing rail.

### Neutral

- **Pager** (pager): page ground, drawer ground, and the 3px halo that separates nodes from rails.
- **Rule Gray** (rule-gray): hairline borders, dashed rules, scrollbar thumb, idle search pill border.
- **Muted Ink** (muted-ink): metadata, hashes, dates, breadcrumbs, stub notes, footer text, blockquote rule, sheet and popover edges.
- **Body Ink** (body-ink): paragraph and list text, explorer entries.
- **Ink** (ink): headings, links, strong text, ref pill labels, poem text.
- **Highlight Wash** and **Marker Yellow**: Quartz's search-match and `==highlight==` tints.

### Named Rules

**The Lanes Only Rule.** Lane inks appear only as rails, commit nodes and ref pills (pill border at 55%, fill at 9%). Never as text colour, backgrounds, buttons or headings.

**The One Blue Rule.** Link Blue is the only interaction colour; links are ink text with a blue underline, never highlighter blocks.

## Typography

**Display Font:** Bricolage Grotesque 600/800 (with system-ui)
**Body Font:** Atkinson Hyperlegible Next 400/700 + italic (with system-ui)
**Label/Mono Font:** JetBrains Mono 400/600

**Character:** A characterful, tightly tracked grotesque for titles against a warm, highly legible humanist body; the mono is a technical aside, never a voice.

### Hierarchy

- **Display** (800, fluid 2.1–3.25rem, 1.04): page titles, including the home HEAD subject.
- **Headline** (600, 1.55rem): in-note h2; the garden map heading uses the same size at 800.
- **Title** (600, 1.15rem): h3. After-note section heads (Graph View, Backlinks) are 600 at 1rem.
- **Site name** (800, 1.35rem, -0.035em): the top bar name only.
- **Body** (400, 1.0625rem, 1.65): note text, held to the 46rem column. Links and strong text are 700.
- **Body lead** (400, 1.2rem, 1.6): the home intro and blockquote, and every poem paragraph (poems in ink, not body ink).
- **Meta** (mono 400, 0.8rem, muted): the commit line, `Date:` line and property lines under a title.
- **Label** (mono 600, 0.75rem): ref pills; hashes and dates in the map use mono at 0.75–0.78rem, dates with tabular figures.

### Named Rules

**The Machine Text Rule.** Mono is for what git would print: hashes, dates, ref labels, commands and header lines. Prose, titles, buttons and navigation never use it.

**The Header Lines Rule.** A note's metadata sits under its title as commit header lines (`commit <hash> (ref)`, `tags: #…`, `Date: …`). Nothing sits above a title except the breadcrumb path; no eyebrows or kickers.

## Layout

A single centred column (46rem max) with 1.5rem side padding (1.25rem on mobile). The top bar is in flow, not sticky: drawer toggle, name, then search and toggles pushed right. Content starts 3.5rem below (1.75rem on mobile). After the note, graph view and backlinks wrap side by side (each flex 1 1 16rem) 3.5rem down; the table of contents is hidden. The footer closes with a dashed rule, 4rem above.

The home page indents its column 2.25rem to make room for the main rail, which runs from the HEAD node beside the title's first line down to the garden map's root row. The garden map hangs back out by the same 2.25rem so its gutter shares the rail.

Graph geometry is exact and shared with the garden-map plugin: lane column x = 8px pad + column × 14px, rails 1.5px, gutter 72px for main plus four lanes, rows at least 2.9rem. On mobile the gutter collapses to one 1.25rem lane: only main is drawn, every node sits on it, and the node colour plus ref pill carry the lane; dates are hidden.

## Elevation & Depth

Flat. There are no drop shadows anywhere; the search sheet, link popovers and graph box are separated by a 1px edge (muted ink for overlays, rule gray for the graph box), and the search sheet dims the page with a 22% ink wash instead of blur. Dividers are 1px dashed rule gray. The only box-shadows are zero-offset rings: the pager-coloured halo that lifts a node off its rail, and the HEAD node's double ring.

### Named Rules

**The Defined Edge Rule.** Overlays get a hairline edge on a dimmed page, never a glow, blur or floating shadow.

## Shapes

Straight lines and circles. Rails are 1.5px vertical strokes; forks are SVG curves from main into each lane at the root. Nodes are filled circles (11px; 13px for HEAD and root; 9px in commit lines and backlinks); an empty lane's stub node is a hollow ring. Ref pills and the search button are full pills. Overlays are softly rounded (10px sheet, 8px popover); code and the graph box take 4px. Blockquotes are a 1px left rule, not a box.

## Components

### Ref pill

The lane label, the HEAD marker. Mono 600 label, ink text, a dot in the lane ink before it, lane-tinted border (55%) and fill (9%), full pill radius. Home shows `HEAD → jay` in main.

### Commit line and header lines

Under every title: `commit` in muted mono, the short hash in ink 600, then the ref pill. On note pages a 9px node in the note's lane leads the line. Properties and the date follow as further mono header lines.

### Garden map (signature)

"the garden" heading with `git log --graph --all` under it in muted mono. Ordered rows, newest first: commits (hash, lane pill on a lane's first row, bold title, date right), a stub per empty lane in italic muted ("branch created, nothing committed yet") with a hollow node, then the root row "garden planted" where all lanes fork from main. Hover or focus on a commit: its lane thickens to 2.5px, other lanes fade to 18% and their nodes to 35%, the node scales 1.35, the title gains a blue underline.

### Links

Ink text at 700 with a 0.08em blue underline at 45%, offset 0.22em; on hover text and underline go full blue (0.2s). Breadcrumbs, explorer, tag links and footer links are 400 weight; breadcrumbs and explorer drop the underline.

### Navigation

Top bar plus explorer drawer: a 20rem overlay sliding from the left (0.28s ease-out), pager ground, hairline right edge. Search is a transparent pill with a rule gray border that darkens to muted ink on hover; its label hides on mobile. Theme and reader toggles are body-ink icons that go ink on hover.

### Folder listings and backlinks

Folder pages draw the notes as commits on their lane: a 1.5px rail in the folder's lane with an 11px haloed node per entry and mono meta. Backlinks are a plain list, each with a 9px main-ink dot.

### Inputs / Fields

The search sheet input uses the body face inside the 10px, muted-edged sheet; focus everywhere is a 2px Link Blue outline offset 3px.

## Do's and Don'ts

### Do:

- **Do** keep lane inks on rails, nodes and ref pills only.
- **Do** derive every rail and node position from the 8px pad / 14px gap / 1.5px rail geometry so CSS and the plugin agree.
- **Do** show empty lanes as honest stubs with hollow nodes, never invented posts.
- **Do** put note metadata under the title as mono commit header lines.
- **Do** give overlays a 1px edge on a dimmed page, with no shadow.
- **Do** collapse the graph to the single main gutter on mobile and let pills carry the lane.
- **Do** honour reduced motion by dropping the draw, reveal and drawer transitions.

### Don't:

- **Don't** set prose, headings, buttons or navigation in mono.
- **Don't** place eyebrows, kickers or labels above a title.
- **Don't** reintroduce the three-column sidebar layout or fixed side widgets.
- **Don't** use the green-on-black terminal look.
- **Don't** add drop shadows, glows or backdrop blur.
- **Don't** use highlighter-block link backgrounds.
