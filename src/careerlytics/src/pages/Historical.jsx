import { useState } from "react";

// ─── DATA ─────────────────────────────────────────────────────────

const OCCUPATIONS = [
  "Management Occupations",
  "Business, Finance and Administration Occupations",
  "Natural and Applied Sciences and Related Occupations",
  "Health Occupations, except management",
  "Occupations in Education, Law and Social, Community and Government Services",
  "Occupations in Art, Culture, Recreation and Sport",
  "Sales and Service Occupations",
  "Trades, Transport and Equipment Operators and Related Occupations",
  "Natural Resources, Agriculture and Related Production Occupations",
  "Occupations in Manufacturing and Utilities",
  "Unclassified Occupations",
];

const PROVINCE_MOCK_DATA = {
  "Newfoundland and Labrador": { base: 18, mult: 0.6 },
  "Prince Edward Island": { base: 4, mult: 0.3 },
  "Nova Scotia": { base: 28, mult: 0.8 },
  "New Brunswick": { base: 24, mult: 0.7 },
  Quebec: { base: 310, mult: 1.4 },
  Ontario: { base: 520, mult: 1.8 },
  Manitoba: { base: 48, mult: 0.9 },
  Saskatchewan: { base: 42, mult: 0.85 },
  Alberta: { base: 95, mult: 1.2 },
  "British Columbia": { base: 180, mult: 1.5 },
};

// ─── DATA HELPERS ─────────────────────────────────────────────────

function getProvinceWorkers(occ, year) {
  const yearFactor = (year - 1987) / 38;

  return Object.entries(PROVINCE_MOCK_DATA).map(([province, { base, mult }]) => {
    const occHash = occ.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 50;

    const workers = Math.round(
      (base + occHash * mult * 0.3) * (0.7 + yearFactor * 0.6) * mult
    );

    return { province, workers };
  });
}

function lerpColor(a, b, t) {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");

  const ar = parseInt(ah.slice(0, 2), 16);
  const ag = parseInt(ah.slice(2, 4), 16);
  const ab = parseInt(ah.slice(4, 6), 16);

  const br = parseInt(bh.slice(0, 2), 16);
  const bg = parseInt(bh.slice(2, 4), 16);
  const bb = parseInt(bh.slice(4, 6), 16);

  const r = Math.round(ar + (br - ar) * t)
    .toString(16)
    .padStart(2, "0");

  const g = Math.round(ag + (bg - ag) * t)
    .toString(16)
    .padStart(2, "0");

  const b2 = Math.round(ab + (bb - ab) * t)
    .toString(16)
    .padStart(2, "0");

  return `#${r}${g}${b2}`;
}

function workerColor(value, min, max) {
  if (max === min) return "#c9a84c";

  const t = (value - min) / (max - min);

  if (t < 0.5) return lerpColor("#1a1030", "#c9a84c", t * 2);

  return lerpColor("#c9a84c", "#ffe899", (t - 0.5) * 2);
}

// ─── HELPER ──────────────────────────────────────────────────────

function FilterLabel({ children }) {
  return <div style={styles.filterLabel}>{children}</div>;
}

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function Historical() {
  const [mapOcc, setMapOcc] = useState(OCCUPATIONS[0]);
  const [mapYear, setMapYear] = useState(2010);

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        {/* Heading */}
        <div style={styles.heading}>
          <div style={styles.sectionTag}>GEOGRAPHIC DISTRIBUTION</div>
          <h2 style={styles.title}>Workers by Province</h2>
        </div>

        {/* Controls */}
        <div style={styles.mapControls}>
          <div>
            <FilterLabel>Occupation</FilterLabel>

            <select
              value={mapOcc}
              onChange={(e) => setMapOcc(e.target.value)}
              style={styles.select}
            >
              {OCCUPATIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <FilterLabel>Year: {mapYear}</FilterLabel>

            <input
              type="range"
              min={1987}
              max={2025}
              value={mapYear}
              onChange={(e) => setMapYear(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#c9a84c",
                cursor: "pointer",
              }}
            />

            <div style={styles.sliderLabels}>
              <span>1987</span>
              <span>2006</span>
              <span>2025</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>
            {mapOcc.toUpperCase()} — {mapYear}
          </div>

          {(() => {
            const data = getProvinceWorkers(mapOcc, mapYear)
              .sort((a, b) => b.workers - a.workers)
              .map((d) => ({
                ...d,
                province: d.province
                  .replace("Newfoundland and Labrador", "NL")
                  .replace("British Columbia", "BC")
                  .replace("Prince Edward Island", "PEI")
                  .replace("New Brunswick", "NB")
                  .replace("Nova Scotia", "NS")
                  .replace("Saskatchewan", "SK"),
              }));

            const max = data[0]?.workers || 1;

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.map((d, i) => (
                  <div key={d.province} style={styles.barRow}>
                    <div style={styles.barRank}>#{i + 1}</div>

                    <div style={styles.barLabel}>{d.province}</div>

                    <div style={styles.barTrack}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${(d.workers / max) * 100}%`,
                          background: workerColor(
                            d.workers,
                            data[data.length - 1].workers,
                            max
                          ),
                        }}
                      />
                    </div>

                    <div style={styles.barValue}>
                      {d.workers.toLocaleString()}k
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#080810",
  },

  content: {
    flex: 1,
    padding: "2rem",
  },

  heading: {
    marginBottom: "1.5rem",
  },

  sectionTag: {
    fontSize: "0.72rem",
    color: "#4a4f6a",
    fontFamily: "'DM Mono',monospace",
    letterSpacing: ".1em",
  },

  title: {
    fontFamily: "'Playfair Display',serif",
    color: "#e8c97a",
    fontSize: "1.6rem",
    margin: "4px 0 0",
  },

  filterLabel: {
    fontSize: "0.7rem",
    color: "#4a4f6a",
    letterSpacing: ".1em",
    textTransform: "uppercase",
    fontFamily: "'DM Mono',monospace",
    marginBottom: 6,
  },

  mapControls: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },

  select: {
    padding: "8px 12px",
    background: "#0a0a0f",
    border: "1px solid #1e2035",
    borderRadius: 8,
    color: "#c4c8e0",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.85rem",
    cursor: "pointer",
    minWidth: 220,
  },

  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.65rem",
    color: "#2e3050",
    fontFamily: "'DM Mono',monospace",
    marginTop: 4,
  },

  card: {
    background: "#0d0e1a",
    border: "1px solid #1e2035",
    borderRadius: 12,
    padding: "1.5rem",
  },

  cardLabel: {
    fontSize: "0.7rem",
    color: "#4a4f6a",
    letterSpacing: ".1em",
    fontFamily: "'DM Mono',monospace",
    marginBottom: "1rem",
  },

  barRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  barRank: {
    width: 40,
    fontSize: "0.68rem",
    color: "#4a4f6a",
    fontFamily: "'DM Mono',monospace",
    textAlign: "right",
  },

  barLabel: {
    width: 60,
    fontSize: "0.72rem",
    color: "#8a8fa8",
    fontFamily: "'DM Mono',monospace",
  },

  barTrack: {
    flex: 1,
    height: 22,
    background: "#12131f",
    borderRadius: 4,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width .4s ease",
  },

  barValue: {
    width: 55,
    fontSize: "0.7rem",
    color: "#c9a84c",
    fontFamily: "'DM Mono',monospace",
    textAlign: "right",
  },
};