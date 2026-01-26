---
name: clean-code
description: Pragmatic coding standards - concise, direct, no over-engineering, no unnecessary comments. MANDATORY for all code.
allowed-tools: Read, Write, Edit
version: 1.0
priority: CRITICAL
---

# Clean Code - Pragmatic Standards

> **Curator:** AB ED&IA - Alexandre Belo | **Project:** Antigravity-Kit-Brabo

**This skill is MANDATORY for all agents. No exceptions.**

## When to Use

ALWAYS. These standards apply to all code.

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Concise** | Less code = less bugs |
| **Direct** | Clear intent, no tricks |
| **Self-Documenting** | Code explains itself |
| **Minimal Dependencies** | Only what's necessary |
| **Test First** | TDD when possible |

---

## Naming Rules

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase, descriptive | `userEmail`, `isActive` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Functions | camelCase, verb | `calculateTotal()` |
| Classes | PascalCase | `UserService` |
| Files | kebab-case | `user-service.ts` |

---

## Function Rules

- 20 lines maximum
- Single responsibility
- Max 3 parameters
- Return early on errors
- No nested callbacks > 2 levels

---

## Anti-Patterns to Avoid

| ❌ Avoid | ✅ Prefer |
|----------|----------|
| Magic numbers | Named constants |
| Deep nesting | Early returns |
| God files | Small modules |
| Any in TypeScript | Explicit types |
| Console.log debug | Proper logging |
| Commented code | Git history |

---

**Remember**: Readable code is maintainable code.
