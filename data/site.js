// Single source of truth for the redesigned site.
// Inlined here so static pages can import without a server.

export const PROFILE = {
  "name": "Nathaniel Oliver",
  "role": "Data Scientist",
  "tagline": "Predictive modeling, probabilistic methods & data visualization.",
  "location": "San Diego, CA",
  "email": "nathanielsoliver@gmail.com",
  "github": "nathansso",
  "linkedin": "nathaniel-oliver-82239a265",
  "photo": "imgs/porto_pic.jpg",
  "bio": "Pursuing an M.S. in Data Science at UC San Diego, building on my undergraduate background in Math and Econ, turning messy, real-world data into actionable models.\n\nMy background spans applied research, predictive modeling, and data product development. \n\nI'm currently a Data Science Intern at IDX Exchange, where I've built end-to-end modeling pipelines, using ETF and gradient boosting, and developed ensemble-based approaches for prediction. \n\nIn my spare time, I've been exploring agent-based workflow and development. One of my current personal projects orchestrates agents to ingest the user's resume, repos, and other data, returning truthfully tailored resumes to specific roles.\n\nMy toolkit includes Python, its various packages (pandas, numpy, sci-kit learn), SQL, R, ETF, ML/predictive modeling, data visualization, and LLM-assisted workflows. \n\nI'm especially interested in data science roles where I can combine analytical rigor, practical machine learning, and product-minded thinking to solve real problems.",
  "shortBio": "M.S. Data Science at **UC San Diego**, building on a Math + Econ foundation. I turn messy real-world data into useful models and decisions — applied research, predictive modeling, and AI-assisted analytics.",
  "currently": "Predictive modeling at **IDX Exchange** · MS Data Science at **UCSD**"
};


















// Categories — the visual filter vocabulary
export const CATEGORIES = {
  "research": {
    "id": "research",
    "label": "Research",
    "hue": 250,
    "count": 6
  },
  "internship": {
    "id": "internship",
    "label": "Internship",
    "hue": 145,
    "count": 6
  },
  "graduate": {
    "id": "graduate",
    "label": "Graduate",
    "hue": 305,
    "count": 6
  },
  "undergrad": {
    "id": "undergrad",
    "label": "Undergrad",
    "hue": 75,
    "count": 60
  },
  "personal": {
    "id": "personal",
    "label": "Personal",
    "hue": 25,
    "count": 16
  }
};


















// Experiences — Research, Internship, Education entries that drive /about
export const EXPERIENCES = [
  {
    "id": "idx",
    "category": "internship",
    "title": "Senior Data Science Intern",
    "org": "IDX Exchange",
    "location": "Remote",
    "start": "2026-01",
    "end": null,
    "blurb": "Predictive modeling for real-estate pricing. \nBuilding ETL pipelines, training and evaluating gradient boosted models, and translating results into product-ready insights for a proptech team. \nCurrently building a production multi-agent AI assistant using OpenClaw that helps consumers by analyzing market trends and recommending properties.",
    "bullets": [
      "Predictive modeling on California MLS data; XGBoost regression for single-family home valuation.",
      "ETL pipelines preparing 100K+ property records for downstream training.",
      "Cross-functional collaboration on model evaluation and visualization for a proptech product."
    ],
    "skills": [
      "Python",
      "XGBoost",
      "scikit-learn",
      "ETL",
      "pandas"
    ],
    "projectIds": [
      "ca-real-estate"
    ]
  },
  {
    "id": "econ-gray",
    "category": "research",
    "title": "Research Assistant — Cohabitation & Census",
    "org": "UCSD Department of Economics",
    "advisor": "Andre Gray, PhD '26",
    "location": "La Jolla, CA",
    "start": "2025-03",
    "end": "2025-07",
    "blurb": "Aggregated and analyzed census and immigration data (UMPS, USCIS) to investigate cohabitation trends across diverse populations in major US metros, 2007–2024.",
    "bullets": [
      "Time-series and breakpoint analysis identifying statistically significant structural changes.",
      "Regression analysis to surface the most important demographic factors.",
      "Collaborated with graduate and post-graduate researchers on reproducible analysis pipelines."
    ],
    "skills": [
      "Python",
      "R",
      "Time-series",
      "Regression",
      "Econometrics"
    ],
    "projectIds": [
      "ucsd-research-lab"
    ]
  },
  {
    "id": "econ-refugee",
    "category": "research",
    "title": "Research Assistant — Refugee Camps & Local Economies",
    "org": "UCSD Department of Economics",
    "location": "La Jolla, CA",
    "start": "2024-01",
    "end": "2024-03",
    "blurb": "Investigated effects of refugee camps on local wages and crop prices in Sub-Saharan Africa, sourcing UN/UNHCR datasets and applying difference-in-differences over geospatial segments.",
    "bullets": [
      "Sourced and tidied large UN/UNHCR economic and geospatial datasets.",
      "Segmented farmers in QGIS based on proximity to refugee camps.",
      "Applied DiD analysis on historical pricing data in Stata."
    ],
    "skills": [
      "R",
      "Stata",
      "QGIS",
      "Geospatial",
      "DiD"
    ],
    "projectIds": [],
    "advisor": "Vincent Armentano, PhD '27"
  },
  {
    "id": "msdsc",
    "category": "graduate",
    "title": "M.S. Data Science",
    "org": "UC San Diego",
    "location": "La Jolla, CA",
    "start": "2026-01",
    "end": null,
    "endLabel": "Expected Jun 2027",
    "gpa": "4.0 / 4.0",
    "blurb": "Graduate coursework in data management, machine learning, and statistics. \nExploring deep learning, graph neural networks, and the use of NN on relational data. ",
    "bullets": [
      "Coursework: Data Management, Machine Learning Algorithms, Statistics",
      "GPA 4.0 · MDS Supplemental Scholarship Recipient."
    ],
    "skills": [
      "Python",
      "XGBoost",
      "scikit-learn",
      "Statistics"
    ],
    "projectIds": [
      "ecommerce-intent"
    ]
  },
  {
    "id": "bsmath",
    "category": "undergrad",
    "title": "B.S. Mathematics & Economics",
    "org": "UC San Diego",
    "location": "La Jolla, CA",
    "start": "2021-09",
    "end": "2025-06",
    "blurb": "Minor in Data Science. \nCoursework spanning real analysis, probability, econometrics, and applied data science. \nProvost Honors 2021–2025.",
    "bullets": [
      "Mathematics: Real Analysis, Probability, Linear Analysis, Graph Theory.",
      "Data Science: Applied DS, EDA, Probabilistic Modeling & ML, Representation & Unsupervised Learning.",
      "Economics: Macro, Micro, Econometrics. Finance: Financial Math, Financial Analytics."
    ],
    "skills": [
      "Python",
      "R",
      "D3.js",
      "Probability",
      "Econometrics"
    ],
    "projectIds": [
      "dsc80-notebook",
      "allrecipes",
      "bike-cambridge",
      "mice-temp",
      "mice-explorable",
      "airbnb-sd",
      "estrus-rats",
      "math189-edu",
      "asteroid",
      "image-processor"
    ]
  },
  {
    "id": "slbo",
    "category": "other",
    "title": "Financial Assistant / Student Lead",
    "org": "UCSD Student Life Business Office",
    "location": "La Jolla, CA",
    "start": "2023-09",
    "end": "2025-06",
    "blurb": "Promoted to Student Lead. Trained a team of 3, built curriculum for accounting/event-planning tools, and supported 450+ student organizations with invoicing and account management.",
    "bullets": [
      "Trained and managed 3 student workers; built onboarding curriculum.",
      "Prepared invoices and purchase orders; managed account balances for 450+ orgs.",
      "PaymentWorks, Concur, IBM Cognos, and other UCSD financial systems."
    ],
    "skills": [
      "Excel",
      "IBM Cognos",
      "Team Management"
    ],
    "projectIds": []
  },
  {
    "id": "aquatics",
    "category": "other",
    "title": "Aquatics Manager",
    "org": "Campbell Community Center",
    "location": "Campbell, CA",
    "start": "2019-06",
    "end": "2022-08",
    "blurb": "Managed City of Campbell Aquatics — 50+ lifeguards and the Wave Swim Team. Developed competitive swim programs, scheduling, and membership management.",
    "bullets": [
      "Trained and managed 50+ lifeguards; scheduled swim-team practices.",
      "Project-management strategies applied to programming and operations.",
      "Excel and CivicRec for scheduling and membership management."
    ],
    "skills": [
      "Project Management",
      "Team Leadership",
      "Excel"
    ],
    "projectIds": []
  }
];


















// PROJECTS_AUTO_START
export const PROJECTS = [
  {
    "id": "rollaway",
    "title": "RollAway",
    "category": "personal",
    "experienceId": null,
    "course": null,
    "date": "2026-07",
    "image": null,
    "award": {
      "placement": "Winner",
      "event": "Beginner Track — MLH x DigitalOcean AI Hackathon for Social Good"
    },
    "blurb": "Hackathon-winning, map-first PWA that ranks legal, low-competition food-truck spots in San Francisco and turns the city's four-agency permit maze into one guided checklist. Scoring and legality are deterministic in code — LLMs only explain and cite.",
    "description": "Built and deployed a map-first location-intelligence and permit-planning PWA for San Francisco mobile food vendors, which won the Beginner Track at the MLH x DigitalOcean AI Hackathon for Social Good. Given a time window and starting point, the app ranks candidate blocks as good/check/avoid and surfaces the foot-traffic, competition, legality, and closure reasons behind every score. The central design decision was to keep scoring, hard constraints, travel time, and legality deterministic in code and never inside a language model: setback rules (75 ft from restaurant entrances, 500 ft from schools, hydrant clearance, sidewalk width) are encoded from SF Public Works Order 182101, and each legality check cites its source document. Language models phrase explanations and read menus and forms, always grounded in precomputed signals. Architected four managed layers — a React 19 + Vite PWA on Railway behind Caddy, reading endpoint URLs from a runtime /config.json so repointing the backend is a restart rather than a rebuild; a FastAPI agents backend on Railway serving Spot Scout, Permit Copilot, menu extraction, grounded form-fill, and an /api/* gateway; Supabase Postgres carrying a pgvector knowledge base with an HNSW cosine index plus a full year of Bay Wheels trip history folded into per-station/day-of-week/hour foot-traffic averages; and seven DigitalOcean Functions computing the signals, orchestrated by recommend_spots. Inference runs on DigitalOcean Gradient (Claude Haiku 4.5 for chat, bge-m3 for embeddings). Wired live city data feeds — DataSF/Socrata vendor permits, SFMTA closures, Google Places, Mapbox Matrix travel times — and gated releases behind an eval suite that pins the response envelope, jailbreak/PII guardrails, and citation behavior against live inference. Shipped an installable offline shell with a schematic-map fallback when Mapbox is unavailable, covered by Vitest unit tests and Playwright end-to-end suites.",
    "skills": [
      "react",
      "typescript",
      "vite",
      "pwa",
      "python",
      "fastapi",
      "supabase",
      "postgresql",
      "pgvector",
      "vector search",
      "rag",
      "embeddings",
      "llm orchestration",
      "prompt engineering",
      "anthropic claude",
      "digitalocean functions",
      "serverless",
      "railway",
      "docker",
      "caddy",
      "mapbox",
      "geospatial analysis",
      "location intelligence",
      "deterministic scoring",
      "constraint modeling",
      "data engineering",
      "socrata",
      "open data",
      "rest api",
      "playwright",
      "vitest",
      "e2e testing",
      "evaluation harness",
      "guardrails",
      "citation grounding",
      "offline-first",
      "document extraction"
    ],
    "url": "https://rollaway-frontend-production.up.railway.app/",
    "repo": "RollAway",
    "lastCommit": "2026-07-14",
    "lockedFields": [
      "description",
      "blurb",
      "url",
      "skills"
    ]
  },
  {
    "id": "ca-real-estate",
    "title": "California Real Estate Price Prediction",
    "category": "internship",
    "experienceId": "idx",
    "course": null,
    "date": "2026-04",
    "image": null,
    "blurb": "Stacked XGBoost + LightGBM ensemble on 100K+ MLS rows. Sub-8% Median Absolute Percent Error, deployed on Streamlit.",
    "description": "Built a machine learning web application that predicts single-family residence prices across California using ensemble models including XGBoost and LightGBM, trained on historical real estate data with features such as location, square footage, and property characteristics. The application was deployed via a Streamlit interface with interactive visualizations powered by Plotly, allowing users to input property details and receive price predictions in real time. Model training leveraged scikit-learn pipelines for preprocessing and hyperparameter tuning, with joblib used for efficient model serialization and deployment.",
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
      "ensemble methods",
      "machine learning",
      "regression",
      "hyperparameter tuning",
      "feature engineering",
      "model serialization",
      "data visualization",
      "real estate",
      "predictive modeling",
      "web application",
      "ml pipelines",
      "pyarrow"
    ],
    "url": "https://single-family-housing-price-predictor.streamlit.app/",
    "repo": "idx-app",
    "lastCommit": "2026-04-29"
  },
  {
    "id": "diginetica-ecomm",
    "title": "Diginetica: GNN vs. Flat Ranker for Session Recommendation",
    "category": "personal",
    "experienceId": null,
    "course": null,
    "date": "2026-06",
    "image": null,
    "lockedFields": [
      "description",
      "skills"
    ],
    "blurb": "Fair, slice-aware comparison of a heterogeneous GNN against a tuned XGBoost ranker on Diginetica (CIKM Cup 2016). A relational-time leakage audit overturned an apparent GNN win — the honest result is that the flat ranker wins every slice.",
    "description": "Built an end-to-end relational deep learning pipeline on the Diginetica (CIKM Cup 2016) e-commerce logs, using RelBench to convert the relational database into a heterogeneous graph — 8 node types (items, sessions, users plus view/query/click/queried-item/purchase events) and 22 edge types over 11 foreign-key relations. Engineered an `abs_time` event clock at microsecond resolution by folding intra-session millisecond offsets into the event date, enabling time-aware neighbor sampling that admits only neighbors strictly earlier than a per-row seed time so the receptive field never peeks at the future. Defined two tasks: session-conversion entity classification (binary, ~4% positive rate, AUPRC/AUROC) and next-item link prediction via intra-session leave-last-out on 218K sessions. The GNN is a two-tower heterogeneous GraphSAGE encoder (HeteroEncoder + temporal encoder) splitting into session and item towers scored by dot product, trained with sampled-softmax over in-batch and pool negatives. It is compared against an XGBoost LambdaRank ranker (`rank:ndcg`) over anchor-based 1-hop features — co-view, co-purchase, transition, category, popularity, price, is_repeat. A shared per-row candidate pool (co-view + transition + co-purchase + category + popularity backfill, built on train statistics only) lets both models rank the identical set, isolating ranking quality from candidate recall, with Optuna sweeps (persistent SQLite, median pruning) tuning both on Novel Recall@10. Evaluation decomposes Recall@10, NDCG@10, and MRR across slices — Repeat/Novel, popularity (Head/Torso/Tail), and session length — through a single masked `task.evaluate` code path, alongside structural ablations on hop depth, item-feature capacity, and scoring head (pooled dot vs. maxpool vs. ColBERT-style late interaction).",
    "skills": [
      "python",
      "jupyter",
      "pandas",
      "numpy",
      "scikit-learn",
      "xgboost",
      "pytorch",
      "pytorch geometric",
      "relbench",
      "relational deep learning",
      "graph neural networks",
      "heterogeneous gnn",
      "graphsage",
      "two-tower model",
      "learning to rank",
      "lambdarank",
      "optuna",
      "hyperparameter tuning",
      "link prediction",
      "next-item recommendation",
      "recommendation systems",
      "entity classification",
      "binary classification",
      "class imbalance",
      "data leakage audit",
      "temporal graphs",
      "time-aware neighbor sampling",
      "recall@k",
      "ndcg",
      "mrr",
      "auprc",
      "feature engineering",
      "e-commerce",
      "session modeling",
      "duckdb",
      "pyarrow",
      "data visualization",
      "matplotlib",
      "seaborn"
    ],
    "url": "https://github.com/nathansso/diginetica-ecomm",
    "repo": "diginetica-ecomm",
    "lastCommit": "2026-06-23"
  },
  {
    "id": "portfolio-editor",
    "title": "Portfolio Live Editor",
    "category": "personal",
    "experienceId": null,
    "course": null,
    "date": "2026-06",
    "image": null,
    "blurb": "Express.js overlay server that injects a live-edit UI into the portfolio, enabling real-time WYSIWYG edits to site.js written back to disk via REST API.",
    "description": "Built an Express.js proxy server that intercepted live HTTP responses from a personal portfolio site and injected a WYSIWYG editing overlay into every served page, enabling point-and-click content editing directly on the rendered site. The overlay communicated with a custom REST API to read and write changes to the source data file instantly, bypassing any build pipeline or recompilation step. This eliminated context-switching between the live site and raw files during content iteration, replacing manual edits with an in-place visual interface.",
    "skills": [
      "javascript",
      "node.js",
      "express.js",
      "rest api",
      "http proxy",
      "html",
      "css",
      "wysiwyg",
      "web development",
      "middleware",
      "dom manipulation",
      "server-side scripting"
    ],
    "url": "https://github.com/nathansso/portfolio_editor",
    "repo": "portfolio_editor",
    "lastCommit": "2026-06-09"
  },
  {
    "id": "ats-resume",
    "title": "ARTie(Agentic Resume Tailoring Platform)",
    "category": "personal",
    "experienceId": null,
    "course": null,
    "date": "2026-04",
    "image": null,
    "blurb": "Production web platform (React + TypeScript / FastAPI, deployed on Fly.io) that ingests resume, GitHub, and LinkedIn data into a per-user knowledge graph and tailors resumes to jobs via a multi-agent LangGraph pipeline, sentence-transformers ATS scoring, and LaTeX PDF export.",
    "description": "Built a production web platform (React 18 + TypeScript / Vite frontend, FastAPI backend, deployed on Fly.io via Docker) that tailors a resume to any job description through an AI chat workflow. Ingested resume files (.md/.docx/.pdf), GitHub repositories, and LinkedIn profiles into a per-user skills knowledge graph that links each skill to the experiences and projects that evidence it, so tailoring cites real support instead of keyword-stuffing. Drove tailoring through a LangGraph pipeline (LangChain over Anthropic/OpenAI models) that scores skills against the job, selects the strongest evidence, and drafts a one-page, ATS-friendly resume using best-of-N candidate generation with an early-exit quality bar. Layered ATS-style scoring and a conversational revision loop on top, persisted profiles via a SQLModel ORM (SQLite locally, Supabase Postgres in production) with Supabase JWT auth, and mirrored the same core pipeline through a CLI. In production the FastAPI backend serves the compiled React app as static files so a single process runs the whole product.",
    "skills": [
      "python",
      "typescript",
      "react",
      "vite",
      "fastapi",
      "sqlmodel",
      "pydantic",
      "postgresql",
      "sqlite",
      "supabase",
      "jwt auth",
      "docker",
      "fly.io",
      "langchain",
      "langgraph",
      "anthropic api",
      "openai api",
      "sentence-transformers",
      "playwright",
      "python-docx",
      "multi-agent systems",
      "llm orchestration",
      "prompt engineering",
      "rag",
      "knowledge graph",
      "semantic similarity",
      "ats engine",
      "resume parsing",
      "skill gap analysis",
      "best-of-n selection",
      "evidence grounding",
      "latex",
      "pdf export",
      "nlp",
      "rest api",
      "cli"
    ],
    "url": "https://artie-resume-tailoring.fly.dev/",
    "repo": "agentic_resume_tailoring",
    "lastCommit": "2026-07-10",
    "lockedFields": [
      "description",
      "url",
      "skills"
    ]
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
    "description": "Built classification models using Random Forest and XGBoost on 12,330 e-commerce browsing sessions to predict purchase intent, applying threshold tuning to maximize recall and reduce missed conversions, achieving approximately 90% accuracy. Applied K-Means clustering to segment shoppers into five behavioral archetypes, uncovering conversion rates ranging from 0.4% for bounce-prone visitors to 24.3% for high-intent consumers. Identified product browsing depth and administrative page engagement as the strongest purchase predictors using Python, scikit-learn, pandas, and seaborn.",
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
      "ecommerce analytics",
      "customer segmentation",
      "supervised learning",
      "unsupervised learning",
      "data visualization",
      "machine learning"
    ],
    "url": "https://github.com/nathansso/dsc207finalproject",
    "repo": "dsc207finalproject",
    "lastCommit": "2026-03-30"
  },
  {
    "id": "dsc80-notebook",
    "title": "AllRecipes Ratings Predictive Model -DSC 80",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 80",
    "date": "2025-08",
    "image": null,
    "blurb": "Pandas + scikit-learn pipeline: cleaning, imputation, feature engineering, supervised modeling on a structured dataset.",
    "description": "Without access to the actual notebook content, I can provide a description based on the detected libraries and context: This project applied machine learning techniques using scikit-learn to build predictive models on a structured dataset, leveraging pandas for data cleaning and feature engineering alongside matplotlib and plotly for interactive visualizations. The workflow followed a full data science pipeline including exploratory data analysis, preprocessing, model training, and evaluation. NumPy supported numerical computations throughout, while Plotly enabled dynamic visual insights into patterns and model performance.",
    "skills": [
      "python",
      "pandas",
      "numpy",
      "scikit-learn",
      "matplotlib",
      "plotly",
      "jupyter",
      "machine learning",
      "data visualization",
      "feature engineering",
      "exploratory data analysis",
      "data cleaning",
      "predictive modeling",
      "model evaluation",
      "data preprocessing",
      "interactive visualization",
      "structured data",
      "data science pipeline"
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
    "blurb": "Statistical modeling and ML in Python and R for domain-specific research questions under Andre Gray, PhD 2026.",
    "description": "Conducted research at UCSD using Jupyter Notebook and R to support ongoing investigative work under the supervision of Andre Gray. Applied statistical modeling and data analysis techniques to process and interpret research datasets, producing reproducible computational notebooks. Findings contributed to the broader research objectives of the lab, with workflows documented across both Python and R environments.",
    "skills": [
      "python",
      "r",
      "jupyter",
      "statistical modeling",
      "data analysis",
      "reproducible research",
      "computational notebooks",
      "data processing",
      "research methods"
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
    "description": "Built an interactive visualization of bike traffic patterns across Cambridge using JavaScript, CSS, and HTML to display real-world cyclist flow data on a dynamic map interface. Implemented filtering controls and visual encodings such as scaled markers and color gradients to communicate traffic volume and direction across different times of day. The project revealed key high-traffic corridors and peak commuting patterns throughout the Cambridge bike network.",
    "skills": [
      "javascript",
      "css",
      "html",
      "data visualization",
      "interactive maps",
      "geospatial data",
      "visual encoding",
      "ui design",
      "traffic analysis",
      "d3.js"
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
    "title": "Airbnb — San Diego Sunshine",
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
    "url": null,
    "repo": null
  },
  {
    "id": "mice-explorable",
    "title": "Of Mice and Medicine",
    "category": "undergrad",
    "experienceId": "bsmath",
    "course": "DSC 106",
    "date": "2025-03",
    "image": null,
    "blurb": "Narrative scrollable explorable of mouse body-temperature data — multi-view D3 dashboard with story mode, per-mouse tooltips, and estrus-cycle filtering.",
    "description": "Group project built in DSC 106 (Winter 2025). A multi-page interactive explorable visualization of mouse body-temperature data built with vanilla JavaScript, D3.js, HTML, and CSS. Features a narrative scrollytelling story mode that guides users through the dataset, a per-mouse detail view, pie chart breakdowns by sex and estrus phase, and an advanced analytics interface for open-ended exploration. Users can filter by sex and estrus cycle phase, adjust the time range, and hover individual data points for tooltips surfacing mouse ID and cycle status. Hosted via GitHub Pages.",
    "skills": [
      "D3.js",
      "JavaScript",
      "HTML",
      "CSS",
      "data visualization",
      "interactive viz",
      "scrollytelling",
      "time series",
      "exploratory data analysis"
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
