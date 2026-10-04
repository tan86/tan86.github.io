# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Confirmed by the owner (2026-10-04), with no single primary audience:

- Peers and developers who follow notes, ideas and experiments.
- Recruiters and people hiring, for whom the site doubles as a calling card.
- Friends and curious visitors who stay for the writing and personality.
- The owner, Jay Parmar, using it as a thinking space.

Visitors read on desktop and phone.

## Product Purpose

Jay Parmar's personal digital garden at jayparmar.cc: a public, interlinked collection of notes and writing that grows over time. It should feel like a personal garden, not a template site.

## Positioning

A garden by one person, in their own voice: technical notes and creative writing side by side, connected by links rather than ordered as a blog feed.

## Operating Context

- Content is Markdown in `content/`, authored Obsidian-style (wikilinks, callouts, frontmatter). A browser/PWA CMS is under consideration (`BACKLOG.md`, `research/cms-options.md`).
- Built with Quartz v5 and deployed to GitHub Pages on every push to `main`.

## Capabilities and Constraints

- Built on Quartz v5: layout comes from community plugins configured in `quartz.config.yaml`. Styling is customisable through Quartz styles and theme config, and the framework in `quartz/` should only be edited when necessary.
- Must keep working:
  - graph view (local and global)
  - full-text search and the explorer
  - backlinks, wikilinks and link popovers
  - encrypted pages (`password:` frontmatter), dark mode and reader mode
- Planned content types:
  - tech notes (dev learnings, git, tools, how-tos)
  - poems and short pieces
  - essays and evolving thoughts
  - logs and links (now pages, reading lists, bookmarks)
- Drafts use `draft: true` (the RemoveDrafts plugin is enabled).
- Regression checks: `.claude/scripts/check-site.mjs`.

## Brand Commitments

- Name: Jay Parmar. Domain: jayparmar.cc.
- Voice, from existing writing: playful, lowercase-casual, nerdy wordplay (the git "reflog" poem on the home page), and a running private joke about "86" ("The 86 chose me.", "no, I don't know either.").

## Evidence on Hand

- `content/index.md`: the home page with the intro, the reflog poem and Connect links (GitHub tan86, LinkedIn jayparmar86, email jayparmar86@pm.me).
- `content/86.md`: an unlisted, password-protected page.
- No other notes, images, portrait, logo or project write-ups yet. Do not invent projects, posts, testimonials or credentials.

## Product Principles

1. Personal over generic: every surface should read as Jay's, not as a Quartz default.
2. Writing first: notes and poems are the product; navigation features support reading rather than compete with it.
3. Connected, not chronological: links, backlinks and the graph are how people move through the garden.
4. Works for every reader: a passer-by, a peer and a recruiter can each find their way on desktop and phone.
5. Grows gracefully: the design must hold up from two notes to hundreds, across all four content types.
