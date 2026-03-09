import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Staggered mount animation ─────────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(22px)'
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, delay)
    return () => clearTimeout(t)
  }, [delay])
  return ref
}

// ── Nav pages ─────────────────────────────────────────────────────────────────
const NAV_PAGES = [
  { route: '/dashboard', icon: '📋', label: 'Find Occupations',  desc: 'Live postings across Canada',         color: '#2563eb', light: '#eff6ff' },
  { route: '/insight',   icon: '📈', label: 'Career Insight', desc: 'Trends & growth over time',           color: '#0284c7', light: '#e0f2fe' },
  { route: '/compare',   icon: '⚖️',  label: 'Compare Career', desc: 'Side-by-side career analysis',       color: '#059669', light: '#ecfdf5' },
  { route: '/about',     icon: '🙋', label: 'About Us',       desc: 'Our data, team & mission',            color: '#7c3aed', light: '#f5f3ff' },
]

// ── Hover card ────────────────────────────────────────────────────────────────
function NavCard({ page, delay, navigate }) {
  const ref = useFadeUp(delay)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onClick={() => navigate(page.route)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s.card,
        background: hovered ? page.color : '#fff',
        borderColor: hovered ? page.color : '#e2e8f0',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 16px 36px ${page.color}33` : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        ...s.cardIcon,
        background: hovered ? 'rgba(255,255,255,0.18)' : page.light,
      }}>
        {page.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...s.cardLabel, color: hovered ? '#fff' : '#0f172a' }}>
          {page.label}
        </div>
        <div style={{ ...s.cardDesc, color: hovered ? 'rgba(255,255,255,0.75)' : '#94a3b8' }}>
          {page.desc}
        </div>
      </div>
      <div style={{ ...s.cardArrow, color: hovered ? 'rgba(255,255,255,0.9)' : '#cbd5e1',
        transform: hovered ? 'translate(2px,-2px)' : 'none' }}>
        ↗
      </div>
    </div>
  )
}

// ── Main Home ─────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()

  const tagRef   = useFadeUp(100)
  const h1Ref    = useFadeUp(220)
  const subRef   = useFadeUp(340)
  const btnRef   = useFadeUp(440)


  const [primaryHover, setPrimaryHover] = useState(false)
  const [secondHover,  setSecondHover]  = useState(false)

  return (
    <div style={s.page}>

      {/* ── Background decoration ── */}
      <div style={s.bgOrb1} />
      <div style={s.bgOrb2} />
      <div style={s.bgGrid} />

      {/* ── Two-column layout ── */}
      <div style={s.layout}>

        {/* LEFT — Hero copy */}
        <div style={s.left}>

          <div ref={tagRef} style={s.tag}>
            <span style={s.tagDot} />
            Canada's Job Intelligence Platform
          </div>

          <h1 ref={h1Ref} style={s.h1}>
            38 years of<br />
            <span style={s.h1Accent}>Canadian jobs,</span><br />
            visualized.
          </h1>

          <p ref={subRef} style={s.sub}>
            Explore historical occupation trends across every Canadian province —
            see how industries rose, shifted, and evolved over nearly four decades.
          </p>

          <div ref={btnRef} style={s.btnRow}>
            <button
              style={{ ...s.btnPrimary, ...(primaryHover ? s.btnPrimaryHover : {}) }}
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => setPrimaryHover(false)}
              onClick={() => navigate('/insight')}
            >
              Explore Trends →
            </button>
            <button
              style={{ ...s.btnOutline, ...(secondHover ? s.btnOutlineHover : {}) }}
              onMouseEnter={() => setSecondHover(true)}
              onMouseLeave={() => setSecondHover(false)}
              onClick={() => navigate('/compare')}
            >
              Compare Careers
            </button>
          </div>



        </div>

        {/* RIGHT — Nav cards */}
        <div style={s.right}>
          <div style={s.cardGrid}>
            {NAV_PAGES.map((page, i) => (
              <NavCard key={i} page={page} delay={300 + i * 80} navigate={navigate} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    background: '#f8faff',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    padding: '2rem 2.5rem',
  },

  // Background decorations
  bgOrb1: {
    position: 'absolute', width: 700, height: 700, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
    top: -200, left: -200, pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
    bottom: -150, right: -100, pointerEvents: 'none',
  },
  bgGrid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },

  // Layout
  layout: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
  },

  // Left column
  left: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },

  tag: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#2563eb',
    fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '0.35rem 0.9rem', borderRadius: 100,
    width: 'fit-content',
  },
  tagDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#34d399',
    boxShadow: '0 0 6px #34d399',
    animation: 'pulse 2s infinite',
  },

  h1: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(2.8rem, 4vw, 4rem)',
    fontWeight: 800, color: '#0f172a',
    lineHeight: 1.08, letterSpacing: '-0.03em',
    margin: 0,
  },
  h1Accent: {
    background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  sub: {
    fontSize: '1rem', color: '#64748b',
    lineHeight: 1.7, fontWeight: 400,
    maxWidth: 440,
  },

  btnRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },

  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#2563eb', color: '#fff',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600,
    padding: '0.8rem 1.6rem', borderRadius: 10,
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
  },
  btnPrimaryHover: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#1d4ed8', color: '#fff',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600,
    padding: '0.8rem 1.6rem', borderRadius: 10,
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(37,99,235,0.45)',
  },
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#fff', color: '#0f172a',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600,
    padding: '0.8rem 1.6rem', borderRadius: 10,
    border: '1.5px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s',
  },
  btnOutlineHover: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#fff', color: '#2563eb',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600,
    padding: '0.8rem 1.6rem', borderRadius: 10,
    border: '1.5px solid #2563eb', cursor: 'pointer', transition: 'all 0.2s',
    transform: 'translateY(-2px)',
  },

  // Stats
  statsRow: {
    display: 'flex', gap: 0,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    overflow: 'hidden',
    width: 'fit-content',
  },
  statItem: { padding: '0.9rem 1.4rem', textAlign: 'center' },
  statNum: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '1.25rem', fontWeight: 800,
    color: '#2563eb', lineHeight: 1,
  },
  statLabel: { fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem', whiteSpace: 'nowrap' },

  // Right column — card grid
  right: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.85rem',
    width: '100%',
  },

  // Individual card
  card: {
    display: 'flex', alignItems: 'center', gap: '0.9rem',
    padding: '1.1rem 1.2rem',
    borderRadius: 14,
    border: '1.5px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.34,1.2,0.64,1)',
    userSelect: 'none',
  },
  cardIcon: {
    width: 40, height: 40, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', flexShrink: 0,
    transition: 'background 0.22s',
  },
  cardLabel: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '0.88rem', fontWeight: 800,
    letterSpacing: '-0.01em', lineHeight: 1.2,
    transition: 'color 0.22s',
  },
  cardDesc: {
    fontSize: '0.73rem', marginTop: '0.2rem',
    lineHeight: 1.4, transition: 'color 0.22s',
  },
  cardArrow: {
    fontSize: '1rem', flexShrink: 0,
    transition: 'transform 0.2s, color 0.2s',
  },
}