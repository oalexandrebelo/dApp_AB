---
description: Deployment command for production releases. Pre-flight checks and deployment execution.
---

# /deploy - Production Deployment

Execute pre-flight checks and deploy to production environment.

## Workflow

### Step 1: Pre-flight Checks
Before deploying, verify:

```markdown
## Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No security vulnerabilities
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Rollback plan documented
```

### Step 2: Run Verification
```bash
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

### Step 3: Deployment Process
1. **Backup** - Create backup of current production state
2. **Migrate** - Apply database migrations
3. **Deploy** - Push new version to production
4. **Verify** - Smoke test production endpoints
5. **Monitor** - Watch error rates for 15 minutes

### Step 4: Rollback (if needed)
If issues are detected:
1. Revert to previous version
2. Rollback database migrations
3. Notify stakeholders
4. Document incident

## Usage

```
/deploy
/deploy staging
/deploy production
```

## Notes
- Always deploy to staging first
- Monitor logs during and after deployment
- Have rollback ready before proceeding
