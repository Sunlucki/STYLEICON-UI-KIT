import { useState } from 'react'
import { SideNavProgress } from './side-nav-progress'

const DEMO_SECTIONS = [
  { id: 1, type: 'hero' },
  { id: 2, type: 'masonry' },
  { id: 3, type: 'timeline' },
  { id: 4, type: 'text' },
  { id: 5, type: 'contact' },
]

const COLORS = ['#2d0a0a', '#3d0c0c', '#1a0505', '#fdf8f3', '#6b0f1a']

export default function Demo() {
  const [locale, setLocale] = useState('en')

  return (
    <div style={{ minHeight: '100vh' }}>
      <SideNavProgress
        sections={DEMO_SECTIONS}
        locale={locale}
        setLocale={setLocale}
        supportedLocales={['en', 'pl', 'ru']}
        copy={{}}
      />

      {DEMO_SECTIONS.map((s, i) => (
        <div
          key={s.id}
          id={`section-${s.id}`}
          style={{
            height: '100vh',
            background: COLORS[i % COLORS.length],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: i === 3 ? '#2d0a0a' : '#fdf8f3',
            fontSize: '2rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {s.type.charAt(0).toUpperCase() + s.type.slice(1)} Section
        </div>
      ))}
    </div>
  )
}
