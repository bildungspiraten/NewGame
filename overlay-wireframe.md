# Multitooling Pool — Overlay Wireframe

```text
┌─ Multitooling Pool ───────────────────────┐
│ Client: online                            │
│ Server: reachable                         │
│ WebSocket: connected                      │
│ Uptime: 00:12:34                          │
│ Last heartbeat: 2s ago                    │
│                                           │
│ Hint                                      │
│ Heartbeat is healthy. System appears      │
│ connected.                                │
│                                           │
│ Auto-open                                 │
│ user configured · cooldown 30s            │
│                                           │
│ Recent events                             │
│ 23:31:01 client.started                   │
│ 23:31:03 websocket.connected              │
│ 23:31:05 heartbeat.received               │
│                                           │
│ Last error: none                          │
│                                           │
│ [Copy Snapshot] [Rules] [Snooze] [Clear]  │
└───────────────────────────────────────────┘
```

## Expanded item example

```text
▼ WebSocket: disconnected
  Last connected: 23:41:02
  Last disconnected: 23:44:18
  Reconnect attempts: 3
  Last close reason: abnormal closure
  Hint: Check whether the backend is running.

  Auto-open for this item:
  ( ) log only
  ( ) badge only
  (x) auto-open
  ( ) once per session
  ( ) muted for session
```

## Rules panel

```text
┌─ Auto-open Rules ─────────────────────────┐
│ Decide when the overlay may open itself.  │
│                                           │
│ Client started              [log only]    │
│ Server unreachable          [auto-open]   │
│ WebSocket disconnected      [badge only]  │
│ Reconnect failed repeatedly [auto-open]   │
│ Heartbeat stale             [badge only]  │
│ Critical error              [auto-open]   │
│ State recovered             [log only]    │
│                                           │
│ [Reset defaults] [Snooze session] [Close] │
└───────────────────────────────────────────┘
```
