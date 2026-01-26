---
name: database-design
description: Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases.
allowed-tools: Read, Write, Edit
version: 1.0
priority: MEDIUM
---

# Database Design - Modeling Principles

> **Curator:** AB ED&IA - Alexandre Belo | **Project:** Antigravity-Kit-Brabo

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Tables | snake_case, plural | `user_profiles` |
| Columns | snake_case | `created_at` |
| PKs | `id` | `id` |
| FKs | `{table}_id` | `user_id` |
| Indexes | `idx_{table}_{column}` | `idx_users_email` |

---

## Required Fields

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at  TIMESTAMPTZ DEFAULT NOW(),
updated_at  TIMESTAMPTZ DEFAULT NOW()
```

---

## Index Strategy

| Query Pattern | Index Type |
|---------------|------------|
| Exact match | B-tree (default) |
| Range queries | B-tree |
| Full-text search | GIN |
| Geospatial | GiST |

---

**Remember**: Index for common queries, not every column.
