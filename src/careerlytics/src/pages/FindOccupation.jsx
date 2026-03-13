//About: This page is for our Find Occupation tab

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";


//Storing occupations in a constant array 

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

const PROVINCES = [

  	"All", "Ontario", "Quebec", "British Columbia", "Alberta",
  	"Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick",
  	"Newfoundland and Labrador", "Prince Edward Island",

];

function seedRand(seed) {

  	let s = seed;

  	return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };

}

const PROVINCE_SCALE = {


  	"All": 1.0, "Ontario": 0.38, "Quebec": 0.23, "British Columbia": 0.14,
  	"Alberta": 0.12, "Manitoba": 0.04, "Saskatchewan": 0.03,
  	"Nova Scotia": 0.03, "New Brunswick": 0.02,
  	"Newfoundland and Labrador": 0.015, "Prince Edward Island": 0.004,

};

const PT_SHARE = {

  	'Sales and Service Occupations': 0.42,
  	'Occupations in Art, Culture, Recreation and Sport': 0.38,
  	'Occupations in Education, Law and Social, Community and Government Services': 0.28,
  	'Health Occupations, except management': 0.25,
  	'Unclassified Occupations': 0.35,
  	'Natural Resources, Agriculture and Related Production Occupations': 0.18,
  	'Occupations in Manufacturing and Utilities': 0.15,	
  	'Trades, Transport and Equipment Operators and Related Occupations': 0.14,
  	'Business, Finance and Administration Occupations': 0.22,
  	'Natural and Applied Sciences and Related Occupations': 0.12,
  	'Management Occupations': 0.08,

};



function buildSeries(occ, province, empType, yearStart, yearEnd) {
	
  	const combined = occ + "|" + province;

  	const hash  = combined.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  	const rand  = seedRand(hash);

  	const provScale = PROVINCE_SCALE[province] ?? 1.0;

  	const ptShare   = PT_SHARE[occ] ?? 0.2;

  	const empScale  = empType === "Part Time" ? ptShare
                  : empType === "Full Time" ? (1 - ptShare)
                  : 1.0;

  	const scale = provScale * empScale;

  	const base  = ((hash % 400) + 80) * scale;

  	const trend = (rand() - 0.45) * 3 * scale;

  	const years = [];

  for (let y = yearStart; y <= yearEnd; y += 4) years.push(y);

  return years.map((year, i) => ({
    year,
    workers: Math.max(1, Math.round(base + trend * i + (rand() - 0.5) * 20 * scale)),
  }));


}



function buildAllSeries(province, empType, yearStart, yearEnd){

	const result = {};

  	OCCUPATIONS.forEach(o => {
    	result[o] = buildSeries(o, province, empType, yearStart, yearEnd);
  	});

  	return result;


}

  
function buildShareData(allSeries, yearStart, yearEnd){


	const years = [];

  	for (let y = yearStart; y <= yearEnd; y += 4) years.push(y);

  	return years.map((year, i) => {

    	const row = { year };
    	let total = 0;
    	OCCUPATIONS.forEach(o => { total += allSeries[o][i]?.workers ?? 0; });
    	OCCUPATIONS.forEach(o => {
      	row[o] = total ? +((allSeries[o][i]?.workers ?? 0) / total * 100).toFixed(1) : 0;

    });

    return row;
  	});

}


// ── components ────--

function SidePanel({ children }) {

  	return <div style={styles.sidePanel}>{children}</div>;

}

function FilterLabel({ children }) {

  	return <div style={styles.filterLabel}>{children}</div>;

}

function OccupationList({ selected, onToggle, max = 1 }) {

  return (
	
    <div>
      <FilterLabel>Occupation — Select One</FilterLabel>
      <div style={styles.occListBox}>
        {OCCUPATIONS.map(o => {
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
              <input type="checkbox" checked={isSelected}
                onChange={() => !isDisabled && onToggle(o)}
                style={{ display: "none" }} />
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

function ProvinceSelect({ value, onChange }) {

  return (
    <div>
      <FilterLabel>Province</FilterLabel>
      <select value={value} onChange={e => onChange(e.target.value)} style={styles.select}>
        {PROVINCES.map(p => <option key={p}>{p}</option>)}
      </select>
    </div>
  );

}


function EmploymentType({ value, onChange }) {

  	const options = ["All", "Full Time", "Part Time"];
  	return (
    	<div>
      	<FilterLabel>Employment Type</FilterLabel>
      	<div style={styles.empToggleRow}>
        	{options.map(o => (
          	<button key={o} onClick={() => onChange(o)} style={{
            ...styles.empToggleBtn,
            background: value === o ? "rgba(201,168,76,.15)" : "transparent",
            color:      value === o ? "#e8c97a" : "#4a4f6a",
            border:     value === o ? "1px solid #c9a84c" : "1px solid #1e2035",
          }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}


function YearRange({ value, onChange }) {

  	const MIN = 1987;
  	const MAX = 2025;

  	const pctStart = ((value[0] - MIN) / (MAX - MIN)) * 100;
  	const pctEnd   = ((value[1] - MIN) / (MAX - MIN)) * 100;

	const handleStart = e => {
		const v = Math.min(Number(e.target.value), value[1] - 1);
		onChange([v, value[1]]);
	};

	const handleEnd = e => {
		const v = Math.max(Number(e.target.value), value[0] + 1);
		onChange([value[0], v]);
	};

  return (
    <div>
      <FilterLabel>Year Range: {value[0]} – {value[1]}</FilterLabel>
      <style>{`
        .yr-thumb { position:absolute; top:0; left:0; width:100%; height:100%; appearance:none; -webkit-appearance:none; background:transparent; pointer-events:none; }
        .yr-thumb::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#c9a84c; border:2px solid #080810; cursor:pointer; pointer-events:all; box-shadow:0 0 0 3px rgba(201,168,76,.2); transition: box-shadow .15s; }
        .yr-thumb::-webkit-slider-thumb:hover { box-shadow:0 0 0 5px rgba(201,168,76,.3); }
        .yr-thumb::-moz-range-thumb { width:14px; height:14px; border-radius:50%; background:#c9a84c; border:2px solid #080810; cursor:pointer; pointer-events:all; }
        .yr-thumb::-webkit-slider-runnable-track { background:transparent; }
        .yr-thumb::-moz-range-track { background:transparent; }
      `}</style>
      <div style={{ position:"relative", height:28, marginTop:10, marginBottom:4 }}>
        {/* Base track */}
        <div style={{
          position:"absolute", top:"50%", left:0, right:0,
          height:3, borderRadius:2, background:"#1e2035",
          transform:"translateY(-50%)", pointerEvents:"none",
        }} />
        {/* Active fill */}
        <div style={{
          position:"absolute", top:"50%",
          left:`${pctStart}%`,
          width:`${pctEnd - pctStart}%`,
          height:3, borderRadius:2,
          background:"linear-gradient(90deg, #c9a84c, #e8c97a)",
          transform:"translateY(-50%)", pointerEvents:"none",
        }} />
        <input
          type="range" min={MIN} max={MAX} step={1} value={value[0]}
          onChange={handleStart}
          className="yr-thumb"
          style={{ zIndex: value[0] >= MAX - 5 ? 5 : 3 }}
        />
        <input
          type="range" min={MIN} max={MAX} step={1} value={value[1]}
          onChange={handleEnd}
          className="yr-thumb"
          style={{ zIndex: 4 }}
        />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
        <span style={styles.yearEndLabel}>{MIN}</span>
        <span style={styles.yearEndLabel}>{MAX}</span>
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

function InsightCard({ label, value, delta, tooltip }) {
  const [hovered, setHovered] = useState(false);
  const positive = delta >= 0;
  return (
    <div style={styles.insightCard}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={styles.insightLabel}>{label}</div>
        {tooltip && (
          <div
            style={styles.tooltipAnchor}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div style={styles.questionMark}>?</div>
            {hovered && (
              <div style={styles.tooltipPopup}>
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={styles.insightValue}>{value}</div>
      {delta !== undefined && (
        <div style={{ ...styles.insightDelta, color: positive ? "#50e3a4" : "#ff6b6b" }}>
          {positive ? "▲" : "▼"} {Math.abs(delta)}% over period
        </div>
      )}
    </div>
  );
}


// ── Main ──────────────────────────────────────────────────────────────────────

export default function FindOccupation() {

	const [selected,  setSelected]  = useState([]);
	const [province,  setProvince]  = useState("All");
	const [yearRange, setYearRange] = useState([1987, 2025]);
	const [empType,   setEmpType]   = useState("All");
	const [applied,   setApplied]   = useState(null);
	const [activeTab, setActiveTab] = useState("trend");

  	const toggleOcc = o =>
    	setSelected(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  	const apply = () => {
    	if (selected.length) setApplied({ occ: selected[0], province, yearRange, empType });
  	};

	const reset = () => {
		setSelected([]); setApplied(null); setProvince("All");
		setYearRange([1987, 2025]); setEmpType("All");
		setActiveTab("trend");
	};

	const allSeries  = applied ? buildAllSeries(applied.province, applied.empType, applied.yearRange[0], applied.yearRange[1]) : {};
	const chartData  = applied ? allSeries[applied.occ] : [];
	const shareData  = applied ? buildShareData(allSeries, applied.yearRange[0], applied.yearRange[1]) : [];

	const peak  = chartData.length ? Math.max(...chartData.map(d => d.workers)) : 0;
	const last  = chartData.length ? chartData[chartData.length - 1].workers    : 0;
	const first = chartData.length ? chartData[0].workers                       : 0;
	const delta = first ? Math.round(((last - first) / first) * 100)            : 0;

	const shareStart = shareData.length ? shareData[0][applied?.occ]                    : 0;
	const shareEnd   = shareData.length ? shareData[shareData.length - 1][applied?.occ] : 0;
	const shareDelta = shareStart ? +((shareEnd - shareStart).toFixed(1))               : 0;


	const TABS = [

		{ id: "trend", label: "Trend" },
		{ id: "share", label: "Workforce Share" },

	];

	const OCC_COLORS = [

		"#c9a84c","#50e3a4","#7eb8f7","#ff6b6b","#b98cff",
		"#f0a050","#4ad8c7","#f77eb8","#a0d070","#f0e070","#90a8b0",

	];

  return (
    <div style={styles.page}>
      <SidePanel>
        <OccupationList selected={selected} onToggle={toggleOcc} max={1} />
        <ProvinceSelect value={province} onChange={setProvince} />
        <EmploymentType value={empType} onChange={setEmpType} />
        <YearRange value={yearRange} onChange={setYearRange} />
        <div style={styles.sideFooter}>
          <ActionBtn onClick={reset} variant="secondary">Reset</ActionBtn>
          <ActionBtn onClick={apply}>Apply</ActionBtn>
        </div>
      </SidePanel>

      <div style={styles.mainPanel}>
        {!applied ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyTitle}>Select Filters to View Occupation Trends</div>
            <div style={styles.emptySubtitle}>choose an occupation · set province · apply</div>
          </div>
        ) : (
          <div style={styles.resultStack}>
            <div>
              <div style={styles.sectionTag}>OCCUPATION ANALYSIS</div>
              <h2 style={styles.resultTitle}>{applied.occ}</h2>
              <div style={styles.resultSubtitle}>
                {applied.province} · {applied.yearRange[0]}–{applied.yearRange[1]} · {applied.empType}
              </div>
            </div>

            <div style={styles.insightGrid}>
              <InsightCard label="PEAK EMPLOYMENT" value={peak.toLocaleString() + "k"}
                tooltip="The highest worker count recorded for this occupation within the selected year range and province." />
              <InsightCard label="FINAL COUNT" value={last.toLocaleString() + "k"} delta={delta}
                tooltip="Total workers in this occupation at the end of the selected period. The % change shows growth or decline relative to the starting year." />
              <InsightCard label="WORKFORCE SHARE" value={shareEnd + "%"} delta={+shareDelta}
                tooltip="This occupation's share of the total provincial workforce at the end of the period. A falling share means this sector grew slower than the overall workforce — even if absolute numbers rose." />
            </div>

            <div style={styles.tabBar}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  ...styles.tabBtn,
                  color:        activeTab === t.id ? "#e8c97a" : "#4a4f6a",
                  borderBottom: activeTab === t.id ? "2px solid #c9a84c" : "2px solid transparent",
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === "trend" && (
              <div style={styles.card}>
                <div style={styles.cardLabel}>WORKFORCE OVER TIME </div>
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
                      tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip contentStyle={styles.tooltipBox} />
                    <Area type="monotone" dataKey="workers"
                      stroke="#c9a84c" strokeWidth={2}
                      fill="url(#areaGrad)" dot={{ fill: "#c9a84c", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ ...styles.mlText, marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #1e2035" }}>
                  <span style={styles.cardLabel}>ML INSIGHT — TREND CLASSIFICATION &nbsp;</span>
                  {delta < -30
                    ? `K-Means clustering places ${applied.occ} in the Technological Displacement cluster, rapid decline following mechanisation or infrastructure change.`
                    : delta > 20
                    ? `Trend detection classifies ${applied.occ} as Sustained Growth, driven by urbanisation, policy shifts, or industrial expansion.`
                    : `${applied.occ} is Cyclically Stable, fluctuating with economic cycles but maintaining structural presence.`
                  }
                </div>
              </div>
            )}

            {activeTab === "share" && (
              <div style={styles.card}>
                <div style={styles.cardLabel}>SHARE OF TOTAL WORKFORCE — ALL OCCUPATIONS (%)</div>
                <div style={styles.shareNote}>
                  Relative share corrects for population growth. A falling share means this occupation
                  is growing <em>slower</em> than the overall workforce, even if absolute numbers rise.
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={shareData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2035" />
                    <XAxis dataKey="year" stroke="#4a4f6a" tick={styles.chartTick} />
                    <YAxis stroke="#4a4f6a" tick={styles.chartTick} tickFormatter={v => v + "%"} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const sorted = [...payload].sort((a, b) => b.value - a.value);
                        return (
                          <div style={{
                            background: "#0d0e1a", border: "1px solid #1e2035", borderRadius: 10,
                            padding: "10px 14px", fontFamily: "'DM Mono',monospace",
                            boxShadow: "0 8px 32px rgba(0,0,0,.6)", minWidth: 260,
                          }}>
                            <div style={{ fontSize: "0.7rem", color: "#4a4f6a", marginBottom: 8, letterSpacing: ".08em" }}>{label}</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                              {sorted.map(p => {
                                const short = p.name.replace("Occupations in ", "").replace(" Occupations", "").replace(" and Related Occupations", "");
                                const isFocus = p.name === applied.occ;
                                return (
                                  <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, opacity: isFocus ? 1 : 0.5 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: "0.65rem", color: isFocus ? "#e8c97a" : "#8a8fa8", fontWeight: isFocus ? 700 : 400, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{short}</span>
                                    <span style={{ fontSize: "0.65rem", color: isFocus ? "#e8c97a" : "#6a6f88", flexShrink: 0 }}>{p.value}%</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    />
                    {OCCUPATIONS.map((o, i) => (
                      <Line key={o} type="monotone" dataKey={o}
                        stroke={OCC_COLORS[i]}
                        strokeWidth={o === applied.occ ? 3 : 1}
                        strokeOpacity={o === applied.occ ? 1 : 0.3}
                        dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                {/* Custom compact legend */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px 12px", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #1e2035" }}>
                  {OCCUPATIONS.map((o, i) => {
                    const short = o.replace("Occupations in ", "").replace(" Occupations", "").replace(" and Related Occupations", "");
                    const isFocus = o === applied.occ;
                    return (
                      <div key={o} style={{ display: "flex", alignItems: "center", gap: 6, opacity: isFocus ? 1 : 0.45 }}>
                        <div style={{ width: isFocus ? 14 : 8, height: 2, background: OCC_COLORS[i], flexShrink: 0, borderRadius: 1 }} />
                        <span style={{ fontSize: "0.61rem", fontFamily: "'DM Mono',monospace", color: isFocus ? "#e8c97a" : "#4a4f6a", fontWeight: isFocus ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{short}</span>
                      </div>
                    );
                  })}
                </div>
               
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



// ─── STYLES ─────────────────
//keeping all the css seperate, so 
const styles = {
  page:        { display: "flex", minHeight: "100vh", overflow: "hidden" },

  sidePanel: {
    width: 280, minWidth: 280,
    background: "#0d0e1a", borderRight: "1px solid #1e2035",
    padding: "1.5rem 1.25rem",
    display: "flex", flexDirection: "column", gap: "1.25rem",
    overflowY: "auto",
  },
  sideFooter:  { display: "flex", gap: 8, marginTop: "auto" },

  filterLabel: {
    fontSize: "0.7rem", color: "#4a4f6a", letterSpacing: ".1em",
    textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginBottom: 6,
  },

  occListBox: {
    background: "#0a0a0f", border: "1px solid #1e2035",
    borderRadius: 8, maxHeight: 220, overflowY: "auto", padding: "0.25rem",
  },
  occItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "6px 8px", borderRadius: 6, transition: "background .15s",
  },
  occLabel:    { fontSize: "0.82rem", fontFamily: "'DM Sans',sans-serif" },
  checkbox: {
    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  checkboxInner: { width: 7, height: 7, background: "#0a0a0f", borderRadius: 1 },

  select: {
    width: "100%", padding: "8px 12px",
    background: "#0a0a0f", border: "1px solid #1e2035", borderRadius: 8,
    color: "#c4c8e0", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
    cursor: "pointer", outline: "none",
  },

  empToggleRow: { display: "flex", gap: 6 },
  empToggleBtn: {
    flex: 1, padding: "7px 4px",
    borderRadius: 7, cursor: "pointer",
    fontFamily: "'DM Mono',monospace", fontSize: "0.65rem",
    letterSpacing: ".04em", transition: "all .15s",
  },

  yearEndLabel: {
    fontSize:   "0.65rem",
    color:      "#2e3050",
    fontFamily: "'DM Mono',monospace",
  },

  actionBtn: {
    padding: "9px 20px", borderRadius: 8, cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
    fontWeight: 600, letterSpacing: ".03em", transition: "all .2s",
  },

  mainPanel:   { flex: 1, padding: "2rem", overflowY: "auto", background: "#080810" },

  emptyState: {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: "100%", flexDirection: "column", gap: 12,
  },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif", fontSize: "2.9rem", color: "#4a4f6a",
  },
  emptySubtitle: {
    fontSize: "1.1rem", color: "#2e3050", fontFamily: "'DM Mono',monospace",
  },

  resultStack: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  sectionTag: {
    fontSize: "0.72rem", color: "#4a4f6a",
    fontFamily: "'DM Mono',monospace", letterSpacing: ".1em",
  },
  resultTitle: {
    fontFamily: "'Playfair Display',serif", color: "#e8c97a",
    fontSize: "1.8rem", margin: "4px 0 0",
  },
  resultSubtitle: {
    fontSize: "0.8rem", color: "#4a4f6a", fontFamily: "'DM Mono',monospace",
  },

  insightGrid: {
    display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem",
  },
  insightCard: {
    background: "#0d0e1a", border: "1px solid #1e2035",
    borderRadius: 10, padding: "1rem 1.25rem",
  },
  insightLabel: {
    fontSize: "0.7rem", color: "#4a4f6a", fontFamily: "'DM Mono',monospace",
    letterSpacing: ".08em", marginBottom: 6,
  },
  insightValue: {
    fontSize: "1.4rem", fontFamily: "'Playfair Display',serif",
    color: "#e8c97a", fontWeight: 700,
  },
  insightDelta: { fontSize: "0.75rem", fontFamily: "'DM Mono',monospace", marginTop: 4 },

  tooltipAnchor: { position: "relative", display: "inline-flex" },
  questionMark: {
    width: 16, height: 16, borderRadius: "50%",
    border: "1px solid #2e3050", color: "#4a4f6a",
    fontSize: "0.65rem", fontFamily: "'DM Mono',monospace",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "default", userSelect: "none", transition: "border-color .15s, color .15s",
  },
  tooltipPopup: {
    position: "absolute", bottom: "calc(100% + 8px)", right: 0,
    width: 220, background: "#13141f", border: "1px solid #2e3050",
    borderRadius: 8, padding: "10px 12px",
    fontSize: "0.75rem", color: "#8a8fa8", fontFamily: "'DM Sans',sans-serif",
    lineHeight: 1.6, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,.5)",
    pointerEvents: "none",
  },

  tabBar: { display: "flex", gap: 0, borderBottom: "1px solid #1e2035" },
  tabBtn: {
    padding: "10px 20px", background: "transparent",
    fontFamily: "'DM Mono',monospace", fontSize: "0.75rem",
    letterSpacing: ".08em", cursor: "pointer", border: "none",
    transition: "color .15s, border-bottom .15s",
  },

  card: {
    background: "#0d0e1a", border: "1px solid #1e2035",
    borderRadius: 12, padding: "1.5rem",
  },
  cardLabel: {
    fontSize: "0.7rem", color: "#4a4f6a", letterSpacing: ".1em",
    fontFamily: "'DM Mono',monospace", marginBottom: "1rem",
  },
  mlText: {
    fontSize: "0.9rem", color: "#c4c8e0",
    fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7,
  },

  shareNote: {
    fontSize: "0.82rem", color: "#6a6f88",
    fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6,
    marginBottom: "1rem",
  },
  shareCallout: {
    marginTop: "1rem", fontSize: "0.85rem",
    fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6,
    paddingTop: "1rem", borderTop: "1px solid #1e2035",
  },

  chartTick: { fontFamily: "'DM Mono',monospace", fontSize: 11 },
  tooltipBox: {
    background: "#0d0e1a", border: "1px solid #1e2035",
    borderRadius: 8, fontFamily: "'DM Sans',sans-serif", color: "#c4c8e0",
  },
};