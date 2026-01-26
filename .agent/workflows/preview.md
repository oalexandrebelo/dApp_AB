---
description: Preview server start, stop, and status check. Local development server management.
---

# /preview - Local Preview

Manage local development server for previewing changes.

## Workflow

### Step 1: Detect Project Type
Identify:
- Framework (Next.js, Vite, React, etc.)
- Start command
- Default port

### Step 2: Start Preview Server

**Next.js:**
```bash
npm run dev
# Server at http://localhost:3000
```

**Vite:**
```bash
npm run dev
# Server at http://localhost:5173
```

**Create React App:**
```bash
npm start
# Server at http://localhost:3000
```

**Static:**
```bash
npx serve dist
# Server at http://localhost:3000
```

### Step 3: Preview Status
```markdown
## Preview Server

🟢 **Status**: Running
📍 **URL**: http://localhost:3000
⏱️ **Uptime**: 5 minutes

### Quick Links
- Home: http://localhost:3000/
- API: http://localhost:3000/api
- Docs: http://localhost:3000/docs
```

### Step 4: Stop Server
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 [PID]
```

## Usage

```
/preview start
/preview stop
/preview status
/preview
```

## Hot Reload
Most frameworks support hot reload:
- Changes auto-refresh in browser
- State preserved when possible
- Errors shown in overlay
