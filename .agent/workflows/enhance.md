---
description: Add or update features in existing application. Used for iterative development.
---

# /enhance - Improve Existing Code

Add features or improve existing functionality in the codebase.

## Workflow

### Step 1: Understand Current State
Use `@explorer-agent` to map:
- Current implementation
- Related files and dependencies
- Test coverage

### Step 2: Define Enhancement
Clarify:
1. What specific improvement is needed?
2. What files will be affected?
3. Are there breaking changes?

### Step 3: Plan Changes
Create minimal plan:
```markdown
## Enhancement: [Title]

### Files to Modify
- `path/to/file.ts` - [change description]

### New Files (if any)
- `path/to/new.ts` - [purpose]

### Tests to Add
- [ ] Test case 1
- [ ] Test case 2
```

### Step 4: Implementation
Execute changes following the plan:
1. Modify code incrementally
2. Run tests after each change
3. Document any deviations

### Step 5: Verification
- [ ] All existing tests pass
- [ ] New tests added and passing
- [ ] No linting errors
- [ ] Functionality verified

## Usage

```
/enhance Add dark mode to the dashboard
/enhance Improve error handling in the API
/enhance Add pagination to the user list
```

## Notes
- Always understand before modifying
- Keep changes minimal and focused
- Add tests for new functionality
