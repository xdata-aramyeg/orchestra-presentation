# Claude Code Agent Teams — Reference

> Faithful summary of the official docs (https://code.claude.com/docs/en/agent-teams),
> saved as our shared knowledge. **Agent teams are experimental and disabled by default.**

## What they are

Agent teams coordinate **multiple Claude Code instances** working together. One session
is the **team lead** (coordinates, assigns tasks, synthesizes). **Teammates** each run in
their own context window and **communicate directly with each other** — not only back to
the lead.

This is different from **subagents**: subagents run inside one session and only report
results back to the main agent; they never talk to each other. Agent-team teammates share
a task list, claim work, and message each other.

| | Subagents | Agent teams |
|---|---|---|
| Context | Own window; result returns to caller | Own window; fully independent |
| Communication | Report back to main agent only | Teammates message each other directly |
| Coordination | Main agent manages all work | Shared task list, self-coordination |
| Best for | Focused tasks, only result matters | Complex work needing discussion |
| Token cost | Lower | Higher (each teammate is a full Claude instance) |

## Enabling (required)

- Needs Claude Code **v2.1.32+** (`claude --version`).
- Disabled by default. Enable via env var `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, e.g. in `settings.json`:
  ```json
  { "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
  ```

## Starting a team

Just tell Claude in natural language: describe the task **and** the team structure. Claude
creates the team, spawns teammates, coordinates. Example:

```
I'm designing a CLI tool that tracks TODO comments across a codebase. Create an
agent team to explore this from different angles: one teammate on UX, one on
technical architecture, one playing devil's advocate.
```

Works best when the roles are **independent** and can explore without waiting on each other.
Claude either creates a team when you ask, or proposes one (you confirm) — never without approval.

## Architecture

| Component | Role |
|---|---|
| **Team lead** | Main session: creates the team, spawns teammates, coordinates |
| **Teammates** | Separate Claude Code instances, each on assigned tasks |
| **Task list** | Shared work items teammates claim and complete |
| **Mailbox** | Messaging between agents |

- **Storage (auto-managed, do NOT hand-edit):**
  - Team config: `~/.claude/teams/{team-name}/config.json` (runtime state: session IDs, tmux pane IDs; `members` array with name/agentId/agentType)
  - Task list: `~/.claude/tasks/{team-name}/`
  - Both exist only while the team is active; removed on cleanup / session end.
- There is **no project-level team config** (`.claude/teams/teams.json` is treated as an ordinary file, not config).
- Task dependencies are managed automatically: completing a task unblocks dependents. Task
  claiming uses **file locking** to avoid races. Task states: pending, in progress, completed.

## Defining reusable teammate roles (this is our `.claude/agents/*.md`)

When spawning a teammate you can reference a **subagent type** from any scope (project,
user, plugin, CLI). Define a role once, reuse it as both a subagent and a teammate:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

- The teammate honors that definition's **`tools` allowlist** and **`model`**; the
  definition body is **appended** to the teammate's system prompt (doesn't replace it).
- Team-coordination tools (`SendMessage`, task tools) are **always available** even if
  `tools` restricts others.
- ⚠️ The `skills` and `mcpServers` frontmatter fields are **NOT applied** to a teammate —
  teammates load skills + MCP servers from project/user settings, like a normal session.

## Display modes

- **In-process** (default fallback): all teammates in the main terminal. `Shift+Down`
  cycles teammates and lets you message them; `Enter` views a session, `Esc` interrupts,
  `Ctrl+T` toggles the task list. Works in any terminal.
- **Split panes**: each teammate gets a pane. Requires **tmux** or **iTerm2** (`it2` CLI).
- Setting `teammateMode` in `~/.claude/settings.json` (`"auto"` default, `"tmux"`,
  `"in-process"`); or `claude --teammate-mode in-process`.
- Split panes are NOT supported in VS Code integrated terminal, Windows Terminal, or Ghostty.

## Controlling the team

- **Specify teammates/models:** "Create a team with 4 teammates… Use Sonnet for each."
  Teammates don't inherit the lead's `/model`; set **Default teammate model** in `/config`.
- **Plan approval:** "Require plan approval before they make any changes." Teammate works in
  read-only plan mode until the lead approves; rejected plans get revised and resubmitted.
  The lead decides autonomously — steer it with criteria ("only approve plans with tests").
- **Talk to teammates directly:** each is a full session; message any by name to redirect.
- **Assign/claim tasks:** lead assigns explicitly, or teammates self-claim the next
  unblocked task.
- **Shut down a teammate:** "Ask the researcher teammate to shut down" (it can approve/reject).
- **Clean up:** "Clean up the team" — **always via the lead**; fails if teammates still
  running (shut them down first).

## Quality gates via hooks

- `TeammateIdle` — runs when a teammate is about to idle; **exit code 2** sends feedback and keeps it working.
- `TaskCreated` — runs on task creation; exit 2 prevents creation + sends feedback.
- `TaskCompleted` — runs on completion; exit 2 prevents completion + sends feedback.

## Permissions & context

- Teammates **start with the lead's permission mode** (incl. `--dangerously-skip-permissions`).
  You can change a teammate's mode after spawn, but not per-teammate at spawn time.
- Each teammate loads the same project context as a normal session (CLAUDE.md, MCP, skills)
  + its spawn prompt. **The lead's conversation history does NOT carry over** — put
  task-specific detail in the spawn prompt.
- Messages deliver automatically (no polling); idle teammates auto-notify the lead.

## Best practices

- **3–5 teammates** for most workflows; ~5–6 tasks per teammate. More = linear token cost +
  coordination overhead + diminishing returns. Three focused beat five scattered.
- **Avoid file conflicts:** give each teammate a different set of files.
- **Wait for teammates:** if the lead starts doing the work itself, tell it
  "Wait for your teammates to complete their tasks before proceeding."
- **Start with research/review** (clear boundaries, no code) before parallel implementation.
- **Monitor and steer;** size tasks to self-contained deliverables (a function, a test file, a review).

## Limitations (experimental)

- No session resumption for in-process teammates (`/resume`, `/rewind` don't restore them).
- Task status can lag (teammates may not mark complete → blocks dependents).
- Shutdown can be slow; **one team at a time**; **no nested teams** (only the lead manages
  the team); **lead is fixed** for the team's lifetime; permissions set at spawn.
- Orphaned tmux sessions: `tmux ls` then `tmux kill-session -t <name>`.

## How this maps to our project

- **Lead = the main Claude Code session** (the orchestrator) — coordinates, never required
  to write feature code itself.
- **Teammate roles** = our `.claude/agents/*.md` definitions (tools + model honored, body
  appended). Note: their `skills`/`mcpServers` frontmatter won't apply as teammates — rely
  on project/user settings for MCP + skills.
- **Quality gates** (wait for QA before Reviewer, etc.) can be enforced socially by the lead
  and/or hardened with `TaskCompleted` / `TeammateIdle` hooks.
