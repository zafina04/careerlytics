import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Nav pages ─────────────────────────────────────────────────────────────────
const NAV_PAGES = [
  { route: '/dashboard', label: 'View Occupation Data',    desc: 'Select an occupation, province, employment type, and year range to view employment trends.', color: '#2563eb', light: '#eff6ff' },
  { route: '/chatbot',   label: 'Historical Map Data',     desc: 'Trends & growth over time', color: '#0284c7', light: '#e0f2fe' },
  { route: '/compare',   label: 'Compare Occupation Data', desc: 'Select occupations, a province, and a year range to compare employment trends.', color: '#059669', light: '#ecfdf5' },
  { route: '/about',     label: 'About Us/FAQ',            desc: 'Learn about this project, the data sources used, and find answers to frequently asked questions.', color: '#7c3aed', light: '#f5f3ff' },
]

// ── Hover card ────────────────────────────────────────────────────────────────
function NavCard({ page, navigate }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => navigate(page.route)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s.card,
        background: '#F5E7C6',
        borderColor: hovered ? 'rgba(201,168,76,0.35)' : '#1e2035',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 16px 36px rgba(201,168,76,0.12)' : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={s.cardIconEmoji}>{page.icon}</div>
        <div style={{ ...s.cardLabel, color: hovered ? '#e8c97a' : '#d4a373' }}>
          {page.label}
        </div>
        <div style={{ ...s.cardDesc, color: hovered ? '#8a8fa8' : '#4a4f6a' }}>
          {page.desc}
        </div>
      </div>
      <div style={{
        ...s.cardArrow,
        color: hovered ? 'rgba(201,168,76,0.9)' : '#2e3050',
        transform: hovered ? 'translate(2px,-2px)' : 'none',
      }} />
    </div>
  )
}

// ── Data source badge ─────────────────────────────────────────────────────────
function DataSourceBadge() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410041601"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: hovered ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.1)',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.25)'}`,
        borderRadius: 6, padding: '0.4rem 0.9rem',
        fontFamily: "'DM Mono', monospace", fontSize: '0.68rem',
        color: GOLD, letterSpacing: '0.05em',
        textDecoration: 'none', width: 'fit-content',
        transition: 'all 0.2s',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
      Statistics Canada 
    </a>
  )
}

// ── Main Home ─────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const [primaryHover, setPrimaryHover] = useState(false)
  const [secondHover,  setSecondHover]  = useState(false)

  return (
    <div style={s.page}>

      {/* Background decoration */}
      <div style={s.bgOrb1} />
      <div style={s.bgOrb2} />
      <div style={s.bgGrid} />
      <div style={s.bgNoise} />

      {/* Layout */}
      <div style={s.layout}>

        {/* LEFT — Hero copy */}
        <div style={s.left}>

          <h1 style={s.h1}>
            Welcome to<br />
            <span style={s.h1Accent}>Careerlytics</span>
          </h1>

          <p style={s.sub}>
            Explore historical occupation trends across every Canadian province.
            See how industries rose, shifted, and evolved over nearly four decades from 1987 to 2025.
          </p>

          {/* Data source badge */}
          <DataSourceBadge />

          <div style={s.btnRow}>
            <button
              style={{ ...s.btnPrimary, ...(primaryHover ? s.btnPrimaryHover : {}) }}
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => setPrimaryHover(false)}
              onClick={() => navigate('/chatbot')}
            >
              Explore Trends
            </button>

            <button
              style={{ ...s.btnOutline, ...(secondHover ? s.btnOutlineHover : {}) }}
              onMouseEnter={() => setSecondHover(true)}
              onMouseLeave={() => setSecondHover(false)}
              onClick={() => navigate('/compare')}
            >
              Compare Occupation
            </button>
          </div>

        </div>

        {/* RIGHT — Nav cards */}
        <div style={s.right}>
          <div style={s.cardGrid}>
            {NAV_PAGES.map((page, i) => (
              <NavCard key={i} page={page} navigate={navigate} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const GOLD       = '#bc6c25'
const GOLD_LIGHT = '#e8c97a'
const GOLD_DIM   = 'rgba(201,168,76,0.12)'
const BG_BORDER  = '#1e2035'
const TEXT_SUB   = '#8a8fa8'

const s = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    background: '#FAF3E1',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    padding: '2rem 2.5rem',
  },

  bgOrb1: {
    position: 'absolute',
    width: 700, height: 700, borderRadius: '50%',
    top: -200, left: -200, pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'absolute',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
    bottom: -150, right: -100, pointerEvents: 'none',
  },
  bgGrid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },
  bgNoise: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    opacity: 0.025,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundSize: '180px 180px',
  },

  layout: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4rem',
  },

  left: {
    display: 'flex', flexDirection: 'column',
    gap: '1.5rem', alignItems: 'center', textAlign: 'center',
  },

  h1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.8rem, 4vw, 4rem)',
    fontWeight: 700, color: '#222222',
    lineHeight: 1.1, letterSpacing: '-0.01em',
    margin: 0,
  },
  h1Accent: {
    color: '#e8c97a',
  },

  sub: {
    fontSize: '0.97rem', color: TEXT_SUB,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.75, fontWeight: 400,
    maxWidth: 440,
  },

  btnRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' },

  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: `linear-gradient(135deg, ${GOLD} 0%, #b8922e 100%)`,
    color: '#0a0a0f',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700,
    padding: '0.8rem 1.6rem', borderRadius: 6,
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
    letterSpacing: '0.01em',
  },
  btnPrimaryHover: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
    color: '#0a0a0f',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700,
    padding: '0.8rem 1.6rem', borderRadius: 6,
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 28px rgba(201,168,76,0.45)',
    letterSpacing: '0.01em',
  },
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'transparent', color: TEXT_SUB,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 600,
    padding: '0.8rem 1.6rem', borderRadius: 6,
    border: `1.5px solid ${BG_BORDER}`, cursor: 'pointer', transition: 'all 0.2s',
    letterSpacing: '0.01em',
  },
  btnOutlineHover: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: GOLD_DIM, color: GOLD_LIGHT,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 600,
    padding: '0.8rem 1.6rem', borderRadius: 6,
    border: '1.5px solid rgba(201,168,76,0.35)', cursor: 'pointer', transition: 'all 0.2s',
    transform: 'translateY(-2px)',
    letterSpacing: '0.01em',
  },

  right: { display: 'flex', alignItems: 'center', justifyContent: 'center' },

  card: {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.75rem', borderRadius: 14,
    border: '1px solid #1e2035',
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.34,1.2,0.64,1)',
    userSelect: 'none', minHeight: 180,
  },
  cardIconEmoji: { fontSize: 28, marginBottom: '0.75rem' },
  cardLabel: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.05rem', fontWeight: 700,
    lineHeight: 1.2, marginBottom: '0.4rem',
    transition: 'color 0.22s',
  },
  cardDesc: {
    fontSize: '0.83rem',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6, transition: 'color 0.22s',
  },
  cardArrow: {
    fontSize: '1rem', flexShrink: 0,
    alignSelf: 'flex-end',
    transition: 'transform 0.2s, color 0.2s',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem', width: '100%',
  },
}