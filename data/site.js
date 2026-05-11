// Single source of truth for the redesigned site.
// Inlined here so static pages can import without a server.

export const PROFILE = {
  name: 'Nathaniel Oliver',
  role: 'Data Scientist',
  tagline: 'Predictive modeling, probabilistic methods & data visualization.',
  location: 'San Diego, CA',
  email: 'nathanielsoliver@gmail.com',
  github: 'nathansso',
  linkedin: 'nathaniel-oliver-82239a265',
  photo: 'imgs/porto_pic.jpg',
  bio: `Pursuing an M.S. in Data Science at UC San Diego, building on my undergraduate background in Math and Econ, turning messy, real-world data into actionable models.

My background spans applied research, predictive modeling, and data product development. 

I'm currently a Data Science Intern at IDX Exchange, where I've built end-to-end modeling pipelines, using ETF and gradient boosting, and developed ensemble-based approaches for prediction. 

In my spare time, I've been exploring Agent-based Workflow/Development. My current project orchestrates agents to ingest the user's resume, repos, and other data, returning truthfully tailoring resumes to specific roles.

My toolkit includes Python, its various packages (pandas, numpy, sci-kit learn), SQL, R, ETF, ML/predictive modeling, data visualization, and LLM-assisted workflows. 

I'm especially interested in data science roles where I can combine analytical rigor, practical machine learning, and product-minded thinking to solve real problems.`,
  shortBio: `M.S. Data Science at UC San Diego, building on a Math + Econ foundation. I turn messy real-world data into useful models and decisions — applied research, predictive modeling, and AI-assisted analytics.`,
  currently: 'Predictive modeling at IDX Exchange · MS Data Science at UCSD'
};

// Categories — the visual filter vocabulary
export const CATEGORIES = {
  research:   { id: 'research',   label: 'Research',   hue: 250, count: 0 },
  internship: { id: 'internship', label: 'Internship', hue: 145, count: 0 },
  graduate:   { id: 'graduate',   label: 'Graduate',   hue: 305, count: 0 },
  undergrad:  { id: 'undergrad',  label: 'Undergrad',  hue: 75,  count: 0 },
  personal:   { id: 'personal',   label: 'Personal',   hue: 25,  count: 0 },
  // 'other' deliberately excluded from the filter UI but allowed on entries
};

// Experiences — Research, Internship, Education entries that drive /about
export const EXPERIENCES = [
  {
    id: 'idx',
    category: 'internship',
    title: 'Senior Data Science Intern',
    org: 'IDX Exchange',
    location: 'Remote',
    start: '2026-01', end: null,
    blurb: 'Predictive modeling for real-estate pricing. Building ETL pipelines, training and evaluating tree-based models, and translating results into product-ready insights for a proptech team.',
    bullets: [
      'Predictive modeling on California MLS data; XGBoost regression for single-family home valuation.',
      'ETL pipelines preparing 100K+ property records for downstream training.',
      'Cross-functional collaboration on model evaluation and visualization for a proptech product.',
    ],
    skills: ['Python','XGBoost','scikit-learn','ETL','pandas'],
    projectIds: ['ca-real-estate'],
  },
  {
    id: 'econ-gray',
    category: 'research',
    title: 'Research Assistant — Cohabitation & Census',
    org: 'UCSD Department of Economics',
    advisor: 'Prof. Andre Gray',
    location: 'La Jolla, CA',
    start: '2025-03', end: '2025-07',
    blurb: 'Aggregated and analyzed census and immigration data (UMPS, USCIS) to investigate cohabitation trends across diverse populations in major US metros, 2007–2024.',
    bullets: [
      'Time-series and breakpoint analysis identifying statistically significant structural changes.',
      'Regression analysis to surface the most important demographic factors.',
      'Collaborated with graduate and post-graduate researchers on reproducible analysis pipelines.',
    ],
    skills: ['Python','R','Time-series','Regression','Econometrics'],
    projectIds: ['ucsd-research-lab'],
  },
  {
    id: 'econ-refugee',
    category: 'research',
    title: 'Research Assistant — Refugee Camps & Local Economies',
    org: 'UCSD Department of Economics',
    location: 'La Jolla, CA',
    start: '2024-01', end: '2024-03',
    blurb: 'Investigated effects of refugee camps on local wages and crop prices in Sub-Saharan Africa, sourcing UN/UNHCR datasets and applying difference-in-differences over geospatial segments.',
    bullets: [
      'Sourced and tidied large UN/UNHCR economic and geospatial datasets.',
      'Segmented farmers in QGIS based on proximity to refugee camps.',
      'Applied DiD analysis on historical pricing data in Stata.',
    ],
    skills: ['R','Stata','QGIS','Geospatial','DiD'],
    projectIds: [],
  },
  {
    id: 'msdsc',
    category: 'graduate',
    title: 'M.S. Data Science',
    org: 'UC San Diego',
    location: 'La Jolla, CA',
    start: '2026-01', end: null,
    endLabel: 'Expected Jun 2027',
    gpa: '4.0 / 4.0',
    blurb: 'Graduate coursework in data management, machine learning, and statistics. Building applied projects that pair ensemble methods with rigorous evaluation and clear product framing.',
    bullets: [
      'Coursework: Data Management, Machine Learning, Statistics.',
      'GPA 4.0 · MDS Supplemental Scholarship Recipient.',
    ],
    skills: ['Python','XGBoost','scikit-learn','Statistics'],
    projectIds: ['ecommerce-intent'],
  },
  {
    id: 'bsmath',
    category: 'undergrad',
    title: 'B.S. Mathematics & Economics',
    org: 'UC San Diego',
    location: 'La Jolla, CA',
    start: '2021-09', end: '2025-06',
    blurb: 'Minor in Data Science. Coursework spanning real analysis, probability, econometrics, and applied data science. Provost Honors 2021–2025.',
    bullets: [
      'Mathematics: Real Analysis, Probability, Linear Analysis, Graph Theory.',
      'Data Science: Applied DS, EDA, Probabilistic Modeling & ML, Representation & Unsupervised Learning.',
      'Economics: Macro, Micro, Econometrics. Finance: Financial Math, Financial Analytics.',
    ],
    skills: ['Python','R','D3.js','Probability','Econometrics'],
    projectIds: ['dsc80-notebook','allrecipes','bike-cambridge','mice-temp','airbnb-sd','estrus-rats','math189-edu','asteroid','image-processor'],
  },
  // 'other' — appears in ALL but not as a filter
  {
    id: 'slbo',
    category: 'other',
    title: 'Financial Assistant / Student Lead',
    org: 'UCSD Student Life Business Office',
    location: 'La Jolla, CA',
    start: '2023-09', end: '2025-06',
    blurb: 'Promoted to Student Lead. Trained a team of 3, built curriculum for accounting/event-planning tools, and supported 450+ student organizations with invoicing and account management.',
    bullets: [
      'Trained and managed 3 student workers; built onboarding curriculum.',
      'Prepared invoices and purchase orders; managed account balances for 450+ orgs.',
      'PaymentWorks, Concur, IBM Cognos, and other UCSD financial systems.',
    ],
    skills: ['Excel','IBM Cognos','Team Management'],
    projectIds: [],
  },
  {
    id: 'aquatics',
    category: 'other',
    title: 'Aquatics Manager',
    org: 'Campbell Community Center',
    location: 'Campbell, CA',
    start: '2019-06', end: '2022-08',
    blurb: 'Managed City of Campbell Aquatics — 50+ lifeguards and the Wave Swim Team. Developed competitive swim programs, scheduling, and membership management.',
    bullets: [
      'Trained and managed 50+ lifeguards; scheduled swim-team practices.',
      'Project-management strategies applied to programming and operations.',
      'Excel and CivicRec for scheduling and membership management.',
    ],
    skills: ['Project Management','Team Leadership','Excel'],
    projectIds: [],
  },
];

// PROJECTS_AUTO_START
export const PROJECTS = [
  {
    "id": "ca-real-estate",
    "title": "California Real Estate Price Prediction",
    "category": "internship",
    "experienceId": "idx",
    "course": null,
    "date": "2026-04",
    "image": null,
    "blurb": "Stacked XGBoost + LightGBM ensemble on 100K+ MLS rows. Sub-8% Median Absolute Percent Error, deployed on Streamlit.",
    "description": "Built a machine learning web application that predicts single-family residence prices across California using ensemble models including XGBoost and LightGBM, trained on real estate market data with features such as location, property size, and neighborhood demographics. Deployed an interactive Streamlit dashboard that allows users to input property characteristics and receive price predictions in real time, supported by dynamic visualizations built with Plotly. The project involved custom model training pipelines with scikit-learn preprocessing, hyperparameter tuning, and model serialization via Joblib to serve predictions efficiently within the application.",
    "skills": [
      "python",
      "scikit-learn",
      "xgboost",
      "lightgbm",
      "streamlit",
      "pandas",
      "numpy",
      "plotly",
      "joblib",
      "scipy",
      "matplotlib",
      "pyarrow",
      "machine learning",
      "ensemble models",
      "regression",
      "hyperparameter tuning",
      "feature engineering",
      "data visualization",
      "model serialization",
      "real estate",
      "predictive modeling",
      "web application",
      "data preprocessing",
      "interactive dashboard"
    ],
    "url": "https://single-family-housing-price-predictor.streamlit.app/",
    "repo": "idx_38",
    "lastCommit": "2026-04-29"
  },
  {
    "id": "ats-resume",
    "title": "AI-Driven Résumé Quality & ATS Analysis",
    "category": "personal",
    "experienceId": null,
    "course": null,
    "date": "2026-04",
    "image": null,
    "blurb": "Multi-agent LangGraph + LangChain system. PostgreSQL knowledge graph, sentence-transformers ATS scoring, hallucination-prevention prompt design.",
    "description": "Built an end-to-end AI hiring analysis system that ingested resumes, LinkedIn exports, GitHub metadata, and transcripts into a structured PostgreSQL knowledge graph, then scored candidate-to-job alignment using a custom ATS engine built on sentence-transformers and scikit-learn. Orchestrated a multi-agent LangGraph pipeline across OpenAI and Ollama models to generate explainable gap analyses and targeted resume improvements, with validation logic that grounded all outputs strictly in existing candidate evidence to prevent hallucinated credentials. Delivered the full system through an interactive Textual terminal UI, with reproducible ETL pipelines and documented prompt engineering practices supporting reliable, auditable AI-assisted hiring decisions.",
    "skills": [
      "python",
      "langchain",
      "langgraph",
      "openai api",
      "ollama",
      "sentence-transformers",
      "scikit-learn",
      "postgresql",
      "sqlmodel",
      "psycopg2",
      "networkx",
      "textual",
      "docling",
      "pydantic",
      "multi-agent systems",
      "ats engine",
      "nlp",
      "knowledge graph",
      "etl pipeline",
      "prompt engineering",
      "semantic similarity",
      "resume parsing",
      "jupyter notebook",
      "playwright",
      "beautifulsoup4",
      "llm orchestration",
      "explainable ai",
      "information extraction",
      "python-dotenv",
      "matplotlib",
      "asyncio",
      "powershell"
    ],
    "url": "https://github.com/nathansso/agentic_resume_tailoring",
    "repo": "agentic_resume_tailoring",
    "lastCommit": "2026-05-08"
  },
  {
    "id": "ecommerce-intent",
    "title": "eCommerce Session Purchase Intent",
    "category": "graduate",
    "experienceId": "msdsc",
    "course": "DSC 207",
    "date": "2026-03",
    "image": null,
    "blurb": "Random Forest + XGBoost on 12,330 sessions. ~90% accuracy with threshold-tuned recall; 5-cluster behavioral segmentation revealing 0.4%–24.3% conversion span.",
    "description": "Built classification models using Random Forest and XGBoost on 12,330 e-commerce browsing sessions to predict purchase intent, applying threshold tuning to optimize recall and reduce missed conversions, achieving ~90% accuracy. Applied K-Means clustering to segment shoppers into five behavioral archetypes, revealing conversion rates ranging from 0.4% for bounce-prone visitors to 24.3% for high-intent consumers. Identified product browsing depth and administrative page engagement as the strongest purchase predictors using Python, scikit-learn, pandas, and seaborn.",
    "skills": [
      "python",
      "jupyter",
      "scikit-learn",
      "pandas",
      "seaborn",
      "random forest",
      "xgboost",
      "k-means clustering",
      "classification",
      "threshold tuning",
      "feature importance",
      "behavioral segmentation",
      "predictive modeling",
      "machine learning",
      "ecommerce analytics",
      "customer segmentation",
      "conversion optimization",
      "data visualization",
      "supervised learning",
      "unsupervised learning"
    ],
    "url": "https://github.com/nathansso/dsc207finalproject",
    "repo": "dsc207finalproject",
    "lastCommit": "2026-03-30"
  },
  {
    "id": "dsc80-notebook",
    "title": "DSC 80 — Project Notebook",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 80",
    "date": "2025-08",
    "image": null,
    "blurb": "Pandas + scikit-learn pipeline: cleaning, imputation, feature engineering, supervised modeling on a structured dataset.",
    "description": "Without access to the actual notebook contents, I can only describe what's visible from the metadata: This project applied data science techniques using Python's core scientific stack — pandas for data manipulation, scikit-learn for machine learning modeling, and Plotly and Matplotlib for interactive and static visualizations. The workflow likely involved data cleaning, feature engineering, and predictive modeling on a structured dataset. To provide a more accurate and specific description, the actual notebook content, dataset details, and findings would need to be shared.",
    "skills": [
      "python",
      "pandas",
      "numpy",
      "scikit-learn",
      "matplotlib",
      "plotly",
      "jupyter",
      "data cleaning",
      "feature engineering",
      "machine learning",
      "predictive modeling",
      "data visualization",
      "exploratory analysis",
      "statistical analysis"
    ],
    "url": "https://github.com/nathansso/DSC-80-Project-Notebook",
    "repo": "DSC-80-Project-Notebook",
    "lastCommit": "2025-08-09"
  },
  {
    "id": "ucsd-research-lab",
    "title": "UCSD Econ Research Lab",
    "category": "research",
    "experienceId": "econ-gray",
    "course": null,
    "date": "2025-07",
    "image": null,
    "blurb": "Statistical modeling and ML in Python and R for domain-specific research questions under Prof. Andre Gray.",
    "description": "Unable to generate a specific description with the limited information provided. Please share more details about the research topic, methods used, datasets, findings, or outcomes so the description accurately reflects the work completed in this project.",
    "skills": [
      "jupyter",
      "r",
      "python",
      "data analysis",
      "statistical modeling",
      "data visualization",
      "research",
      "machine learning",
      "exploratory analysis",
      "scientific computing"
    ],
    "url": "https://github.com/nathansso/UCSD-Research-Lab",
    "repo": "UCSD-Research-Lab",
    "lastCommit": "2025-07-07"
  },
  {
    "id": "bike-cambridge",
    "title": "Bike Traffic in Cambridge",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 106",
    "date": "2025-02",
    "image": "imgs/bike_cambridge.jpg",
    "blurb": "Variable-width polylines over Cambridge's cycling network, encoding raw counts as proportional weights.",
    "description": "Built an interactive visualization of bike traffic patterns across Cambridge using JavaScript, CSS, and HTML to display station-level ridership data on a dynamic map. Implemented filtering controls and visual encodings such as scaled markers and color gradients to communicate traffic volume and flow direction across different times of day. The project enabled users to identify high-traffic corridors and temporal usage trends across the city's bike network.",
    "skills": [
      "javascript",
      "css",
      "html",
      "data visualization",
      "interactive maps",
      "geospatial data",
      "visual encodings",
      "ui design",
      "temporal analysis",
      "transit analytics"
    ],
    "url": "https://nathansso.github.io/datacycling/",
    "repo": "datacycling",
    "lastCommit": "2025-02-26"
  },
  {
    "id": "mice-temp",
    "title": "Mice Body Temperature × Sex",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 106",
    "date": "2025-03",
    "image": "imgs/mice_temp.jpg",
    "blurb": "Interactive D3 visualization with filtering, scope alteration, and per-mouse tooltips highlighting estrus cycle.",
    "description": "Interactive visualization of body temperature across mice by sex. Users filter, alter scope, and hover individual mice for tooltips that surface mouse ID and estrus-cycle status. Built collaboratively with peers in DSC 106.",
    "skills": [
      "D3.js",
      "JavaScript",
      "data visualization",
      "interactive viz",
      "HTML",
      "CSS",
      "time series"
    ],
    "url": "https://sebastianferragut.github.io/miced3/",
    "repo": null
  },
  {
    "id": "airbnb-sd",
    "title": "Airbnb × San Diego Sunshine",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 106",
    "date": "2025-02",
    "image": "imgs/airbnb_sd.png",
    "blurb": "Static graph exploring San Diego Airbnb bookings and revenue across the year — peaks in summer, dips in winter.",
    "description": "Static graph exploring Airbnb bookings and revenue throughout the year in San Diego, California. Shows how booking counts and revenue change month-over-month, with the highest peaks in summer.",
    "skills": [
      "Python",
      "pandas",
      "matplotlib",
      "data visualization",
      "time series",
      "EDA"
    ],
    "url": "https://sebastianferragut.github.io/miceexplorable/",
    "repo": null
  },
  {
    "id": "estrus-rats",
    "title": "Estrus Impact Across the Day",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 106",
    "date": "2025-02",
    "image": "imgs/estrus_static.png",
    "blurb": "Static visualization of body temperature across male/female mice highlighting the impact of female estrus.",
    "description": "Static visualization of body-temperature curves across male and female mice. Used to explore differences in the daily cycle of body temperature while highlighting the impact of female estrus.",
    "skills": [
      "Python",
      "matplotlib",
      "seaborn",
      "pandas",
      "statistical analysis",
      "circadian rhythms",
      "chronobiology"
    ],
    "url": null,
    "repo": null
  },
  {
    "id": "allrecipes",
    "title": "AllRecipes Rating Classifier",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 80",
    "date": "2024-12",
    "image": "imgs/allrecipes.jpg",
    "blurb": "Multiclass Random Forest classifier predicting AllRecipes ratings from recipe-level features.",
    "description": "Multiclass classification model predicting AllRecipes ratings from recipe-level features. Built with scikit-learn — feature engineering, preprocessing, hyperparameter tuning, and model evaluation.",
    "skills": [
      "Python",
      "scikit-learn",
      "Random Forest",
      "multiclass classification",
      "pandas",
      "NumPy",
      "feature engineering",
      "BeautifulSoup",
      "NLP"
    ],
    "url": "https://aconsiglio03.github.io/Recipe-Review-Analysis/",
    "repo": null
  },
  {
    "id": "math189-edu",
    "title": "Education & Income Across California",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "Math 189",
    "date": "2024-06",
    "image": "imgs/math189.jpg",
    "blurb": "Heatmap-driven EDA of educational-institution density and income distribution across California.",
    "description": "Exploratory data analysis of educational-institution presence and income distribution across California. Heatmap visualizations reveal regional patterns linking institutional density and economic indicators.",
    "skills": [
      "Python",
      "pandas",
      "matplotlib",
      "seaborn",
      "geospatial",
      "EDA",
      "heatmap",
      "census data"
    ],
    "url": null,
    "repo": null
  },
  {
    "id": "asteroid",
    "title": "Asteroid Landfall Simulation",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 10",
    "date": "2023-12",
    "image": "imgs/asteroid.jpg",
    "blurb": "Pandas + Jupyter simulation of asteroid landfall using historical data, probabilistic modeling, and bootstrapping.",
    "description": "Simulation of asteroid landfall using historical NASA datasets. Probabilistic modeling and bootstrapping to estimate landfall location distributions and tail-risk events.",
    "skills": [
      "Python",
      "pandas",
      "Jupyter",
      "probabilistic modeling",
      "bootstrapping",
      "simulation",
      "NumPy"
    ],
    "url": null,
    "repo": null
  },
  {
    "id": "image-processor",
    "title": "Image Processor",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": null,
    "date": "2024-04",
    "image": "imgs/image_processor.png",
    "blurb": "Python image-processing library: negate, grayscale, edge-detection filters on raw pixel arrays.",
    "description": "Image processor that reads an image, applies a filter, and outputs the result. Filters implemented include negate, grayscale, and edge detection — operating directly on raw pixel arrays.",
    "skills": [
      "Python",
      "image processing",
      "computer vision",
      "edge detection",
      "NumPy",
      "Pillow"
    ],
    "url": null,
    "repo": null
  }
];
// PROJECTS_AUTO_END

// Compute counts for the filter UI
for (const p of PROJECTS) {
  if (CATEGORIES[p.category]) CATEGORIES[p.category].count++;
}

// Helpers
export function fmtDate(yyyymm) {
  if (!yyyymm) return '';
  const [y, m] = yyyymm.split('-').map(Number);
  return new Date(y, (m || 1) - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}
export function fmtRange(start, end, endLabel) {
  const s = fmtDate(start);
  const e = end ? fmtDate(end) : (endLabel || 'Present');
  return `${s} — ${e}`;
}
export function projectsByIds(ids) {
  const map = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
  return (ids || []).map(id => map[id]).filter(Boolean);
}
export function byExperience(expId) {
  return PROJECTS.filter(p => p.experienceId === expId);
}
export function abbreviate(title) {
  return title.split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).slice(0, 3).join('') || title.slice(0, 3);
}
