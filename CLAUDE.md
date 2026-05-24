# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build both client and server
npm run build:client   # tsc -p tsconfig.client.json + copies index.html to dist/client/client/
npm run build:server   # tsc -p tsconfig.server.json

# Run
npm run start:server   # serves client files + handles WebSockets on port 8080
```

No test runner is configured (`npm test` exits with error). Build output goes to `dist/`.

After `build:client`, the compiled JS and HTML live in `dist/client/client/`. The HTTP server in `src/server/server.ts` serves everything under `dist/client/` when a request comes in, mapping `/` → `/client/index.html`.

## Architecture

This is a multiplayer snake game. TypeScript, no bundler — the client is compiled directly to ES modules and served as-is.

**Three compilation domains:**
- `src/shared/` — game logic compiled into both client and server builds
- `src/client/` — browser canvas game, compiled with `moduleResolution: bundler`, targets DOM
- `src/server/` — Node.js WebSocket + HTTP server, compiled with `moduleResolution: NodeNext`

**Client game loop** (`src/client/main.ts` → `GameLoop` → tick):
1. `sendInput()` — reads `activeKeys`, computes direction, updates local snake, sends `ClientMessage` over WebSocket
2. `SnakeMover.increaseMovementClock(dt)` — moves snakes on a fixed 250ms tick
3. `SnakeCollider.checkAllSnakes()` — kills snakes that hit walls or other segments
4. `render(ctx, world)` — clears canvas and redraws all live/dead snakes
5. `endKeyLoop()` — clears per-frame key sets

**Server** (`src/server/`): HTTP server in `server.ts` (file serving), WebSocket server in `wss.ts` (piggybacks on the same HTTP port), `SocketManager` assigns client IDs and listens for messages. Currently the server does **not** run a game loop or broadcast world state — it only receives input messages and sends a `welcome` message on connect.

**Known architectural issue:** `SnakeMover`, `SnakeCollider`, and `SnakeSpawner` in `src/shared/` all import `ClientWorld` from `src/client/`, so shared code depends on client code. This compiles because both tsconfigs include `src/shared/`, but it means these classes cannot be used in a true server-side game loop without refactoring `ClientWorld` into `src/shared/`.

**World model:** `ClientWorld` holds two `Map<string, SnakeState>` (live snakes and dead snakes). `SnakeState` is `{ id, segments: SnakeSegment[], direction }`. `MySnake` is a singleton holding the local player's snake.

**Input flow:** `keys.ts` maintains three `Set<string>` (active, triggered, released) updated via `keydown`/`keyup` listeners. `input.ts` reads these each frame and sends arrow-key direction changes to the server, preventing 180° reversals.
