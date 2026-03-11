import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

//All the data
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
]

const PROVINCES = [
    "All", "Ontario", "Quebec", "British Columbia", "Alberta",
    "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick",
    "Newfoundland and Labrador", "Prince Edward Island",
];


//this function is the general side panel layout
function SidePanel({ children }) {

    return <div style = {styles.sidePanel}>{children}</div>
      
}

function FilterLabel({ children }) {

    return <div style = {styles.filterLabel}>{children}</div>

}


function OccupationList({ selected, onToggle, max = 1, occupations }) {
    return (
      <div>
        <FilterLabel>Occupation — Select One</FilterLabel>
        <div style={styles.occListBox}>
          {occupations.map(o => {
            const isSelected = selected.includes(o);
            const isDisabled = !isSelected && selected.length >= max;
            return (
              <label key={o} style={{
                ...styles.occItem,
                cursor:     isDisabled ? "not-allowed" : "pointer",
                opacity:    isDisabled ? 0.35 : 1,
                background: isSelected ? "rgba(201,168,76,.1)" : "transparent",
              }}>
                <div style={{
                  ...styles.checkbox,
                  border:     isSelected ? "none" : "1px solid #2e3050",
                  background: isSelected ? "#c9a84c" : "transparent",
                }}>
                  {isSelected && <div style={styles.checkboxInner} />}
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !isDisabled && onToggle(o)}
                  style={{ display: "none" }}
                />
                <span style={{ ...styles.occLabel, color: isSelected ? "#e8c97a" : "#8a8fa8" }}>
                  {o}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
  
  function ProvinceSelect({ value, onChange, provinces }) {
    return (
      <div>
        <FilterLabel>Province</FilterLabel>
        <select value={value} onChange={e => onChange(e.target.value)} style={styles.select}>
          {provinces.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
    );
  }
  
  function EmploymentType({ partTime, fullTime, setPartTime, setFullTime }) {
    return (
      <div>
        <FilterLabel>Employment Type</FilterLabel>
        {[["Part Time", partTime, setPartTime], ["Full Time", fullTime, setFullTime]].map(([lbl, val, set]) => (
          <label key={lbl} style={styles.empTypeRow}>
            <div
              onClick={() => set(!val)}
              style={{
                ...styles.empCheckbox,
                border:     val ? "none" : "1px solid #2e3050",
                background: val ? "#c9a84c" : "transparent",
              }}
            />
            <span style={styles.empLabel}>{lbl}</span>
          </label>
        ))}
      </div>
    );
  }
  
  function YearRange({ value, onChange }) {
    const years = [1987, 1993, 1999, 2005, 2011, 2017, 2025];
    return (
      <div>
        <FilterLabel>Year Range: {value[0]} – {value[1]}</FilterLabel>
        <div style={styles.yearRow}>
          {years.map(y => (
            <button key={y} onClick={() => onChange(y)} style={{
              ...styles.yearBtn,
              background: y >= value[0] && y <= value[1] ? "rgba(201,168,76,.2)" : "#0a0a0f",
              border:     y === value[0] || y === value[1] ? "1px solid #c9a84c" : "1px solid #1e2035",
              color:      y >= value[0] && y <= value[1] ? "#c9a84c" : "#4a4f6a",
            }}>{y}</button>
          ))}
        </div>
      </div>
    );
  }
  
  function ActionBtn({ children, onClick, variant = "primary" }) {
    return (
      <button onClick={onClick} style={{
        ...styles.actionBtn,
        background: variant === "primary" ? "linear-gradient(135deg,#c9a84c,#e8c97a)" : "transparent",
        color:      variant === "primary" ? "#0a0a0f" : "#4a4f6a",
        border:     variant === "secondary" ? "1px solid #1e2035" : "none",
      }}>
        {children}
      </button>
    );
  }
  
  function InsightCard({ label, value, delta }) {
    const positive = delta >= 0;
    return (
      <div style={styles.insightCard}>
        <div style={styles.insightLabel}>{label}</div>
        <div style={styles.insightValue}>{value}</div>
        {delta !== undefined && (
          <div style={{ ...styles.insightDelta, color: positive ? "#50e3a4" : "#ff6b6b" }}>
            {positive ? "▲" : "▼"} {Math.abs(delta)}% over period
          </div>
        )}
      </div>
    );
  }
  

  function buildMockSeries(occ, yearStart, yearEnd) {
    // Replace with: fetch(`/api/trend/${occ}?year_start=${yearStart}&year_end=${yearEnd}`)
    const hash  = occ.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const start = (hash % 300) + 100;
    const end   = start * (0.6 + (hash % 10) * 0.08);
    const years = [];
    for (let y = yearStart; y <= yearEnd; y += 4) years.push(y);
    return years.map((year, i) => ({
      year,
      workers: Math.round(start + ((end - start) / (years.length - 1)) * i),
    }));
  }


export default function FindOccupation() {
    const [selected,  setSelected]  = useState([]);
  const [province,  setProvince]  = useState("All");
  const [yearRange, setYearRange] = useState([1987, 2025]);
  const [partTime,  setPartTime]  = useState(false);
  const [fullTime,  setFullTime]  = useState(true);
  const [applied,   setApplied]   = useState(null);

  const toggleOcc = o =>
    setSelected(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  const handleYearClick = y =>
    setYearRange(prev =>
      y < (prev[0] + prev[1]) / 2 ? [y, prev[1]] : [prev[0], y]
    );

  const apply = () => {
    if (selected.length) setApplied({ occ: selected[0], province, yearRange });
  };

  const reset = () => {
    setSelected([]);
    setApplied(null);
    setProvince("All");
    setYearRange([1987, 2025]);
  };

  const chartData = applied
    ? buildMockSeries(applied.occ, applied.yearRange[0], applied.yearRange[1])
    : [];

  const peak  = chartData.length ? Math.max(...chartData.map(d => d.workers)) : 0;
  const last  = chartData.length ? chartData[chartData.length - 1].workers : 0;
  const first = chartData.length ? chartData[0].workers : 0;
  const delta = first ? Math.round(((last - first) / first) * 100) : 0;

  return (
    <div style={styles.page}>

      {/* ── SIDEBAR ── */}
      <SidePanel>
        <OccupationList
          selected={selected}
          onToggle={toggleOcc}
          max={1}
          occupations={OCCUPATIONS}
        />
        <ProvinceSelect
          value={province}
          onChange={setProvince}
          provinces={PROVINCES}
        />
        <EmploymentType
          partTime={partTime}
          fullTime={fullTime}
          setPartTime={setPartTime}
          setFullTime={setFullTime}
        />
        <YearRange value={yearRange} onChange={handleYearClick} />
        <div style={styles.sideFooter}>
          <ActionBtn onClick={reset} variant="secondary">Reset</ActionBtn>
          <ActionBtn onClick={apply}>Apply</ActionBtn>
        </div>
      </SidePanel>

      {/* ── MAIN CONTENT ── */}
      <div style={styles.mainPanel}>
        {!applied ? (

          /* Empty state */
          <div style={styles.emptyState}>
    
            <div style={styles.emptyTitle}>Select Filters to View Occupation Trends</div>
            <div style={styles.emptySubtitle}>choose an occupation · set province · apply</div>
          </div>

        ) : (

          /* Results */
          <div style={styles.resultStack}>

            {/* Heading */}
            <div>
              <div style={styles.sectionTag}>OCCUPATION ANALYSIS</div>
              <h2 style={styles.resultTitle}>{applied.occ}</h2>
              <div style={styles.resultSubtitle}>
                {applied.province} · {applied.yearRange[0]}–{applied.yearRange[1]}
              </div>
            </div>

            {/* Insight cards */}
            <div style={styles.insightGrid}>
              <InsightCard label="PEAK EMPLOYMENT" value={peak.toLocaleString() + "k"} />
              <InsightCard label="FINAL COUNT"     value={last.toLocaleString() + "k"} delta={delta} />
              <InsightCard label="TREND"           value={delta > 10 ? "Growing" : delta < -10 ? "Declining" : "➡ Stable"} />
            </div>

            {/* Area chart */}
            <div style={styles.card}>
              <div style={styles.cardLabel}>WORKFORCE OVER TIME</div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c9a84c" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2035" />
                  <XAxis dataKey="year" stroke="#4a4f6a" tick={styles.chartTick} />
                  <YAxis stroke="#4a4f6a" tick={styles.chartTick}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip contentStyle={styles.tooltipBox} />
                  <Area
                    type="monotone" dataKey="workers"
                    stroke="#c9a84c" strokeWidth={2}
                    fill="url(#areaGrad)" dot={{ fill: "#c9a84c", r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* ML insight */}
            <div style={styles.card}>
              <div style={styles.cardLabel}>ML INSIGHT — TREND CLASSIFICATION</div>
              <div style={styles.mlText}>
                {delta < -30
                  ? `Our K-Means clustering model places ${applied.occ} in the Technological Displacement cluster — characterized by rapid decline following mechanization or infrastructure change.`
                  : delta > 20
                  ? `Our trend detection model classifies ${applied.occ} as Sustained Growth — driven by urbanization, education policy, or industrial expansion.`
                  : `${applied.occ} is classified as Cyclically Stable — fluctuating with economic cycles but maintaining structural presence in the labor market.`
                }
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = {

  // Page layout
  page: {
    display:   "flex",
    minHeight: "100vh",
    overflow:  "hidden",
  },

  // Sidebar
  sidePanel: {
    width:         280,
    minWidth:      280,
    background:    "#0d0e1a",
    borderRight:   "1px solid #1e2035",
    padding:       "1.5rem 1.25rem",
    display:       "flex",
    flexDirection: "column",
    gap:           "1.25rem",
    overflowY:     "auto",
  },
  sideFooter: {
    display:   "flex",
    gap:       8,
    marginTop: "auto",
  },

  // Filter label
  filterLabel: {
    fontSize:      "0.7rem",
    color:         "#4a4f6a",
    letterSpacing: ".1em",
    textTransform: "uppercase",
    fontFamily:    "'DM Mono',monospace",
    marginBottom:  6,
  },

  // Occupation list
  occListBox: {
    background:   "#0a0a0f",
    border:       "1px solid #1e2035",
    borderRadius: 8,
    maxHeight:    220,
    overflowY:    "auto",
    padding:      "0.25rem",
  },
  occItem: {
    display:      "flex",
    alignItems:   "center",
    gap:          10,
    padding:      "6px 8px",
    borderRadius: 6,
    transition:   "background .15s",
  },
  occLabel: {
    fontSize:   "0.82rem",
    fontFamily: "'DM Sans',sans-serif",
  },
  checkbox: {
    width:          14,
    height:         14,
    borderRadius:   3,
    flexShrink:     0,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  checkboxInner: {
    width:        7,
    height:       7,
    background:   "#0a0a0f",
    borderRadius: 1,
  },

  // Province dropdown
  select: {
    width:        "100%",
    padding:      "8px 12px",
    background:   "#0a0a0f",
    border:       "1px solid #1e2035",
    borderRadius: 8,
    color:        "#c4c8e0",
    fontFamily:   "'DM Sans',sans-serif",
    fontSize:     "0.85rem",
    cursor:       "pointer",
    outline:      "none",
  },

  // Employment type
  empTypeRow: {
    display:      "flex",
    alignItems:   "center",
    gap:          10,
    cursor:       "pointer",
    marginBottom: 8,
  },
  empCheckbox: {
    width:        16,
    height:       16,
    borderRadius: 4,
    flexShrink:   0,
    cursor:       "pointer",
  },
  empLabel: {
    fontSize:   "0.85rem",
    color:      "#8a8fa8",
    fontFamily: "'DM Sans',sans-serif",
  },

  // Year range
  yearRow: {
    display: "flex",
    gap:     8,
  },
  yearBtn: {
    flex:         1,
    padding:      "3px 0",
    fontSize:     "0.6rem",
    fontFamily:   "'DM Mono',monospace",
    borderRadius: 4,
    cursor:       "pointer",
  },

  // Action buttons
  actionBtn: {
    padding:       "9px 20px",
    borderRadius:  8,
    cursor:        "pointer",
    fontFamily:    "'DM Sans',sans-serif",
    fontSize:      "0.85rem",
    fontWeight:    600,
    letterSpacing: ".03em",
    transition:    "all .2s",
  },

  // Main content panel
  mainPanel: {
    flex:       1,
    padding:    "2rem",
    overflowY:  "auto",
    background: "#080810",
  },

  // Empty state
  emptyState: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    height:         "100%",
    flexDirection:  "column",
    gap:            12,
  },
  emptyIcon: {
    width:          64,
    height:         64,
    borderRadius:   16,
    background:     "rgba(201,168,76,.1)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       28,
  },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize:   "2.9rem",
    color:      "#4a4f6a",
  },
  emptySubtitle: {
    fontSize:   "1.1rem",
    color:      "#2e3050",
    fontFamily: "'DM Mono',monospace",
  },

  // Results
  resultStack: {
    display:       "flex",
    flexDirection: "column",
    gap:           "1.5rem",
  },
  sectionTag: {
    fontSize:      "0.72rem",
    color:         "#4a4f6a",
    fontFamily:    "'DM Mono',monospace",
    letterSpacing: ".1em",
  },
  resultTitle: {
    fontFamily: "'Playfair Display',serif",
    color:      "#e8c97a",
    fontSize:   "1.8rem",
    margin:     "4px 0 0",
  },
  resultSubtitle: {
    fontSize:   "0.8rem",
    color:      "#4a4f6a",
    fontFamily: "'DM Mono',monospace",
  },
  insightGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap:                 "1rem",
  },

  // Insight card
  insightCard: {
    background:   "#0d0e1a",
    border:       "1px solid #1e2035",
    borderRadius: 10,
    padding:      "1rem 1.25rem",
  },
  insightLabel: {
    fontSize:      "0.7rem",
    color:         "#4a4f6a",
    fontFamily:    "'DM Mono',monospace",
    letterSpacing: ".08em",
    marginBottom:  6,
  },
  insightValue: {
    fontSize:   "1.4rem",
    fontFamily: "'Playfair Display',serif",
    color:      "#e8c97a",
    fontWeight: 700,
  },
  insightDelta: {
    fontSize:   "0.75rem",
    fontFamily: "'DM Mono',monospace",
    marginTop:  4,
  },

  // Generic card
  card: {
    background:   "#0d0e1a",
    border:       "1px solid #1e2035",
    borderRadius: 12,
    padding:      "1.5rem",
  },
  cardLabel: {
    fontSize:      "0.7rem",
    color:         "#4a4f6a",
    letterSpacing: ".1em",
    fontFamily:    "'DM Mono',monospace",
    marginBottom:  "1rem",
  },
  mlText: {
    fontSize:   "0.9rem",
    color:      "#c4c8e0",
    fontFamily: "'DM Sans',sans-serif",
    lineHeight: 1.7,
  },

  // Chart
  chartTick: {
    fontFamily: "'DM Mono',monospace",
    fontSize:   11,
  },
  tooltipBox: {
    background:   "#0d0e1a",
    border:       "1px solid #1e2035",
    borderRadius: 8,
    fontFamily:   "'DM Sans',sans-serif",
    color:        "#c4c8e0",
  },

};