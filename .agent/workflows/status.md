---
description: Display agent and project status. Progress tracking and status board.
---

# /status - Project Status

Check current project and agent status.

## Workflow

### Step 1: Project Analysis
Scan the project for:
- Technology stack
- Dependencies status
- Test coverage
- Recent changes

### Step 2: Generate Status Report

```markdown
# Project Status Report

## Overview
- **Project**: [name]
- **Stack**: [technologies]
- **Last Modified**: [date]

## Health Checks
| Check | Status |
|-------|--------|
| Dependencies | ✅/❌ |
| Tests | ✅/❌ |
| Lint | ✅/❌ |
| Build | ✅/❌ |

## Statistics
- Files: [count]
- Lines of Code: [count]
- Test Coverage: [percentage]

## Recent Activity
- [recent commits or changes]

## Recommendations
1. [Suggested improvement 1]
2. [Suggested improvement 2]
```

### Step 3: Run Checks
```bash
# Quick validation
python .agent/scripts/checklist.py .
```

## Usage

```
/status
/status detailed
```

## Example Output

```
📊 Project Status

✅ Dependencies: Up to date
✅ Tests: 45/45 passing
✅ Lint: No errors
⚠️ Coverage: 72% (target: 80%)

💡 Suggestions:
- Add tests for utils/format.ts
- Update 2 outdated packages
```
