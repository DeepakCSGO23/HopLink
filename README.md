# HopLink 🔗

> **Jump directly from your frontend API call to the backend route handler — in one click.**

HopLink is a VS Code extension that bridges your frontend JavaScript/TypeScript code and your Go backend. When you hover over an API call like `fetch('/users')` or `axios.get('/products')`, HopLink registers as a **Go-to-Definition** provider so you can jump straight to the matching route handler in your backend server file.

---

## ✨ Features

### 🚀 API Call → Backend Route Navigation
Place your cursor on any API URL string inside a `fetch`, `axios`, or similar HTTP call and press **F12** (Go to Definition). HopLink resolves the route and opens the matching handler in your Go backend file.

**Supported call patterns:**
```js
fetch('/api/users')
axios.get('/api/products')
api.post('/api/orders')
http.put('/api/items/1')
client.patch('/api/settings')
service.delete('/api/records/5')
```

### 🔍 Smart Route Matching
- Strips query strings (`?foo=bar`) before matching
- Handles template literal prefixes (e.g., `${BASE_URL}/users` → matches `/users`)
- Scans all `**/backend/**/*.go` files in your workspace for the route handler

### 📋 Output Channel Logging
HopLink creates a dedicated **"HopLink"** output channel in VS Code so you can trace activation and resolution events.

---

## 🌐 Supported Languages (Frontend)

HopLink's definition provider activates on the following file types:

| Language | File Extensions |
|---|---|
| TypeScript | `.ts` |
| TypeScript React | `.tsx` |
| JavaScript | `.js`, `.mjs`, `.cjs` |
| JavaScript React (JSX) | `.jsx` |

---

## 🗂️ Backend Requirements

HopLink currently targets **Go** backends with the following conventions:

| Requirement | Detail |
|---|---|
| Language | Go (`.go` files) |
| File location | Must be under a `backend/` directory in your workspace |
| Server file | The `.go` file path must include the word `server` (e.g., `backend/server.go`, `backend/server/router.go`) |

> [!IMPORTANT]
> Your backend Go file must be named or located in a path containing `server`. For example: `backend/server.go` or `backend/server/routes.go`.

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Go to Definition (standard VS Code) | `F12` |
| HopLink Hello World (test command) | `Ctrl+1` |

---

## 📦 Requirements

- **VS Code** `^1.140.0`
- A workspace with:
  - Frontend code in **JavaScript** or **TypeScript** (any of the 4 supported language IDs)
  - Backend code in **Go**, located under a `backend/` folder containing a file with `server` in its path

No additional runtime dependencies are required — HopLink uses only the VS Code extension API.

---

## 🔧 Extension Settings

This extension does not contribute any configurable settings at this time. Future versions may add:

- Custom backend directory glob patterns
- Multiple backend language support
- Route prefix stripping options

---

## 🚧 Known Limitations

- **Go only**: Backend support is currently limited to Go (`.go`) files.
- **`server` file naming**: The backend file must include `server` in its path for the extension to locate it.
- **Simple string matching**: Route matching is done by searching for the first URL segment as a plain text substring in the server file. Complex router configurations (nested groups, dynamic prefixes) may not resolve correctly.
- **No template literal support**: Dynamic URL segments like `` `/api/users/${id}` `` are partially handled (the dynamic prefix is stripped), but fully dynamic routes may not match.
- **Single server file**: Only the first `.go` file matching `**/backend/**/*.go` with `server` in its path is used.

---

## 🛠️ Development

### Project Structure

```
hoplink/
├── extension.js          # Main extension entry point
├── package.json          # Extension manifest & metadata
├── jsconfig.json         # JS compiler config (ES2022, Node16)
├── eslint.config.mjs     # ESLint rules
├── test/
│   └── extension.test.js # Mocha test suite
└── .vscode/
    └── launch.json       # Debug launch config
```

### Running Locally

1. Clone/open the project in VS Code.
2. Press `F5` to launch the **Extension Development Host**.
3. In the new window, open a workspace that has frontend JS/TS files and a `backend/server.go`.
4. Place your cursor on an API URL string and press `F12`.

### Running Tests

```bash
npm run lint     # Run ESLint
npm test         # Run the Mocha test suite via @vscode/test-cli
```

---

## 📝 Release Notes

### 0.0.1
- Initial release
- Go-to-Definition provider for `fetch` and HTTP client calls
- Supports TypeScript, TSX, JavaScript, JSX
- Go backend route resolution via `**/backend/**/*.go` glob

---

## 📄 License

See repository for license information.

---

*Made with ❤️ for full-stack developers who hate context-switching.*
