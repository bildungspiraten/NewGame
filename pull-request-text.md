## Proposal: Multitooling Pool diagnostic overlay

This PR adds a documentation-first proposal for a small diagnostic overlay called **Multitooling Pool**.

It does not change runtime behavior.

The proposal includes:

- client status
- server status
- websocket status
- uptime/session duration
- last heartbeat
- recent events
- last error
- practical hint
- expandable status items
- user-configurable auto-open rules
- optional JSON snapshot export

The goal is to make system state visible without adding a large admin dashboard.

Design principles:

- non-destructive
- modular
- local-first
- no sensitive raw data in logs
- easy to disable
- user controls when the overlay may open automatically

If this does not fit the project direction, feel free to close it.
