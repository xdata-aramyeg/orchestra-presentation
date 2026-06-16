#!/usr/bin/env bash
#
# tmux-orchestra.sh — multi-pane "control room" view for the Orchestra demo.
#
# Layout (one window, 6 panes — orchestrator + 5 role watchers, grouped by wave):
#
#   ┌─────────────────────────┬──────────────────┐
#   │                         │   Researcher  ┐  │  Wave 1
#   │                         │   Designer    ┘  │  (async)
#   │      ORCHESTRATOR       ├──────────────────┤
#   │   (you drive this one)  │   Frontend    ┐  │  Wave 2
#   │                         │   Backend     ┘  │  (async)
#   │                         ├──────────────────┤
#   │                         │   QA / Reviewer  │  gates
#   └─────────────────────────┴──────────────────┘
#
# This is a PRESENTATION harness: the left pane is your real Claude Code session
# (the orchestrator). The right panes are watcher panes — point them at each
# agent's task output / log so the audience sees each wave's parallel work live.
#
# Usage:
#   bash scripts/tmux-orchestra.sh           # build the layout and attach
#   bash scripts/tmux-orchestra.sh kill      # tear it down
#
set -euo pipefail

SESSION="orchestra"

if [[ "${1:-}" == "kill" ]]; then
  tmux kill-session -t "$SESSION" 2>/dev/null || true
  echo "Killed tmux session: $SESSION"
  exit 0
fi

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "Session '$SESSION' already exists — attaching."
  exec tmux attach -t "$SESSION"
fi

# Pleasant defaults for a demo (titles on, status bar tuned to the brand accent).
tmux new-session -d -s "$SESSION" -n control
tmux set -t "$SESSION" pane-border-status top
tmux set -t "$SESSION" pane-border-format " #{pane_title} "
tmux set -t "$SESSION" status-style "bg=#161619,fg=#ECECEE"
tmux set -t "$SESSION" status-left "#[fg=#D97757,bold] ORCHESTRA #[default]"
tmux set -t "$SESSION" status-right "#[fg=#9A9AA2]Wave 1 ∥ → barrier → Wave 2 ∥ → QA → Review "

# --- Build the panes -------------------------------------------------------
# Pane 0 (left, wide): the orchestrator — your real session.
tmux select-pane -t "$SESSION:control.0" -T "ORCHESTRATOR  (drive here)"

# Split off the right column (42% wide) -> pane 1 (Wave 1: Researcher).
tmux split-window -h -t "$SESSION:control.0" -p 42
tmux select-pane -t "$SESSION:control.1" -T "WAVE 1 · RESEARCHER"

# Stack the right column into five watcher panes, wave by wave.
tmux split-window -v -t "$SESSION:control.1" -p 80
tmux select-pane -t "$SESSION:control.2" -T "WAVE 1 · DESIGNER"

tmux split-window -v -t "$SESSION:control.2" -p 75
tmux select-pane -t "$SESSION:control.3" -T "WAVE 2 · FRONTEND"

tmux split-window -v -t "$SESSION:control.3" -p 66
tmux select-pane -t "$SESSION:control.4" -T "WAVE 2 · BACKEND"

tmux split-window -v -t "$SESSION:control.4" -p 50
tmux select-pane -t "$SESSION:control.5" -T "QA  /  REVIEWER"

# --- Seed each watcher pane ------------------------------------------------
# Replace these echoes with a real follow command once the team is running, e.g.:
#   watch -n1 'claude task output <task-id>'        (poll a task's output)
#   tail -f logs/frontend.log                        (follow an agent log)
tmux send-keys -t "$SESSION:control.1" \
  "clear; printf '\\033[38;5;67m[RESEARCHER]\\033[0m  Wave 1 watcher — references + brief / acceptance criteria\\n'" C-m
tmux send-keys -t "$SESSION:control.2" \
  "clear; printf '\\033[38;5;176m[DESIGNER]\\033[0m  Wave 1 watcher — ui-ux-pro-max + Figma tokens / screenshot\\n'" C-m
tmux send-keys -t "$SESSION:control.3" \
  "clear; printf '\\033[38;5;108m[FRONTEND]\\033[0m  Wave 2 watcher — landing page (magic MCP + Motion)\\n'" C-m
tmux send-keys -t "$SESSION:control.4" \
  "clear; printf '\\033[38;5;72m[BACKEND]\\033[0m  Wave 2 watcher — waitlist API + SQLite (zod, dedupe)\\n'" C-m
tmux send-keys -t "$SESSION:control.5" \
  "clear; printf '\\033[38;5;179m[QA/REVIEWER]\\033[0m  gate output (Playwright E2E PASS/FAIL, review verdict)\\n'" C-m

# Land focus on the orchestrator pane and start Claude there.
tmux select-pane -t "$SESSION:control.0"
tmux send-keys -t "$SESSION:control.0" "clear; echo 'Orchestrator pane — run: claude   (then: /spin-up-orchestra)'" C-m

echo "Built tmux session '$SESSION'. Attaching…"
exec tmux attach -t "$SESSION"
