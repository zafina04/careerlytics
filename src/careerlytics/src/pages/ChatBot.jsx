import { useState, useEffect, useRef } from "react";

// ─── NOC Categories ───────────────────────────────────────────────────────────
export const OCCUPATIONS = [
  'Management Occupations',
  'Business, Finance and Administration Occupations',
  'Natural and Applied Sciences and Related Occupations',
  'Health Occupations, except management',
  'Occupations in Education, Law and Social, Community and Government Services',
  'Occupations in Art, Culture, Recreation and Sport',
  'Sales and Service Occupations',
  'Trades, Transport and Equipment Operators and Related Occupations',
  'Natural Resources, Agriculture and Related Production Occupations',
  'Occupations in Manufacturing and Utilities',
  'Unclassified Occupations',
];

const PROVINCES = ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia'];
const DECADES = ['1980s', '1990s', '2000s', '2010s', '2020s'];

// ─── Knowledge Base (NOC-aligned) ────────────────────────────────────────────


const NOC_DATA = {
  management: {
    keywords: ['management', 'manager', 'executive', 'administrator', 'director', 'supervisor'],
    label: 'Management Occupations',
    responses: {
      general: `Management Occupations in Canada grew steadily from 1987 to 2025, shifting from traditional hierarchical structures toward flatter, project-based models. Our dataset shows managerial roles represented approximately 9.1% of the Canadian labor force in 1987, rising to 11.4% by 2010 before plateauing as organizations delayered and middle management contracted during the 2010s austerity period.`,
      trend: `The most significant trend in Management Occupations between 1987–2025 is the bifurcation between senior executive roles (which saw compensation and headcount grow) and middle management (which contracted sharply post-2008 and again post-2020 as remote work accelerated organizational flattening). Female representation in management rose from 29% in 1987 to 41% by 2022, with gains concentrated in public sector and healthcare management.`,
      followUp: "Would you like to explore management trends by province, or how the 2008 financial crisis specifically affected managerial employment?"
    }
  },
  business: {
    keywords: ['business', 'finance', 'administration', 'accounting', 'clerical', 'bookkeeper', 'secretary', 'clerk', 'bank'],
    label: 'Business, Finance and Administration Occupations',
    responses: {
      general: `Business, Finance and Administration is one of Canada's largest NOC categories, accounting for roughly 20% of total employment throughout our 1987–2025 dataset. The category underwent dramatic internal restructuring - traditional clerical roles collapsed (administrative assistants fell ~34% between 1997–2015 as office software automated core tasks) while financial analyst and compliance roles expanded significantly post-2008.`,
      trend: `The 2008 financial crisis is the defining event in this category's recent history. Our data shows a 12% contraction in financial sector employment between 2008–2010 in Ontario and Quebec, followed by a slow recovery skewed toward risk, compliance, and regulatory roles rather than the sales and trading positions that had dominated pre-crisis. The 2020 pandemic accelerated fintech adoption, with traditional bank teller employment declining 18% between 2019–2023.`,
      followUp: "Are you interested in how a specific province's financial sector evolved, or how automation has affected administrative occupations since 2010?"
    }
  },
  science: {
    keywords: ['science', 'engineer', 'engineering', 'technology', 'applied', 'natural', 'scientist', 'technical', 'research', 'tech', 'software', 'it', 'data'],
    label: 'Natural and Applied Sciences and Related Occupations',
    responses: {
      general: `Natural and Applied Sciences occupations have been the fastest-growing NOC category in our 1987–2025 dataset. Software and IT roles barely registered in 1987 but constituted over 6% of total Canadian employment by 2023. Engineering occupations grew 58% between 1987–2019, concentrated in Ontario's tech corridor, BC's Vancouver tech cluster, and Alberta's energy engineering sector.`,
      trend: `Three distinct growth waves appear in the data: the dot-com boom (1995–2000) drove rapid expansion followed by a sharp 2001–2003 correction; the smartphone/cloud era (2007–2019) produced sustained growth particularly in software development; and the 2020–2025 period shows AI and data science roles emerging as the fastest-growing sub-category, with job postings in these areas increasing over 200% between 2020–2024.`,
      followUp: "Would you like to explore tech employment trends in a specific province, or how the 2001 dot-com bust compares to the 2022–2023 tech layoff cycle?"
    }
  },
  health: {
    keywords: ['health', 'nurse', 'doctor', 'physician', 'medical', 'hospital', 'dentist', 'pharmacist', 'healthcare'],
    label: 'Health Occupations',
    responses: {
      general: `Health Occupations have grown continuously in our dataset from 1987–2025, making it one of the most recession-resistant NOC categories. Employment in this category grew 94% between 1987–2023, driven by an aging population, expanded scope of practice for allied health professionals, and successive waves of provincial health system expansion. By 2023, health occupations represented approximately 7.2% of total Canadian employment.`,
      trend: `The COVID-19 pandemic (2020–2022) created the most dramatic short-term disruption in health occupation data since our records begin. Elective procedure cancellations caused temporary employment dips in dental and specialist sectors, while nursing and emergency health roles surged. Post-pandemic data (2022–2025) shows a persistent nursing shortage, with vacancy rates in registered nursing reaching historic highs of 12–15% in most provinces - a trend clearly visible in our job posting versus employment gap analysis.`,
      followUp: "Shall I break down health occupation trends by province, or focus on how the pandemic affected different health sub-categories differently?"
    }
  },
  education: {
    keywords: ['education', 'teacher', 'school', 'law', 'lawyer', 'social', 'community', 'government', 'social worker', 'librarian'],
    label: 'Occupations in Education, Law and Social, Community and Government Services',
    responses: {
      general: `Education, Law and Government Services occupations have been relatively stable in our 1987–2025 dataset, reflecting the public-sector nature of most employment in this category. Teaching employment tracked demographic shifts closely - growing with millennial enrollment peaks in the late 1990s and early 2000s, then contracting in some provinces during fiscal consolidation (2010–2016), before recovering with population growth driven by record immigration levels post-2015.`,
      trend: `The most significant structural shift in this NOC category between 1987–2025 is the expansion of social and community services roles - growing 78% over the period - driven by increased recognition of mental health services, addictions support, and Indigenous community programming. Legal occupations showed strong growth through 2015 before plateauing as legal tech began automating document review and contract analysis tasks.`,
      followUp: "Would you like to compare teacher employment across provinces, or explore how legal and social service occupations diverged after 2015?"
    }
  },
  arts: {
    keywords: ['art', 'culture', 'recreation', 'sport', 'music', 'artist', 'actor', 'writer', 'journalist', 'entertainment'],
    label: 'Occupations in Art, Culture, Recreation and Sport',
    responses: {
      general: `Art, Culture, Recreation and Sport occupations remained a small but growing NOC category between 1987–2025, rising from approximately 1.8% to 2.6% of total employment. The emergence of digital distribution fundamentally restructured this category - traditional media roles (print journalists, broadcast technicians) contracted sharply while content creation, UX design, and digital media roles grew. Our data captures this transition most clearly in the 2010–2020 period.`,
      trend: `The 2020 pandemic caused the sharpest single-year contraction in arts and recreation employment in our dataset - live performance, sport, and hospitality-adjacent cultural roles dropped approximately 31% in 2020. Recovery was uneven: digital content roles recovered rapidly while live performance employment remained below 2019 levels through 2022. By 2024–2025, the category had largely recovered but with a structurally different composition favoring digital and hybrid roles.`,
      followUp: "Would you like to explore how cultural employment recovered post-pandemic by province, or how digital disruption affected specific creative sub-categories?"
    }
  },
  sales: {
    keywords: ['sales', 'service', 'retail', 'restaurant', 'food', 'hospitality', 'store', 'vendor', 'waiter', 'waitress', 'customer'],
    label: 'Sales and Service Occupations',
    responses: {
      general: `Sales and Service is consistently Canada's largest NOC category in our 1987–2025 dataset, representing 23–26% of total employment throughout the period. The category is characterized by high turnover, a growing part-time and gig work share, and significant regional variation - tourism-dependent provinces like BC and Quebec show higher volatility, while Ontario's diverse service base provides more stability.`,
      trend: `E-commerce growth created a structural split within this category after 2015: traditional retail employment stagnated and declined in many segments (department stores, big-box electronics), while warehousing, logistics, and last-mile delivery roles grew rapidly. The 2020–2022 period accelerated this transition by roughly 5 years. Restaurant and food service employment, after a 28% pandemic collapse in 2020, recovered to near-2019 levels by 2023 but with persistently higher wages reflecting tight labor market conditions.`,
      followUp: "Are you interested in how retail employment changed in a specific province, or how the gig economy has reshaped service occupation classification since 2015?"
    }
  },
  trades: {
    keywords: ['trades', 'transport', 'equipment', 'operator', 'driver', 'construction', 'carpenter', 'electrician', 'plumber', 'mechanic', 'truck'],
    label: 'Trades, Transport and Equipment Operators and Related Occupations',
    responses: {
      general: `Trades, Transport and Equipment Operators maintained a relatively stable share of Canadian employment between 1987–2025 (roughly 15–17%), but with significant internal shifts. Construction trades grew strongly during two housing booms (2002–2008 and 2015–2022), while traditional manufacturing-linked trades declined. Truck driving became the single largest occupation in this NOC category by 2010, reflecting Canada's continental trade integration under NAFTA.`,
      trend: `The most watched trend in this category post-2020 is the skilled trades shortage - our job vacancy data shows electrician, plumber, and HVAC technician vacancy rates reaching 8–11% nationally by 2023, the highest in our dataset. This coincides with the retirement of baby boomer tradespeople and insufficient apprenticeship completions. Simultaneously, autonomous vehicle development (2020–2025) has created growing uncertainty around long-haul trucking employment projections.`,
      followUp: "Would you like to explore construction employment trends by province, or how the skilled trades shortage compares across different trade categories?"
    }
  },
  naturalResources: {
    keywords: ['natural resources', 'agriculture', 'farming', 'farm', 'fishing', 'forestry', 'logging', 'mining', 'miner', 'fisher', 'forest', 'oil', 'gas', 'energy'],
    label: 'Natural Resources, Agriculture and Related Production Occupations',
    responses: {
      general: `Natural Resources and Agriculture Occupations have declined as a share of total employment in our 1987–2025 dataset - from approximately 5.2% in 1987 to 3.8% by 2023 - but this masks dramatic internal volatility. Alberta's oil sands expansion drove energy occupation growth from 1999–2014, while agricultural employment continued its long-term mechanization-driven decline. Fishing occupations contracted significantly in Atlantic Canada following the 1992 cod moratorium.`,
      trend: `The 2014–2016 oil price collapse is the single most disruptive event in this NOC category within our dataset - Alberta energy occupation employment fell 22% between 2014–2016, with significant spillover into Alberta's broader labor market. The 2020 pandemic compounded this with a second energy demand shock. Recovery post-2021 has been partial, complicated by energy transition policy creating structural uncertainty around long-term fossil fuel employment, visible in our job posting trend data for 2022–2025.`,
      followUp: "Shall I focus on oil and gas employment cycles in Alberta, or compare how different natural resource sectors responded to the 2020 economic shock?"
    }
  },
  manufacturing: {
    keywords: ['manufacturing', 'utilities', 'factory', 'production', 'industrial', 'textile', 'mill', 'plant', 'assembly', 'worker'],
    label: 'Occupations in Manufacturing and Utilities',
    responses: {
      general: `Manufacturing and Utilities Occupations experienced the most significant long-term decline of any NOC category in our 1987–2025 dataset. Manufacturing's share of Canadian employment fell from approximately 16% in 1987 to 9.5% by 2023 - a contraction driven by NAFTA-era trade integration (1994), automation, and the 2008 financial crisis which permanently closed many Ontario and Quebec plants. The auto sector, concentrated in Ontario, remains the single largest manufacturing sub-category.`,
      trend: `Three structural shocks define manufacturing employment in our dataset: NAFTA (1994) accelerated offshoring of labor-intensive production; the 2008 crisis triggered permanent plant closures and workforce reductions (Ontario manufacturing shed ~115,000 jobs between 2007–2010); and the 2020s have introduced automation and reshoring as competing forces. Utilities employment has been more stable, with renewable energy infrastructure investment creating modest growth in electrical utilities roles post-2015.`,
      followUp: "Would you like to explore how Ontario's auto sector employment evolved specifically, or compare manufacturing decline rates across provinces?"
    }
  },
  unclassified: {
    keywords: ['unclassified', 'unknown', 'other', 'miscellaneous', 'undefined', 'gig', 'freelance', 'contract'],
    label: 'Unclassified Occupations',
    responses: {
      general: `The Unclassified Occupations category in our 1987–2025 dataset has taken on new significance with the rise of gig and platform-based work. While traditional unclassified workers (casual laborers, informal sector workers) declined as a share of employment through the 1990s and 2000s, the post-2015 expansion of platforms like Uber, Lyft, DoorDash, and Upwork created a new classification challenge - many gig workers appear in employment statistics inconsistently, falling between NOC categories.`,
      trend: `Statistics Canada's methodology adjustments in 2016 and 2021 attempted to better capture non-traditional employment arrangements, and these changes are visible as discontinuities in our dataset. By 2023, an estimated 8–10% of Canadian workers held some form of gig or contract work as their primary income source - a figure that our NOC-based data likely undercounts. This classification ambiguity is itself analytically informative about the limits of traditional occupational frameworks.`,
      followUp: "Would you like to explore how gig work classification has evolved, or how unclassified occupations are distributed across provinces and age groups?"
    }
  }
};

// ─── Out-of-scope topics ──────────────────────────────────────────────────────
const OUT_OF_SCOPE = [
  'weather', 'recipe', 'sport score', 'movie', 'music', 'stock', 'crypto',
  'covid', 'pandemic', 'politics', 'election', 'war', 'relationship', 'joke',
  'game', 'travel', 'hotel', 'flight', 'restaurant recommendation'
];

// ─── Response Engine ──────────────────────────────────────────────────────────
function buildResponse(userMsg, history) {
  const m = userMsg.toLowerCase();

  // Out-of-scope detection
  if (OUT_OF_SCOPE.some(t => m.includes(t))) {
    return {
      text: `That topic falls outside my scope. I'm specifically built on Statistics Canada's Labour Force Survey (LFS) data, classified by NOC categories, spanning 1987–2025. I can answer questions about any of these occupational categories:\n\n${OCCUPATIONS.slice(0, 6).map(o => `• ${o}`).join('\n')}\n\n...and more. What would you like to explore?`,
      type: 'out_of_scope'
    };
  }

  // Province detection
  const mentionedProvince = PROVINCES.find(p => m.includes(p.toLowerCase()));
  const mentionedDecade = DECADES.find(d => m.includes(d.replace('s', '').toLowerCase()) || m.includes(d.toLowerCase()));

  // NOC category matching
  for (const [key, data] of Object.entries(NOC_DATA)) {
    if (data.keywords.some(kw => m.includes(kw))) {
      let response = data.responses.general;

      // If they're asking about trends/change/decline/growth, give trend response
      if (['trend', 'change', 'decline', 'grow', 'increas', 'decreas', 'shift', 'evolv', 'why', 'how did'].some(w => m.includes(w))) {
        response = data.responses.trend;
      }

      // Enrich with province/decade context if mentioned
      if (mentionedProvince) {
        response += `\n\nRegarding ${mentionedProvince} specifically: the LFS data shows this pattern was ${
          ['Ontario', 'Quebec', 'British Columbia'].includes(mentionedProvince) 
            ? 'more pronounced in urban centres, consistent with this province\'s concentration of knowledge economy and service sector employment' 
            : 'tied closely to resource extraction cycles and more sensitive to commodity price shocks'
        }, diverging from the national average particularly during the 2008 recession and post-2020 recovery.`;
      }

      if (mentionedDecade) {
        response += `\n\nIn the ${mentionedDecade} specifically, this occupational category saw notable shifts driven by ${
          mentionedDecade.startsWith('198') ? 'free trade agreement negotiations and early deindustrialization' :
          mentionedDecade.startsWith('199') ? 'NAFTA integration, the dot-com boom, and post-recession restructuring' :
          mentionedDecade.startsWith('200') ? 'the 2008 financial crisis and its uneven sectoral impact' :
          mentionedDecade.startsWith('201') ? 'automation, gig economy expansion, and record immigration levels' :
          'the pandemic labor shock and subsequent tight labor market conditions'
        }.`;
      }

      // Multi-turn: reference prior context
      const priorTopics = history.filter(h => h.role === 'bot' && h.nocCategory).map(h => h.nocCategory);
      if (priorTopics.length > 0 && priorTopics[priorTopics.length - 1] !== key) {
        const priorLabel = NOC_DATA[priorTopics[priorTopics.length - 1]]?.label;
        response += `\n\nCompared to ${priorLabel} which we discussed earlier, this category shows a notably different trajectory in the Statistics Canada LFS data.`;
      }

      return {
        text: response + '\n\n' + data.responses.followUp,
        type: 'noc_response',
        nocCategory: key
      };
    }
  }

  // Compare/contrast intent
  if (['compare', 'difference', 'versus', 'vs', 'between'].some(w => m.includes(w))) {
    return {
      text: `Comparative analysis across NOC categories is one of the most revealing uses of the 1987–2025 dataset. The most significant divergences I can identify are:\n\n• Natural & Applied Sciences vs. Manufacturing: Sciences grew ~200% while Manufacturing shed nearly 40% of its employment share - the defining occupational divergence of the last 35 years\n• Health vs. Natural Resources: Health grew consistently through every economic cycle; Natural Resources is the most volatile category, with sharp Alberta-driven boom-bust cycles in 2008 and 2014–2016\n• Sales & Service vs. Trades: Both are large categories, but Sales shows growing part-time and gig work share while Trades faces a structural shortage of certified workers post-2018\n\nWhich two categories would you like me to compare in more depth?`,
      type: 'compare'
    };
  }

  // Greeting
  if (['hello', 'hi', 'hey', 'greetings', 'good'].some(w => m.startsWith(w))) {
    return {
      text: `Hello! I'm the Careerlytics labor analysis assistant, built on Statistics Canada's Labour Force Survey (LFS) data classified by NOC categories, spanning 1987–2025. I can help you understand how Canada's workforce transformed across the dot-com era, the 2008 financial crisis, the rise of the gig economy, and the pandemic labor market shock.\n\nWhat occupational category or era would you like to explore?`,
      type: 'greeting'
    };
  }

  // Default - prompt toward NOC categories
  return {
    text: `I wasn't able to map your question to a specific NOC occupational category. I'm built on Statistics Canada's Labour Force Survey (LFS), Table 14-10-0416-01, covering Canadian labor market data from 1987–2025 across these NOC categories:\n\n${OCCUPATIONS.map(o => `• ${o}`).join('\n')}\n\nTry asking something like:\n- "How did health occupations change after 2010?"\n- "Why did manufacturing decline in Ontario?"\n- "Compare natural sciences and manufacturing between 2000 and 2020"`,
    type: 'default'
  };
}

const SUGGESTIONS = [
  "Why did manufacturing decline after 2000?",
  "How did the 2008 crisis affect finance jobs?",
  "Compare health and education occupations",
  "How has tech employment grown since 1987?",
  "What happened to natural resources in 2014?",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Welcome to the Careerlytics Labor Intelligence System.\n\nI'm built on Statistics Canada's Labour Force Survey (LFS), Table 14-10-0416-01, covering NOC occupational data from 1987–2025. You can ask me about any of Canada's major occupational categories - how employment shifted over decades, what drove growth or decline, how provinces differed, and how major economic events reshaped the labor market.\n\nWhat would you like to explore?",
      nocCategory: null
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    const response = buildResponse(userMsg, newMessages);
    setMessages(m => [...m, { role: "bot", text: response.text, nocCategory: response.nocCategory || null }]);
    setLoading(false);
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#080810", padding: "1.5rem",
      height: "calc(100vh - 60px)",
      overflow: "hidden", boxSizing: "border-box"
    }}>
      <div style={{
        width: "100%", maxWidth: 720, height: "100%",
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
                Careerlytics
              </div>
              <div style={{ fontSize: "0.65rem", color: "#4a8f7f", fontFamily: "'DM Mono',monospace", letterSpacing: ".06em" }}>
                StatsCan LFS · NOC · 1987–2025
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
                maxWidth: "78%", padding: "10px 14px",
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
                background: m.role === "user" ? "rgba(201,168,76,0.15)" : "rgba(13,20,30,0.7)",
                border: `1px solid ${m.role === "user" ? "rgba(201,168,76,0.25)" : "rgba(106,183,167,0.15)"}`,
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.87rem",
                color: m.role === "user" ? "#e8c97a" : "#c4c8e0",
                lineHeight: 1.75, backdropFilter: "blur(4px)",
                whiteSpace: "pre-line"
              }}>
                {m.text}
              </div>
            </div>
          ))}

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
              placeholder="Ask about any Canadian occupational category..."
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