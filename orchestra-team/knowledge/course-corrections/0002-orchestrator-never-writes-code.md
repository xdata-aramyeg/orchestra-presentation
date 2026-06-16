# Orchestrator never writes feature code

- **Date:** 2026-06-17
- **Trigger:** The Orchestrator (the main session) started hand-writing the app's
  code instead of delegating — doing the implementation itself rather than routing
  it, which collapses the role separation the whole team depends on.
- **Correction:** The Orchestrator is the **main session** and **coordinates only**.
  It delegates **ALL** feature code to the **frontend** and **backend** specialists
  and confines itself to decomposition, routing, and holding the barriers. If it
  catches itself writing production code, it stops and routes the work to the
  dedicated dev instead.
- **Applies-to:** orchestrator / all phases.
