---
name: mcp-servers
description: Definitive collection of Model Context Protocol (MCP) servers for the Antigravity Kit. Includes configuration patterns, installation guides, and use cases for 20+ tools.
---

# 🚀 Antigravity MCP Collection

> **Purpose:** Supercharge your AI agent with external tools (Filesystem, Database, Browser, GitHub, etc.).
> **Collection:** 20+ Curated Servers.

## 🏗️ 1. Core Development (The "Big Three")

Fundamental tools for building software.

### 1. Supabase MCP
Backend management as code.
*   **Capabilities:** Schema inspection, SQL execution, RLS policy creation.
*   **Config:**
    ```json
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": { "SUPABASE_URL": "<URL>", "SUPABASE_KEY": "<KEY>" }
    }
    ```

### 2. GitHub MCP
Repository memory and version control.
*   **Capabilities:** Read issues, PR history, search code, file contents.
*   **Config:**
    ```json
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<TOKEN>" }
    }
    ```

### 3. Figma MCP
Design-to-code bridge.
*   **Capabilities:** Read layout hierarchy, extract tokens, inspect props.
*   **Config:**
    ```json
    "figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": { "FIGMA_ACCESS_TOKEN": "<TOKEN>" }
    }
    ```

## ⚡ 2. QA & Management

### 4. Playwright MCP
End-to-end testing automation.
*   **Capabilities:** Browser automation, screenshots, interaction testing.
*   **Config:**
    ```json
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
    ```

### 5. Linear MCP
Project management and issue tracking.
*   **Capabilities:** Create issues, read backlog, update status.
*   **Config:**
    ```json
    "linear": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-linear"],
      "env": { "LINEAR_API_KEY": "<KEY>" }
    }
    ```

## 🛠️ 3. DevOps & Infra

### 6. Docker MCP
Container management.
*   **Capabilities:** List containers, logs, restart services.
*   **Config:**
    ```json
    "docker": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"]
    }
    ```

### 7. Kubernetes MCP
Cluster orchestration inspection.
*   **Capabilities:** List pods, namespaces, describe deployments.
*   **Config:**
    ```json
    "kubernetes": {
      "command": "npx",
      "args": ["-y", "@flux-framework/mcp-server-kubernetes"]
    }
    ```

### 8. Cloudflare MCP
Edge computing management.
*   **Capabilities:** Manage Workers, DNS, R2 storage.
*   **Config:**
    ```json
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-cloudflare"],
      "env": { "CLOUDFLARE_API_TOKEN": "<TOKEN>" }
    }
    ```

### 9. Sentry MCP
Error monitoring and stack traces.
*   **Capabilities:** Read latest errors, analyze stack traces.
*   **Config:**
    ```json
    "sentry": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sentry"],
      "env": { "SENTRY_AUTH_TOKEN": "<TOKEN>" }
    }
    ```

## 🧠 4. Intelligence & Data

### 10. PostgreSQL MCP
Direct database access.
*   **Capabilities:** Raw SQL, schema introspection.
*   **Config:**
    ```json
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/db"]
    }
    ```

### 11. SQLite MCP (✨ New)
Lightweight local database.
*   **Capabilities:** Read/Write local SQLite files.
*   **Config:**
    ```json
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "path/to/database.db"]
    }
    ```

### 12. Brave Search MCP
Web search capabilities.
*   **Capabilities:** API-based web search (safer than scraping).
*   **Config:**
    ```json
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "<KEY>" }
    }
    ```

### 13. Sequential Thinking MCP
Metacognition and planning.
*   **Capabilities:** Force step-by-step reasoning.
*   **Config:**
    ```json
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
    ```

### 14. Fetch MCP
Headless browser scraping.
*   **Capabilities:** Get URL content (HTML/JSON).
*   **Config:**
    ```json
    "fetch": {
      "command": "python",
      "args": ["-m", "mcp_server_fetch"]
    }
    ```
    *(Note: Often requires Python environment)*

## 📂 5. System & Productivity

### 15. Filesystem MCP
Local file manipulation.
*   **Capabilities:** Read/Write files, list directories.
*   **Config:**
    ```json
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\AB\\AllowedPath"]
    }
    ```

### 16. Google Drive MCP
Document access.
*   **Capabilities:** Read Docs, Sheets, search Drive.
*   **Config:**
    ```json
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"]
    }
    ```

### 17. Slack MCP
Team communication.
*   **Capabilities:** Read channels, send messages.
*   **Config:**
    ```json
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": { "SLACK_BOT_TOKEN": "<TOKEN>" }
    }
    ```

### 18. Memory MCP
Knowledge graph persistence.
*   **Capabilities:** Remember user preferences across sessions.
*   **Config:**
    ```json
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
    ```

### 19. Git MCP
Local version control.
*   **Capabilities:** Commit, push, status (local repo).
*   **Config:**
    ```json
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
    ```

## 🌟 6. New Additions (Recommended)

### 20. Google Maps MCP
Location and places.
*   **Capabilities:** Search places, get directions, geocoding.
*   **Config:**
    ```json
    "google-maps": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-maps"],
      "env": { "GOOGLE_MAPS_API_KEY": "<KEY>" }
    }
    ```

### 21. Obsidian MCP
Personal Knowledge Management.
*   **Capabilities:** Read/Write Markdown notes in Obsidian vault.
*   **Config:** (Community server, requires local setup)
    ```json
    "obsidian": {
      "command": "node",
      "args": ["path/to/mcp-obsidian/index.js", "C:\\Users\\AB\\Vault"]
    }
    ```

### 22. Vercel MCP
Deployment management.
*   **Capabilities:** Inspect deployments, logs, project configs.
*   **Config:**
    ```json
    "vercel": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": { "VERCEL_TOKEN": "<TOKEN>" }
    }
    ```

---
**© 2025 Antigravity Kit**
