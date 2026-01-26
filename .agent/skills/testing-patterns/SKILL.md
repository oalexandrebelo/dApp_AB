---
name: testing-patterns
description: Testing patterns and principles. Unit, integration, mocking strategies.
allowed-tools: Read, Write, Edit, Bash
version: 1.0
priority: MEDIUM
---

# Testing Patterns - Quality Principles

> **Curator:** AB ED&IA - Alexandre Belo | **Project:** Antigravity-Kit-Brabo

## Test Pyramid

```
        ╱╲
       ╱  ╲  E2E (few)
      ╱────╲
     ╱      ╲  Integration (some)
    ╱────────╲
   ╱          ╲  Unit (many)
  ╱────────────╲
```

---

## AAA Pattern

```typescript
it('should create user', async () => {
  // Arrange
  const data = { name: 'John' }
  
  // Act
  const user = await createUser(data)
  
  // Assert
  expect(user.id).toBeDefined()
})
```

---

## Coverage Targets

| Type | Target |
|------|--------|
| Business logic | 80%+ |
| Utilities | 70%+ |
| UI components | 60%+ |

---

## Naming Convention

```
describe('[Unit]', () => {
  it('should [expected behavior] when [condition]', () => {})
})
```

---

**Remember**: Tests are documentation. Write them clearly.
