# Multitooling Pool — Implementation Notes

## Intended integration style

This proposal should be implemented non-destructively.

Possible structure:

```text
src/shared/multitooling-pool/
  types.ts
  rules.ts

src/client/multitooling-pool/
  overlay.ts
  overlay.css

src/server/multitooling-pool/
  heartbeat.ts
```

Documentation-first structure:

```text
proposals/multitooling-pool/
  README.md
  spec.yaml
  auto-open-matrix.yaml
  interaction-model.md
  example-events.json
  implementation-notes.md
  overlay-wireframe.md
  pull-request-text.md
```

## Minimal implementation logic

1. Client records `client.started`.
2. Client attempts WebSocket connection.
3. Server sends heartbeat messages.
4. Client stores last 10 events in memory.
5. Client computes one practical hint from deterministic rules.
6. Overlay opens manually with `Ctrl+Shift+M`.
7. Overlay can auto-open according to user-configured rules.
8. Snapshot button copies a sanitized JSON object.

## Snapshot shape

```json
{
  "module": "multitooling_pool",
  "timestamp": "2026-05-18T21:30:10.000Z",
  "clientStatus": "online",
  "serverStatus": "reachable",
  "websocketStatus": "connected",
  "uptimeSeconds": 754,
  "lastHeartbeatAgeSeconds": 2,
  "hint": "Heartbeat is healthy. System appears connected.",
  "autoOpen": {
    "enabled": true,
    "mode": "user_configured",
    "lastTriggeredAt": null,
    "cooldownSeconds": 30
  },
  "recentEvents": [],
  "lastError": null
}
```

## Do not log

- passwords
- tokens
- personal data
- full user text
- raw private files
- private URLs with secrets
