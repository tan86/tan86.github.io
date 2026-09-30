# CLAUDE.md

Jay Parmar's digital garden, built with Quartz v5 and deployed to `jayparmar.cc` via GitHub Pages.

## Working mode: orchestrator

The main session is the orchestrator. Its job is to understand the request, plan, split it into specific tasks, delegate them to subagents, check what comes back, and make the final decisions. It is standing permission to spawn subagents in this project; you do not need to ask first.

Pick the cheapest agent that can do the task well. The effort level is pinned in each agent's definition in `.claude/agents/`, so choose effort by choosing the agent:

| Task                                                                                                                                          | Agent (`subagent_type`)                   | Model / effort            |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------- |
| Small and specific: find a file or symbol, read/summarize a file, run build or tests and report, apply one edit you already specified exactly | `haiku-quick`                             | haiku / low               |
| Moderate implementation with a decided approach: a few files, a component or style change, content edits, config wiring                       | `sonnet-worker`                           | sonnet / medium           |
| Approach unknown: debugging with no obvious cause, non-trivial refactor, reviewing a diff for bugs, investigating framework internals         | `sonnet-deep`                             | sonnet / high             |
| Broad read-only search across many files                                                                                                      | `Explore` with `model: "haiku"`           | haiku                     |
| Design work through the impeccable skill                                                                                                      | the `impeccable-*` agents the skill names | inherit (keep as shipped) |

Rules:

- Keep in the main session: talking with the user, planning, design direction and taste calls, final review of subagent output, and all git commits and pushes.
- Brief every subagent fully. It starts with no context: give it the goal, exact file paths, constraints, what "done" looks like, and what to report back.
- Make tasks small and specific. Split big work into independent pieces and run them in parallel in one message where they don't depend on each other.
- Escalate on failure: if `haiku-quick` comes back confused or wrong, re-run the task with `sonnet-worker`; if `sonnet-worker` stalls on an unknown cause, hand it to `sonnet-deep`.
- Do trivial things (one `ls`, one grep, a one-line edit) directly; spawning an agent costs more than it saves there.
- Verify what agents report before telling the user it's done (check the diff, re-run the build).

## Commands

- `npm ci`: install dependencies (Node 22, see `.node-version`)
- `npm run build`: build the site into `public/` (runs `npm run plugins` first)
- `npm run dev`: build and serve locally with live reload
- `npm test`: unit tests (tsx)
- `npm run check`: typecheck and prettier check

## Previewing without going live

Only a push to `main` deploys (`deploy-pages.yaml`). The other workflows are guarded by `github.repository == 'jackyzha0/quartz'` and never run here. Work on a branch and nothing goes live.

- **Private preview (cloud sessions):** after `npm run build`, run `python3 .claude/scripts/preview-files.py` and publish to the private preview artifact https://claude.ai/artifact/3DTHucvUVU5PnZuN4iigZz with the Artifact tool: `file_path: public/_preview.html`, `root: public`, `url` set to the artifact above, and the printed map as `files`. The script writes that stub page because the artifact wraps its main page in a skeleton that overrides Quartz's fonts and colors; the stub redirects to the real home page, published unwrapped as `home`. Hashed asset names change between builds, so pass `--prev <old-map.json>` to remove stale files. Don't run `npm run dev` before publishing: the dev server rewrites `public/`. Run `npm run build` again first.
- **Local live dev (own machine):** `npm ci && npm run dev`, then open http://localhost:8080. It rebuilds and reloads on every save.

## Scripts (`.claude/scripts/`)

Reusable tools for building, serving, screenshotting and testing the site. Use them instead of writing one-off scripts. When one falls short, update it in place and keep its header comment and this section current. Put new reusable tools here too. Run everything from the repo root after `npm run build`.

| Script                                                                                    | Use                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serve-preview.py [--mode pages\|artifact] [--port 8091]`                                 | Serve `public/` like GitHub Pages (`pages`, default) or like the private preview artifact (`artifact`: wrapped stub page plus unwrapped files). Run in the background: `python3 .claude/scripts/serve-preview.py &`. Stop one server with `pkill -f "serve-previe[w].py.*--port 8091"` or all of them with `pkill -f "serve-previe[w]"`. Run the stop as its own command: the pattern must not match anything else in the same command line.                               |
| `check-site.mjs [base-url] [--password 86] [--out dir] [--verbose] [--all]`               | Browser smoke test: home page title and web font, every internal link on the home page via the SPA, unlocking encrypted pages, back home, search, dark mode toggle, mobile overflow at 390px. Prints each step's console output and saves a screenshot per step (default `.claude/scripts/out/`, gitignored). Exit 1 on failed checks or console errors. Run it after any change to layout, styles, config or plugins, against both server modes when the preview matters. |
| `shot.mjs <url> [out.png] [--width N] [--height N] [--dark] [--full] [--verbose] [--all]` | Screenshot one URL and print its console output.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `preview-files.py [--prev old.json]`                                                      | Write the stub page and print the Artifact `files` map for the private preview (see above).                                                                                                                                                                                                                                                                                                                                                                                |
| `lib/browser.mjs`                                                                         | Shared Playwright setup (`openPage()`): finds Playwright (global in cloud sessions), collects console/page errors/failed requests, and in the cloud sandbox fetches external https assets through curl, because Chromium doesn't trust the proxy CA. TLS verification stays on.                                                                                                                                                                                            |

Console output: errors and warnings always print. `--verbose` adds `console.log` lines and `--all` adds headless-GPU noise. Read screenshots with the Read tool to check them visually.

Known issues these checks currently report (as of 2026-09-30; update when fixed):

- Mobile: at 390px the page scrolls horizontally by 300px because the footer sits in the left sidebar, which becomes the top bar on mobile.
- Dark mode toggle stops working after unlocking an encrypted page and then navigating (each click toggles twice).
- The explorer plugin logs debug `console.log` lines on every navigation, and warns `[Explorer] No trie or empty children` when the explorer is empty.

## Layout

- `content/`: the notes (Markdown). `index.md` is the home page.
- `quartz.config.yaml`: site title, base URL, theme fonts and colors, plugins
- `quartz/`: the Quartz framework. Avoid editing it unless the task needs it.
- `.github/workflows/`: CI and GitHub Pages deploy
- `.claude/skills/impeccable/`: the impeccable design skill (Claude Code build, see below)
- `.claude/scripts/`: reusable serve, screenshot and test scripts (see Scripts)
- `.claude/agents/`: orchestration agents (`haiku-quick`, `sonnet-worker`, `sonnet-deep`) and impeccable's agents

## Impeccable skill

- Installed with `npx skills add pbakaus/impeccable`, then replaced with upstream's Claude Code build and cleaned of Codex, Cursor, Copilot, Grok and Gemini instructions.
- Do not run `npx skills update`: `skills-lock.json` points at the Codex build and would overwrite the adaptation. To upgrade, copy upstream's `.claude/skills/impeccable` and `.claude/agents/impeccable-*.md` again and redo the cleanup.
- The design-check hook is off; `/impeccable hooks on` enables it in `.claude/settings.local.json`.
- There is no `PRODUCT.md` yet; `/impeccable init` creates it.
