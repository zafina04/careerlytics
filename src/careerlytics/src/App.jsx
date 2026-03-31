import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';

import { useLocation } from 'react-router-dom';

import FindOccupation from './pages/FindOccupation'

import Histrocial from './pages/Historical'
import AboutUs from './pages/AboutUs'
import ChatBot from './pages/ChatBot'

import CompareOccupations from './pages/CompareOccupations'

import ChatBotPopup from './components/chatBotPopup'
import Prediction from './pages/Prediction';



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
        <li><NavLink to="/dashboard"       >View Occupation Data</NavLink></li>
        <li><NavLink to="/insight"       >Historical Map Data</NavLink></li>
        {/*<li><NavLink to="/chatbot"         >Historical Chatbot</NavLink></li>*/}
        <li><NavLink to="/prediction"         >Occupation Predictor</NavLink></li>
        <li><NavLink to="/compare"         >Compare Occupation Data</NavLink></li>
        <li><NavLink to="/about"           >About Us/FAQ</NavLink></li>
      </ul>
    </nav>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {

  const location= useLocation();

  const showChatbot = [

    '/dashboard',
    '/compare'
  
  ].includes(useLocation().pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<FindOccupation />} />
        <Route path="/insight"   element={<Histrocial/>} />
        <Route path="/prediction"   element={<Prediction/>} />
        <Route path="/compare"   element={<CompareOccupations/>} />
        <Route path="/about"     element={<AboutUs/>} />
      </Routes>

      {/*This is to make sure the chatbot is available on all pages */}


      {showChatbot && <ChatBotPopup />}

    </>
    
  )

  
}