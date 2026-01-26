---
name: magicui-components
description: Guide for using Magic UI components. Focuses on landing page micro-interactions, "Bento" style cards, and polished visual effects.
---

# Magic UI - Master Guide

> **Official Docs:** [magicui.design](https://magicui.design)
> **CLI Support:** Yes (Shadcn Compatible)

A collection of re-usable components for building landing pages and user-facing marketing materials.

## 📦 Installation

Magic UI is fully compatible with the `shadcn` CLI, making it the easiest "Fancy UI" library to install.

### Option 1: CLI (Recommended)

```bash
# Add a component (e.g., Marquee)
npx shadcn@latest add "https://magicui.design/r/marquee"

# Add the Bento Grid
npx shadcn@latest add "https://magicui.design/r/bento-grid"
```

### Option 2: Manual Setup

1.  **Dependencies**:
    ```bash
    npm install framer-motion clsx tailwind-merge
    ```
2.  **Utils**: Ensure you have `lib/utils.ts` with `cn()` (standard in Shadcn projects).

## 🚀 Standout Components

### 1. Micro-Interactions
- **Marquee**: Infinite scrolling logos/text (very performant).
- **Animated List**: Notifications stacking up automatically.
- **Number Ticker**: Animated number counter for stats.
- **Word Rotate**: Rotating words in a sentence.

### 2. Visual Effects
- **Borders**: "Shine Border", "Meteors", "Border Beam".
- **Backgrounds**: "Grid Pattern", "Dot Pattern", "Retro Grid".
- **Typing Animation**: Terminal-like typing effect.

## 🛠️ Usage Guidelines

### 1. Integration with Shadcn
Magic UI is designed to sit alongside `shadcn/ui`. It uses the same architecture (`components/magicui` vs `components/ui`).

### 2. Theming
Magic UI respects your `tailwind.config.js` colors (`--background`, `--foreground`). It works in Light and Dark mode out of the box better than Aceternity.

### 3. "Magic" Config
Some components require adding animations to `tailwind.config.js`.
If using the CLI, this is done automatically.
If manual, you MUST copy the `theme.extend.animation` and `keyframes` from the docs.

## 🎨 Creative Workflow

1.  **Social Proof**: Use **Marquee** for client logos.
2.  **Features**: Use **Bento Grid** for feature highlights.
3.  **CTA**: Use **Shine Border** on your main "Get Started" button.
4.  **Header**: Use **Word Rotate** or **Flip Text** for dynamic headlines.

---
**© 2025 Antigravity Kit**
