# CLAUDE.md

## Project Overview

This is a multiplayer Snake game built with TypeScript. The architecture is a full-stack Node.js application:

- **Client**: Browser-based canvas renderer communicating with the server via WebSocket
- **Server**: Node.js HTTP server serving static files + WebSocket server handling connections
- **Shared**: Game logic and type definitions used by both client and server

## Repository Structure

```
src/
  client/       # Browser code (canvas rendering, input, WebSocket client)
  server/       # Node.js code (HTTP server, WebSocket server, connection management)
  shared/       # Shared game logic and types (snake movement, collision, spawning)
dist/           # Compiled output (generated, gitignored)
  client/       # Compiled client JS + copied index.html
  server/       # Compiled server JS
```

### Key Files

| File | Purpose |
|------|---------|
| `src/client/main.ts` | Client entry point — initializes `ClientWorld`, `GameLoop`, `SocketManager` |
| `src/client/GameLoop.ts` | `requestAnimationFrame` loop; orchestrates input, movement, collision, render |
| `src/client/ClientWorld.ts` | Client-side world state: snakes, dead snakes, coordinate queries |
| `src/client/SocketManager.ts` | WebSocket client; handles welcome/death messages, exposes `sendMessage` |
| `src/client/render.ts` | Canvas rendering (background, live snakes in blue, dead snakes in red) |
| `src/client/input.ts` | Reads `activeKeys`, computes direction, sends `ClientMessage` to server |
| `src/client/keys.ts` | Tracks `activeKeys`, `triggeredKeys`, `releasedKeys` via `keydown`/`keyup` |
| `src/client/MySnake.ts` | Static singleton holding the local player's `SnakeState` |
| `src/client/canvas.ts` | Initializes and resizes the `HTMLCanvasElement` |
| `src/server/index.ts` | Server entry point — attaches connection handler to WebSocket server |
| `src/server/server.ts` | HTTP server (port 8080); serves `dist/client/` as static files |
| `src/server/wss.ts` | `ws.WebSocketServer` instance attached to the HTTP server |
| `src/server/SocketManager.ts` | Manages connected clients; assigns IDs, sends welcome, handles close/error |
| `src/server/logger.ts` | Pino logger with child loggers: `httpLogger`, `wsLogger`, `gameLogger` |
| `src/shared/constants.ts` | `TILE_SIZE=32`, `INITIAL_SNAKE_LENGTH=10`, `SERVER_PORT=8080` |
| `src/shared/messages.ts` | `ClientMessage` (`input`) and `ServerMessage` (`welcome`, `death`) union types |
| `src/shared/Direction.ts` | `Direction` type, `DIRECTIONS` map, and helper functions |
| `src/shared/SnakeState.ts` | `SnakeState` interface: `id`, `segments`, `direction` |
| `src/shared/SnakeSegment.ts` | `SnakeSegment` interface: `x`, `y` |
| `src/shared/SnakeMover.ts` | Moves all snakes on a fixed timer (250ms per tick) |
| `src/shared/SnakeCollider.ts` | Detects head collisions with other segments or boundaries |
| `src/shared/SnakeSpawner.ts` | Randomly spawns snakes with boundary/overlap validation |
| `src/shared/Boundaries.ts` | Axis-aligned bounding box with `containsPoint` |
| `src/shared/InputState.ts` | `InputState` interface: `up`, `down`, `left`, `right`, `sequence` |

## Build & Run

```bash
# Install dependencies
npm install

# Build (must build both; server serves client dist)
npm run build:client    # tsc -p tsconfig.client.json + copies index.html
npm run build:server    # tsc -p tsconfig.server.json

# Run
npm run start:server    # node dist/server/server/index.js
```

Open `http://localhost:8080` in the browser. The server serves `dist/client/` as static files.

## TypeScript Configuration

Three tsconfig files with a shared base:

- **`tsconfig.base.json`**: `strict: true`, `target: ES2022`
- **`tsconfig.client.json`**: `module: ESNext`, `moduleResolution: bundler`, includes `DOM` lib, outputs to `dist/client/`; includes `src/client/**` and `src/shared/**`
- **`tsconfig.server.json`**: `module: NodeNext`, `moduleResolution: NodeNext`, outputs to `dist/server/`; includes `src/server/**` and `src/shared/**`

The project uses ES modules (`"type": "module"` in package.json).

## Architecture & Data Flow

### Game Loop (Client)

Every animation frame (`GameLoop.loop`):
1. `sendInput()` — reads arrow keys, computes direction, sends `ClientMessage` to server if direction changed
2. `SnakeMover.increaseMovementClock(deltaTime)` — advances all snakes every 250ms
3. `SnakeCollider.checkAllSnakes()` — kills snakes that hit boundaries or other segments
4. `render(ctx, world)` — draws background, live snakes (royalBlue), dead snakes (red)
5. `endKeyLoop()` — clears triggered/released key sets

### WebSocket Protocol

Messages are JSON-serialized union types.

**Client → Server** (`ClientMessage`):
- `{ type: "input", payload: { input: InputState } }` — sent each frame when arrow keys are active

**Server → Client** (`ServerMessage`):
- `{ type: "welcome", payload: { clientId: string } }` — sent on connection
- `{ type: "death", payload: { clientId: string } }` — defined but not yet wired up

### Coordinate System

- Tile-based grid; `TILE_SIZE = 32` pixels per tile
- World is 20×15 tiles (set in `src/client/main.ts`)
- Origin `(0,0)` is top-left; `x` increases right, `y` increases down
- Direction vectors: `up=(0,-1)`, `down=(0,1)`, `left=(-1,0)`, `right=(1,0)`

### Snake Representation

```ts
interface SnakeState {
    id: string;
    segments: SnakeSegment[];  // segments[0] is the head
    direction: Direction;
}

interface SnakeSegment { x: number; y: number; }
```

Movement: new head segment is prepended, tail segment is popped.

## Code Conventions

- **Strict TypeScript** — `strict: true` is enforced; avoid `any`
- **ES modules** — always use `.js` extensions in import paths (compiled output convention), even for `.ts` source files
- **Private fields** — use `#field` syntax (native ES private) rather than `private` keyword for class fields that must not leak
- **Static singletons** — `MySnake` and `SocketManager` (client) use static class members; server-side `SocketManager` uses instance methods
- **Null safety** — prefer explicit `undefined` checks and early throws over silent failures
- **Logging** — server uses Pino child loggers (`httpLogger`, `wsLogger`, `gameLogger`); client uses `console.*`
- **No test infrastructure** — the `test` script is a placeholder; there are no test files

## Known TODOs / Incomplete Areas

- `SocketManager.startSocket()` has a TODO for success/error callbacks
- `socket.onerror` handler in client `SocketManager` is commented out
- Server does not yet act on received `input` messages (handler only logs them)
- `ServerMessage` defines a `death` type that is not yet sent by the server
- Client ID generation (`id-${Math.round(Math.random() * 100)}`) has a collision risk
- No linter (ESLint), formatter (Prettier), or test framework configured

## Dependencies

| Package | Purpose |
|---------|---------|
| `ws` | WebSocket server on Node.js |
| `pino` | Structured JSON logging |
| `pino-pretty` | Human-readable log output in dev |
| `typescript` | TypeScript compiler |
| `@types/node` | Node.js type definitions |
| `@types/ws` | `ws` library type definitions |
