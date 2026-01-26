---
name: api-patterns
description: API design principles and decision-making. REST vs GraphQL vs tRPC selection, response formats, versioning, pagination.
allowed-tools: Read, Write, Edit
version: 1.0
priority: MEDIUM
---

# API Patterns - Design Principles

> **Curator:** AB ED&IA - Alexandre Belo | **Project:** Antigravity-Kit-Brabo

## REST Conventions

```
GET    /resources       → List
GET    /resources/:id   → Get one
POST   /resources       → Create
PUT    /resources/:id   → Full update
PATCH  /resources/:id   → Partial update
DELETE /resources/:id   → Delete
```

---

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

---

## Status Codes

| Code | Use |
|------|-----|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |
