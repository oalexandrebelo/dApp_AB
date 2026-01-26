---
name: aceternity-components
description: Guide for using Aceternity UI components. Focuses on trending, high-quality, copy-paste React components using Framer Motion and Tailwind CSS.
---

# Aceternity UI - Master Guide

> **Official Docs:** [ui.aceternity.com](https://ui.aceternity.com)
> **Author:** Manu Arora

A collection of trending, high-quality React components tailored for modern web design. Known for "Bento Grids", "Hero Parallax", and glowing effects.

## 📦 Core Setup

Aceternity UI is **NOT** a component library you install via `npm i aceternity-ui`. It uses the "Copy-Paste" philosophy (similar to Shadcn).

### 1. Dependencies
You must have these installed:

```bash
npm install framer-motion clsx tailwind-merge
```

### 2. Utility Class (`cn`)
Most components rely on a `cn` utility. Create `lib/utils.ts` (or `utils/cn.ts`):

```ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. Tailwind Configuration
Some components (like `Spotlight` or `Moving Border`) require extending `tailwind.config.js`. Always check the component docs.

## 🚀 Popular Components

### 1. Heroes & Layouts
- **Hero Parallax**: Full-screen scroll effect with products.
- **Bento Grid**: Apple-style grid layouts with hover effects.
- **Wavy Background**: Animated SVG background.
- **Lamp Section**: Text inside a glowing lamp beam.

### 2. Cards & Elements
- **3D Card**: Card that rotates on hover.
- **Moving Border**: Button with a snake-like moving border gradient.
- **Hover Border Gradient**: Minimalist glowing border.
- **Text Reveal**: Scroll-triggered text reveal.

## 🛠️ Usage Workflow

1.  **Select Component**: Go to [ui.aceternity.com/components](https://ui.aceternity.com/components).
2.  **Copy Code**: Click "Copy" on the component source code.
3.  **Paste & Fix Imports**: 
    - Paste into `components/ui/[name].tsx`.
    - Fix the `cn` import path if necessary (`@/lib/utils` or `../utils/cn`).
4.  **Install Extras**: Some components need extra libs (e.g., `three`, `mini-svg-data-uri`). The docs will tell you.

## 🎨 Best Practices

- **Dark Mode First**: Aceternity shines in Dark Mode. It often assumes a dark background.
- **Performance**: Heavy animations (e.g., `Sparkles`, `Globe`) use Canvas/WebGL. Use sparingly on mobile.
- **Customization**: It's your code. Changing colors usually involves modifying the Tailwind classes inside the component file, not valid props.

---
**© 2025 Antigravity Kit**
