---
name: reactbits-components
description: Guide for using React Bits animated components. Covers installation, component types, and customization.
---

# React Bits - Animated UI Components

> **Official Docs:** [reactbits.dev](https://reactbits.dev)
> **GitHub:** [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits)

A collection of high-quality, animated, interactive & fully customizable React components.

## 📦 Installation

React Bits is designed for "copy-paste" or CLI installation, similar to shadcn/ui.

### Option 1: CLI (Recommended)

React Bits supports `shadcn` and `jsrepo` CLIs.

```bash
# Using shadcn CLI
npx shadcn@latest add @react-bits/[ComponentName]

# Example:
npx shadcn@latest add @react-bits/BlurText
```

### Option 2: Manual Copy-Paste

1. Go to the [React Bits documentation](https://reactbits.dev).
2. Select a component.
3. Choose your variant (TS/JS, Tailwind/CSS).
4. Copy the code into a file in your project (e.g., `components/react-bits/BlurText.tsx`).
5. Install necessary dependencies (usually `framer-motion` or standard React hooks).

## 🚀 Components Categories

### 1. Text Animations
High-impact text effects for heroes and headers.
- **BlurText**: Text that blurs in.
- **SplitText**: Character/word splitting animations.
- **DecryptedText**: Hacker-style text reveal.
- **ShinyText**: Gradient shine effect.

### 2. Backgrounds
Dynamic backgrounds to add depth.
- **GridMotion**: Moving grid lines.
- **DotPattern**: Animated dots.
- **Hyperspeed**: Star wars jump effect.
- **Aurora**: Fluid gradient colors.

### 3. UI Elements
Interactive functional components.
- **Stack**: Card stacking effects.
- **Dock**: macOS-style dock.
- **Magnet**: Elements that follow the cursor.

## 🛠️ Usage Guidelines

### 1. Zero-Config vs Customization
Most components work out of the box with default props.
Always check the `props` interface in the component file to see what can be customized (colors, speed, delay, etc.).

```tsx
<BlurText 
  text="Hello World" 
  delay={50} 
  className="text-4xl font-bold" 
/>
```

### 2. Dependencies
Many animations rely on **Framer Motion** or **GSAP**.
Ensure you have them installed if the component requires it:

```bash
npm install framer-motion gsap
```

### 3. Performance
- **Client Components**: Most React Bits components are interactive, so they must be Client Components in Next.js (`'use client'`).
- **Heavy Animations**: Be careful with heavy background animations (like WebGL ones) on mobile devices. Check for performance flags or simplified versions.

## 🎨 Creative Workflow

1. **Identify High-Impact Areas**: Use React Bits for "Above the Fold" content (Hero sections, Call to Action).
2. **Mix & Match**: Combine a *Text Animation* with a *Background* for a complete section.
3. **Consistent Theme**: Customize the colors of the animations to match your Tailwind theme (`text-primary`, `bg-accent`).

---
**© 2025 Antigravity Kit**
