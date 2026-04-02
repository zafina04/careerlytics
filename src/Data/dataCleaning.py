import pandas as pd
import json
import re

# ── CONFIG ────────────────────────────────────────────────────────────────────
INPUT_FILE  = "OccupationsDataset.csv"  
OUTPUT_FILE = "backend/datatest.json"

#List of all the 10 provinces and Canada has a whole
PROVINCES = [
    "Canada",
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
]

#The data is sepreated by labour force, employment (total employment), full-time employment, and part-time employment
METRICS = ["Labour force", "Employment", "Full-time employment", "Part-time employment"]

YEARS = list(range(1987, 2026))  # 1987 to 2025 inclusive = 39 years

# ── STEP 1: READ THE RAW FILE ─────────────────────────────────────────────────
# The first 4 rows are metadata headers (Geography, Labour force characteristics,
# Gender, NOC year labels). Row index 4 is "Persons in thousands". Data starts row 5.
raw = pd.read_csv(INPUT_FILE, header=None, dtype=str)

# Row 0: Geography repeated (Canada, Canada, Canada, Canada, Newfoundland...)
# Row 1: Metric repeated (Labour force, Employment, Full-time, Part-time, Labour force...)
# Row 2: Gender (all "Total - Gender" - we can ignore)
# Row 3: Years repeated (1987,1988,...2025, 1987,1988,...2025, ...)
# Row 4: "Persons in thousands" label row - skip
# Row 5+: Occupation name in col 0, then numeric values


# Extract the occupation names (column 0, rows 5 onwards)
#This is because the first 4 rows are metadata
data_rows = raw.iloc[5:].copy()

#this will make it start counting at the 5th row, 0,1,2, etc
data_rows = data_rows.reset_index(drop=True)


# Clean occupation names - strip footnote numbers like "13", "14" etc at end
#Since above we skipped first 5 rows, this function will start reading and extracting from "Total, all occupations 13" row
def clean_occ_name(name):

    #If the cell is empty return none
    if pd.isna(name):

        return None
    
    #this converts the occupation name into a string, strip() removes any whitespace
    name = str(name).strip()


    # Remove trailing footnote numbers (e.g. "Total, all occupations13" -> "Total, all occupations")
    #this uses regex to remove those numbers at the end of occupation names
    name = re.sub(r'\d+$', '', name).strip()


    # Remove trailing comma, since its copied with the comma
    name = name.rstrip(',').strip()

    #return the occupation, if its not empty aka none
    return name if name else None



#occupations = [clean_occ_name(r) for r in data_rows.iloc[:, 0]]

occupations = []

#iloc is "integer location", it allows me to select rows and colunms by their postion number
#[:, 0] part has two pieces seprated by comma, : means "all rows", from top to bottom
# 0 means "column 0", which is the first colunm (occupation name)
for r in data_rows.iloc[:, 0]:

    #this cleans the raw value using the function above
    cleaned = clean_occ_name(r)

    #then the cleaned occ name gets added to the occupations list
    occupations.append(cleaned)



# ── STEP 2: BUILD COLUMN INDEX ────────────────────────────────────────────────
# Each province has 4 metrics × 39 years = 156 columns
# Total data columns = 11 provinces × 156 = 1,716 columns (starting at column index 1)

#each metric has 39 colunms, 1987 to 2025
cols_per_metric = len(YEARS)     

#Metrics is the 4 things, labour force, employment, full-time, part-time, so thats 4*39 = 156
cols_per_province = len(METRICS) * cols_per_metric  



def get_col_index(province_idx, metric_idx, year_idx):

    """Returns the 0-based column index in the raw dataframe (offset by 1 for occ name col)"""
    return 1 + (province_idx * cols_per_province) + (metric_idx * cols_per_metric) + year_idx


# ── STEP 3: PARSE INTO STRUCTURED DATA ───────────────────────────────────────
def safe_float(val):

    """Convert value to float, return None for suppressed/missing values (x, .., etc.)"""
    if pd.isna(val):
        return None
    s = str(val).strip().replace(',', '')
    try:
        return float(s)
    except ValueError:
        return None  # handles "x", "..", "F", etc.


result = {}


for row_idx, occ in enumerate(occupations):
    if occ is None:
        continue

    result[occ] = {}

    for p_idx, province in enumerate(PROVINCES):
        result[occ][province] = {}

        for m_idx, metric in enumerate(METRICS):
            result[occ][province][metric] = []

            for y_idx, year in enumerate(YEARS):
                col_idx = get_col_index(p_idx, m_idx, y_idx)

                # Guard against rows that are shorter than expected
                if col_idx >= len(data_rows.columns):
                    value = None
                else:
                    raw_val = data_rows.iloc[row_idx, col_idx]
                    value = safe_float(raw_val)

                result[occ][province][metric].append({
                    "year": year,
                    "workers": value  # in thousands of persons
                })


# ── STEP 4: SAVE OUTPUT ───────────────────────────────────────────────────────
import os
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

# ── STEP 5: PRINT SUMMARY ─────────────────────────────────────────────────────
print(f"Done!")
print(f"  Occupations found : {len(result)}")
print(f"   Provinces         : {len(PROVINCES)}")
print(f"   Metrics per entry : {len(METRICS)}")
print(f"   Years             : {YEARS[0]}–{YEARS[-1]}")
print(f"   Output saved to   : {OUTPUT_FILE}")
print()
print("Sample occupations:")
for occ in list(result.keys())[:5]:
    canada_lf_1987 = result[occ]["Canada"]["Labour force"][0]
    print(f"   {occ[:50]:<50} | Canada Labour force 1987: {canada_lf_1987['workers']}")
