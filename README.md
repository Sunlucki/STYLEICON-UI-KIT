# STYLEICO UI SET

A curated collection of reusable, animated React UI components built with **Framer Motion**, **Tailwind CSS**, and **Lucide Icons**.

Each component is self-contained, production-ready, and designed for easy integration into any React project.

---

## Components

| Component | Description | Path |
|-----------|-------------|------|
| **SideNav Progress Bar** | Scroll-linked side navigation with animated progress dots, spring-fill transitions, and adaptive light/dark background detection | `components/side-nav-progress/` |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19+ |
| Animation | Framer Motion | 12+ |
| Styling | Tailwind CSS | 4+ |
| Icons | Lucide React | latest |
| Utilities | clsx + tailwind-merge | latest |

---

## Project Structure

```
STYLEICO-UI-SET/
├── README.md                        ← This file
├── CONTRIBUTING.md                   ← How to add components
├── components/
│   └── side-nav-progress/
│       ├── README.md                ← Component docs, props, usage
│       ├── side-nav-progress.jsx    ← Main component
│       ├── demo.jsx                 ← Standalone demo/preview
│       └── preview.png              ← Screenshot (optional)
├── lib/
│   └── utils.js                     ← Shared utilities (cn helper)
└── .gitignore
```

---

## Usage

Each component directory is self-contained. Copy the component folder into your project, install peer dependencies, and import:

```jsx
import { SideNavProgress } from './components/side-nav-progress/side-nav-progress'
```

### Peer dependencies

```bash
npm install react framer-motion lucide-react clsx tailwind-merge
```

---

## Adding Components from Other Projects

Other agents or developers can contribute new components by:

1. Creating a new branch: `component/<component-name>`
2. Adding a folder under `components/` following the structure above
3. Including a component-level `README.md` with props, usage, and examples
4. Opening a Pull Request to `main`

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

---

## License

MIT
