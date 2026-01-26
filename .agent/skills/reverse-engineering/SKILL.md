---
name: reverse-engineering
description: Patterns, techniques, and methodologies for reverse engineering code, APIs, protocols, and systems.
allowed-tools: Read, Grep, Glob, Bash
version: 1.0
priority: HIGH
---

# Reverse Engineering - System Analysis

> **Curator:** AB ED&IA - Alexandre Belo | **Project:** Antigravity-Kit-Brabo

## RIMA Methodology

### R - Reconnaissance
- Inventory available artifacts
- Identify language/framework
- Map folder structure

### I - Investigation
- Find entry points
- Trace data flow
- Map external calls

### M - Mapping
- Create component diagram
- Document interfaces
- List business rules

### A - Artifacts
- Generate discovery document
- Create diagrams
- List knowledge gaps

---

## Analysis Commands

```bash
# Find entry points
grep -rn "main\|init" --include="*.{js,py,ts}"

# Map imports
grep -rn "^import\|require(" --include="*.ts"

# Find routes
grep -rn "app\.\(get\|post\)" --include="*.js"
```

---

## Confidence Levels

| Level | Criteria |
|-------|----------|
| **High** | Confirmed by multiple sources |
| **Medium** | Consistent evidence |
| **Low** | Limited hypothesis |

---

**Remember**: Observe → Document → Verify. Don't assume.
