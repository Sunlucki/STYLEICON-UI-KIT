# Contributing to STYLEICO UI SET

Thanks for adding a component! Follow these guidelines so any agent or developer can contribute cleanly.

---

## Workflow

1. **Fork or clone** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b component/<component-name>
   ```
3. **Add your component** under `components/<component-name>/`
4. **Commit & push**, then **open a Pull Request** to `main`

---

## Component Structure

Every component must include:

```
components/<component-name>/
├── README.md                ← Required: props table, usage example, peer deps
├── <component-name>.jsx     ← Required: the component source
├── demo.jsx                 ← Recommended: standalone demo/preview
└── preview.png              ← Optional: screenshot or gif
```

### Component README Template

```markdown
# <Component Name>

Brief description of what the component does.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## Dependencies

- react
- framer-motion
- (list all peer dependencies)

## Usage

\`\`\`jsx
import { ComponentName } from './component-name'

<ComponentName prop1="value" />
\`\`\`

## Preview

![preview](./preview.png)
```

---

## Tech Stack Requirements

All components in this repository must use:

| Requirement | Details |
|-------------|---------|
| **React** | 19+ (hooks only, no class components) |
| **Styling** | Tailwind CSS utility classes |
| **Animation** | Framer Motion (preferred) or CSS transitions |
| **Icons** | Lucide React (preferred) or inline SVG |
| **Utilities** | Use `cn()` from `../../lib/utils` for conditional classes |

### Rules

- No external CSS files — Tailwind only
- No runtime CSS-in-JS (styled-components, emotion, etc.)
- Components must be self-contained — no cross-component imports
- Use `export { ComponentName }` (named exports, not default)
- All colors should use hex values or Tailwind classes (no hard-coded rgb)
- Animations should respect `prefers-reduced-motion`

---

## Naming Conventions

- **Folder**: `kebab-case` (e.g., `side-nav-progress`)
- **File**: `kebab-case.jsx` (e.g., `side-nav-progress.jsx`)
- **Export**: `PascalCase` (e.g., `SideNavProgress`)
- **Branch**: `component/<kebab-case-name>`

---

## Agent Integration

If you're an AI agent adding a component from another project:

1. Extract the component and its direct dependencies
2. Replace project-specific imports with relative paths to `../../lib/utils`
3. Remove any project-specific hard-coded values — make them props
4. Create the `README.md` with the template above
5. Branch name: `component/<component-name>`
6. Commit message: `feat: add <component-name> component`

---

## Quality Checklist

- [ ] Component renders without errors
- [ ] All props are documented in README
- [ ] No project-specific imports (API calls, contexts, etc.)
- [ ] Works with both light and dark backgrounds (if visual)
- [ ] Mobile-responsive or clearly desktop-only (documented)
- [ ] Named export used
