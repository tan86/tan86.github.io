# CMS options for the site

Research for the `BACKLOG.md` item "CMS for managing content from anywhere", done 2026-09-30. Release dates and key features were checked against npm, the projects' docs and GitHub's docs.

## What the site needs

- Content is Markdown in `content/`, Obsidian-flavoured (wikilinks, callouts), with frontmatter: `title`, `draft`, `password`, `unlisted`.
- Publishing is a push to `main` (GitHub Actions deploys to GitHub Pages). Anything on another branch never goes live.
- Drafts: `draft: true` already hides a page (the `remove-draft` plugin is enabled).
- Wanted: works in any browser, on phone and desktop, ideally installable as a PWA. Free or cheap, with no server to maintain.

## The decision to make first: the repo is public

`tan86/tan86.github.io` is public. So:

- **Drafts are public in source form.** `draft: true` only keeps a page off the built site; the Markdown is readable on GitHub. The same goes for drafts on branches or in PRs.
- **Page passwords are public.** `content/86.md` has `password: "86"` in plain text, so the encryption only stops visitors who don't read the repo.

This is true for every option below, because they all store content in the repo. The options:

| Option                                                                                                                    | Drafts and passwords private? | Cost     | Effort                                         |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | -------- | ---------------------------------------------- |
| A. Keep the repo public                                                                                                   | No                            | Free     | None                                           |
| B. Make the repo private with GitHub Pro (Pages from a private repo is a paid-plan feature; the site itself stays public) | Yes                           | $4/month | Low: flip visibility                           |
| C. Split: a private repo for content, building into this public repo's Pages                                              | Yes                           | Free     | Medium: a cross-repo deploy workflow and token |
| D. Private repo, host on Cloudflare Pages instead of GitHub Pages                                                         | Yes                           | Free     | Medium: move hosting and DNS                   |

Every CMS below works with a private repo.

## Browser CMSs that edit the repo

| CMS                  | Maintained                        | Sign-in without Netlify                                                  | Cost                              | Phone / PWA                                                                     | Drafts                                                                                                    | Keeps Obsidian Markdown                                                                                                   | Setup                                  |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Sveltia CMS**      | Very active (0.224.0, 2026-09-29) | Personal access token (no server), or OAuth via a free Cloudflare Worker | Free                              | Mobile-optimised, installable PWA, QR-code sign-in from desktop; no offline yet | Editorial workflow: each draft on its own `cms/…` branch with a PR, merged to publish; or a `draft` field | Body in raw mode keeps wikilinks and callouts; handling of frontmatter keys not in the config is undocumented, so test it | Low: `admin/index.html` + `config.yml` |
| **Pages CMS**        | Active (2.1.8, 2026-06)           | Hosted app at app.pagescms.org signs in with GitHub                      | Free                              | Responsive; PWA not confirmed                                                   | `draft: true` only, commits straight to the branch                                                        | Best: `merge` keeps keys outside the schema; raw mode edits the whole file                                                | Lowest: one `.pages.yml`               |
| Decap CMS            | Alive (3.16.3, 2026-09-22)        | Needs an OAuth server or paid Decap Turbo                                | Free / €19 per month              | Clunky on phones                                                                | Editorial workflow (PRs)                                                                                  | Rich editor normalises Markdown                                                                                           | Medium                                 |
| TinaCMS              | Active                            | Tina Cloud or a self-hosted backend                                      | Editorial workflow from $41/month | No PWA                                                                          | Paid                                                                                                      | Drops frontmatter not in its schema                                                                                       | High                                   |
| Keystatic, Outstatic | Alive                             | Need a Next.js/Astro server                                              | Free + hosting                    | n/a                                                                             | n/a                                                                                                       | Own schema, not Obsidian                                                                                                  | High, Quartz unsupported               |
| CloudCannon          | Commercial                        | Hosted                                                                   | $55/month                         | Web                                                                             | Yes                                                                                                       | Not checked                                                                                                               | Moves hosting                          |

Dead or not a web CMS: Static CMS (last release 2024), Front Matter CMS (VS Code extension), Prose.io (unsupported), StackEdit (stalled).

## Editor and app workflows

| Option                         | Phone                  | Browser or app | Notes                                                                                                                          |
| ------------------------------ | ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Obsidian on desktop + Git      | n/a                    | App            | What Quartz recommends; full fidelity. Obsidian Git plugin or Quartz Syncer to push.                                           |
| Obsidian on phone + GitSync    | Good                   | App            | GitSync (Android, iOS) does the Git sync reliably. The Obsidian Git plugin on mobile is flaky and its README warns of crashes. |
| Obsidian Sync ($4–5/month)     | Good                   | App            | Syncs devices only; something else still has to push to GitHub.                                                                |
| GitHub mobile app / github.dev | Usable for small edits | App / browser  | Fine for flipping `draft`, fixing a typo or merging a PR; poor for writing.                                                    |

## Recommendation

1. **Decide on privacy first** (table above). If drafts or passwords should be private, go with **B** (simplest, $4/month) or **C** (free, more setup).
2. **Use Sveltia CMS as the browser/PWA editor.** It is the only free option that is an installable PWA, is optimised for phones, needs no server, and gives real drafts (editorial workflow branches that never touch `main` until you publish).
   - Sign in with a fine-grained token limited to this one repo: Contents and Pull requests read/write.
   - Admin page at `content/admin/` → `jayparmar.cc/admin/`. The page is public but useless without the token.
   - Configure the body field as raw Markdown only, so wikilinks and callouts aren't rewritten. Set `omit_empty_optional_fields: true` and a media folder such as `content/attachments`.
   - Before relying on it, round-trip `content/86.md` and check that `password` and `unlisted` survive.
3. **Fallback:** if Sveltia drops frontmatter keys it doesn't know, use **Pages CMS** with `merge: true` (hosted, keeps unknown keys, but no PR-based drafts).
4. **Optional:** Obsidian on desktop for long writing. Both tools edit the same Markdown files, so they coexist.

## Open questions to settle when building

- Does Quartz copy `content/admin/index.html` and `config.yml` into the site as-is? It copies all non-Markdown files from `content/`; confirm with a build.
- Sveltia's handling of undeclared frontmatter keys (test with `86.md`).
- Sveltia issue #1012: saving an entry with many new images at once can fail, so upload images in small batches.

## Sources

- Sveltia: GitHub backend and sign-in https://sveltiacms.app/en/docs/backends/github · UI, PWA and mobile https://sveltiacms.app/en/docs/ui · editorial workflow https://sveltiacms.app/en/docs/workflows/editorial · rich-text raw mode https://sveltiacms.app/en/docs/fields/richtext · releases https://github.com/sveltia/sveltia-cms/releases
- Pages CMS: settings (`merge`) https://pagescms.org/docs/configuration/settings/ · content formats https://pagescms.org/docs/configuration/content/
- Decap: GitHub backend https://decapcms.org/docs/github-backend/ · Turbo https://decapcms.org/turbo/
- TinaCMS pricing https://tina.io/pricing · Keystatic GitHub mode https://keystatic.com/docs/github-mode · CloudCannon pricing https://cloudcannon.com/pricing/
- npm registry for release dates: https://registry.npmjs.org/@sveltia/cms, https://registry.npmjs.org/decap-cms-app, https://registry.npmjs.org/@staticcms/core
- GitHub plans (Pages in private repos) https://docs.github.com/en/get-started/learning-about-github/githubs-plans
- Quartz authoring and drafts https://quartz.jzhao.xyz/getting-started/authoring-content · RemoveDrafts https://quartz.jzhao.xyz/plugins/removedrafts
- Obsidian Git (mobile limits) https://github.com/Vinzent03/obsidian-git · GitSync https://github.com/ViscousPot/GitSync · Quartz Syncer https://github.com/saberzero1/quartz-syncer
