//This page is for our Find Occupation tab
//This controls evreything in our Find Occupation page, from the side filters to the change after sumbit is clicked, to showing the graphs

import { color } from 'd3';
import { useState, useRef} from 'react'
//import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  	"Select Province", "Ontario", "Quebec", "British Columbia", "Alberta",
  	"Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick",
  	"Newfoundland and Labrador", "Prince Edward Island",

];

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



// ── components ────--

function SidePanel({ children }) {

  	return <div style={styles.sidePanel}>{children}</div>;

}

function FilterLabel({ children }) {

  	return <div style={styles.filterLabel}>{children}</div>;

}

function OccupationList({ selected, onToggle, max = 1 }) {

	const [occSearch, setOccSearch] = useState("");

	const filteredOccupations = OCCUPATIONS.filter(o =>
		o.toLowerCase().includes(occSearch.toLowerCase())
	  );

  return (

    <div>
		

      <FilterLabel>Occupation — Select One</FilterLabel>

	  	<input
			type="text"
			placeholder="Search occupations..."
			value={occSearch}
			onClick={(e) => e.stopPropagation()}
			onChange={(e) => setOccSearch(e.target.value)}
			style={{
				width: "100%",
				padding: "6px 8px",
				marginBottom: "8px",
				borderRadius: 6,
				border: "1px solid #2e3050",
				fontSize: "0.8rem",
				backgroundColor: "#F5E7C6",
			}}
		/>

      <div style={styles.occListBox}>

	  {filteredOccupations.map(o => {

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
              <span style={{ ...styles.occLabel, color: isSelected ? "#222222" : "#000000" }}>
                {o}
              </span>
            </label>

          );

        })}

      </div>

    </div>

  ); //End of return

} //end of OccupationList function


//function for selecting province, with a dropdown menu and label
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


//function for selecting the employment type
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

//function to select tyear range, with a slider and labels
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


// ── Main ─────────────────────────────────────────────────────────────────────-----------------

export default function FindOccupation() {

	const [selected,  setSelected]  = useState([]);
	const [province,  setProvince]  = useState("");
	const [yearRange, setYearRange] = useState([1987, 2025]);
	const [empType,   setEmpType]   = useState("All");
	const [applied,   setApplied]   = useState(null);
	const [activeTab, setActiveTab] = useState("trend");

	const chartRef = useRef(null);

	const [chartType, setChartType] = useState("line");

	const [chartColor, setChartColor]       = useState("#c9a84c");  // default gold
const [lineType, setLineType]           = useState("monotone"); // smooth or sharp
const [showDots, setShowDots]           = useState(true);       // show data points
const [showGrid, setShowGrid]           = useState(true);       // show grid lines
const [showCustomize, setShowCustomize] = useState(false);      // show/hide the panel

	//function for donwlaoding the chart
	const downloadChart = () => {

		html2canvas(chartRef.current).then(canvas => {

			const link = document.createElement('a');
			link.download = `${applied.occ}-${applied.province}.png`;
			link.href = canvas.toDataURL();
			link.click();

		});

	};

  	const toggleOcc = o =>
    	setSelected(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

	  const [errors, setErrors] = useState({});

  	const apply = () => {

		const newErrors = {};

    	//if (selected.length) setApplied({ occ: selected[0], province, yearRange, empType });

		if (!selected.length) {
			newErrors.occ = "Please select an occupation";
		}

		if (!province || province === "Select Province") {
			newErrors.province = "Please select a province";
		  }


		  // If errors exist, show them and stop
			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return;
			}

			// Clear errors if valid
			setErrors({});

			setApplied({
				occ: selected[0],
				province,
				yearRange,
				empType
			});

			console.log("Province:", province);

  	};

	const reset = () => {
		setSelected([]); setApplied(null); setProvince("All");
		setYearRange([1987, 2025]); setEmpType("All");
		setActiveTab("trend");
	};

	const allSeries  = applied ? buildAllSeries(applied.province, applied.empType, applied.yearRange[0], applied.yearRange[1]) : {};
	const chartData  = applied ? allSeries[applied.occ] : [];
	const shareData  = applied ? buildShareData(allSeries, applied.yearRange[0], applied.yearRange[1]) : [];

	let peak = 0;
	let last = 0;
	let first = 0;

	let peakYear = "-";

	let lowYear = "-";

	let averageWorkers = 0;

	if (chartData.length) {

		const workerCounts = chartData.map(d => {
			if (d.workers == null) return 0;
			return d.workers;
		});
		peak = Math.max(...workerCounts);

		peakYear = chartData.find(d => d.workers === peak)?.year ?? "—";

		lowYear = chartData.find(d => d.workers === Math.min(...workerCounts))?.year ?? "—";

		last = workerCounts[workerCounts.length - 1];
		first = workerCounts[0];

		averageWorkers = Math.round(workerCounts.reduce((a, b) => a + b, 0) / workerCounts.length);


	}

	const delta = first ? Math.round(((last - first) / first) * 100) : 0;

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


	// always use full 1987-2025 data to train the model
	// regardless of what year range the user selected
	let fullSeriesData = [];

	if (applied !== null) {

		// get the full employment data for the selected occupation and province
		// we always use 1987-2025 so the model trains on as much data as possible
		fullSeriesData = buildSeries(applied.occ, applied.province, applied.empType, 1987, 2025);

	}

	// train the linear regression model on the full dataset
	// predict is a function that takes a year and returns a predicted worker count
	let predict = null;

	if (applied !== null) {

		//send the fullSeriesData as the parameter
		predict = linearRegression(fullSeriesData);

	}

	// calculate R² score to measure how well the regression line fits the historical data
	// R² of 1.0 = perfect fit (line passes through every point)
	// R² of 0.0 = no fit (data is too scattered for a straight line)
	let rSquared = null;

	if (applied !== null) {

		// step 1 — calculate the average worker count across all years
		let workerSum = 0;
		fullSeriesData.forEach(d => {

			workerSum += d.workers;

		});

		const meanY = workerSum / fullSeriesData.length;

		// step 2 — calculate total variance (how much workers vary from the average)
		let ssTot = 0;
		fullSeriesData.forEach(d => {

			ssTot += (d.workers - meanY) ** 2;

		});

		// step 3 — calculate residual variance (how far the predicted line is from real data)
		let ssRes = 0;
		fullSeriesData.forEach(d => {

			ssRes += (d.workers - predict(d.year)) ** 2;

		});

		// step 4 — R² = 1 minus the ratio of unexplained variance to total variance
		// the closer to 1, the better the line fits the data
		rSquared = +(1 - ssRes / ssTot).toFixed(2);

	}

	// generate prediction points from 2026 to 2035
	// each point is { year, predicted } which the chart will use
	const predictionData = [];

	if (applied !== null) {

		for (let y = 2026; y <= 2035; y++) {

			predictionData.push({
			year: y,
			// round to 1 decimal place for cleaner display
			predicted: Math.round(predict(y) * 10) / 10
			});

		}

	}

  return (

    <div style={styles.page}>
	    
		
		
      	<SidePanel>

        	<OccupationList selected={selected} onToggle={toggleOcc} max={1} />
			{errors.occ && (
				<div style={{ color: "#ff6b6b", fontSize: "0.75rem", marginTop: "4px" }}>
					{errors.occ}
				</div>
			)}

        	<ProvinceSelect value={province} onChange={setProvince} />
			{errors.province && (
				<div style={styles.errorText}>
					{errors.province}
				</div>
			)}
        	<EmploymentType value={empType} onChange={setEmpType} />
        	<YearRange value={yearRange} onChange={setYearRange} />

        	<div style={styles.sideFooter}>

          		<ActionBtn onClick={reset} variant="secondary">Reset</ActionBtn>
          		<ActionBtn onClick={apply}>Apply</ActionBtn>

        	</div>

      </SidePanel>

	  
      <div style={styles.mainPanel}>


		{/*First is to show the empty state, before submit is clicked */}
		{!applied && (

			<div style = {styles.emptyState}> 

				<div style = {styles.emptyTitle}> Select Filters to View Occupation Trends </div>


				<div style = {styles.emptySubtitle}> Choose an occupation, set province, apply </div>
			
			</div>

		)}


		{/*Then, we show the results, when filters are applied and submit is clicked*/}
		{applied && (

			<div style = {styles.resultGraph}> 

				{/*This div is for the subtitles */}
				<div>
              		<div style={styles.sectionTag}>
						
						Selected Occupation for Analysis
						
					</div>

              		<h2 style={styles.resultTitle}>{applied.occ}</h2>

              		<div style={styles.resultSubtitle}>

						{/*this shows the time range selected by the user, and province */}
                		Filters: {applied.province} / {applied.yearRange[0]} – {applied.yearRange[1]} / {applied.empType} 

              		</div>

            	</div>

				{/*This is for the three cards*/}
				<div style={styles.insightGrid}>
					

					<InsightCard label="Peak Employment Number" value={peak.toLocaleString() + "k"}
						
						tooltip="The highest worker count recorded for this occupation within the selected year range and province." 
						
					/>

					<InsightCard label="Final Count" value={last.toLocaleString() + "k"} delta={delta}

						tooltip="Total workers in this occupation at the end of the selected period. The % change shows growth or decline relative to the starting year." 
					
					/>

					<InsightCard label="Lowest Year" value={lowYear}

						tooltip="This occupation's share of the total provincial workforce at the end of the period. A falling share means this sector grew slower than the overall workforce — even if absolute numbers rose." 
						
					/>


					<InsightCard label="Peak Year" value={peakYear} 

					tooltip="This shows the year that had the most workers" 

					/>


					<InsightCard label="Average Employment" value={averageWorkers + "k"} 

					tooltip="Shows the average yearly worker count for the selected years" 

					/>

            	</div>

				{/*This is for the tabs to switch between the trend chart and the share chart */}
				<div style = {styles.tabBar}>

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

				<div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>

					{["line", "bar", "area"].map(type => (
						<button
						key={type}
						onClick={() => setChartType(type)}
						style={{
							padding: "4px 12px",
							borderRadius: 4,
							border: chartType === type ? "1px solid #c9a84c" : "1px solid #2e3050",
							background: chartType === type ? "rgba(201,168,76,0.15)" : "transparent",
							color: chartType === type ? "#c9a84c" : "#4a4f6a",
							fontFamily: "'DM Mono',monospace",
							fontSize: "0.65rem",
							letterSpacing: ".08em",
							cursor: "pointer",
							textTransform: "uppercase",
						}}
						>
						{type}
						</button>
					))}

				</div>




				{/*This is for the occupation trends chart over the specfic time*/}
				{activeTab === "trend" && (

					
						
              		<div style={styles.card} ref={chartRef}>
						
						{/*(<h2 style={styles.resultTitleGraph}>{applied.occ}</h2>)*/}
						<div style = {styles.cardLabel}> Workers Overtime ({applied.occ}) </div>

				


							{/* Bar chart */}
							{chartType === "bar" && (

								<ResponsiveContainer width="100%" height={260}>

								<BarChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1e2035" />
								<XAxis dataKey="year" stroke="#4a4f6a" tick={styles.chartTick}
									label={{ value: "Years", position: "insideBottom", offset: -5, fill: "#4a4f6a", fontSize: "15px" }} />
								<YAxis stroke="#4a4f6a" tick={styles.chartTick} width={90}
									label={{ value: "Workers", angle: -90, position: "insideLeft", fill: "#4a4f6a", fontSize: "15px", offset: 10 }}
									tickFormatter={v => (v * 1000).toLocaleString()} />
								<Tooltip contentStyle={styles.tooltipBox}
									formatter={v => [(v * 1000).toLocaleString(), "workers"]} />
								<Bar dataKey="workers" fill="#c9a84c" radius={[4, 4, 0, 0]} />
								</BarChart>
		
								</ResponsiveContainer>

							)}
    
							
							{/* Line chart */}
							{chartType === "line" && (
							<ResponsiveContainer width="100%" height={260}>
								<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1e2035" />
								<XAxis dataKey="year" stroke="#4a4f6a" tick={styles.chartTick}
									label={{ value: "Years", position: "insideBottom", offset: -5, fill: "#4a4f6a", fontSize: "15px" }} />
								<YAxis stroke="#4a4f6a" tick={styles.chartTick} width={90}
									label={{ value: "Workers", angle: -90, position: "insideLeft", fill: "#4a4f6a", fontSize: "15px", offset: 10 }}
									tickFormatter={v => (v * 1000).toLocaleString()} />
								<Tooltip contentStyle={styles.tooltipBox}
									formatter={v => [(v * 1000).toLocaleString(), "workers"]} />
								<Line type="monotone" dataKey="workers"
									stroke="#c9a84c" strokeWidth={2}
									dot={{ fill: "#c9a84c", r: 4 }} />
								</LineChart>
							</ResponsiveContainer>
							)}


							{/* Area chart */}
							{chartType === "area" && (
							<ResponsiveContainer width="100%" height={260}>
								<AreaChart data={chartData}>
								<defs>
									<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#c9a84c" stopOpacity={0.9} />
									<stop offset="95%" stopColor="#c9a84c" stopOpacity={0.9} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#1e2035" />
								<XAxis dataKey="year" stroke="#4a4f6a" tick={styles.chartTick}
									label={{ value: "Years", position: "insideBottom", offset: -5, fill: "#4a4f6a", fontSize: "15px" }} />
								<YAxis stroke="#4a4f6a" tick={styles.chartTick} width={90}
									label={{ value: "Workers", angle: -90, position: "insideLeft", fill: "#4a4f6a", fontSize: "15px", offset: 10 }}
									tickFormatter={v => (v * 1000).toLocaleString()} />
								<Tooltip contentStyle={styles.tooltipBox}
									formatter={v => [(v * 1000).toLocaleString(), "workers"]} />
								<Area type="monotone" dataKey="workers"
									stroke="#c9a84c" strokeWidth={2}
									fill="url(#areaGrad)" dot={{ fill: "#c9a84c", r: 4 }} />
								</AreaChart>
							</ResponsiveContainer>
							)}

							


						

              		</div>
	

            	)} {/*End of activeTab for "trends" chart */}

						
						
				


				
		<button onClick={downloadChart} style={styles.downloadBtn}>

			Download Chart

		</button>


				


	</div>

	)}

      </div>

    </div>

  );


} //end of FindOccupation component



// ─── STYLES ─────────────────
//keeping all the css seperate, so 
const styles = {
  page:        { display: "flex", minHeight: "100vh", overflow: "hidden" },

  sidePanel: {
    width: 280, minWidth: 280,
    background: "#FAF3E1", borderRight: "1px solid #1e2035",
    padding: "1.5rem 1.25rem",
    display: "flex", flexDirection: "column", gap: "1.25rem",
    overflowY: "auto",
  },
  sideFooter:  { display: "flex", gap: 8, marginTop: "auto" },

  filterLabel: {
    fontSize: "0.7rem", color: "", letterSpacing: ".1em",
    textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginBottom: 6,
  },

  occListBox: {
    background: "#F5E7C6", border: "1px solid #1e2035",
    borderRadius: 8, maxHeight: 220, overflowY: "auto", padding: "0.25rem",
  },
  occItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "6px 8px", borderRadius: 6, transition: "background .15s",
  },
  occLabel:    { fontSize: "0.82rem", fontFamily: "'DM Sans',sans-serif"},
  checkbox: {
    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  checkboxInner: { width: 7, height: 7, background: "#0a0a0f", borderRadius: 1 },

  select: {
    width: "100%", padding: "8px 12px",
    background: "#F5E7C6", border: "1px solid #1e2035", borderRadius: 8,
    color: "", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
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
    fontWeight: 600, letterSpacing: ".03em", transition: "all .2s", marginBottom: 70,
  },

  //background: "#080810" 
  mainPanel:   { flex: 1, padding: "2rem", overflowY: "auto", background: "#FAF3E1"},

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

  resultGraph: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  sectionTag: {
    fontSize: "0.72rem", color: "",
    fontFamily: "'DM Mono',monospace", letterSpacing: ".1em",
  },
  resultTitle: {
    fontFamily: "'Playfair Display',serif", color: "#222222",
    fontSize: "1.4rem", margin: "8px 0 0",
  },
  resultSubtitle: {

    fontSize: "0.8rem", color: "#4a4f6a", fontFamily: "'DM Mono',monospace", marginTop: 20,

  },



  insightGrid: {
    display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem",
  },
  insightCard: {
    background: "#F5E7C6", border: "1px solid #1e2035",
    borderRadius: 10, padding: "1rem 1.25rem",
  },
  insightLabel: {
    fontSize: "0.7rem", color: "#4a4f6a", fontFamily: "'DM Mono',monospace",
    letterSpacing: ".08em", marginBottom: 6,
  },
  insightValue: {
    fontSize: "1.4rem", fontFamily: "'Playfair Display',serif",
    color: "black", fontWeight: 700,
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
    background: "#F5E7C6", border: "1px solid #1e2035",
    borderRadius: 12, padding: "1.5rem",
  },
  cardLabel: {
    fontSize: "1.0rem", color: "#4a4f6a", letterSpacing: ".1em",
    fontFamily: "'DM Mono',monospace", marginBottom: "1rem", textAlign: "center",
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

  downloadBtn: {
	padding: "8px 16px",
	background: "transparent",
	border: "1px solid #c9a84c",
	borderRadius: 8,
	color: "#c9a84c",
	cursor: "pointer",
	fontFamily: "'DM Mono', monospace",
	fontSize: "0.75rem",
	letterSpacing: ".08em",
  },


};