import { useState } from "react";

//This imports componenets from the React-Leaflet library
//React-Leaflet is whats lets us use Leaflet maps inside React
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

//Map container is the actual interactive map
//GeoJSON draws geographic shapes aka the provinces from GeoJSON data, which is a common format for geographic data. It contains the shapes and boundaries of the provinces, which we can style and add interactivity to.


//this data.json file contains the parsed data from stats canada's raw data, organized by occupation, province, and employment type, with yearly worker counts for each combination. 
import rawData from "../../../Data/backend/data.json";

//this is the GeoJSON map data for Canada
//GeoJSON describes the polygon shapes of provinces
import canadaGeoJSON from "../../../Data/backend/canada.json";


//https://github.com/codeforgermany/click_that_hood/tree/main/public/data

// ─── DATA ─────────────────────────────────────────────────────────


export const OCCUPATIONS = [

        
    "Legislative and senior management occupations",
    "Specialized middle management occupations",
    "Middle management occupations in retail and wholesale trade and customer services",
    "Middle management occupations in trades, transportation, production and utilities",
    "Professional occupations in finance",
    "Professional occupations in business",
    "Administrative and financial supervisors and specialized administrative occupations",
    "Administrative occupations and transportation logistics occupations",
    "Administrative and financial support and supply chain logistics occupations",
    "Professional occupations in natural sciences",
    "Professional occupations in applied sciences (except engineering)",
    "Professional occupations in engineering",
    "Technical occupations related to natural and applied sciences",
    "Health treating and consultation services professionals",
    "Therapy and assessment professionals",
    "Nursing and allied health professionals",
    "Technical occupations in health",
    "Assisting occupations in support of health services",
    "Professional occupations in law",
    "Professional occupations in education services",
    "Professional occupations in social and community services",
    "Professional occupations in government services",
    "Occupations in front-line public protection services",
    "Paraprofessional occupations in legal, social, community and education services",
    "Assisting occupations in education and in legal and public protection",
    "Care providers and public protection support occupations and student monitors, crossing guards and related occupations",
    "Professional occupations in art and culture",
    "Technical occupations in art, culture and sport",
    "Occupations in art, culture and sport",
    "Support occupations in art, culture and sport",
    "Retail sales and service supervisors and specialized occupations in sales and services",
    "Occupations in sales and services",
    "Sales and service representatives and other customer and personal services occupations",
    "Sales and service support occupations",
    "Technical trades and transportation officers and controllers",
    "General trades",
    "Mail and message distribution, other transport equipment operators and related maintenance workers",
    "Helpers and labourers and other transport drivers, operators and labourers",
    "Supervisors and occupations in natural resources, agriculture and related production",
    "Workers and labourers in natural resources, agriculture and related production",
    "Supervisors, central control and process operators in processing, manufacturing and utilities and aircraft assemblers and inspectors",
    "Machine operators, assemblers and inspectors in processing, manufacturing and printing",
    "Labourers in processing, manufacturing and utilities",
    "Unclassified occupations",

];

/*

const PROVINCE_MOCK_DATA = {
  "Newfoundland and Labrador": { base: 18, mult: 0.6 },
  "Prince Edward Island":      { base: 4,  mult: 0.3 },
  "Nova Scotia":               { base: 28, mult: 0.8 },
  "New Brunswick":             { base: 24, mult: 0.7 },
  Quebec:                      { base: 310, mult: 1.4 },
  Ontario:                     { base: 520, mult: 1.8 },
  Manitoba:                    { base: 48, mult: 0.9 },
  Saskatchewan:                { base: 42, mult: 0.85 },
  Alberta:                     { base: 95, mult: 1.2 },
  "British Columbia":          { base: 180, mult: 1.5 },
};

*/

const PROVINCES = [

  "All", "Ontario", "Quebec", "British Columbia", "Alberta",
  "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick",
  "Newfoundland and Labrador", "Prince Edward Island",

];

// ─── DATA HELPERS ─────────────────────────────────────────────────

//Takes an occupation and year, and returns worker counts for every province
//getProvinceWorkers("Professional occupations in finance", 2010)
function getProvinceWorkers(occ, year) {


    const provinces = [
        "Newfoundland and Labrador",
        "Prince Edward Island",
        "Nova Scotia",
        "New Brunswick",
        "Quebec",
        "Ontario",
        "Manitoba",
        "Saskatchewan",
        "Alberta",
        "British Columbia",
    ];

    return provinces.map((province) => {
        const series = rawData[occ]?.[province]?.["Employment"] ?? [];
        const match = series.find((d) => d.year === year);
        return { province, workers: match?.workers ?? 0 };
    });

}


//This function belnds two colours together
function lerpColor(a, b, t) {

    const ah = a.replace("#", "");
    const bh = b.replace("#", "");
    const ar = parseInt(ah.slice(0, 2), 16);
    const ag = parseInt(ah.slice(2, 4), 16);
    const ab = parseInt(ah.slice(4, 6), 16);
    const br = parseInt(bh.slice(0, 2), 16);
    const bg = parseInt(bh.slice(2, 4), 16);
    const bb = parseInt(bh.slice(4, 6), 16);
    const r  = Math.round(ar + (br - ar) * t).toString(16).padStart(2, "0");
    const g  = Math.round(ag + (bg - ag) * t).toString(16).padStart(2, "0");
    const b2 = Math.round(ab + (bb - ab) * t).toString(16).padStart(2, "0");
    return `#${r}${g}${b2}`;

}

//this maps worker numbers with colour intensity
function workerColor(value, min, max) {

    if (max === min) return "#c9a84c";
    const t = (value - min) / (max - min);
    if (t < 0.5) return lerpColor("#1a1030", "#c9a84c", t * 2);
    return lerpColor("#c9a84c", "#ffe899", (t - 0.5) * 2);

}


// ─── HELPERS ──────────────────────────────────────────────────────

//create a small label component for the filters
function FilterLabel({ children }) {
    
    return <div style={styles.filterLabel}>{children}</div>;

}

// ─── MAP COMPONENT ────────────────────────────────────────────────

//this is the function that renders the interactive map of Canada
//it gets passed the selecte occupation and year, and uses that to get the worker counts for each province, which it then uses to style the map and tooltips
function ProvinceMap({ occ, year }) {

    //get the worker counts for each province for the selected occupation and year
    const data = getProvinceWorkers(occ, year);

    //find max and min workers for the provinces
    const max  = Math.max(...data.map((d) => d.workers));
    const min  = Math.min(...data.map((d) => d.workers));


    //Leaflet calls this function for each province polygon
    const style = (feature) => {

        //get province name from the GeoJSON properties, and find the matching worker data for that province
        const name  = feature.properties.name || feature.properties.NAME || "";

        //find the worker data for that province
        const match = data.find((d) => d.province === name);


        return {

            fillColor:   match ? workerColor(match.workers, min, max) : "#1e2035",
            fillOpacity: 0.85,
            color:       "#080810",
            weight:      1,

        };

    };

    //runs for every province shape
    const onEachFeature = (feature, layer) => {



        const name  = feature.properties.name || feature.properties.NAME || "";
        const match = data.find((d) => d.province === name);

        if (!match) return;

        //mouse events, for when hovering over a province to show tooltip with worker data
        layer.on({

            mouseover(e) {
                e.target.setStyle({ fillOpacity: 0.6 });
                layer
                .bindTooltip(
                    `<span style="font-family:'DM Mono',monospace;font-size:0.75rem;color:#e8c97a">
                    <strong>${match.province}</strong><br/>
                    ${match.workers.toLocaleString()}k workers
                    </span>`,
                    { className: "map-tooltip", sticky: true }
                )
                .openTooltip();
            },

            mouseout(e) {
                e.target.setStyle({ fillOpacity: 0.85 });
                layer.closeTooltip();
            },

        });

    };


    return (

        <>
        {/* Override Leaflet tooltip styles to match dark theme */}
        <style>{`
            .map-tooltip {
            background: #0d0e1a !important;
            border: 1px solid #c9a84c !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            box-shadow: none !important;
            }
            .map-tooltip::before { display: none !important; }
            .leaflet-container { background: #F5E7C6 !important; }
        `}</style>

        {/*This creates the Leaflet map*/}
        <MapContainer
            ///centers map on Canada
            center={[60, -96]}
            zoom={4}
            zoomSnap={0.5}
            minZoom={2}
            style={{ height: 520, borderRadius: 8, background: "#080810" }}
            attributionControl={false}
        >
            {/*This draws the province shapes on the map using the GeoJSON data, and applies the styles and interactivity defined above*/}
            <GeoJSON
                key={occ + year}
                data={canadaGeoJSON}
                style={style}
                onEachFeature={onEachFeature}
            />

        </MapContainer>

        {/* Legend */}
        <div style={styles.legend}>
            <span style={styles.legendLabel}>Low</span>
            <div style={styles.legendBar} />
            <span style={styles.legendLabel}>High</span>
        </div>
        </>
    );

}


const prov = "Ontario";
const occ = OCCUPATIONS[0];
console.log("Employment:", rawData[occ]?.[prov]?.["Employment"]);
console.log("Full-time:", rawData[occ]?.[prov]?.["Full-time employment"]);
console.log("Part-time:", rawData[occ]?.[prov]?.["Part-time employment"]);


// ─── MAIN PAGE ───────────────────────────────────────────────────

//main page compnent
export default function Historical() {

    //state varibales to keep track of the selected occupation, year, and active tab (chart or map)
    const [mapOcc,     setMapOcc]     = useState(OCCUPATIONS[0]);
    const [mapYear,    setMapYear]    = useState(2010);
    const [activeTab,  setActiveTab]  = useState("chart");

    return (

        <div style={styles.page}>
        <div style={styles.content}>

            {/* Heading */}
            <div style={styles.heading}>
            <div style={styles.sectionTag}>Provincial Employment Overview </div>
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
                style={{ width: "100%", accentColor: "#c9a84c", cursor: "pointer" }}
                />
                <div style={styles.sliderLabels}>
                <span>1987</span>
                <span>2006</span>
                <span>2025</span>
                </div>
            </div>
            </div>

            {/* Card */}
            <div style={styles.card}>

            {/* Card header + tabs */}
            <div style={styles.cardTop}>
                <div style={styles.cardLabel}>
                {mapOcc.toUpperCase()} — {mapYear}
                </div>
                <div style={styles.tabBar}>
                {["chart", "map"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                        ...styles.tabBtn,
                        color:        activeTab === tab ? "#e8c97a" : "#4a4f6a",
                        borderBottom: activeTab === tab ? "2px solid #c9a84c" : "2px solid transparent",
                    }}
                    >
                    {tab === "chart" ? "Bar Graph" : "Map View"}
                    </button>
                ))}
                </div>
            </div>

            {/* Bar chart tab */}
            {activeTab === "chart" && (() => {
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

            {/* Map tab */}
            {activeTab === "map" && (
                <ProvinceMap occ={mapOcc} year={mapYear} />
            )}

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
    background: "#FAF3E1",
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
    color: "",
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
    color: "",
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
    background: "#F5E7C6",
    border: "1px solid #1e2035",
    borderRadius: 8,
    color: "",
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
    background: "#F5E7C6",
    border: "1px solid #1e2035",
    borderRadius: 12,
    padding: "1.5rem",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
    borderBottom: "1px solid #1e2035",
    paddingBottom: "0.5rem",
  },

  cardLabel: {
    fontSize: "0.7rem",
    color: "#4a4f6a",
    letterSpacing: ".1em",
    fontFamily: "'DM Mono',monospace",
  },

  tabBar: {
    display: "flex",
    gap: 0,
  },

  tabBtn: {
    padding: "6px 16px",
    background: "transparent",
    border: "none",
    fontFamily: "'DM Mono',monospace",
    fontSize: "0.72rem",
    letterSpacing: ".08em",
    cursor: "pointer",
    transition: "color .15s, border-bottom .15s",
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

    fontFamily: "'DM Mono',monospace",
  },

  barTrack: {
    flex: 1,
    height: 22,
    
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

  legend: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: "1rem",
  },

  legendLabel: {
    fontSize: "0.65rem",
    color: "#4a4f6a",
    fontFamily: "'DM Mono',monospace",
  },

  legendBar: {
    height: 8,
    width: 160,
    borderRadius: 4,
    background: "linear-gradient(90deg, #1a1030, #c9a84c, #ffe899)",
  },
};