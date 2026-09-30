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

## Layout

- `content/`: the notes (Markdown). `index.md` is the home page.
- `quartz.config.yaml`: site title, base URL, theme fonts and colors, plugins
- `quartz/`: the Quartz framework. Avoid editing it unless the task needs it.
- `.github/workflows/`: CI and GitHub Pages deploy
- `.claude/skills/impeccable/`: the impeccable design skill (Claude Code build, see below)
- `.claude/agents/`: orchestration agents (`haiku-quick`, `sonnet-worker`, `sonnet-deep`) and impeccable's agents

## Impeccable skill

- Installed with `npx skills add pbakaus/impeccable`, then replaced with upstream's Claude Code build and cleaned of Codex, Cursor, Copilot, Grok and Gemini instructions.
- Do not run `npx skills update`: `skills-lock.json` points at the Codex build and would overwrite the adaptation. To upgrade, copy upstream's `.claude/skills/impeccable` and `.claude/agents/impeccable-*.md` again and redo the cleanup.
- The design-check hook is off; `/impeccable hooks on` enables it in `.claude/settings.local.json`.
- There is no `PRODUCT.md` yet; `/impeccable init` creates it.
