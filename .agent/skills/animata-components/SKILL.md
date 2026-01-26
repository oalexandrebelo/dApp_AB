---
name: animata-components
description: Guide for using Animata components. A collection of hand-crafted, interaction-heavy animations focused on user engagement and delight.
---

# Animata - Interaction Library

> **Official Docs:** [animata.design](https://animata.design)
> **Best For:** Micro-interactions, Gestures, Unique Layouts

Animata is less about "standard UI" and more about **creative interactions** and **visual delight**.

## 📦 Setup

Animata relies heavily on `tailwindcss-animate` plugin.

### 1. Installation

```bash
npm install tailwindcss-animate lucide-react
```

### 2. Config
Add the plugin to `tailwind.config.js`:

```js
module.exports = {
  // ...
  plugins: [
    require("tailwindcss-animate"),
    // ...
  ],
}
```

### 3. Usage Strategy
Animata is strict "Copy-Paste". There is no CLI.
You copy the file content and usually `layout.tsx` or `page.tsx` examples.

## 🚀 Unique Categories

### 1. Interactions
- **Drag & Drop**: Kanban-style lists or sortable items.
- **Swipe**: Tinder-like card swiping.
- **Gestures**: Elements that respond to mouse position/velocity.

### 2. High-Fidelity UI
- **Pricing Cards**: Interactive pricing toggles and highlights.
- **Testimonials**: Carousel interactions.
- **Navigations**: Floating docks and distinct menu styles.

### 3. Skeleton Loading
Animata has some of the best creative loading skeletons (shimmer, wave, pulse) that look better than standard grey boxes.

## 🛠️ When to Use

Use Animata when you need to **surprise** the user.
*   "Add to Cart" animations.
*   Complex interactive charts.
*   Unique image galleries (e.g., "Bento Gallery").

## ⚠️ Notes
*   **Code Volume**: Some Animata components are large (single file). Don't be afraid to refactor them into smaller sub-components if needed.
*   **Icons**: Default uses `lucide-react`.

---
**© 2025 Antigravity Kit**
