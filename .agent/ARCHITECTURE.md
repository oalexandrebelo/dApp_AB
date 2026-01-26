# Antigravity-Kit-Brabo Architecture

> **The Best Brazilian AI Agents Kit** - Complete System Documentation

---

## 📋 Overview

Antigravity-Kit-Brabo is a modular AI agent system consisting of:

- **20 Specialist Agents** - Role-based AI personas
- **10 Core Skills** - Domain-specific knowledge modules
- **5 Workflows** - Slash command procedures

---

## 🏗️ Directory Structure

```plaintext
.agent/
├── ARCHITECTURE.md       # This file
├── agents/               # 20 Specialist Agents
├── skills/               # 10 Core Skills
├── workflows/            # 5 Slash Commands
├── scripts/              # Validation Scripts
└── memory/               # Persistent Context

project-root/
├── GEMINI.md             # AI Behavior Configuration
├── docs/                 # Usage Documentation
└── i18n/pt-BR/           # Portuguese Translation
```

---

## 🤖 Agents (20)

Specialist AI personas for different domains.

### Orchestration & Planning
| Agent | Focus | Skills |
|-------|-------|--------|
| `orchestrator` | Multi-agent coordination | brainstorming |
| `project-planner` | Discovery, task planning | plan-writing, brainstorming |
| `product-manager` | Requirements, roadmaps | brainstorming, plan-writing |

### Development
| Agent | Focus | Skills |
|-------|-------|--------|
| `backend-specialist` | API, databases | api-patterns, database-design |
| `frontend-specialist` | Web UI/UX | frontend-design, clean-code |
| `mobile-developer` | iOS, Android, RN | mobile-design |
| `database-architect` | Schema, optimization | database-design |
| `game-developer` | Game logic, engines | clean-code |

### Operations & Quality
| Agent | Focus | Skills |
|-------|-------|--------|
| `devops-engineer` | CI/CD, Docker | clean-code |
| `test-engineer` | Unit, E2E, TDD | testing-patterns |
| `qa-automation-engineer` | QA frameworks | testing-patterns |
| `debugger` | Root cause analysis | clean-code |
| `performance-optimizer` | Speed, Web Vitals | clean-code |

### Security
| Agent | Focus | Skills |
|-------|-------|--------|
| `security-auditor` | Security review | vulnerability-scanner |
| `penetration-tester` | Red team, pentesting | vulnerability-scanner |

### Documentation & Analysis
| Agent | Focus | Skills |
|-------|-------|--------|
| `documentation-writer` | Technical writing | brainstorming |
| `explorer-agent` | Codebase discovery | reverse-engineering |
| `code-archaeologist` | Legacy code | reverse-engineering |
| `reverse-engineer` | System analysis | reverse-engineering |

### Growth
| Agent | Focus | Skills |
|-------|-------|--------|
| `seo-specialist` | SEO, meta tags | clean-code |

---

## 🧩 Skills (10)

Modular knowledge domains that agents can load on-demand.

| Skill | Category | Description |
|-------|----------|-------------|
| `clean-code` | Standards | **GLOBAL** - Pragmatic coding standards |
| `api-patterns` | Backend | REST, GraphQL, tRPC design |
| `database-design` | Backend | Schema, indexes, ORMs |
| `frontend-design` | Frontend | UI/UX patterns, design systems |
| `mobile-design` | Mobile | Mobile-first, touch patterns |
| `testing-patterns` | Quality | Jest, Vitest, TDD strategies |
| `vulnerability-scanner` | Security | OWASP 2025, security auditing |
| `plan-writing` | Planning | Task breakdown, estimation |
| `brainstorming` | Discovery | Socratic questioning |
| `reverse-engineering` | Analysis | System analysis, RIMA methodology |

---

## 🔄 Workflows (5)

Slash command procedures. Invoke with `/command`.

| Command | Description | Primary Agent |
|---------|-------------|---------------|
| `/plan` | Create implementation plan | project-planner |
| `/create` | Build new features | orchestrator |
| `/debug` | Systematic debugging | debugger |
| `/orchestrate` | Multi-agent coordination | orchestrator |
| `/brainstorm` | Socratic discovery | - |

---

## 🎯 Skill Loading Protocol

```plaintext
User Request → Agent Selection → Load Agent Skills
                                       ↓
                               Read SKILL.md
                                       ↓
                               Apply Principles
```

### Skill Structure

```plaintext
skill-name/
└── SKILL.md           # Instructions & patterns
```

---

## 📊 Agent-Skill Matrix

| Agent | clean-code | api-patterns | database-design | frontend-design | testing-patterns | vulnerability-scanner | plan-writing | brainstorming | reverse-engineering | mobile-design |
|-------|:----------:|:------------:|:---------------:|:---------------:|:----------------:|:--------------------:|:------------:|:-------------:|:-------------------:|:-------------:|
| orchestrator | ✓ | | | | | | | ✓ | | |
| project-planner | ✓ | | | | | | ✓ | ✓ | | |
| backend-specialist | ✓ | ✓ | ✓ | | | | | | | |
| frontend-specialist | ✓ | | | ✓ | | | | | | |
| mobile-developer | ✓ | | | | | | | | | ✓ |
| database-architect | ✓ | | ✓ | | | | | | | |
| security-auditor | ✓ | | | | | ✓ | | | | |
| test-engineer | ✓ | | | | ✓ | | | | | |
| debugger | ✓ | | | | | | | | | |
| reverse-engineer | ✓ | | | | | | | | ✓ | |

---

## 🔗 Quick Reference

| Need | Agent | Skills |
|------|-------|--------|
| Web App | `frontend-specialist` | frontend-design, clean-code |
| API | `backend-specialist` | api-patterns, database-design |
| Mobile | `mobile-developer` | mobile-design |
| Database | `database-architect` | database-design |
| Security | `security-auditor` | vulnerability-scanner |
| Testing | `test-engineer` | testing-patterns |
| Debug | `debugger` | clean-code |
| Plan | `project-planner` | plan-writing, brainstorming |
| Legacy | `code-archaeologist` | reverse-engineering |

---

## 📈 Statistics

| Metric | Value |
|--------|-------|
| **Total Agents** | 20 |
| **Total Skills** | 10 |
| **Total Workflows** | 5 |
| **Documentation Pages** | 8 |
| **Languages** | English (official), Portuguese (i18n) |

---

**© 2025 AB ED&IA - Alexandre Belo | [alexandrebelo.com.br](https://www.alexandrebelo.com.br)**
