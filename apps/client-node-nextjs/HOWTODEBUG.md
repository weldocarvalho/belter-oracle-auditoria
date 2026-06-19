# How to Debug Next.js in VS Code with Breakpoints

This guide covers full-stack debugging (server and client-side) for Next.js 16.2.9 using VS Code on macOS.

---

## Quick Start

### 1. Prerequisites

- VS Code with Debugger for Chrome extension (built-in)
- Your project already has `.vscode/launch.json` configured
- `package.json` has `"dev": "next dev"` script (already set up)

### 2. Start Debugging

1. Open the **Run and Debug** panel (`Cmd + Shift + D`)
2. Select **"Next.js: Full Stack (Node + Browser)"** from the dropdown
3. Press `F5` or click the green **Play** button
4. VS Code will start the dev server and open Chrome automatically

---

## Debugging Modes

### Mode 1: Full Stack Debugging (Recommended)

**Configuration:** "Next.js: Full Stack (Node + Browser)"

This runs your Next.js server and automatically opens a browser for client-side debugging.

**Use for:**
- Debugging API routes and server components
- Debugging client-side code (React components)
- Tracing issues across server/client boundary

**How to use:**
```bash
1. Select "Next.js: Full Stack (Node + Browser)" in Run and Debug
2. Press F5
3. Set breakpoints in:
   - Server files: src/app/api/*, middleware, server components
   - Client files: src/components/*, page.tsx (client components)
4. Interact with the app in the opened browser
5. Execution will pause at breakpoints
```

### Mode 2: Server-Side Only

**Configuration:** "Next.js: Server-Side Only"

Debug only the server (API routes, server components, middleware).

**Use for:**
- Focusing on backend logic
- Faster iteration without browser debugging overhead

### Mode 3: Attach to Running Process

**Configuration:** "Next.js: Attach to Running Process"

Attach the debugger to an already-running Next.js server on port 9229.

**Use for:**
```bash
# Terminal 1: Start Next.js with debug protocol
NODE_OPTIONS='--inspect' npm run dev

# Terminal 2: VS Code
# Then select "Next.js: Attach to Running Process" and press F5
```

---

## Setting Breakpoints

### Server-Side Breakpoints (API Routes, Server Components)

1. Open any file in `src/app/api/*` or a server component
2. Click on the **left gutter** (line number area) to set a red breakpoint
3. Trigger the code path (e.g., call the API, load the page)
4. Execution pauses; variables appear in the debugger panel

**Files where server breakpoints work:**
- `src/app/api/**` - API routes
- Server components (files with `"use server"` or default exports)
- `middleware.ts`
- `next.config.ts`

### Client-Side Breakpoints (React Components)

1. Open any `.tsx` file with `"use client"` or in `src/components/`
2. Click the left gutter to set a red breakpoint
3. Interact with the app in the browser (click buttons, navigate, etc.)
4. Execution pauses when the code is reached

**Files where client breakpoints work:**
- Components with `"use client"` directive
- Files in `src/components/`
- Any client-side code in `src/app/` pages

### Using `debugger` Statement

Insert `debugger;` directly in your code for immediate breakpoint:

```typescript
// In a client component
function MyComponent() {
  debugger; // Execution pauses here when browser devtools is open
  return <div>Hello</div>;
}

// In a server-side function
export async function GET(req: Request) {
  debugger; // Pauses in VS Code debugger
  return Response.json({ data: "test" });
}
```

---

## Debugging Workflow

### Step-by-Step Example: Debug an API Route

1. Open `src/app/api/my-route/route.ts`
2. Add a breakpoint on line 10 (left gutter click)
3. In VS Code's Run and Debug panel, select **"Next.js: Full Stack (Node + Browser)"**
4. Press `F5` to start debugging
5. Open browser at `http://localhost:3000/api/my-route` or call it from your app
6. Execution pauses at the breakpoint
7. Use the Debug Console to:
   - **Step over:** `F10` (execute one line)
   - **Step into:** `F11` (enter function)
   - **Step out:** `Shift + F11` (exit function)
   - **Continue:** `F5` (resume execution)
8. Watch variables in the **Variables** panel on the left

### Step-by-Step Example: Debug a React Component

1. Open `src/components/MyComponent.tsx` and add `"use client"` if missing
2. Add a breakpoint inside an event handler (e.g., `onClick`)
3. Select **"Next.js: Full Stack (Node + Browser)"** and press `F5`
4. In the opened browser, click the button or trigger the handler
5. Execution pauses in VS Code
6. Inspect variables, evaluate expressions in the **Debug Console**

---

## Using the Debug Console

While paused at a breakpoint, use the **Debug Console** at the bottom:

```javascript
// Print a variable
console.log(myVariable)

// Evaluate an expression
1 + 2

// Call a function
JSON.stringify(userData)

// Check object properties
person.address.street
```

---

## Debugging Tips & Tricks

### Conditional Breakpoints

Set a breakpoint that only pauses when a condition is true:

1. Right-click on a breakpoint (red dot)
2. Select **"Edit Breakpoint"**
3. Enter condition: `userId === 42` or `response.status === 500`
4. Breakpoint pauses only when condition is true

### Watch Variables

1. In the **Watch** panel (left sidebar), click the **+** icon
2. Enter variable name: `myArray`, `user.email`, `fetchResult`
3. Variable is tracked and updated as you step through code

### Logpoints (Print Without Stopping)

Instead of pausing execution, print to console:

1. Right-click on a breakpoint location (left gutter)
2. Select **"Add Logpoint"**
3. Enter message: `User loaded: {user.id}`
4. Logs appear in Debug Console without pausing

### Quick Eval in Debug Console

Type any JavaScript expression:
```javascript
// While paused, type in Debug Console:
user.permissions.includes('admin')  // Check a condition
new Date().toISOString()             // Get current time
localStorage.getItem('token')        // Access browser storage
```

---

## Source Maps

Source maps allow you to debug TypeScript and JSX directly in their original form (not transpiled JavaScript).

**Configuration already enabled in:**
- `next.config.ts`: Webpack configured with source maps for development
- `tsconfig.json`: TypeScript source maps enabled

**If source maps aren't working:**
1. Ensure `NODE_ENV` is `development` (automatic in `next dev`)
2. Restart the dev server: Stop (`Ctrl + C`) and run `npm run dev` again
3. Hard-refresh browser: `Cmd + Shift + R`
4. Clear `.next/` folder and restart: `rm -rf .next && npm run dev`

---

## Troubleshooting

### Breakpoints Not Working

**Problem:** Red breakpoints appear but execution doesn't pause

**Solutions:**
1. Ensure you're debugging in **development mode** (`npm run dev`, not `npm start`)
2. Check file is actually being executed (add `console.log` temporarily)
3. Server components need to be restarted; stop debugger and press `F5` again
4. Source maps might be missing; restart dev server: `Ctrl + C`, then `npm run dev`

### Debugger Doesn't Start

**Problem:** Clicking F5 does nothing

**Solutions:**
1. Check `.vscode/launch.json` is valid JSON (no trailing commas)
2. Ensure no other process is running on port 3000: `lsof -i :3000`
3. Stop any existing `npm run dev` processes: `killall node`
4. Try "Attach to Running Process" mode instead

### Console Errors During Debugging

**Problem:** Server-side code shows "Cannot find module" or type errors

**Solutions:**
1. Install dependencies: `npm install`
2. Check path aliases in `tsconfig.json` match actual file structure
3. Rebuild TypeScript: `npx tsc --noEmit`
4. Restart VS Code completely

### Browser Not Opening

**Problem:** Debugger starts but no browser window opens

**Solutions:**
1. Install "Debugger for Chrome" extension (usually built-in)
2. Use "Full Stack" configuration which includes `serverReadyAction`
3. Manually open `http://localhost:3000` in Chrome
4. Check `.vscode/launch.json` has `serverReadyAction` configured

---

## Advanced Debugging

### Debug with Environment Variables

Create a `.env.local` file and start debugging with specific environment:

```bash
# .env.local
DEBUG=next:*
NODE_ENV=development
LOG_LEVEL=debug
```

Then start: `npm run dev` and debug normally.

### Remote Debugging

Debug a Next.js instance running on a different machine:

```bash
# On remote machine, start with debug protocol
NODE_OPTIONS='--inspect=0.0.0.0:9229' npm run dev

# In VS Code launch.json, update "Attach" config:
"address": "192.168.1.100",  // Remote IP
"port": 9229
```

### Debug Next.js Internals

To debug Next.js framework code itself:

```json
// Add to launch.json config:
"skipFiles": []  // Remove to debug node_internals
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Start Debugging | `F5` |
| Pause Execution | `F6` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift + F11` |
| Continue Execution | `F5` (or click continue icon) |
| Stop Debugging | `Shift + F5` |
| Add Breakpoint | Click left gutter |
| Toggle Breakpoint | `Cmd + K, Cmd + B` |

---

## Resources

- [Next.js Debugging Guide](https://nextjs.org/docs/advanced-features/debugging)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [Node.js Debugging in VS Code](https://nodejs.org/en/docs/guides/nodejs-debugging-getting-started/)
