<p align="center">
  <img src="icon.png" alt="HopLink Logo" width="128" height="128" />
</p>

<h1 align="center">HopLink</h1>

<p align="center">
  <strong>Instantly bridge frontend API calls to backend route handlers in VS Code.</strong><br>
  Jump from <code>fetch('/api/users')</code> or <code>axios.post('/checkout')</code> directly to your server-side route definitions with <kbd>F12</kbd> or <kbd>Ctrl+Click</kbd>.
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#supported-languages--stacks">Supported Languages</a> •
  <a href="#usage--shortcuts">Usage</a> •
  <a href="#workspace-conventions">Workspace Setup</a> •
  <a href="#under-the-hood-deep-dive">Under the Hood</a>
</p>

---

## Why HopLink?

In full-stack projects, navigating between the client and the server is filled with friction:

- Copying an endpoint string like `/api/v1/orders`.
- Opening global search (`Ctrl+Shift+F`).
- Sifting through dozens of false matches in documentation, tests, and mock data.
- Finally locating the route handler in your backend code.

**HopLink eliminates this friction.** It registers as a native VS Code **Definition Provider**, transforming API endpoints in your frontend code into interactive, clickable hyperlinks that jump directly to their declaration in backend route handlers.

---

## Key Features

- **Native VS Code Experience**: Works natively with <kbd>F12</kbd> (Go to Definition), <kbd>Alt+F12</kbd> (Peek Definition), and <kbd>Ctrl+Click</kbd> / <kbd>Cmd+Click</kbd>.
- **Universal Frontend HTTP Clients**: Automatically detects:
  - Standard `fetch('/api/...')`
  - Any HTTP client method: `axios.get()`, `api.post()`, `http.put()`, `client.patch()`, `service.delete()`, and more.
  - Single quotes (`'`), double quotes (`"`), and template literals (`` ` ``).
- **High-Performance Sliding Window**: Analyzes a localized 3-line buffer around your cursor rather than re-parsing whole files, ensuring 0ms latency even in massive source files.
- **Smart Path Normalization**:
  - Automatically strips leading template literals (e.g. `` `${BASE_URL}/users` `` &rarr; `/users`).
  - Automatically strips query strings (e.g. `/users?sort=desc&limit=10` &rarr; `/users`).
- **Resilient 2-Tier Route Matching**:
  - **Tier 1 (Exact Match)**: Searches for the normalized route (e.g., `/api/v1/users`).
  - **Tier 2 (Fallback)**: If prefix routers or mounts obscure the full route, falls back to the core resource action segment (e.g., `users`).
- **Polyglot Backend Support**: Searches across **11 major backend languages**:
  `Go`, `TypeScript`, `JavaScript`, `Python`, `Rust`, `Java`, `PHP`, `C#`, `C++`, `C`, and `Ruby`.
- **Reactive Workspace File Cache**: Scans backend server files once with instantaneous caching and automatically invalidates the cache when backend files are created or deleted via a live `FileSystemWatcher`.

---

## How It Works

HopLink operates directly within the VS Code language intelligence pipeline:

```
┌────────────────────────────────────────────────────────┐
│  Frontend Editor (TypeScript / JavaScript / React)      │
│  User hovers or presses F12 on:                        │
│  const res = await api.post(`/api/v1/users?ref=web`);   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  1. Sliding-Window Capture (pos.line ± 1)              │
│     Target: api.post(`/api/v1/users?ref=web`)          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  2. Path Sanitizer & Extractor                         │
│     - Strips template prefixes (${BASE_URL})           │
│     - Truncates query params (?ref=web)                │
│     - Normalized Route: "/api/v1/users"                │
│     - Fallback Token:   "users"                        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  3. Backend Resolver & Route Finder                    │
│     - Reads cached server files (server/main/index/app)│
│     - Tier 1: exact match for "/api/v1/users"          │
│     - Tier 2: fallback match for "users"               │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Jump to Definition in Backend Route File!             │
│  e.g., backend/server.go  (or main.py, index.ts, etc.) │
│  r.POST("/api/v1/users", handlers.CreateUser)          │
└────────────────────────────────────────────────────────┘
```

---

## Usage & Shortcuts

No setup or commands required. Once installed, HopLink activates automatically in any supported frontend file.

| Action | Shortcut (Windows / Linux) | Shortcut (macOS) | Description |
| :--- | :--- | :--- | :--- |
| **Go to Definition** | <kbd>F12</kbd> or <kbd>Ctrl</kbd> + **Click** | <kbd>F12</kbd> or <kbd>Cmd</kbd> + **Click** | Opens the backend file and places the cursor on the route definition line. |
| **Peek Definition** | <kbd>Alt</kbd> + <kbd>F12</kbd> | <kbd>Option</kbd> + <kbd>F12</kbd> | Opens an inline peek window inside your frontend file without switching tabs. |
| **Hover Preview** | <kbd>Ctrl</kbd> + Hover | <kbd>Cmd</kbd> + Hover | Displays a preview tooltip of the backend target route definition. |

### Supported Code Patterns

```typescript
// 1. Native Fetch
const res = await fetch("/api/v1/orders");

// 2. HTTP Client Instances (axios, ky, got, api, service, client, etc.)
const users = await axios.get("/users");
const created = await api.post("/users", payload);
const updated = await http.put("/settings", config);
const patched = await client.patch("/profile", data);
const deleted = await request.delete("/sessions");

// 3. Template Literals & Query Parameters
// -> Normalizes automatically to: "/orders"
const result = await api.get(`${API_BASE}/orders?status=completed&page=1`);
```

---

## Supported Languages & Stacks

### Frontend Languages

HopLink activates on:

- **TypeScript** (`.ts`)
- **TypeScript React** (`.tsx`)
- **JavaScript** (`.js`, `.mjs`, `.cjs`)
- **JavaScript React** (`.jsx`)

### Backend Languages & Frameworks

HopLink scans backend source code across:

| Backend Language | Extension | Typical Frameworks Supported |
| :--- | :--- | :--- |
| **Go** | `.go` | Gin, Echo, Fiber, Chi, standard `net/http` |
| **JavaScript / TypeScript** | `.js`, `.ts` | Express, Fastify, NestJS, Koa, Hono |
| **Python** | `.py` | FastAPI, Flask, Django Ninja, Tornado |
| **Rust** | `.rs` | Actix-web, Axum, Rocket, Warp |
| **Java** | `.java` | Spring Boot, Javalin, Micronaut, Quarkus |
| **PHP** | `.php` | Laravel, Symfony, Slim |
| **C#** | `.cs` | ASP.NET Core, Minimal APIs |
| **Ruby** | `.rb` | Ruby on Rails, Sinatra |
| **C / C++** | `.c`, `.cpp` | Crow, Drogon, Pistache |

---

## Workspace Conventions

To enable HopLink to resolve routes quickly and accurately, your workspace should follow these lightweight conventions:

1. **Backend Directory**: Backend code should live inside a directory named `backend` (e.g., `<project-root>/backend/...` or `apps/backend/...`).
2. **Server File Naming**: The file declaring your routes or HTTP server should contain `server`, `main`, `index`, or `app` in its filename (case-insensitive).

### Example Monorepo / Full-Stack Layout

```text
my-fullstack-app/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts      <-- Calls: api.get("/api/v1/users")
│   │   └── pages/
│   │       └── Dashboard.tsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   └── users.go
│   ├── server.go              <-- Matched! Target route handler definition
│   └── go.mod
│
└── package.json
```

_HopLink also effortlessly resolves `backend/main.py`, `backend/src/index.ts`, `backend/app.js`, `backend/src/main.rs`, and similar server entry points._

---

## Under the Hood: Deep Dive into `extension.js`

HopLink's design balances lightweight execution with intelligent heuristics:

### 1. Sliding-Window Lexical Extraction

Rather than traversing an AST or performing multi-line scans across an entire document on every cursor move or keystroke, HopLink inspects a 3-line sliding window:

```javascript
const first = Math.max(0, pos.line - 1);
const last = Math.min(doc.lineCount - 1, pos.line + 1);
const window = new vscode.Range(first, 0, last, doc.lineAt(last).text.length);
```

This isolates cursor interaction strictly to the active invocation site while keeping CPU overhead near zero.

### 2. Method Signature & Endpoint Regex

Calls are extracted via:

```javascript
/(?:fetch|\w+\.(?:get|post|put|patch|delete))\(\s*([`'"])(.*?)\1/g;
```

- Matches standalone `fetch(...)` or any instance method `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`.
- Captures matching quotation delimiters (`'`, `"`, or `` ` ``).
- Verifies that the user's cursor offset falls strictly within the boundaries of the matched URL string (`cursor >= urlStart && cursor <= urlEnd`).

### 3. Route Sanitization

Template prefixes and query strings are cleaned on the fly:

```javascript
route: url.replace(/^\$\{[^}]+\}/, "").split("?")[0];
```

For example:

- `` `${API_URL}/v2/analytics?period=monthly` `` &rarr; `/v2/analytics`

### 4. Reactive File Caching

Backend files matching `**/backend/**/*.{go,js,ts,rs,py,java,php,cs,cpp,c,rb}` are discovered using `vscode.workspace.findFiles` and cached in memory using nullish coalescing (`cachedFiles ??= ...`).
A live `vscode.workspace.createFileSystemWatcher` hooks into workspace file operations:

```javascript
watcher.onDidCreate(() => (cachedFiles = undefined));
watcher.onDidDelete(() => (cachedFiles = undefined));
```

When files are added or deleted, the cache is cleanly invalidated without requiring an extension reload.

### 5. Multi-Tier Backend Route Resolution

Once the target server document is opened, HopLink navigates with high tolerance for different router configurations:

```javascript
let idx = text.indexOf(route);
if (idx === -1) {
  idx = text.indexOf(route.split("/").filter(Boolean).pop());
}
return { uri, position: serverDoc.positionAt(Math.max(idx, 0)) };
```

- **Direct match**: Matches the full endpoint (e.g., `"/api/v1/auth/login"`).
- **Segment fallback**: In router mounts or grouped route architectures where only the endpoint leaf is declared in the route handler (e.g., `router.post("/login", ...)`), HopLink isolates `"login"` and successfully positions the cursor at the handler definition.

---

## Development & Contribution

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [VS Code](https://code.visualstudio.com/) `v1.140.0` or higher

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/hoplink.git
   cd hoplink
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Launch Extension in Debug Mode:
   - Press <kbd>F5</kbd> in VS Code.
   - An Extension Development Host window will open with HopLink active.
   - Open any full-stack project with frontend files and a `backend/` folder to test navigation.

### Available Scripts

- `npm run lint` — Runs ESLint checks across JavaScript sources.
- `npm test` — Executes extension integration test suites.

---

## License

This extension is licensed under the [MIT License](LICENSE).
