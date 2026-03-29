import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_77t3y9n'
const EMAILJS_TEMPLATE_ID = 'template_spf4rao'
const EMAILJS_PUBLIC_KEY  = 'Bagj4CYenPVhUz4Lq'


const GOLD       = '#bc6c25'
const GOLD_LIGHT = '#e8c97a'
const TEXT_MUTED = '#4a4f6a'
const TEXT_SUB   = '#69779f'

const FAQS = [
  {
    q: "What data does Careerlytics use?",
    a: "Careerlytics draws from historical Canadian census records spanning 1987 to 2025, covering occupational employment figures across all 10 provinces and multiple employment types."
  },
  {
    q: "How is the data processed?",
    a: "Raw occupational data is cleaned and fed into machine learning models that classify employment trends, detect growth patterns, and generate interactive visualizations for exploration."
  },
  {
    q: "Which occupations are tracked?",
    a: "We currently track 15+ occupational categories ranging from trades and technical roles to management, healthcare, and service industries — with more being added over time."
  },
  {
    q: "Can I compare occupations across provinces?",
    a: "Yes! The Compare Occupation page lets you select multiple occupations, choose a province, and set a year range to view side-by-side employment trend charts."
  },
  {
    q: "Is Careerlytics free to use?",
    a: "Careerlytics is a university research initiative and is currently free to access for researchers, students, and the general public."
  },
  {
    q: "How do I report an issue or suggest a feature?",
    a: "You can use the feedback form on this page or reach out directly at contact@careerlytics.ca. We read every message and appreciate your input."
  },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => setOpen(o => !o)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${open ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.2)'}`,
        borderRadius: 12,
        background: open ? '#F5E7C6' : hovered ? '#F5E7C6' : '#FAF3E1',
        marginBottom: "0.75rem",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: open ? "0 4px 16px rgba(201,168,76,0.1)" : "none",
        overflow: "hidden",
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.1rem 1.4rem",
      }}>
        <span style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem",
          fontWeight: 600, color: open ? GOLD : "#222222",
          transition: "color 0.2s", paddingRight: "1rem"
        }}>
          {item.q}
        </span>
        <span style={{
          fontSize: "1.3rem", color: GOLD, flexShrink: 0,
          transition: "transform 0.25s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          display: "inline-block", lineHeight: 1, fontWeight: 300,
        }}>+</span>
      </div>
      {open && (
        <div style={{
          padding: "0.9rem 1.4rem 1.1rem",
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
          color: TEXT_SUB, lineHeight: 1.8,
          borderTop: "1px solid rgba(201,168,76,0.15)",
        }}>
          {item.a}
        </div>
      )}
    </div>
  )
}

const AboutUs = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [feedback, setFeedback]       = useState("");
  const [status, setStatus]           = useState("idle"); // idle | sending | success | error

  const handleSubmit = async () => {
    if (!feedback.trim() || !senderEmail.trim()) return;

    setStatus("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_email: senderEmail,
          message: feedback,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setFeedback("");
    setSenderEmail("");
  };

  const isValid = feedback.trim() && senderEmail.trim() && senderEmail.includes("@");
  const isBusy  = status === "sending";

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#FAF3E1", position: "relative" }}>

      {/* Background decorations */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      {/* Hero / Description */}
      <div style={{ padding: "4rem 2rem 3rem", maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: "0.72rem", color: GOLD, letterSpacing: ".2em",
          fontFamily: "'DM Mono',monospace", marginBottom: 14, textTransform: "uppercase"
        }}>
          Who We Are
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,4vw,3rem)", color: "#222222",
          margin: "0 0 1.5rem", fontWeight: 700, lineHeight: 1.15
        }}>
          About <span style={{ color: GOLD_LIGHT }}>Careerlytics</span>
        </h1>
        <p style={{ fontSize: "0.97rem", color: TEXT_SUB, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.85, marginBottom: "1.25rem" }}>
          Careerlytics is a university research initiative focused on Archive Intelligence Mining, the application of machine
          learning techniques to historical Canadian census records spanning 1987 to 2025.
        </p>
        <p style={{ fontSize: "0.97rem", color: TEXT_SUB, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.85, marginBottom: "1.25rem" }}>
          Our platform transforms raw occupational data into interactive visualizations and AI-powered insights,
          revealing how Canada's labor market was shaped.
        </p>
        <p style={{ fontSize: "0.97rem", color: TEXT_SUB, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.85 }}>
          Whether you're a researcher, historian, student, or curious explorer, Careerlytics gives you the tools
          to understand how work itself has evolved across generations.
        </p>

        {/* Stat pills */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {[
            ["38 Years", "of census data"],
            ["15+ Occupations", "tracked & modeled"],
            ["10 Provinces", "geographic coverage"],
            ["ML-Powered", "trend classification"],
          ].map(([val, lbl]) => (
            <div key={val} style={{
              background: "#F5E7C6", border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: 10, padding: "0.85rem 1.25rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}>
              <div style={{ fontFamily: "'Playfair Display',serif", color: GOLD, fontSize: "1.1rem", fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: "0.7rem", color: TEXT_MUTED, fontFamily: "'DM Mono',monospace", marginTop: 3 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", maxWidth: 860, margin: "0 auto" }} />

      {/* FAQ Section */}
      <div style={{ padding: "3rem 2rem", maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: "0.72rem", color: GOLD, letterSpacing: ".2em",
          fontFamily: "'DM Mono',monospace", marginBottom: 10, textTransform: "uppercase"
        }}>
          FAQ
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#222222", fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: "0.88rem", color: TEXT_MUTED, fontFamily: "'DM Sans',sans-serif", marginBottom: "1.75rem" }}>
          Everything you need to know about Careerlytics.
        </p>
        <div>
          {FAQS.map((item, i) => <FAQItem key={i} item={item} />)}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", maxWidth: 860, margin: "0 auto" }} />

      {/* Feedback Section */}
      <div style={{ padding: "3rem 2rem", maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: "0.72rem", color: GOLD, letterSpacing: ".2em",
          fontFamily: "'DM Mono',monospace", marginBottom: 10, textTransform: "uppercase"
        }}>
          Feedback
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#222222", fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
          We would love to hear from you!
        </h2>
        <p style={{ fontSize: "0.88rem", color: TEXT_MUTED, fontFamily: "'DM Sans',sans-serif", marginBottom: "1.25rem" }}>
          Share your thoughts, suggestions, or questions about Careerlytics.
        </p>

        <div style={{
          position: "relative", background: "#F5E7C6",
          border: "1px solid rgba(201,168,76,0.35)", borderRadius: 14, padding: "1.75rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>

          {/* Success banner */}
          {status === "success" && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(245,231,198,0.97)", border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: 12, padding: "20px 28px",
              display: "flex", alignItems: "center", gap: 24,
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)", zIndex: 10, minWidth: 280
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", color: "#222222", fontSize: "1rem", fontWeight: 600 }}>
                  Thank you for your feedback!
                </span>
                <span style={{ fontSize: "0.78rem", color: TEXT_MUTED, fontFamily: "'DM Sans',sans-serif" }}>
                  We'll get back to you at {senderEmail}.
                </span>
              </div>
              <button
                onClick={handleReset}
                style={{
                  marginLeft: "auto", background: "none", border: "none",
                  cursor: "pointer", color: "#e05555", fontSize: "1.1rem",
                  lineHeight: 1, padding: "4px 6px", borderRadius: 4, flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#ff7070"}
                onMouseLeave={e => e.currentTarget.style.color = "#e05555"}
              >✕</button>
            </div>
          )}

          {/* Error banner */}
          {status === "error" && (
            <div style={{
              background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.3)",
              borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem",
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "#c0392b"
            }}>
              Something went wrong. Please try again or email us directly at contact@careerlytics.ca.
            </div>
          )}

          {/* Email input */}
          <label style={{
            display: "block", fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.8rem", color: TEXT_MUTED, marginBottom: "0.4rem", fontWeight: 600
          }}>
            Your email address
          </label>
          <input
            type="email"
            value={senderEmail}
            onChange={e => setSenderEmail(e.target.value)}
            placeholder="you@gmail.com"
            disabled={isBusy || status === "success"}
            style={{
              width: "100%", padding: "12px 14px", background: "#FAF3E1",
              border: "1px solid rgba(201,168,76,0.35)", borderRadius: 10,
              color: "#222222", fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.9rem", outline: "none", marginBottom: "1rem",
              boxSizing: "border-box",
              opacity: status === "success" ? 0.4 : 1, transition: "opacity .3s"
            }}
          />

          {/* Message textarea */}
          <label style={{
            display: "block", fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.8rem", color: TEXT_MUTED, marginBottom: "0.4rem", fontWeight: 600
          }}>
            Your message
          </label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Type here..."
            rows={6}
            disabled={isBusy || status === "success"}
            style={{
              width: "100%", padding: "14px", background: "#FAF3E1",
              border: "1px solid rgba(201,168,76,0.35)", borderRadius: 10,
              color: "#222222", fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.9rem", resize: "vertical", outline: "none",
              lineHeight: 1.7, marginBottom: "1rem",
              opacity: status === "success" ? 0.4 : 1, transition: "opacity .3s",
              boxSizing: "border-box"
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem" }}>
            {status === "error" && (
              <button
                onClick={handleReset}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
                  color: TEXT_MUTED, textDecoration: "underline"
                }}
              >Try again</button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!isValid || isBusy || status === "success"}
              style={{
                padding: "10px 28px",
                background: (!isValid || isBusy || status === "success")
                  ? "rgba(201,168,76,0.15)"
                  : `linear-gradient(135deg, ${GOLD} 0%, #b8922e 100%)`,
                border: "none", borderRadius: 10,
                color: (!isValid || isBusy || status === "success") ? TEXT_MUTED : "#0a0a0f",
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
                fontWeight: 700,
                cursor: (!isValid || isBusy || status === "success") ? "not-allowed" : "pointer",
                transition: "all .2s",
                boxShadow: (isValid && !isBusy && status !== "success") ? "0 4px 20px rgba(201,168,76,0.3)" : "none"
              }}
            >
              {isBusy ? "Sending..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(201,168,76,0.2)", background: "#F5E7C6",
        padding: "2.5rem 2rem", marginTop: "1rem",
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", flexWrap: "wrap", gap: "2rem",
        position: "relative", zIndex: 1
      }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: TEXT_MUTED, fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>
            © 2026 Careerlytics
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["𝕏", "in", "gh", "✉"].map((s, i) => (
              <div key={i} style={{
                width: 28, height: 28, background: "rgba(201,168,76,0.15)",
                border: "1px solid rgba(201,168,76,0.25)", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", color: GOLD, cursor: "pointer"
              }}>{s}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: TEXT_MUTED, letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", marginBottom: 10, textTransform: "uppercase" }}>Contact</div>
          <div style={{ fontSize: "0.82rem", color: TEXT_MUTED, fontFamily: "'DM Sans',sans-serif", lineHeight: 2 }}>
            contact@careerlytics.ca<br />
            research@careerlytics.ca<br />
            +1 (123) 456-7890
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: TEXT_MUTED, letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", marginBottom: 10, textTransform: "uppercase" }}>Address</div>
          <div style={{ fontSize: "0.82rem", color: TEXT_MUTED, fontFamily: "'DM Sans',sans-serif", lineHeight: 2 }}>
            CIS3750 Group 12<br />
            University of Guelph<br />
            50 Stone Road East, Ontario, Canada<br />
            Guelph, N1G 2W1
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;