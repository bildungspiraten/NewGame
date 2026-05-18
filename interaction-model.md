# Multitooling Pool — Interaction Model

## Core interaction

The overlay has two layers:

1. compact status view
2. expandable detail view

The compact view should be readable by non-developers.
The expanded view should help developers diagnose the issue.

## Click rules

```text
Click status line       -> expand/collapse
Click event line        -> show sanitized event details
Click hint              -> show why this hint was selected
Click auto-open mode    -> edit when this item may open the overlay
Click Rules             -> open auto-open matrix
```

## Expanded item example

```text
WebSocket: disconnected
```

Expanded:

```text
WebSocket: disconnected
Last connected: 23:41:02
Last disconnected: 23:44:18
Reconnect attempts: 3
Last close reason: abnormal closure
Hint: Check whether the backend is running.
Auto-open: badge only
[Change rule]
```

## Auto-open matrix

The user can configure reveal behavior per event/status type.

Modes:

- log only
- badge only
- auto-open
- auto-open once per session
- muted for session

## Recommended defaults

```text
Info       -> log only
Warning    -> badge only
Critical   -> auto-open
Recovered  -> log only
```

All defaults should be editable.
