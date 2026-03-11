import { useState, useEffect, useRef } from "react";

// ─── Response Logic ───────────────────────────────────────────────────────────
const CHATBOT_RESPONSES = {
  teacher: "In 1920, schoolteachers in Canada typically required a provincial teaching certificate obtained after 2–3 years of Normal School training. Rural teachers often had only Grade 10 education plus a summer teaching permit. Female teachers earned roughly 60% of male salaries and were frequently dismissed upon marriage.",
  blacksmith: "Blacksmith employment peaked around 1900 with over 40,000 practitioners across Canada. Decline accelerated sharply after 1910 as automobile ownership expanded. By 1940, most blacksmiths had transitioned to auto mechanics or metal fabricators — a clear example of technological displacement recorded in census occupational schedules.",
  telegraph: "Telegraph operators were largely displaced by automatic switching equipment (1920s–1930s) and the expansion of telephone networks. Many transitioned to telephone exchanges or clerical roles. The 1931 Census shows a 74% reduction in listed telegraph operators versus 1911.",
  miner: "Coal miners faced cyclical decline driven by competition from petroleum and natural gas, particularly after 1947. The Nova Scotia and Alberta coalfields showed divergent trends — Cape Breton mines contracted while Alberta surface mining expanded briefly before the energy transition.",
  default: "That's a fascinating historical labor question! The census records from 1900–1970 reveal extraordinary transformations in Canadian occupation structures. Key drivers of change included industrialization, two World Wars, the Great Depression, rural-to-urban migration, and technological displacement. Could you be more specific about an occupation or era? Try asking about teachers, blacksmiths, telegraph operators, or coal miners."
};

function getChatResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("teacher") || m.includes("school")) return CHATBOT_RESPONSES.teacher;
  if (m.includes("blacksmith"))                        return CHATBOT_RESPONSES.blacksmith;
  if (m.includes("telegraph"))                         return CHATBOT_RESPONSES.telegraph;
  if (m.includes("miner") || m.includes("coal"))       return CHATBOT_RESPONSES.miner;
  return CHATBOT_RESPONSES.default;
}

const SUGGESTIONS = [
  "What qualifications did teachers need in 1920?",
  "Why did blacksmith jobs decline?",
  "Which occupations replaced telegraph operators?",
  "How did coal mining change after 1940?"
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Welcome to the Careerlytics Historical Chatbot. I'm trained on Canadian census records from 1900–1970 and historical labor descriptions. Ask me about historical occupations — qualifications needed, why jobs declined, what replaced them, and more." }
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setMessages(m => [...m, { role: "bot", text: getChatResponse(userMsg) }]);
    setLoading(false);
  };

  return (
    <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#080810", padding: "1.5rem",
        height: "calc(100vh - 60px)",  // 60px = navbar height
        overflow: "hidden", boxSizing: "border-box"
    }}>

      {/* ── Centered chat panel ── */}
      <div style={{
        width: "100%", maxWidth: 720,
        height: "100%",
        display: "flex", flexDirection: "column",
        borderRadius: 18, overflow: "hidden",
        background: "rgba(106,183,167,0.08)",
        border: "1px solid rgba(106,183,167,0.2)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)"
      }}>

        {/* Header */}
        <div style={{
          padding: "1.1rem 1.75rem",
          background: "rgba(106,183,167,0.12)",
          borderBottom: "1px solid rgba(106,183,167,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, rgba(106,183,167,0.3), rgba(201,168,76,0.2))",
              border: "1px solid rgba(106,183,167,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
            }}>🏛️</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", color: "#e8c97a", fontSize: "1.05rem", fontWeight: 700 }}>
                HireMeAI
              </div>
              <div style={{ fontSize: "0.65rem", color: "#4a8f7f", fontFamily: "'DM Mono',monospace", letterSpacing: ".06em" }}>
                Census records 1900–1970
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#50e3a4", boxShadow: "0 0 6px #50e3a4" }} />
            <span style={{ fontSize: "0.68rem", color: "#50e3a4", fontFamily: "'DM Mono',monospace", letterSpacing: ".08em" }}>ACTIVE</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "1.5rem 1.75rem",
          display: "flex", flexDirection: "column", gap: "1rem"
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end", gap: 8
            }}>
              {m.role === "bot" && (
                <div style={{
                  fontSize: "0.62rem", color: "#4a8f7f",
                  fontFamily: "'DM Mono',monospace", letterSpacing: ".06em",
                  marginBottom: 2, flexShrink: 0
                }}>AI</div>
              )}
              <div style={{
                maxWidth: "72%", padding: "10px 14px",
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
                background: m.role === "user" ? "rgba(201,168,76,0.15)" : "rgba(13,20,30,0.7)",
                border: `1px solid ${m.role === "user" ? "rgba(201,168,76,0.25)" : "rgba(106,183,167,0.15)"}`,
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.87rem",
                color: m.role === "user" ? "#e8c97a" : "#c4c8e0",
                lineHeight: 1.7, backdropFilter: "blur(4px)"
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <div style={{ fontSize: "0.62rem", color: "#4a8f7f", fontFamily: "'DM Mono',monospace", letterSpacing: ".06em" }}>AI</div>
              <div style={{
                padding: "10px 16px", background: "rgba(13,20,30,0.7)",
                border: "1px solid rgba(106,183,167,0.15)",
                borderRadius: "4px 14px 14px 14px",
                display: "flex", gap: 5, alignItems: "center"
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#6ab7a7",
                    animation: `botPulse 1.2s ${i * 0.2}s ease-in-out infinite`
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion chips */}
        <div style={{ padding: "0.5rem 1.75rem 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setInput(s)} style={{
              padding: "4px 11px",
              background: "rgba(106,183,167,0.08)",
              border: "1px solid rgba(106,183,167,0.2)",
              borderRadius: 20, color: "#6ab7a7",
              fontSize: "0.7rem", fontFamily: "'DM Sans',sans-serif",
              cursor: "pointer", transition: "all .18s"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(106,183,167,0.15)"; e.currentTarget.style.color = "#a8ddd4"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(106,183,167,0.08)"; e.currentTarget.style.color = "#6ab7a7"; }}
            >{s}</button>
          ))}
        </div>

        {/* Input bar */}
        <div style={{ padding: "0.85rem 1.75rem 1.25rem" }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: "rgba(8,8,16,0.6)",
            border: "1px solid rgba(106,183,167,0.25)",
            borderRadius: 50, padding: "6px 6px 6px 20px",
            backdropFilter: "blur(8px)"
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Write here . . ."
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "#c4c8e0", fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.88rem", letterSpacing: ".01em"
              }}
            />
            <button onClick={send} style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: input.trim() ? "linear-gradient(135deg,#6ab7a7,#4a9f8f)" : "rgba(106,183,167,0.15)",
              border: `1px solid ${input.trim() ? "transparent" : "rgba(106,183,167,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() ? "pointer" : "default",
              transition: "all .2s", fontSize: 16,
              color: input.trim() ? "#0a0a0f" : "#4a8f7f"
            }}>↑</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes botPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}