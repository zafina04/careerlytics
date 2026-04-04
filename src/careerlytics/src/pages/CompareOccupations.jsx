import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";


import rawData from "../../../Data/backend/data.json";

// ─── DATA ─────────────────────────────────────────────────────────────────────

export const OCCUPATIONS = [

	'Legislative and senior management occupations',
	'Specialized middle management occupations',
	'Middle management occupations in retail and wholesale trade and customer services',
	'Middle management occupations in trades, transportation, production and utilities',
	'Professional occupations in finance',
	'Professional occupations in business',
	'Administrative and financial supervisors and specialized administrative occupations',
	'Administrative occupations and transportation logistics occupations',
	'Administrative and financial support and supply chain logistics occupations',
	'Professional occupations in natural sciences',
	'Professional occupations in applied sciences (except engineering)',
	'Professional occupations in engineering',
	'Technical occupations related to natural and applied sciences',
	'Health treating and consultation services professionals',
	'Therapy and assessment professionals',
	'Nursing and allied health professionals',
	'Technical occupations in health',
	'Assisting occupations in support of health services',
	'Professional occupations in law',
	'Professional occupations in education services',
	'Professional occupations in social and community services',
	'Professional occupations in government services',
	'Occupations in front-line public protection services',
	'Paraprofessional occupations in legal, social, community and education services',
	'Assisting occupations in education and in legal and public protection',
	'Care providers and public protection support occupations and student monitors, crossing guards and related occupations',
	'Professional occupations in art and culture',
	'Technical occupations in art, culture and sport',
	'Occupations in art, culture and sport',
	'Support occupations in art, culture and sport',
	'Retail sales and service supervisors and specialized occupations in sales and services',
	'Occupations in sales and services',
	'Sales and service representatives and other customer and personal services occupations',
	'Sales and service support occupations',
	'Technical trades and transportation officers and controllers',
	'General trades',
	'Mail and message distribution, other transport equipment operators and related maintenance workers',
	'Helpers and labourers and other transport drivers, operators and labourers',
	'Supervisors and occupations in natural resources, agriculture and related production',
	'Workers and labourers in natural resources, agriculture and related production',
	'Supervisors, central control and process operators in processing, manufacturing and utilities and aircraft assemblers and inspectors',
	'Machine operators, assemblers and inspectors in processing, manufacturing and printing',
	'Labourers in processing, manufacturing and utilities',
	'Unclassified occupations',

]

const PROVINCES = [
  "Select One", "Ontario", "Quebec", "British Columbia", "Alberta",
  "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick",
  "Newfoundland and Labrador", "Prince Edward Island",
];

const CHART_COLORS = ["#c9a84c", "#4e8cff"];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────


function buildSeries(occupation, province, empType, yearStart, yearEnd){


	let empKey = "Employment"

	if(empType == "Full Time") {

		empKey = "Full-time employment";

	}

	if (empType == "Part Time") {

		empKey = "Part-time employment";
	}

	console.log("Looking up:", occupation, province, empKey);
  	console.log("Result:", rawData[occupation]?.[province]?.[empKey]);


	const series = rawData[occupation]?.[province]?.[empKey] ?? [];
  	return series.filter(d => d.year >= yearStart && d.year <= yearEnd);

}

function buildAllSeries(province, empType, yearStart, yearEnd) {

	const result = {};

	OCCUPATIONS.forEach(o => {

	  	result[o] = buildSeries(o, province, empType, yearStart, yearEnd);

	});

	return result;

  }


function buildShareData(allSeries, yearStart, yearEnd) {


	// build an array of every year in the range
	const years = [];
	for (let y = yearStart; y <= yearEnd; y++) {

	  	years.push(y);

	}
  
	// for each year, calculate each occupation's % share of total workers
	return years.map((year, i) => {

	  	const row = { year };
  
		// add up total workers across all occupations for this year
		let total = 0;
		OCCUPATIONS.forEach(o => {
			total += allSeries[o][i]?.workers ?? 0;
		});
	
		// calculate each occupation's percentage share
		OCCUPATIONS.forEach(o => {

			if (total) {
			row[o] = +((allSeries[o][i]?.workers ?? 0) / total * 100).toFixed(1);
			} else {
			row[o] = 0;
			}

		});
  
	  	return row;
  
	});


}






// ─── ML: COSINE SIMILARITY ────────────────────────────────────────────────────

function cosineSimilarity(occ1, occ2, province, yearStart, yearEnd) {
  const s1 = buildSeries(occ1, province, "All", yearStart, yearEnd).map(d => d.workers ?? 0);
  const s2 = buildSeries(occ2, province, "All", yearStart, yearEnd).map(d => d.workers ?? 0);
  const dot    = s1.reduce((sum, v, i) => sum + v * s2[i], 0);
  const mag1   = Math.sqrt(s1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(s2.reduce((sum, v) => sum + v * v, 0));
  if (mag1 === 0 || mag2 === 0) return 0;
  return Math.round((dot / (mag1 * mag2)) * 100);
}

function similarityLabel(score) {
  if (score >= 90) return { label: "Nearly Identical Trajectories", color: "#50e3a4" };
  if (score >= 70) return { label: "Strongly Correlated Growth",    color: "#50e3a4" };
  if (score >= 50) return { label: "Moderately Similar Patterns",   color: "#c9a84c" };
  if (score >= 30) return { label: "Weakly Correlated",             color: "#c9a84c" };
  return             { label: "Divergent Trajectories",             color: "#ff6b6b" };
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function SidePanel({ children }) {
  return <div style={styles.sidePanel}>{children}</div>;
}

function FilterLabel({ children }) {
  return <div style={styles.filterLabel}>{children}</div>;
}

function OccupationList({ selected, onToggle, max = 2, occupations }) {
  return (
    <div>
      <FilterLabel>Occupation — Select Two</FilterLabel>
      <div style={styles.occListBox}>
        {occupations.map(o => {
          const isSelected = selected.includes(o);
          const isDisabled = !isSelected && selected.length >= max;
          const colorIdx   = selected.indexOf(o);
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
                background: isSelected ? CHART_COLORS[colorIdx] : "transparent",
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
      <FilterLabel>Year Range: {value[0]} - {value[1]}</FilterLabel>
      <style>{`
        .yr-thumb { position:absolute; top:0; left:0; width:100%; height:100%; appearance:none; -webkit-appearance:none; background:transparent; pointer-events:none; }
        .yr-thumb::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#c9a84c; border:2px solid #080810; cursor:pointer; pointer-events:all; box-shadow:0 0 0 3px rgba(201,168,76,.2); transition: box-shadow .15s; }
        .yr-thumb::-webkit-slider-thumb:hover { box-shadow:0 0 0 5px rgba(201,168,76,.3); }
        .yr-thumb::-moz-range-thumb { width:14px; height:14px; border-radius:50%; background:#c9a84c; border:2px solid #080810; cursor:pointer; pointer-events:all; }
        .yr-thumb::-webkit-slider-runnable-track { background:transparent; }
        .yr-thumb::-moz-range-track { background:transparent; }
      `}</style>
      <div style={{ position:"relative", height:28, marginTop:10, marginBottom:4 }}>
        <div style={{
          position:"absolute", top:"50%", left:0, right:0,
          height:3, borderRadius:2, background:"#1e2035",
          transform:"translateY(-50%)", pointerEvents:"none",
        }} />
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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CompareOccupations() {
  const [selected,  setSelected]  = useState([]);
  const [province,  setProvince]  = useState("All");
  const [yearRange, setYearRange] = useState([1987, 2025]);
  const [compared,  setCompared]  = useState(null);

  const toggleOcc = o =>
    setSelected(prev =>
      prev.includes(o) ? prev.filter(x => x !== o) : prev.length < 2 ? [...prev, o] : prev
    );

  const handleYearClick = range => setYearRange(range);

  const compare = () => {
    if (selected.length === 2) setCompared({ occs: selected, province, yearRange });
  };

  const reset = () => {
    setSelected([]);
    setCompared(null);
    setProvince("All");
    setYearRange([1987, 2025]);
  };

  // Build merged chart data for both occupations
  const chartData = compared ? (() => {
    
    const s1 = buildSeries(compared.occs[0], compared.province, "All", compared.yearRange[0], compared.yearRange[1]);
    const s2 = buildSeries(compared.occs[1], compared.province, "All", compared.yearRange[0], compared.yearRange[1]);

    return s1.map((d, i) => ({
      year: d.year,
      [compared.occs[0]]: d.workers,
      [compared.occs[1]]: s2[i]?.workers || 0,
    }));
  })() : [];

  // ML similarity score
  const similarity = compared

    ? cosineSimilarity(compared.occs[0], compared.occs[1], compared.province, compared.yearRange[0], compared.yearRange[1])

    : null;
  const simLabel = similarity !== null ? similarityLabel(similarity) : null;

  return (
    <div style={styles.page}>

      {/* ── SIDEBAR ── */}
      <SidePanel>
        <OccupationList
          selected={selected}
          onToggle={toggleOcc}
          max={2}
          occupations={OCCUPATIONS}
        />
        <ProvinceSelect
          value={province}
          onChange={setProvince}
          provinces={PROVINCES}
        />
        <YearRange value={yearRange} onChange={handleYearClick} />
        <div style={styles.selectedCount}>
          {selected.length}/2 occupations selected
        </div>
        <div style={styles.sideFooter}>
          <ActionBtn onClick={reset} variant="secondary">Reset</ActionBtn>
          <ActionBtn onClick={compare}>Compare</ActionBtn>
        </div>
      </SidePanel>

      {/* ── MAIN CONTENT ── */}
      <div style={styles.mainPanel}>
        {!compared ? (

          /* Empty state */
          <div style={styles.emptyState}>
        
            <div style={styles.emptyTitle}>Select Two Occupations to Compare</div>
            <div style={styles.emptySubtitle}>select exactly two occupations · set province · compare</div>
          </div>

        ) : (

          /* Results */
          <div style={styles.resultStack}>

            {/* Heading */}
            <div>
              <div style={styles.sectionTag}>Comparison Analysis</div>
              <h2 style={styles.resultTitle}>
                {compared.occs[0]}
                <span style={styles.vsLabel}> vs </span>
                {compared.occs[1]}
              </h2>
              <div style={styles.resultSubtitle}>
                {compared.province} · {compared.yearRange[0]}–{compared.yearRange[1]}
              </div>
            </div>

            {/* Stat cards */}
            <div style={styles.statGrid}>
              {compared.occs.map((occ, i) => {
                const s = buildSeries(occ, compared.province, "All", compared.yearRange[0], compared.yearRange[1]);
                const first = s[0]?.workers || 0;
                const last  = s[s.length - 1]?.workers || 0;
                const delta = first ? Math.round(((last - first) / first) * 100) : 0;
                return (
                  <div key={occ} style={{ ...styles.statCard, borderColor: CHART_COLORS[i] + "55" }}>
                    <div style={{ ...styles.statOccLabel, color: CHART_COLORS[i] }}>
                      {occ.toUpperCase()}
                    </div>
                    <div style={styles.statValue}>{last.toLocaleString()}k</div>
                    <div style={{ ...styles.statDelta, color: delta >= 0 ? "#50e3a4" : "#ff6b6b" }}>
                      {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% over period
                    </div>
                  </div>
                );
              })}
            </div>
            

            {/* Dual line chart */}
            <div style={styles.card}>
              <div style={styles.cardLabel}>SIDE-BY-SIDE TREND COMPARISON</div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2035" />
                  <XAxis dataKey="year" stroke="#4a4f6a" tick={styles.chartTick} />
                  <YAxis stroke="#4a4f6a" tick={styles.chartTick}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip contentStyle={styles.tooltipBox} />
                  <Legend wrapperStyle={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12 }} />
                  {compared.occs.map((occ, i) => (
                    <Line
                      key={occ}
                      type="monotone"
                      dataKey={occ}
                      stroke={CHART_COLORS[i]}
                      strokeWidth={2}
                      dot={{ r: 3, fill: CHART_COLORS[i] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>



            {/* ML similarity score */}
            <div style={styles.card}>
            {/*ML INSIGHT - COSINE SIMILARITY SCORE */}
              <div style={styles.cardLabel}>COSINE SIMILARITY SCORE</div>
              <div style={styles.simRow}>

                {/* Score gauge */}
                <div style={styles.simScoreWrap}>
                  <div style={{ ...styles.simScore, color: simLabel.color }}>
                    {similarity}%
                  </div>
                  <div style={{ ...styles.simScoreLabel, color: simLabel.color }}>
                    {simLabel.label}
                  </div>
                </div>

                {/* Bar */}
                <div style={styles.simBarWrap}>
                  <div style={styles.simBarTrack}>
                    <div style={{
                      ...styles.simBarFill,
                      width:      `${similarity}%`,
                      background: simLabel.color,
                    }} />
                  </div>
                  <div style={styles.simBarLabels}>
                    <span>0% Divergent</span>
                    <span>100% Identical</span>
                  </div>

                  
                </div>

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

  // Page
  page: {
    display:   "flex",
    minHeight: "100vh",
    overflow:  "hidden",
    

  },

  // Sidebar
  sidePanel: {
    width:         280,
    minWidth:      280,
    background:    "#FAF3E1",
    borderRight:   "1px solid #1e2035",
    padding:       "1.5rem 1.25rem",
    display:       "flex",
    flexDirection: "column",
    gap:           "1.25rem",
    overflowY:     "auto",
  },
  sideFooter: {
    display: "flex",
    gap:     8,
  },
  selectedCount: {
    fontSize:   "0.75rem",
    color:      "#2e3050",
    fontFamily: "'DM Mono',monospace",
    textAlign:  "center",
    marginTop:  "auto",
  },

  // Filter label
  filterLabel: {
    fontSize:      "0.7rem",

    letterSpacing: ".1em",
    textTransform: "uppercase",
    fontFamily:    "'DM Mono',monospace",
    marginBottom:  6,
  },

  // Occupation list
  occListBox: {
    background:   "#F5E7C6",
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
    background:   "#F5E7C6",
    border:       "1px solid #1e2035",
    borderRadius: 8,

    fontFamily:   "'DM Sans',sans-serif",
    fontSize:     "0.85rem",
    cursor:       "pointer",
    outline:      "none",
  },

  // Year range
  yearEndLabel: {
    fontSize:   "0.65rem",
    color:      "#2e3050",
    fontFamily: "'DM Mono',monospace",
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
    marginBottom: 70,
  },

  // Main panel
  mainPanel: {
    flex:       1,
    padding:    "2rem",
    overflowY:  "auto",
    background: "#FAF3E1",
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
    fontSize:   "0.8rem",
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
    color:      "",
    fontSize:   "1.6rem",
    margin:     "4px 0 0",
  },
  vsLabel: {
    color: "#2e3050",
  },
  resultSubtitle: {
    fontSize:   "0.8rem",
    color:      "#4a4f6a",
    fontFamily: "'DM Mono',monospace",
  },

  // Stat cards
  statGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 "1rem",
  },
  statCard: {
    background:   "#F5E7C6",
    border:       "1px solid",
    borderRadius: 12,
    padding:      "1.25rem",
  },
  statOccLabel: {
    fontSize:      "0.65rem",
    letterSpacing: ".1em",
    fontFamily:    "'DM Mono',monospace",
    marginBottom:  6,
  },
  statValue: {
    fontSize:   "2rem",
    fontFamily: "'Playfair Display',serif",
    color:      "#e8c97a",
  },
  statDelta: {
    fontSize:   "0.75rem",
    fontFamily: "'DM Mono',monospace",
    marginTop:  4,
  },

  // Generic card
  card: {
    background:   "#F5E7C6",
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

  // Similarity score
  simRow: {
    display:    "flex",
    gap:        "2rem",
    alignItems: "flex-start",
  },
  simScoreWrap: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    minWidth:       100,
  },
  simScore: {
    fontSize:   "3rem",
    fontFamily: "'Playfair Display',serif",
    fontWeight: 700,
    lineHeight: 1,
  },
  simScoreLabel: {
    fontSize:   "0.65rem",
    fontFamily: "'DM Mono',monospace",
    marginTop:  6,
    textAlign:  "center",
    letterSpacing: ".05em",
  },
  simBarWrap: {
    flex:          1,
    display:       "flex",
    flexDirection: "column",
    gap:           8,
  },
  simBarTrack: {
    height:       10,
    background:   "#12131f",
    borderRadius: 5,
    overflow:     "hidden",
  },
  simBarFill: {
    height:       "100%",
    borderRadius: 5,
    transition:   "width .6s ease",
  },
  simBarLabels: {
    display:        "flex",
    justifyContent: "space-between",
    fontSize:       "0.62rem",
    color:          "#2e3050",
    fontFamily:     "'DM Mono',monospace",
  },
  simText: {
    fontSize:   "0.85rem",
    color:      "#8a8fa8",
    fontFamily: "'DM Sans',sans-serif",
    lineHeight: 1.6,
    marginTop:  4,
  },

};