import React, { useState } from 'react';

const AboutUs = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback.trim()) setSubmitted(true);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#080810" }}>

      {/* Hero / Description */}
      <div style={{
        padding: "4rem 2rem 3rem", maxWidth: 860, margin: "0 auto",
        background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,.07), transparent)"
      }}>
        <div style={{ fontSize: "0.72rem", color: "#c9a84c", letterSpacing: ".2em", fontFamily: "'DM Mono',monospace", marginBottom: 14 }}>
          WHO WE ARE
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#e8c97a", margin: "0 0 1.5rem", fontWeight: 700, lineHeight: 1.15 }}>
          About Careerlytics
        </h1>
        <p style={{ fontSize: "0.97rem", color: "#8a8fa8", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.85, marginBottom: "1.25rem" }}>
          Careerlytics is a university research initiative focused on{" "}
          <span style={{ color: "#c9a84c" }}>Archive Intelligence Mining</span> — the application of machine
          learning techniques to historical Canadian census records spanning 1900 to 1970.
        </p>
        <p style={{ fontSize: "0.97rem", color: "#8a8fa8", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.85, marginBottom: "1.25rem" }}>
          Our platform transforms raw occupational data into interactive visualizations and AI-powered insights,
          revealing how Canada's labor market was shaped by industrialization, the World Wars, the Great Depression,
          and the rise of the knowledge economy.
        </p>
        <p style={{ fontSize: "0.97rem", color: "#8a8fa8", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.85 }}>
          Whether you're a researcher, historian, student, or curious explorer — Careerlytics gives you the tools
          to understand how work itself has evolved across generations.
        </p>

        {/* Stat pills */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {[
            ["70 Years", "of census data"],
            ["15+ Occupations", "tracked & modeled"],
            ["10 Provinces", "geographic coverage"],
            ["ML-Powered", "trend classification"],
          ].map(([val, lbl]) => (
            <div key={val} style={{ background: "#0d0e1a", border: "1px solid #1e2035", borderRadius: 10, padding: "0.85rem 1.25rem" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", color: "#e8c97a", fontSize: "1.1rem", fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: "0.7rem", color: "#4a4f6a", fontFamily: "'DM Mono',monospace", marginTop: 3 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #1e2035", maxWidth: 860, margin: "0 auto" }} />

      {/* Feedback Section */}
      <div style={{ padding: "3rem 2rem", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ fontSize: "0.72rem", color: "#c9a84c", letterSpacing: ".2em", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>
          FEEDBACK
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#e8c97a", fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
          We would love to hear from you!
        </h2>
        <p style={{ fontSize: "0.88rem", color: "#4a4f6a", fontFamily: "'DM Sans',sans-serif", marginBottom: "1.25rem" }}>
          Share your thoughts, suggestions, or questions about Careerlytics.
        </p>

        {/* Form card */}
        <div style={{ position: "relative", background: "#0d0e1a", border: "1px solid #1e2035", borderRadius: 14, padding: "1.75rem" }}>

          {/* Thank-you banner */}
          {submitted && (
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(13,14,26,0.97)", border: "1px solid #c9a84c",
              borderRadius: 10, padding: "14px 20px",
              display: "flex", alignItems: "center", gap: 20,
              boxShadow: "0 4px 32px rgba(201,168,76,.15)", zIndex: 10, minWidth: 260
            }}>
              <span style={{ fontFamily: "'Playfair Display',serif", color: "#e8c97a", fontSize: "1rem", fontWeight: 600 }}>
                Thank you!
              </span>
              <button
                onClick={() => { setSubmitted(false); setFeedback(""); }}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#4a4f6a", fontSize: "1rem", lineHeight: 1, padding: "2px 4px", borderRadius: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = "#e8c97a"}
                onMouseLeave={e => e.currentTarget.style.color = "#4a4f6a"}
              >✕</button>
            </div>
          )}

          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="type here...."
            rows={6}
            style={{
              width: "100%", padding: "14px", background: "#080810",
              border: "1px solid #1e2035", borderRadius: 10,
              color: "#c4c8e0", fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.9rem", resize: "vertical", outline: "none",
              lineHeight: 1.7, marginBottom: "1rem",
              opacity: submitted ? 0.4 : 1, transition: "opacity .3s"
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSubmit}
              disabled={submitted}
              style={{
                padding: "10px 28px",
                background: submitted ? "#1e2035" : "linear-gradient(135deg,#c9a84c,#e8c97a)",
                border: "none", borderRadius: 10,
                color: submitted ? "#4a4f6a" : "#0a0a0f",
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
                fontWeight: 700, cursor: submitted ? "not-allowed" : "pointer",
                transition: "all .2s"
              }}
            >Submit</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #1e2035", background: "#0a0a0f",
        padding: "2.5rem 2rem", marginTop: "1rem",
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", flexWrap: "wrap", gap: "2rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, background: "linear-gradient(135deg,#c9a84c,#e8c97a)",
              borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 12, color: "#0a0a0f"
            }}>CA</div>
            <span style={{ fontFamily: "'Playfair Display',serif", color: "#e8c97a", fontSize: "1rem" }}>Careerlytics</span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "#2e3050", fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>© 2026 HIRE ME AI</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["𝕏", "in", "gh", "✉"].map((s, i) => (
              <div key={i} style={{
                width: 28, height: 28, background: "#1e2035", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", color: "#4a4f6a", cursor: "pointer"
              }}>{s}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "#4a4f6a", letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>CONTACT</div>
          <div style={{ fontSize: "0.82rem", color: "#4a4f6a", fontFamily: "'DM Sans',sans-serif", lineHeight: 2 }}>
            contact@careerlytics.ca<br />
            research@careerlytics.ca<br />
            +1 (416) 555-0192
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "#4a4f6a", letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>ADDRESS</div>
          <div style={{ fontSize: "0.82rem", color: "#4a4f6a", fontFamily: "'DM Sans',sans-serif", lineHeight: 2 }}>
            Archive Intelligence Lab<br />
            University Research Centre<br />
            123 Census Drive, Suite 400<br />
            Toronto, ON M5V 2T6
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;