import { color } from 'd3';
import { useState, useRef} from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

//this is to download the chart
import html2canvas from 'html2canvas';

//this data.json file contains the parsed data from stats canada's raw data, organized by occupation, province, and employment type, with yearly worker counts for each combination. 
import rawData from "../../../Data/backend/data.json";

//Storing occupations in a constant array 
console.log("JSON keys:", Object.keys(rawData));



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


function buildSeries(occupation, province, yearStart, yearEnd) {

  const series = rawData[occupation]?.[province]?.["Employment"] ?? [];

  return series.filter(d => d.year >= yearStart && d.year <= yearEnd);

}



function linearRegression(data) {

	//count all years, which would be 38 years in total, store this in n
	const n = data.length;
  

	// calculate the average year and average workers
	let sumX = 0;
	let sumY = 0;
  
	//loop through the data to get the sum of years and sum of workers, which will be used to calculate the average year and average workers
	data.forEach(d => {

	  sumX += d.year;
	  sumY += d.workers;

	});
  
	//calculate the average year and average workers by dividing the sum of years and sum of workers by n
	const meanX = sumX / n;

	const meanY = sumY / n;
  

	// calculate slope and intercept of the best fit line
	let numerator = 0;
	let denominator = 0;


	//this part calculates the slope
	//loops through every year
	data.forEach(d => {
		
		//takes the specfic year (d.year) and subtracts it with the average year (meanX), 
		// then multiply it with the worker count of that year (d.workers) subtracting with the average worker count (meanY), 
		// and add this value to the numerator
	  	numerator += (d.year - meanX) * (d.workers - meanY);

		//takes the specfic year (d.year) and subtracts it with the average year (meanX), 
		// then square this value, and add it to the denominator
	  	denominator += (d.year - meanX) * (d.year - meanX);

	});
	
	//numerator is the covariance of year and worker count, denominator is the variance of year
	//calculate the slope by dividing the numerator with the denominator
	const slope = numerator / denominator;

	//calculate the intercept using the formula: intercept = meanY - slope * meanX
	const intercept = meanY - slope * meanX;
  
	// return a function that predicts workers for any given year
	return (year) => slope * year + intercept;
  
}




export default function Prediction() {

    const [occupation, setOccupation] = useState(OCCUPATIONS[0]);
    const [province, setProvince]     = useState("Canada");
    const [applied, setApplied]       = useState(null);

    const apply = () => {
        setApplied({ occupation, province });
    };

    const reset = () => {

        setApplied(null);
        setOccupation(OCCUPATIONS[0]);
        setProvince("Canada");

    };

    

    // get historical data for the chart
    let historicalData = [];

    if (applied !== null) {

        historicalData = buildSeries(applied.occupation, applied.province, 1987, 2025);
    }

    // always train on full 1987-2025 dataset
    let predict = null;
    if (applied !== null) {

        predict = linearRegression(historicalData);

    }


    // calculate R² score
    let rSquared = null;
    if (applied !== null) {

        let workerSum = 0;
        historicalData.forEach(d => { workerSum += d.workers; });
        const meanY = workerSum / historicalData.length;

        let ssTot = 0;
        let ssRes = 0;

        historicalData.forEach(d => {
        ssTot += (d.workers - meanY) ** 2;
        ssRes += (d.workers - predict(d.year)) ** 2;
        });

        rSquared = +(1 - ssRes / ssTot).toFixed(2);

    }


    // generate prediction points 2026-2035
    const predictionData = [];
    if (applied !== null) {

        for (let y = 2026; y <= 2035; y++) {

            predictionData.push({
                year: y,
                predicted: Math.round(predict(y) * 10) / 10
            });

        }

    }


        
    // calculate slope for annual growth rate
    let annualGrowth = null;
    let trendLabel = null;

    if (applied !== null) {

        const n = historicalData.length;
        let sumX = 0;
        let sumY = 0;

        historicalData.forEach(d => {

            sumX += d.year;
            sumY += d.workers;

        });

        const meanX = sumX / n;
        const meanY = sumY / n;

        let numerator = 0;
        let denominator = 0;

        historicalData.forEach(d => {

            numerator += (d.year - meanX) * (d.workers - meanY);
            denominator += (d.year - meanX) * (d.year - meanX);

        }); 

    }



    return (
        <div style={styles.page}>

        {/* Top header */}
        <div style={styles.header}>

            <div>
          
                <h1 style={styles.headerTitle}>Occupation Trend Predictor</h1>
                <p style={styles.headerSub}>
                    Select an occupation and province to generate an employment forecast from 2026 to 2035.
                </p>

            </div>

        </div>



        {/* Filter bar */}
        <div style={styles.filterBar}>

            <div style={styles.filterGroup}>

                <label style={styles.filterLabel}>Occupation</label>
                <select
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    style={styles.select}
                >
                    {OCCUPATIONS.map(o => <option key={o}>{o}</option>)}
                </select>

            </div>


            <div style={styles.filterGroup}>

                <label style={styles.filterLabel}>Province</label>
                <select

                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    style={styles.select}
                >
                    
                    {PROVINCES.map(p => <option key={p}>{p}</option>)}

                </select>

            </div>

            <div style={styles.filterActions}>

                <button onClick={reset} style={styles.resetBtn}>Reset</button>
                <button onClick={apply} style={styles.applyBtn}>Generate Forecast</button>

            </div>

        </div>


        {/* Main content */}
        <div style={styles.content}>

            {/* Empty state */}
            {applied === null && (

                <div style={styles.emptyState}>
            
                    <div style={styles.emptyTitle}>Select an Occupation & Province</div>

                    <div style={styles.emptySubtitle}>
                        The model will train on 1987–2025 data and forecast employment through 2035
                    </div>

                </div>

            )}


            {/* Results */}
            {applied !== null && (

            <div style={styles.results}>

                {/* Occupation title */}
                <div style={styles.resultHeader}>
                
                    <h2 style={styles.resultTitle}>{applied.occupation}</h2>
                    <div style={styles.resultSub}>{applied.province} / Trained on 1987–2025 Employment data</div>

                </div>

                {/* Stat strip */}
                <div style={styles.statStrip}>

                <div style={styles.stat}>

                    <div style={styles.statLabel}>Predicted 2030</div>

                    <div style={styles.statValue}>
                        {predict ? Math.round(predict(2030) * 10) / 10 + "k" : "—"}
                    </div>

                </div>

                <div style={styles.statDivider} />

                <div style={styles.stat}>

                    <div style={styles.statLabel}>Predicted 2035</div>

                    <div style={styles.statValue}>
                        {predict ? Math.round(predict(2035) * 10) / 10 + "k" : "—"}
                    </div>

                </div>

                <div style={styles.statDivider} />


                <div style={styles.statDivider} />

             

                <div style={styles.statDivider} />


                <div style={styles.stat}>

                    <div style={styles.statLabel}>MODEL FIT (R²)</div>

                    <div style={styles.statValue}>{rSquared}</div>

                    <div style={styles.statSub}>

                        {rSquared >= 0.8 && "Strong fit"}
                        {rSquared >= 0.5 && rSquared < 0.8 && "Moderate fit"}
                        {rSquared < 0.5 && "Weak fit"}

                    </div>

                </div>



                </div>

                {/* Prediction chart */}
                <div style={styles.chartCard}>

                <div style={styles.chartHeader}>
                    <div style={styles.chartTitle}>Employment Forecast 2026–2035</div>
                    <div style={styles.chartSub}>
                    Trained on full 1987–2025 dataset
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={280}>

                    <LineChart data={predictionData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                    <XAxis
                        dataKey="year"
                        stroke="#a08050"
                        tick={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fill: "#a08050" }}
                        label={{ value: "Year", position: "insideBottom", offset: -10, fill: "#a08050", fontSize: 11 }}
                    />
                    <YAxis
                        stroke="#a08050"
                        tick={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fill: "#a08050" }}
                        tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                        label={{ value: "Workers (Thousands)", angle: -90, position: "insideLeft", fill: "#a08050", fontSize: 11, offset: 10 }}
                    />
                    <Tooltip contentStyle={styles.tooltipBox} />
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#7eb8f7"
                        strokeWidth={2.5}
                        strokeDasharray="6 4"
                        dot={{ fill: "#7eb8f7", r: 4 }}
                    />
                    </LineChart>

                </ResponsiveContainer>

                </div>

                {/* Historical chart */}
                <div style={styles.chartCard}>

                <div style={styles.chartHeader}>

                    <div style={styles.chartTitle}>Historical Employment 1987–2025</div>
                    <div style={styles.chartSub}>Actual Statistics Canada data used to train the model</div>

                </div>

                <ResponsiveContainer width="100%" height={280}>

                    <AreaChart data={historicalData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                    <defs>
                        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                    <XAxis
                        dataKey="year"
                        stroke="#a08050"
                        tick={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fill: "#a08050" }}
                        label={{ value: "Year", position: "insideBottom", offset: -10, fill: "#a08050", fontSize: 11 }}
                    />
                    <YAxis
                        stroke="#a08050"
                        tick={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fill: "#a08050" }}
                        tickFormatter={v => (v * 1000).toLocaleString()}
                        label={{ value: "Workers", angle: -90, position: "insideLeft", fill: "#a08050", fontSize: 11, offset: 10 }}
                    />
                    <Tooltip
                        contentStyle={styles.tooltipBox}
                        formatter={v => [(v * 1000).toLocaleString(), "workers"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="workers"
                        stroke="#c9a84c"
                        strokeWidth={2}
                        fill="url(#goldGrad)"
                        dot={{ fill: "#c9a84c", r: 3 }}
                    />
                    </AreaChart>
                </ResponsiveContainer>

                </div>

                

                {/* Model explanation */}
                <div style={styles.mlCard}>

                    <div style={styles.mlTag}>HOW THIS WORKS</div>

                    <p style={styles.mlText}>
                        This forecast uses <strong>linear regression</strong> — a supervised machine learning algorithm.
                        The model learns the relationship between year and employment count from 38 years of
                        Statistics Canada data, then extends that trend forward to 2035.
                        An R² score of <strong>{rSquared}</strong> indicates a{" "}
                        {rSquared >= 0.8 ? "strong" : rSquared >= 0.5 ? "moderate" : "weak"} fit,
                        meaning the historical trend {rSquared >= 0.8 ? "follows a fairly consistent direction" : "has significant variation that limits prediction accuracy"}.
                    </p>

                </div>

            </div>
            )}

        </div>

        </div>
    );

}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#FAF3E1",
    display: "flex",
    flexDirection: "column",
  },

  // top header band
  header: {
    background: "#F5E7C6",
    padding: "2rem 3rem",
    borderBottom: "1px solid rgba(201,168,76,0.2)",
  },
  headerTag: {
    fontSize: "0.6rem", color: "#c9a84c", letterSpacing: ".25em",
    fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 8,
  },
  headerTitle: {
    fontFamily: "'Playfair Display',serif", color: "",
    fontSize: "2rem", margin: "0 0 8px 0",
  },
  headerSub: {
    fontSize: "0.85rem", color: "#8a7a5a",
    fontFamily: "'DM Sans',sans-serif", margin: 0,
  },

  // filter bar
  filterBar: {
    display: "flex", alignItems: "flex-end", gap: "1rem",
    padding: "1.5rem 3rem",
    background: "#f0e6cc",
    borderBottom: "1px solid rgba(201,168,76,0.2)",
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 200,
  },
  filterLabel: {
    fontSize: "0.6rem", color: "#a08050", letterSpacing: ".15em",
    textTransform: "uppercase", fontFamily: "'DM Mono',monospace",
  },
  select: {
    padding: "10px 14px",
    background: "#FAF3E1", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6,
    color: "#1a1208", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
    cursor: "pointer", outline: "none",
  },
  filterActions: {
    display: "flex", gap: 8, alignItems: "flex-end",
  },
  resetBtn: {
    padding: "10px 20px", borderRadius: 6, cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
    fontWeight: 600, background: "transparent",
    border: "1px solid rgba(201,168,76,0.3)", color: "#a08050",
  },
  applyBtn: {
    padding: "10px 24px", borderRadius: 6, cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
    fontWeight: 600, background: "#1a1208",
    border: "none", color: "#c9a84c", letterSpacing: ".03em",
  },

  // main content area
  content: {
    flex: 1, padding: "2.5rem 3rem",
  },

  // empty state
  emptyState: {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: "60vh", flexDirection: "column", gap: 16,
  },
  emptyIcon: {
    fontSize: "3rem", color: "rgba(201,168,76,0.3)",
  },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: "#a08050",
  },
  emptySubtitle: {
    fontSize: "0.85rem", color: "#c9a07a",
    fontFamily: "'DM Mono',monospace", letterSpacing: ".05em", textAlign: "center",
    maxWidth: 400,
  },

  // results
  results: { display: "flex", flexDirection: "column", gap: "2rem" },

  resultHeader: { borderLeft: "3px solid #c9a84c", paddingLeft: "1rem" },
  resultTag: {
    fontSize: "0.6rem", color: "#c9a84c", letterSpacing: ".2em",
    fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 6,
  },
  resultTitle: {
    fontFamily: "'Playfair Display',serif", color: "#1a1208",
    fontSize: "1.6rem", margin: "0 0 6px 0",
  },
  resultSub: {
    fontSize: "0.75rem", color: "#a08050", fontFamily: "'DM Mono',monospace",
  },

  // horizontal stat strip
  statStrip: {
    display: "flex", alignItems: "center",
    background: "#F5E7C6", borderRadius: 10,
    padding: "1.5rem 2rem", gap: 0,
  },
  stat: { flex: 1, padding: "0 1.5rem" },
  statDivider: {
    width: 1, height: 40, background: "rgba(201,168,76,0.2)", flexShrink: 0,
  },
  statLabel: {
    fontSize: "0.55rem", color: "", letterSpacing: ".15em",
    fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 6,
  },
  statValue: {
    fontSize: "1.3rem", fontFamily: "'Playfair Display',serif",
    color: "", fontWeight: 700,
  },
  statSub: {
    fontSize: "0.65rem", color: "#8a7a5a",
    fontFamily: "'DM Mono',monospace", marginTop: 2,
  },

  // charts
  chartCard: {
    background: "#F5E7C6",
    borderLeft: "3px solid #c9a84c",
    padding: "1.5rem 2rem",
  },
  chartHeader: { marginBottom: "1.5rem" },
  chartTitle: {
    fontSize: "0.9rem", fontFamily: "'DM Mono',monospace",
    color: "#1a1208", letterSpacing: ".05em", marginBottom: 4,
  },
  chartSub: {
    fontSize: "0.72rem", color: "#a08050", fontFamily: "'DM Mono',monospace",
  },

  tooltipBox: {
    background: "#1a1208", border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 6, fontFamily: "'DM Sans',sans-serif", color: "#c9a84c",
  },

  // ml explanation card
  mlCard: {
    background: "#f0e6cc",
    borderTop: "1px solid rgba(201,168,76,0.2)",
    padding: "1.5rem 2rem",
    borderRadius: 6,
  },
  mlTag: {
    fontSize: "0.6rem", color: "#c9a84c", letterSpacing: ".2em",
    fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 10,
  },
  mlText: {
    fontSize: "0.88rem", color: "#4a3f2a",
    fontFamily: "'DM Sans',sans-serif", lineHeight: 1.8, margin: 0,
  },

};