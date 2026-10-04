---
version: 1
slug: "content-index-md"
primary_target: "content/index.md"
related_targets: ["quartz.config.yaml","quartz/styles/custom.scss"]
---

# Surface brief: home page and site-wide note template

## Scope and mode

- Home (`content/index.md`) plus the shared note template every page inherits (sidebars, header, footer, widgets).
- Visitor mode: Read.

## Audience and job

Peers, recruiters, friends and Jay himself, on desktop and phone. They should leave the first screen remembering "a person with a voice", then wander the garden through the map.

## Content decisions (confirmed 2026-10-04)

- Home = short personal intro + garden map grouped by kind (poems, tech, essays, logs) + Connect.
- The reflog poem moves, word for word, to `content/poems/reflog.md`, the first note in the poems lane.
- `86` stays unlisted and never appears in the map; the home page keeps its joke link.
- Must not feel corporate or portfolio, twee, sparse or blank, or like a hacker cliché.

## Direction contract

THESIS: The garden is a repository history read as `git log --graph`. The intro is the HEAD commit; each kind of writing is a branch lane; each note is a commit row. It refuses the template's three columns with a sidebar of widgets, and the green-on-black terminal.

OWN-WORLD: A light, slightly cool pager ground with near-black ink. Four lane inks (rose for poems, teal for tech, mustard for essays, indigo for logs) are used only as lane lines, nodes and ref pills. Lanes are drawn as real SVG paths with filled commit nodes. Mono appears only for hashes, dates, ref labels and graph text; headings use a characterful grotesque, and body text a legible humanist face. Recognisable with all content removed: coloured lane lines, nodes and pills on a pale ground.

STORY: A visitor meets Jay's voice in the HEAD commit, sees four labelled lanes showing what grows here, opens a note, reads it as a `git show`, and follows links to wander.

FIRST VIEWPORT: The graph rail runs down the left edge. At the top is a ref pill reading "HEAD → jay", with the intro as a large commit subject and body beside the HEAD node. Below it, four lanes fork from main, each labelled in plain words, with the first commit rows visible (the poem). Connect follows. On mobile the rail collapses to one lane gutter.

FORM: Commit Graph, my top-ranked grounded candidate (Impeccable's pick, chosen by the user over the rolled zine). Seed key 89b44793. Signature interaction: lanes draw once from HEAD downward on first load, and hovering or focusing a commit row lights its lane up to HEAD.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Exact faces (sourced and self-hosted or Google Fonts) are picked at build within the contract.
- How empty lanes read before they have notes: an honest stub, never invented posts.
