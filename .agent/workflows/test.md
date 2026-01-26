---
description: Test generation and test running command. Creates and executes tests for code.
---

# /test - Run Tests

Generate and run tests for the project.

## Workflow

### Step 1: Test Analysis
Determine:
- Test framework (Jest, Vitest, Playwright, etc.)
- Current test coverage
- Missing test cases

### Step 2: Run Tests
```bash
# Unit tests
npm test

# With coverage
npm test -- --coverage

# Specific file
npm test -- path/to/file.test.ts

# Watch mode
npm test -- --watch
```

### Step 3: Analyze Results
```markdown
## Test Results

### Summary
- **Total**: X tests
- **Passed**: X ✅
- **Failed**: X ❌
- **Skipped**: X ⏭️

### Coverage
| File | Lines | Branches | Functions |
|------|-------|----------|-----------|
| ... | XX% | XX% | XX% |

### Failed Tests
1. `test name` - [reason]
```

### Step 4: Generate Missing Tests
If requested, use `@test-engineer` to:
1. Identify untested code
2. Generate test cases
3. Apply AAA pattern (Arrange, Act, Assert)

## Usage

```
/test
/test coverage
/test generate UserService
/test fix failing
```

## Test Generation Template

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = createTestData();
      
      // Act
      const result = methodUnderTest(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
```
