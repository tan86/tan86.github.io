# Backlog

Ideas and work for the site, newest first. Move an item to Done (with the date and commit or PR) when it ships.

## Open

### CMS for managing content from anywhere

**Status:** research needed first.

I want a CMS I can use from any platform and browser, ideally installable like a PWA, to manage and add content, write drafts, and publish.

Research before choosing:

- Which options work with a Git-based Quartz site: content is Markdown in `content/`, and publishing is a push to `main`.
- Drafts and publish flow: drafts must not go live until published, e.g. Quartz frontmatter `draft: true`, a drafts branch, or PRs.
- Works on phone and desktop browsers; installable as a PWA or has an app.
- Editor quality for Markdown, including frontmatter, wikilinks, images and media uploads.
- Auth and hosting: GitHub login, where the CMS itself runs, and cost.
- Compatibility with how the site is built: GitHub Pages deploy, and encrypted pages with a `password:` field.

Output: a short comparison with a recommendation, before building anything.

### Mobile layout overflows horizontally

At 390px the page scrolls sideways by 300px, because the footer sits in the left sidebar, which becomes the top bar on mobile. Found by `.claude/scripts/check-site.mjs`.

### Dark mode and reader mode toggles stop working after unlocking an encrypted page

**Status:** fixed locally with a `patch-package` patch (`patches/@quartz-community+encrypted-pages+0.1.1.patch`, applied on `npm install` via `postinstall`). Still open: report upstream and drop the local patch once a fixed version ships.

After you unlock an encrypted page (86), each click on dark mode or reader mode toggles twice, so nothing seems to happen. It stays broken for the rest of the browser session, including reloads, because the password is cached in sessionStorage. Found by `.claude/scripts/check-site.mjs`.

**Root cause:**

- `@quartz-community/encrypted-pages` 0.1.1 dispatches a `render` event after every navigation once a password is cached. Its content-index sync (`G()` in `encrypted.inline.ts`) dispatches it even when nothing new was added.
- `@quartz-community/darkmode` and `reader-mode` run their setup on both `nav` and `render`. Each run adds another click listener, and cleanup only happens on `prenav`, so two listeners end up bound.
- Other plugins (explorer, graph, search, etc.) also run twice per navigation, which is wasted work; search still works.
- Version 1.0.0 of both plugins has the same code, so upgrading doesn't fix it.

**Fix options:**

1. Upstream fix in encrypted-pages (recommended): only dispatch `render` / `content-index-updated` when new slugs were added. This was verified in the browser by patching the built script in flight; both toggles then work in every state.
2. Also make darkmode and reader-mode setup idempotent upstream (defense in depth).
3. Until upstream ships: apply option 1 locally with `patch-package` on `node_modules/@quartz-community/encrypted-pages/dist/` so it survives reinstalls.

## Done
