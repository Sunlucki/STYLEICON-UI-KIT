import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu,
  X,
  Globe,
  Home,
  Images,
  LayoutGrid,
  Clock,
  FileText,
  Type,
  Play,
  MessageCircle,
  Check,
  Sparkles,
} from 'lucide-react'
import { cn } from '../../lib/utils'

/* ─── Section type → icon & label ─── */
const SECTION_ICON = {
  hero: Home,
  carousel: Images,
  masonry: LayoutGrid,
  timeline: Clock,
  text: FileText,
  heading: Type,
  video: Play,
  contact: MessageCircle,
  webgl: Sparkles,
}
const SECTION_LABEL = {
  hero: 'Home',
  carousel: 'Gallery',
  masonry: 'Projects',
  timeline: 'Experience',
  text: 'About',
  heading: 'Section',
  video: 'Video',
  contact: 'Contact',
  webgl: 'Effects',
}

/* Locale label map — extend as needed */
const DEFAULT_LOCALE_LABELS = {
  en: 'EN',
  pl: 'PL',
  uk: 'UA',
  ru: 'RU',
}

/* ═══════════════════ FULLSCREEN MENU ═══════════════════ */
function FullscreenMenu({ open, onClose, navItems, copy }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a0505]/95 backdrop-blur-xl"
        >
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={onClose}
            className="absolute top-6 right-6 flex size-12 items-center justify-center rounded-full border border-[#fdf8f3]/10 text-[#fdf8f3]/60 transition-colors hover:border-[#d4a574]/40 hover:text-[#d4a574]"
          >
            <X className="size-5" />
          </motion.button>

          <nav className="flex flex-col items-center gap-2">
            {navItems.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={onClose}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-center gap-5 rounded-2xl px-8 py-4 transition-colors hover:bg-[#fdf8f3]/5"
                >
                  <Icon className="size-5 text-[#d4a574]/60 transition-colors group-hover:text-[#d4a574]" />
                  <span className="text-2xl font-light tracking-wide text-[#fdf8f3]/70 transition-colors group-hover:text-[#fdf8f3] sm:text-3xl">
                    {copy[`nav${item.label}`] || item.label}
                  </span>
                </motion.a>
              )
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════ LOCALE DROPDOWN ═══════════════════ */
function LocaleDropdown({ locale, supportedLocales, onChange, onClose, localeLabels }) {
  const ref = useRef(null)
  const labels = localeLabels || DEFAULT_LOCALE_LABELS

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 flex flex-col gap-1 rounded-xl border border-[#fdf8f3]/10 bg-[#1a0505]/90 p-1.5 backdrop-blur-xl"
    >
      {supportedLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => { onChange(loc); onClose() }}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] transition-colors',
            loc === locale
              ? 'bg-[#d4a574] text-[#1a0505]'
              : 'text-[#fdf8f3]/50 hover:bg-[#fdf8f3]/10 hover:text-[#fdf8f3]',
          )}
        >
          {labels[loc] || loc.toUpperCase()}
        </button>
      ))}
    </motion.div>
  )
}

/* ═══════════════════ LUMINANCE HELPER ═══════════════════ */
function sampleBgLuminance() {
  try {
    const x = 32
    const y = window.innerHeight / 2
    const els = document.elementsFromPoint(x, y)
    for (const el of els) {
      if (el.closest('[data-sidenav]')) continue
      const bg = getComputedStyle(el).backgroundColor
      if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') continue
      const m = bg.match(/(\d+),\s*(\d+),\s*(\d+)/)
      if (m) {
        return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255
      }
    }
  } catch {}
  return 0.2
}

/* ═══════════════════ SIDE NAV PROGRESS ═══════════════════ */
/**
 * SideNavProgress — Scroll-linked side navigation with animated progress dots.
 *
 * @param {Object} props
 * @param {Array<{id: number, type: string}>} props.sections - Sections from CMS/API
 * @param {string} props.locale - Current locale code
 * @param {function} props.setLocale - Locale setter
 * @param {string[]} props.supportedLocales - Supported locale codes
 * @param {Object} props.copy - Localized text (keys like navHome, navContact)
 * @param {Object} [props.localeLabels] - Custom locale display labels
 */
function SideNavProgress({ locale, setLocale, supportedLocales, copy, sections = [], localeLabels }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [localeOpen, setLocaleOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrollProgress, setScrollProgress] = useState({})
  const [lightBg, setLightBg] = useState(false)
  const [atFooter, setAtFooter] = useState(false)

  const navItems = useMemo(() =>
    sections.length > 0
      ? sections.map((s) => ({
          id: `section-${s.id}`,
          icon: SECTION_ICON[s.type] || FileText,
          label: SECTION_LABEL[s.type] || s.type,
        }))
      : [{ id: 'top', icon: Home, label: 'Home' }],
    [sections],
  )

  /* ─── scroll spy ─── */
  const updateScroll = useCallback(() => {
    const viewH = window.innerHeight
    const scrollY = window.scrollY
    const docH = document.documentElement.scrollHeight

    const progress = {}
    let current = 'top'

    for (let i = 0; i < navItems.length; i++) {
      const el = document.getElementById(navItems[i].id)
      if (!el) { progress[navItems[i].id] = i === 0 ? 1 : 0; continue }

      const rect = el.getBoundingClientRect()
      const top = rect.top + scrollY
      const sectionProgress = Math.max(0, Math.min(1, (scrollY + viewH * 0.5 - top) / rect.height))
      progress[navItems[i].id] = sectionProgress

      if (rect.top < viewH * 0.5 && rect.bottom > viewH * 0.3) {
        current = navItems[i].id
      }
    }

    const reachedFooter = scrollY + viewH >= docH - 100
    if (reachedFooter && navItems.length > 0) {
      const last = navItems[navItems.length - 1]
      current = last.id
      progress[last.id] = 1
    }
    setAtFooter(reachedFooter)
    setScrollProgress(progress)
    setActiveSection(current)

    const lum = sampleBgLuminance()
    setLightBg(lum > 0.5)
  }, [navItems])

  useEffect(() => {
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [updateScroll])

  const activeIdx = navItems.findIndex((s) => s.id === activeSection)
  const currentProgress = scrollProgress[activeSection] ?? 0
  const maxTrackHeight = navItems.length * 48

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <motion.aside
        data-sidenav
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 top-0 z-50 hidden h-screen w-16 flex-col items-center py-6 lg:flex"
      >
        {/* Burger */}
        <button
          onClick={() => setMenuOpen(true)}
          className={cn(
            'flex size-10 items-center justify-center rounded-full border transition-all duration-300',
            lightBg
              ? 'border-[#2d0a0a]/10 bg-[#fdf8f3]/80 text-[#2d0a0a] hover:bg-[#6b0f1a] hover:text-[#fdf8f3] hover:border-[#6b0f1a]'
              : 'border-[#fdf8f3]/15 bg-[#fdf8f3]/5 text-[#fdf8f3]/70 hover:bg-[#fdf8f3]/15 hover:text-[#fdf8f3]',
          )}
        >
          <Menu className="size-4" />
        </button>

        {/* Globe / locale */}
        <div className="relative mt-4">
          <button
            onClick={() => setLocaleOpen((p) => !p)}
            className={cn(
              'flex size-10 items-center justify-center rounded-full border transition-all duration-300',
              localeOpen
                ? 'border-[#d4a574] bg-[#d4a574]/10 text-[#d4a574]'
                : lightBg
                  ? 'border-[#2d0a0a]/10 bg-[#fdf8f3]/80 text-[#2d0a0a]/60 hover:text-[#6b0f1a] hover:border-[#6b0f1a]/30'
                  : 'border-[#fdf8f3]/10 bg-[#fdf8f3]/5 text-[#fdf8f3]/50 hover:text-[#fdf8f3] hover:border-[#fdf8f3]/20',
            )}
          >
            <Globe className="size-4" />
          </button>
          <AnimatePresence>
            {localeOpen && (
              <LocaleDropdown
                locale={locale}
                supportedLocales={supportedLocales}
                onChange={setLocale}
                onClose={() => setLocaleOpen(false)}
                localeLabels={localeLabels}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className={cn(
          'mx-auto mt-4 mb-3 h-px w-6 transition-colors duration-300',
          lightBg ? 'bg-[#2d0a0a]/10' : 'bg-[#fdf8f3]/10',
        )} />

        {/* Section icons with progress track */}
        <div className="relative flex flex-1 flex-col items-center">
          {/* Filled track (gold fill up to active — no background line) */}
          <motion.div
            className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[2px] origin-top bg-[#d4a574]"
            animate={{
              height: `${Math.max(0, Math.min(maxTrackHeight, atFooter ? maxTrackHeight : activeIdx * 48 + currentProgress * 48))}px`,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Section icons */}
          {navItems.map((item, i) => {
            const Icon = item.icon
            const isPast = i < activeIdx || (i === activeIdx && currentProgress > 0.9)
            const isActive = item.id === activeSection

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                title={item.label}
                className="group relative z-10 flex size-10 items-center justify-center"
                style={{ marginBottom: 8 }}
              >
                <motion.div
                  className="relative flex items-center justify-center"
                  animate={{ width: isActive ? 36 : 28, height: isActive ? 36 : 28 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {/* Outline circle */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full border transition-colors duration-300',
                      isPast || isActive
                        ? 'border-[#d4a574]/40'
                        : lightBg
                          ? 'border-[#2d0a0a]/15 group-hover:border-[#d4a574]/40'
                          : 'border-[#fdf8f3]/15 group-hover:border-[#d4a574]/40',
                    )}
                  />

                  {/* Filled circle — springs in for active & past */}
                  <AnimatePresence>
                    {(isPast || isActive) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute inset-0 rounded-full bg-[#d4a574]"
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <Icon
                    className={cn(
                      'relative z-10 transition-all duration-300',
                      isPast || isActive
                        ? 'text-[#1a0505]'
                        : lightBg
                          ? 'text-[#2d0a0a]/25 group-hover:text-[#d4a574]'
                          : 'text-[#fdf8f3]/25 group-hover:text-[#d4a574]',
                      isActive ? 'size-4.5' : 'size-3.5',
                    )}
                    strokeWidth={isPast || isActive ? 2.5 : 2}
                  />
                </motion.div>

                {/* Tooltip */}
                <span className="pointer-events-none absolute left-[calc(100%+8px)] whitespace-nowrap rounded-md bg-[#1a0505] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#fdf8f3] opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </a>
            )
          })}

          {/* Footer checkmark */}
          <div className="group relative z-10 flex size-10 items-center justify-center">
            <div className="relative flex size-7 items-center justify-center">
              <div
                className={cn(
                  'absolute inset-0 rounded-full border transition-colors duration-300',
                  atFooter
                    ? 'border-[#d4a574]/40'
                    : lightBg
                      ? 'border-[#2d0a0a]/15'
                      : 'border-[#fdf8f3]/15',
                )}
              />
              <AnimatePresence>
                {atFooter && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute inset-0 rounded-full bg-[#d4a574]"
                  />
                )}
              </AnimatePresence>
              <Check
                className={cn(
                  'relative z-10 size-3.5 transition-colors duration-300',
                  atFooter
                    ? 'text-[#1a0505]'
                    : lightBg
                      ? 'text-[#2d0a0a]/25'
                      : 'text-[#fdf8f3]/25',
                )}
                strokeWidth={atFooter ? 3 : 2}
              />
            </div>
            <span className="pointer-events-none absolute left-[calc(100%+8px)] whitespace-nowrap rounded-md bg-[#1a0505] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#fdf8f3] opacity-0 transition-opacity group-hover:opacity-100">
              Done
            </span>
          </div>
        </div>
      </motion.aside>

      {/* ── Mobile floating burger ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setMenuOpen(true)}
        className={cn(
          'fixed left-4 top-5 z-50 flex size-11 items-center justify-center rounded-full border shadow-lg transition-all duration-300 lg:hidden',
          lightBg
            ? 'border-[#2d0a0a]/10 bg-[#fdf8f3] text-[#2d0a0a] shadow-[#2d0a0a]/10'
            : 'border-[#fdf8f3]/15 bg-[#2d0a0a]/60 text-[#fdf8f3] shadow-[#2d0a0a]/30 backdrop-blur-xl',
        )}
      >
        <Menu className="size-4" />
      </motion.button>

      {/* ── Mobile locale badge ── */}
      <div className="fixed left-4 top-[4.5rem] z-50 lg:hidden">
        <div className="relative">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setLocaleOpen((p) => !p)}
            className={cn(
              'flex size-9 items-center justify-center rounded-full border shadow-lg transition-all duration-300',
              lightBg
                ? 'border-[#2d0a0a]/10 bg-[#fdf8f3] text-[#2d0a0a]/60 shadow-[#2d0a0a]/10'
                : 'border-[#fdf8f3]/10 bg-[#2d0a0a]/60 text-[#fdf8f3]/60 shadow-[#2d0a0a]/30 backdrop-blur-xl',
            )}
          >
            <Globe className="size-3.5" />
          </motion.button>
          <AnimatePresence>
            {localeOpen && (
              <LocaleDropdown
                locale={locale}
                supportedLocales={supportedLocales}
                onChange={setLocale}
                onClose={() => setLocaleOpen(false)}
                localeLabels={localeLabels}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen menu */}
      <FullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        copy={copy}
      />
    </>
  )
}

export { SideNavProgress }
