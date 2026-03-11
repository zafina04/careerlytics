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
  
    const tagRef = useFadeUp(100)
    const h1Ref  = useFadeUp(220)
    const subRef = useFadeUp(340)
    const btnRef = useFadeUp(440)
  
    const [primaryHover, setPrimaryHover] = useState(false)
    const [secondHover,  setSecondHover]  = useState(false)
  
    return (
      <div style={s.page}>
  
        {/* ── Background decoration ── */}
        <div style={s.bgOrb1} />
        <div style={s.bgOrb2} />
        <div style={s.bgGrid} />
        <div style={s.bgNoise} />
  
        {/* ── Two-column layout ── */}
        <div style={s.layout}>
  
          {/* LEFT — Hero copy */}
          <div style={s.left}>
  
            <div ref={tagRef} style={s.tag}>
              <span style={s.tagDot} />
              Canada's Job Intelligence Platform
            </div>
  
            <h1 ref={h1Ref} style={s.h1}>
              Welcome to<br />
              <span style={s.h1Accent}>Careerlytics</span>
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
const GOLD       = '#c9a84c'
const GOLD_LIGHT = '#e8c97a'
const GOLD_DIM   = 'rgba(201,168,76,0.12)'
const BG_DEEP    = '#080810'
const BG_CARD    = '#0d0e1a'
const BG_BORDER  = '#1e2035'
const TEXT_MUTED = '#4a4f6a'
const TEXT_SUB   = '#8a8fa8'

const s = {

    page: {
        minHeight: 'calc(100vh - 60px)',
        background: BG_DEEP,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem 2.5rem',

    },
    
    // Background decorations
    bgOrb1: {
        
        position: 'absolute',
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)`,
        top: -200, left: -200, pointerEvents: 'none',
    },
    bgOrb2: {
        position: 'absolute',
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)`,
        bottom: -150, right: -100, pointerEvents: 'none',
    },
    bgGrid: {
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
    },
    bgNoise: {
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
    },
    
    // Layout
    layout: {

        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',          // ← change grid to flex
        flexDirection: 'column',  // ← stack vertically
        alignItems: 'center',     // ← center everything
        gap: '4rem',
    },
    
    // Left column
    left: { display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' },
    
    tag: {

        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: GOLD_DIM,
        border: `1px solid rgba(201,168,76,0.25)`,
        color: GOLD,
        fontSize: '0.68rem', fontWeight: 700,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: '0.18em', textTransform: 'uppercase',
        padding: '0.35rem 0.9rem', borderRadius: 4,
        width: 'fit-content',
    },
    tagDot: {
        width: 6, height: 6, borderRadius: '50%',
        background: GOLD,
        boxShadow: `0 0 8px ${GOLD}`,
        animation: 'pulse 2s infinite',
    },
    
    h1: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2.8rem, 4vw, 4rem)',
        fontWeight: 700, color: '#e2d9c4',
        lineHeight: 1.1, letterSpacing: '-0.01em',
        margin: 0,
    },
      h1Accent: {
        background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 60%, #f5dfa0 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
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
        boxShadow: `0 4px 20px rgba(201,168,76,0.3)`,
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
        boxShadow: `0 8px 28px rgba(201,168,76,0.45)`,
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
        border: `1.5px solid rgba(201,168,76,0.35)`, cursor: 'pointer', transition: 'all 0.2s',
        transform: 'translateY(-2px)',
        letterSpacing: '0.01em',
    },
    
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
        borderRadius: 10,
        background: BG_CARD,
        border: `1px solid ${BG_BORDER}`,
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.34,1.2,0.64,1)',
        userSelect: 'none',
    },
    cardIcon: {
        width: 40, height: 40, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
        background: GOLD_DIM,
        transition: 'background 0.22s',
    },
    cardLabel: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '0.9rem', fontWeight: 700,
        color: GOLD_LIGHT,
        letterSpacing: '-0.01em', lineHeight: 1.2,
        transition: 'color 0.22s',
    },
    cardDesc: {
        fontSize: '0.72rem', marginTop: '0.2rem',
        color: TEXT_MUTED,
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.4, transition: 'color 0.22s',
    },
    cardArrow: {
        fontSize: '1rem', flexShrink: 0,
        color: TEXT_MUTED,
        transition: 'transform 0.2s, color 0.2s',
    },

  
}