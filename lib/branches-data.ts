export const FOET_BRANCHES = [
  { code: "CSE", name: "Comp. Science & Engineering" },
  { code: "ECE", name: "Electronics & Comm. Engineering" },
  { code: "EE", name: "Electrical Engineering" },
  { code: "ME", name: "Mechanical Engineering" },
  { code: "CE", name: "Civil Engineering" },
]

export const FOET_SYLLABUS = {
  // ----------------------------------------------------
  // COMMON FIRST YEAR SUBJECTS
  // ----------------------------------------------------
  COMMON_S1: [
    { code: "AS-101", title: "Engineering Physics - I" },
    { code: "AS-103", title: "Engineering Mathematics - I" },
    { code: "EE-101", title: "Basic Electrical Engineering" },
    { code: "CS-101", title: "Programming for Problem Solving (C)" },
    { code: "AS-102", title: "Engineering Chemistry" },
    { code: "AS-104", title: "Professional Communication" },
  ],

  COMMON_S2: [
    { code: "AS-201", title: "Engineering Physics - II" },
    { code: "AS-203", title: "Engineering Mathematics - II" },
    { code: "ME-201", title: "Elements of Mechanical Engineering" },
    { code: "EC-201", title: "Basic Electronics Engineering" },
    { code: "AS-205", title: "Environment & Ecology (Audit)" },
  ],

  CSE_S3: [
    { code: "NAS-301", title: "Engineering Mathematics-III" },
    { code: "NCS-301", title: "Data Structure" },
    { code: "NEC-301", title: "Digital Circuits & Logic Design" },
    { code: "NCS-303", title: "Numerical and Statistical Techniques" },
    { code: "NCS-302", title: "Object Oriented Programming" },
    { code: "NCS-304", title: "Theory of Automata" },
    { code: "NCS-305", title: "Emerging Trends in Technology" },
  ],

  ECE_S3: [
    { code: "NAS-301", title: "Engineering Mathematics-III" },
    { code: "NCS-301", title: "Data Structure" },
    { code: "NEC-301", title: "Digital Circuits & Logic Design" },
    { code: "NEC-302", title: "Semiconductor Devices & Circuits" },
    { code: "NEC-303", title: "Signal & Systems" },
    { code: "NEC-304", title: "Electronics Measurement & Instrumentation" },
  ],

  EE_S3: [
    { code: "NAS-301", title: "Engineering Mathematics-III" },
    { code: "NEE-301", title: "Network Analysis & Synthesis" },
    { code: "NEE-302", title: "Electrical Machines-I" },
    { code: "NEE-303", title: "Electrical Measurement & Measuring Instruments" },
    { code: "NEE-304", title: "Basic Signals & Systems Analysis" },
    { code: "NEC-305", title: "Analog and Digital Electronics" },
  ],

  ME_S3: [
    { code: "NAS-301", title: "Engineering Mathematics-III" },
    { code: "NME-301", title: "Strength of Materials" },
    { code: "NCE-301", title: "Fluid Mechanics" },
    { code: "NME-302", title: "Materials Science & Engineering" },
    { code: "NME-303", title: "Engineering Thermodynamics" },
    { code: "NME-304", title: "Measurements & Metrology" },
  ],

  CE_S3: [
    { code: "NAS-301", title: "Engineering Mathematics-III" },
    { code: "NME-301", title: "Strength of Materials" },
    { code: "NCE-301", title: "Fluid Mechanics" },
    { code: "NCE-302", title: "Material Construction" },
    { code: "NCE-303", title: "Surveying" },
    { code: "NCE-304", title: "Engineering Geology" },
  ],

  CSE_S5: [
    { code: "NCS-501", title: "Operating System" },
    { code: "NCS-502", title: "Data Base Management Concepts" },
    { code: "NCS-503", title: "Compiler Design" },
    { code: "NCS-504", title: "Web Technology" },
    { code: "NCS-505", title: "Software Engineering" },
    { code: "NCS-506", title: "Java Programming" },
  ],

  ECE_S5: [
    { code: "NEC-502", title: "Microprocessor & Interfaces" },
    { code: "NEC-503", title: "Analog Integrated Circuits" },
    { code: "NEC-504", title: "Antenna & Wave Propagation" },
    { code: "NEC-505", title: "Control System" },
    { code: "NEC-501", title: "Principles of Communication Engineering" },
    { code: "NAI-501", title: "Fundamentals of Data Analytics" },
  ],

  EE_S5: [
    { code: "NEE-501", title: "Power System-II" },
    { code: "NEE-502", title: "Control Systems" },
    { code: "NEE-503", title: "Power Electronics" },
    { code: "NEE-504", title: "Advanced Electrical Machines" },
    { code: "NEC-501", title: "Principles of Communication Engineering" },
    { code: "NEE-505", title: "Power Station Practice" },
  ],

  ME_S5: [
    { code: "NME-501", title: "Machine Design-II" },
    { code: "NME-502", title: "Heat and Mass Transfer" },
    { code: "NME-503", title: "Theory of Machines-II" },
    { code: "NME-504", title: "Industrial Engineering" },
    { code: "NME-505", title: "Manufacturing Science and Engineering-II" },
    { code: "NME-506", title: "I.C. Engines" },
  ],

  CE_S5: [
    { code: "NCE-501", title: "Structural Analysis-II" },
    { code: "NCE-502", title: "Design of Concrete Structures-I" },
    { code: "NCE-503", title: "Transportation Engineering-I" },
    { code: "NCE-504", title: "Geotechnical Engineering" },
    { code: "NCE-505", title: "Environmental Engineering-I" },
    { code: "NCE-506", title: "Engineering Hydrology" },
  ],

  CSE_S7: [
    { code: "CS-701", title: "Advance DBMS" },
    { code: "CS-702", title: "Computer Graphics" },
    { code: "CS-703", title: "Artificial Intelligence" },
    { code: "CS-7044", title: "Data Mining" },
    { code: "AS-702", title: "Industrial Management" },
    { code: "PE-701", title: "Program Elective" },
    { code: "OE-701", title: "Open Elective" },
  ],

  ECE_S7: [
    { code: "EC-701", title: "Mobile and Wireless Communications" },
    { code: "EC-702", title: "VLSI Design" },
    { code: "EC-703", title: "Optical Communication" },
    { code: "EC-7041", title: "Information Theory and Coding" },
    { code: "AS-701", title: "Engineering Economics" },
    { code: "PE-701", title: "Program Elective" },
    { code: "OE-701", title: "Open Elective" },
  ],

  EE_S7: [
    { code: "EE-701", title: "Switchgear and Protection" },
    { code: "EE-702", title: "Electric Drives" },
    { code: "EE-703", title: "FACTS Devices" },
    { code: "EE-7042", title: "Advanced Power Transmission" },
    { code: "AS-701", title: "Engineering Economics" },
    { code: "PE-701", title: "Program Elective" },
    { code: "OE-701", title: "Open Elective" },
  ],

  ME_S7: [
    { code: "ME-701", title: "Refrigeration & Air Conditioning" },
    { code: "ME-702", title: "Computer Aided Design" },
    { code: "ME-703", title: "Computer Aided Manufacturing" },
    { code: "ME-7041", title: "Non-Destructive Testing" },
    { code: "AS-701", title: "Engineering Economics" },
    { code: "PE-701", title: "Program Elective" },
    { code: "OE-701", title: "Open Elective" },
  ],

  CE_S7: [
    { code: "CE-701", title: "Design of Steel Structures" },
    { code: "CE-702", title: "Engineering Hydrology" },
    { code: "CE-703", title: "Water Resource Engineering" },
    { code: "CE-7042", title: "Environmental Impact Assessment" },
    { code: "AS-702", title: "Industrial Management" },
    { code: "PE-701", title: "Program Elective" },
    { code: "OE-701", title: "Open Elective" },
  ],

  PLACEHOLDER: [
    { code: "XX-001", title: "Core Subject Placeholder" },
    { code: "XX-002", title: "Departmental Elective / Project" },
  ],
}

export type BranchCode = "CSE" | "ECE" | "EE" | "ME" | "CE"
export type Semester = 1 | 3 | 5 | 7

export function getBranches(): BranchCode[] {
  return FOET_BRANCHES.map((b) => b.code as BranchCode)
}

export function getSemesters(): Semester[] {
  return [1, 3, 5, 7]
}

export function getSubjects(branch: BranchCode, semester: Semester): string[] {
  const key = `${branch}_S${semester}`

  if (FOET_SYLLABUS[key as keyof typeof FOET_SYLLABUS]) {
    return FOET_SYLLABUS[key as keyof typeof FOET_SYLLABUS].map((s) => s.title)
  }

  // Handle Common First Year Subjects
  if (semester <= 2) {
    const commonKey = `COMMON_S${semester}` as keyof typeof FOET_SYLLABUS
    return FOET_SYLLABUS[commonKey]?.map((s) => s.title) || []
  }

  // Default to placeholder for missing data
  return FOET_SYLLABUS.PLACEHOLDER.map((s) => s.title)
}

export function getBranchName(branch: BranchCode): string {
  return FOET_BRANCHES.find((b) => b.code === branch)?.name || branch
}
