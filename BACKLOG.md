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

### Dark mode toggle stops working after unlocking an encrypted page

After unlocking the 86 page and navigating home, each click toggles the theme twice, so it looks like nothing happens. Root-cause investigation in progress. Found by `.claude/scripts/check-site.mjs`.

## Done
