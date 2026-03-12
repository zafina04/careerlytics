import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'

import FindOccupation from './pages/FindOccupation'

import Histrocial from './pages/Historical'
import AboutUs from './pages/AboutUs'
import ChatBot from './pages/ChatBot'

import CompareOccupations from './pages/CompareOccupations'

// ── Placeholder pages (we'll build these next) ──────────────────────────────
const Placeholder = ({ title }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: 'calc(100vh - 60px)',
    fontFamily: 'Syne, sans-serif', color: '#64748b', gap: '0.5rem'
  }}>
    <span style={{ fontSize: '2.5rem' }}>🚧</span>
    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{title}</h2>
    <p style={{ fontSize: '0.9rem' }}>Coming soon — check back next sprint!</p>
  </div>
)

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <img src="/logo.png" alt="Careerlytics" style={{ height: 180, width: 'auto' }} />
      </NavLink>
      <ul className="nav-links">
        <li><NavLink to="/"             end>Home</NavLink></li>
        <li><NavLink to="/dashboard"       >Job Dashboard</NavLink></li>
        <li><NavLink to="/insight"       >Historical Insight</NavLink></li>
        <li><NavLink to="/chatbot"         >Historical Chatbot</NavLink></li>
        <li><NavLink to="/compare"         >Compare Career</NavLink></li>
        <li><NavLink to="/about"           >About Us</NavLink></li>
      </ul>
    </nav>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<FindOccupation />} />
        <Route path="/insight"   element={<Histrocial/>} />
        <Route path="/chatbot"   element={<ChatBot/>} />
        <Route path="/compare"   element={<CompareOccupations/>} />
        <Route path="/about"     element={<AboutUs/>} />
      </Routes>
    </>
  )
}