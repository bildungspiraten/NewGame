# Multitooling Pool

A small documentation-first proposal for a lightweight diagnostic overlay.

The goal is simple:

> Make it visible whether the application is alive, connected, interrupted, or waiting.

This proposal does not change runtime code. It describes a possible optional module that can later be implemented or ignored.

## What it shows

The overlay can show:

- client status
- server status
- websocket status
- uptime / session duration
- last heartbeat
- recent events
- last error
- a short practical hint
- expandable details
- user-configurable auto-open rules
- optional JSON snapshot export

## Main idea

The overlay is a small status window.

It can be opened manually, for example with:

```text
Ctrl + Shift + M
```

It can also open automatically, but only when the user allows it for certain events.

## Why this helps

Small web applications often fail silently.

A user may not know whether:

- the browser is still working
- the server is offline
- the websocket connection broke
- the app is waiting
- an error happened
- the system recovered

This overlay makes that visible.

## User agency

The user should control when the overlay may open automatically.

Principle:

> The system may warn, but the user controls the warning logic.

## Auto-open examples

Default behavior could be:

```text
Client started              -> log only
Server unreachable          -> auto-open
WebSocket disconnected      -> badge only
Reconnect failed repeatedly -> auto-open
Heartbeat stale             -> badge only
Critical error              -> auto-open
State recovered             -> log only
Snapshot created            -> log only
```

The user can change these rules.

## Reveal modes

Each event/status can use one of these modes:

- log only
- badge only
- auto-open
- auto-open once per session
- muted for session

## Expandable status items

Every visible status line should be clickable.

Example:

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

Auto-open rule:
( ) log only
( ) badge only
(x) auto-open
( ) once per session
( ) muted for session
```

## Minimal definition of done

- Overlay can be opened and closed.
- Client/server/websocket state is visible.
- Uptime and last heartbeat are visible.
- Recent events are visible.
- Last error is visible if present.
- Every status item can be expanded.
- Auto-open behavior can be configured.
- Snapshot can be copied/exported as JSON.
- No sensitive raw data is logged.
- Existing project code does not need to be replaced.
