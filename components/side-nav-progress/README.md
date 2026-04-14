# SideNav Progress Bar

A scroll-linked side navigation with animated progress dots. Icons start as outlined circles and spring-fill with gold as you scroll past each section. The active section icon enlarges. Includes adaptive light/dark background detection, locale switcher, and fullscreen mobile menu.

## Preview

Desktop sidebar with vertical progress track. Each section gets a circle with an icon inside:
- **Upcoming**: Outlined circle, dim icon
- **Active**: Enlarged circle, gold-filled, larger icon (spring animation)
- **Passed**: Gold-filled circle with dark icon (spring animation)
- **Footer checkmark**: Same spring-fill behavior when page bottom is reached

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `Array<{ id: number, type: string }>` | `[]` | Array of section objects from your CMS/API. Each needs `id` and `type` |
| `locale` | `string` | — | Current locale code (e.g., `'en'`) |
| `setLocale` | `(locale: string) => void` | — | Locale change handler |
| `supportedLocales` | `string[]` | — | Array of supported locale codes |
| `copy` | `object` | — | Localized text map (keys like `navHome`, `navContact`, etc.) |

### Section Types → Icons

| Type | Icon | Label |
|------|------|-------|
| `hero` | Home | Home |
| `carousel` | Images | Gallery |
| `masonry` | LayoutGrid | Projects |
| `timeline` | Clock | Experience |
| `text` | FileText | About |
| `heading` | Type | Section |
| `video` | Play | Video |
| `contact` | MessageCircle | Contact |
| `webgl` | Sparkles | Effects |

## Dependencies

- `react` (19+)
- `framer-motion` (12+)
- `lucide-react`
- `clsx` + `tailwind-merge` (via `cn` utility)

## Usage

```jsx
import { SideNavProgress } from './side-nav-progress'

const sections = [
  { id: 1, type: 'hero' },
  { id: 2, type: 'masonry' },
  { id: 3, type: 'timeline' },
  { id: 4, type: 'text' },
  { id: 5, type: 'contact' },
]

function App() {
  return (
    <div>
      <SideNavProgress
        sections={sections}
        locale="en"
        setLocale={() => {}}
        supportedLocales={['en']}
        copy={{}}
      />

      {/* Sections must have matching IDs */}
      {sections.map(s => (
        <div key={s.id} id={`section-${s.id}`} style={{ height: '100vh' }}>
          Section {s.type}
        </div>
      ))}
    </div>
  )
}
```

### Scroll Target

Each page section must have `id="section-{id}"` matching the `sections[n].id` value.

## Color Palette

The component uses a warm burgundy/gold palette by default:
- `#d4a574` — Gold accent (filled circles, progress line)
- `#1a0505` — Dark (icon color when filled)
- `#2d0a0a` — Dark background tones
- `#fdf8f3` — Cream light tones
- `#6b0f1a` — Burgundy hover

Customize by editing the Tailwind classes in the component.

## Features

- Scroll-spy with IntersectionObserver-free approach (scroll position math)
- Background luminance detection — auto-switches between light/dark icon tones
- Spring animations (`type: 'spring', stiffness: 400, damping: 15`)
- Locale dropdown with click-outside dismiss
- Fullscreen mobile menu with staggered animations
- Progress track line (gold fill only, no background track)
- Footer checkmark with identical spring-fill behavior
