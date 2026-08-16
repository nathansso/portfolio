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
  // Hero photo rotation. Add an entry per photo — `label` renders bottom-left,
  // `place` bottom-right. Falls back to `photo` above if this list is empty.
  // Optional: "fit": "contain" letterboxes instead of cropping (use for wide
  // group shots that a 4:5 crop would cut people out of), and "position" sets
  // object-position, e.g. "50% 30%" to favor the top of the frame.
  "photos": [
    {
      "src": "imgs/porto_pic.jpg",
      "alt": "Nathaniel Oliver in Porto, Portugal",
      "label": "NSO · 2025",
      "place": "Porto / PT"
    },
    {
      "src": "imgs/frontier-tower-demo.jpg",
      "alt": "Nathaniel Oliver presenting at Frontier Tower",
      "label": "Demo day",
      "place": "Frontier Tower / SF"
    },
    {
      "src": "imgs/frontier-tower-team.jpg",
      "alt": "Nathaniel Oliver with his team at Frontier Tower",
      "label": "The team",
      "place": "Frontier Tower / SF"
    },
    {
      "src": "imgs/mlh-digitalocean.jpg",
      "alt": "Nathaniel Oliver and teammates at the MLH x DigitalOcean AI Hackathon for Social Good",
      "label": "AI for Social Good",
      "place": "MLH × DigitalOcean",
      "fit": "contain"
    }
  ],
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
    "projectIds": []
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
    "projectIds": []
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
    "id": "atrium",
    "title": "Atrium",
    "category": "personal",
    "experienceId": null,
    "course": null,
    "date": "2026-08-03",
    "image": null,
    "award": {
      "placement": "1st Overall",
      "event": "Memory Meets Motion Hackathon — hosted by Devnovate at Frontier Tower, San Francisco"
    },
    "blurb": "Learn anything with a single search. Atrium researches the web, builds a cited curriculum, and stress-tests it in a simulated classroom — then rewrites the lesson around the misconception it actually produced. Won 1st Place Overall at Memory Meets Motion.",
    "description": "Built the 1st Place Overall winner of the Memory Meets Motion Hackathon (Devnovate, Frontier Tower SF): an adaptive curriculum system that turns one search into a taught, tested, and rewritten lesson. The research phase uses Firecrawl to search the web and return ranked sources, which Atrium then evaluates — binding every claim to a citation, ordering concepts by dependency, and chunking material into sequenced lessons with comprehension checks. The classroom phase runs that lesson against a simulated class, so a curriculum fails in front of a simulator instead of in front of students. Everything lands in a FalkorDB knowledge graph with a deliberate dual structure: a research half tracking Source → Lesson → Concept (where content came from) and a classroom half tracking Student → Misconception → Concept (what failed and why), joined at shared Concept nodes. The central modeling decision was to treat a misconception as its own node rather than a low score or a missing edge — two students both scoring 40% on a concept can be stuck for entirely different reasons — so a single Cypher traversal groups students by the barrier they actually share and walks it straight back to the web page that taught it badly, a precision impossible in flat tables or embedding space. Guild.ai splits the decisions across nine specialist agents (curriculum research, assignment architect, student memory, grouping, accessibility, assignment curator, assessment, classroom evolution, lesson planner), and RocketRide runs what they decide as chained pipelines: a shared misconception rewrites the lesson for that room, those results rewrite tomorrow's plan, and updated mastery — tracked with Bayesian Knowledge Tracing — regroups a different set of students the next day. Every submission and agent decision lands on a durable LaserData (Apache Iggy) event stream, so the classroom moves in real time with full replayability. Two human gates cannot be disabled: low-confidence grades pause for educator review, and final lesson plans require sign-off before reaching students. Shipped as a Next.js + TypeScript app with a custom canvas isometric classroom renderer (no game engine), deployed on Railway via Docker.",
    "skills": [
      "typescript",
      "next.js",
      "react",
      "node.js",
      "falkordb",
      "knowledge graph",
      "cypher",
      "graph traversal",
      "graphrag",
      "firecrawl",
      "web scraping",
      "retrieval",
      "citation grounding",
      "multi-agent systems",
      "guild.ai",
      "agent orchestration",
      "llm orchestration",
      "prompt engineering",
      "rocketride",
      "pipeline orchestration",
      "laserdata",
      "apache iggy",
      "event streaming",
      "event sourcing",
      "real-time systems",
      "bayesian knowledge tracing",
      "simulation",
      "human-in-the-loop",
      "canvas rendering",
      "isometric rendering",
      "docker",
      "railway",
      "vitest",
      "edtech"
    ],
    "url": "https://atrium-web-production-164a.up.railway.app",
    "repo": "Atrium.",
    "lastCommit": "2026-08-06",
    "lockedFields": [
      "description",
      "blurb",
      "url",
      "skills"
    ]
  },
  {
    "id": "alongside",
    "title": "Alongside",
    "category": "personal",
    "experienceId": null,
    "course": null,
    "date": "2026-07-25",
    "image": null,
    "blurb": "A longitudinal treatment companion for cancer patients, built end to end in Jac at JacHacks SF. Relevance is reachability, not similarity — a concern surfaces only when it's reachable from the anchor a check-in touches, which lets the graph find convergence and absence that top-k retrieval cannot produce at any k.",
    "description": "Built at JacHacks SF: a longitudinal treatment companion that helps a cancer patient advocate for himself with a record he actually has — not to diagnose, and never to contact anyone's doctor. The design problem is that a patient is the last person positioned to see a gradual decline: day to day the change sits below the threshold of perception, so the symptoms that matter arrive at appointments compressed into 'I've been okay, I guess.' Meanwhile prescriptions accumulate across oncology, primary care, and urgent care from clinicians who don't share notes, and two individually safe drugs are not jointly safe. The core architectural claim is that relevance is reachability, not similarity. Check-ins are wired into the graph against the medications, symptoms, and instructions they are about, so remembering is a walk across those edges rather than a nearest-neighbor lookup — which buys two findings top-k cannot produce at any k. Convergence: two drugs from two prescribers meeting at one toxicity through a shared node, a three-hop path that keyword or embedding search would never assemble. Absence: a symptom with no attributing edge, a prescription with no adherence record, a gap in the check-in chain — a retriever cannot rank a document that does not exist, but a graph can point at the missing edge, so the record says 'not in your record' instead of 'safe.' Modeled three node layers — a provenance floor (Utterance, Observation) that is never scored, a deterministic anchor layer, and a belief layer that is the only thing scored — so stale beliefs sink below a waterline without ever touching what the patient actually said. Traversal runs two channels: Channel A (soft preferences) is scored, beam-limited, and decaying, while Channel B (hard constraints) is exhaustive, unscored, and exempt from both decay and budget, killable only by an explicit Supersedes edge, with emergencies evaluated first. Implemented six walkers (Vigil, Remember, Recall, Consolidate, Investigate, Prepare) against a hard two-call autonomy budget: exactly two by llm() sites, both on the write path, leaving the read path with zero model calls. Deliberately refused visit [-->] by llm() — letting the model choose the traversal would void the Channel B guarantee — and covered the read path with roughly fifty MockLLM tests. Object-Spatial Programming makes traversal first-class, so the safety property is the literal control flow rather than a slogan, and marking every model call as the token by llm() turns the autonomy budget into a greppable invariant. Shipped as a single-file full-stack vertical slice: main.jac holds the schema, both model-call sites, the traversal, the templates, and the UI, deployed on JacHammer as one git-native artifact with no separate frontend and no separate Python service. Output is a page, not a message — a standing 'Questions for your care team' document that accumulates and drains, laid out as a severity ladder, where every row cites the exact quote it came from and expands into a case file back to first onset. The system has no outbound path by design: the patient carries it.",
    "skills": [
      "jac",
      "jaseci",
      "object-spatial programming",
      "jachammer",
      "graph traversal",
      "knowledge graph",
      "graph modeling",
      "provenance tracking",
      "constraint modeling",
      "deterministic retrieval",
      "llm orchestration",
      "prompt engineering",
      "agentic workflows",
      "walkers",
      "full-stack",
      "single-file architecture",
      "web speech api",
      "voice input",
      "citation grounding",
      "safety engineering",
      "mocking",
      "unit testing",
      "test-driven development",
      "healthcare",
      "clinical informatics",
      "drug interaction modeling",
      "patient-reported outcomes"
    ],
    "url": null,
    "repo": "Alongside",
    "lastCommit": "2026-07-27",
    "lockedFields": [
      "description",
      "blurb",
      "url",
      "skills"
    ]
  },
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
    "lastCommit": "2026-07-20",
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
    "description": "Built a machine learning web application that predicts single-family residence prices across California ZIP codes using an ensemble of XGBoost and LightGBM models trained on historical real estate transaction data. The Streamlit-powered interface allows users to input property features and receive price predictions alongside interactive Plotly visualizations of market trends and comparable properties. Feature engineering and preprocessing pipelines were constructed with scikit-learn to handle geographic, structural, and demographic variables that drive residential property valuations.",
    "skills": [
      "python",
      "machine learning",
      "xgboost",
      "lightgbm",
      "scikit-learn",
      "streamlit",
      "pandas",
      "numpy",
      "plotly",
      "ensemble methods",
      "feature engineering",
      "data visualization",
      "gradient boosting",
      "regression",
      "scipy",
      "joblib",
      "matplotlib",
      "pyarrow",
      "real estate",
      "geospatial data",
      "predictive modeling",
      "data preprocessing",
      "web application",
      "interactive dashboard",
      "requests"
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
    "description": "Built an Express.js proxy server that intercepted live HTTP responses from a personal portfolio site and injected a WYSIWYG editing overlay into every served page, enabling point-and-click content editing directly on the rendered site. The overlay communicated with a custom REST API to read and write changes to a source JSON data file in real time, bypassing any build pipeline or recompilation step. This replaced manual source file edits with an in-place visual interface, eliminating context-switching between the live site and raw data files during content iteration.",
    "skills": [
      "javascript",
      "node.js",
      "express.js",
      "rest api",
      "html",
      "css",
      "http proxy",
      "wysiwyg",
      "middleware",
      "json",
      "web development",
      "dom manipulation"
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
    "lastCommit": "2026-08-09",
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
      "machine learning",
      "threshold tuning",
      "feature importance",
      "customer segmentation",
      "behavioral analysis",
      "ecommerce analytics",
      "predictive modeling",
      "data visualization",
      "imbalanced classes",
      "conversion optimization"
    ],
    "url": "https://github.com/nathansso/dsc207finalproject",
    "repo": "dsc207finalproject",
    "lastCommit": "2026-03-30"
  }
];
// PROJECTS_AUTO_END

// Compute counts for the filter UI
for (const p of PROJECTS) {
  if (CATEGORIES[p.category]) CATEGORIES[p.category].count++;
}




// ============================================================
//  Reading list
//  Papers, books, articles, and other media worth sharing.
//  `image` (manual) always wins; `thumb` is filled by the
//  `npm run thumbs` generator (first page of a paper, etc.).
// ============================================================
export const READING_TYPES = {
  "paper":   { "id": "paper",   "label": "Paper",   "hue": 250 },
  "book":    { "id": "book",    "label": "Book",    "hue": 145 },
  "article": { "id": "article", "label": "Article", "hue": 305 },
  "media":   { "id": "media",   "label": "Media",   "hue": 25  }
};

export const READING = [
  {
    "id": "codified-fsm",
    "title": "Codified Finite-state Machines for Role-playing",
    "authors": "Peng, Hou, Zhou, Shang (2026)",
    "type": "paper",
    "date": "2026-07",
    "link": "https://arxiv.org/abs/2602.05905",
    "image": null,
    "note": "",
    "tags": ["llm", "role-playing", "finite-state-machines"]
  },
  {
    "id": "relbench-benchmark",
    "title": "RelBench: A Benchmark for Deep Learning on Relational Databases",
    "authors": "Robinson, Ranjan, Hu, Huang, Han, Dobles, Fey, Lenssen, et al. (2024)",
    "type": "paper",
    "date": "2026-06",
    "link": "https://arxiv.org/abs/2407.20060",
    "image": null,
    "note": "",
    "tags": ["relational-dl", "gnn", "benchmarks"]
  },
  {
    "id": "relational-deep-learning",
    "title": "Relational Deep Learning: Graph Representation Learning on Relational Databases",
    "authors": "Fey, Hu, Huang, Lenssen, Ranjan, Robinson, Ying, You, Leskovec (2023)",
    "type": "paper",
    "date": "2026-06",
    "link": "https://arxiv.org/abs/2312.04615",
    "image": null,
    "note": "",
    "tags": ["relational-dl", "gnn", "representation-learning"]
  },
  {
    "id": "attention-is-all-you-need",
    "title": "Attention Is All You Need",
    "authors": "Vaswani, Shazeer, Parmar, et al. (2017)",
    "type": "paper",
    "date": "2026-05",
    "link": "https://arxiv.org/abs/1706.03762",
    "image": null,
    "note": "",
    "tags": ["transformers", "nlp", "foundational"]
  }
];




// ============================================================
//  Blog
//  Short posts about recent achievements & events.
//  `body` supports blank-line paragraphs and **bold**.
//  `images` are paths into imgs/blog/ (first = header image).
// ============================================================
export const POSTS = [
  {
    "id": "atrium-hackathon-win",
    "title": "Atrium won 1st Place Overall at the Memory Meets Motion Hackathon",
    "date": "2026-08-03",
    "tags": ["hackathon", "award", "atrium", "agentic ai"],
    "blurb": "Dat Nguyen, Bryan Pham, Manny Vazquez, and I formed our own terrifying quartet and won 1st Place Overall at Memory Meets Motion, hosted by Devnovate at Frontier Tower in San Francisco. Our aim was simple: learn anything with a single search.",
    "body": "Dat Nguyen, Bryan Pham, Manny Vazquez, and I formed our own terrifying quartet, winning 🥇 **1st Place Overall** at the Memory Meets Motion Hackathon hosted by Devnovate at Frontier Tower in San Francisco.\n\nOur aim was simple. Learn anything with a single search.\n\nSo we built **Atrium**. It explores the internet, does the research for you, builds a curriculum, and then tests it in the classroom.\n\nFirecrawl searches the web and returns ranked sources. Atrium evaluates them, binding claims to citations, orders concepts, and chunks material into sequenced lessons with comprehension checks.\n\nThen we take the lesson to a simulated classroom.\n\nIt all lands in a FalkorDB knowledge graph: each lesson wired to the sources that taught it, each student wired to the concepts they've mastered and the misconceptions blocking the rest.\n\nYou can group students by the misconception they share, then walk it straight back to the web page that taught it badly.\n\nUsing Guild.ai, Atrium splits the decisions across eight specialist agents: one forms rooms around a shared misconception, one grades and names what went wrong.\n\nRocketRide runs what they decide, each pipeline fed by the one before it:\n\nA shared misconception rewrites the lesson for that room. Those results rewrite tomorrow's plan.\n\nAnd that mastery is reflected in the graph, so tomorrow's lesson groups a different set of students. **The classroom remembers.**\n\nEvery submission and agent decision lands on a durable event stream, courtesy of LaserData; the classroom moves in real time with full replayability.\n\nHuge thanks to my teammates Dat Nguyen, Bryan Pham, and Manny Vazquez. And to Firecrawl, FalkorDB, RocketRide, Guild.ai, and LaserData, whose tech held up the build.\n\nYou can try the [live demo here](https://atrium-web-production-164a.up.railway.app) or read the [code on GitHub](https://github.com/nathansso/Atrium.).",
    "images": [],
    "link": "projects.html#atrium"
  },
  {
    "id": "alongside-jachacks",
    "title": "Alongside: building a treatment companion for my grandfather at JacHacks",
    "date": "2026-07-25",
    "tags": ["hackathon", "jac", "alongside", "graphs"],
    "blurb": "My grandfather has cancer. I see him every few years, and the change is always stark — he doesn't notice, because he's living the slope. At JacHacks SF we built Alongside, a longitudinal treatment companion where relevance is reachability, not similarity.",
    "body": "My grandfather has cancer. I see him every few years, and the change is always stark. He doesn't notice, because he is living the slope: day to day the change sits below the threshold of perception, and the person inside a gradual decline is the last one positioned to see it. I only see the endpoints.\n\nThe same blind spot runs through his care. Patients collect prescriptions from oncology, primary care, and urgent care — clinicians who do not share notes. Two doctors each prescribe something safe; nobody was in both rooms; together they are not safe. Meanwhile the symptoms that matter most happen between visits and arrive compressed into \"I've been okay, I guess.\"\n\nSo at **JacHacks SF** we built **Alongside**: a longitudinal treatment companion that sees the endpoints and the slope at once. Not to diagnose, not to talk to anyone's doctor, but to help a patient advocate for himself with a record he actually has.\n\nIt checks in daily, by typing or by voice — voice is one tap for the days typing is the barrier, because a tired day should not become a missing day. A tingling hand becomes a dated observation. \"The copay was rough\" becomes the reason you skipped Tuesday, which is a completely different conversation from skipping over side effects.\n\n**The graph is the memory.** Check-ins are wired to the medications, symptoms, and instructions they are about, rather than stored to be searched. Remembering is a walk across those connections, so a concern surfaces only when it is reachable from the anchor a check-in touches. **Relevance is reachability, not similarity.**\n\nThat buys two findings top-k retrieval cannot produce at any k.\n\n**Convergence:** two drugs, two prescribers, one toxicity through a shared node — a three-hop path that keyword or embedding search would never assemble.\n\n**Absence:** a symptom with no attributing edge, a script with no adherence record, a gap in the check-in chain. A retriever cannot rank a document that does not exist; a graph points at the missing edge. So the record says \"not in your record\" instead of \"safe.\"\n\nThe output is a page, not a message: \"Questions for your care team,\" a standing document that accumulates and drains. Every row cites the exact quote it came from and expands into a case file back to first onset. The system never sends anything to anyone. You carry it.\n\nWe built it end to end in **Jac** on JacHammer — 95.2% Jac, which I am unreasonably proud of. Six walkers, and a hard budget of exactly two `by llm()` sites, both on the write path, so the read path makes zero model calls. We refused `visit [-->] by llm()` on purpose: letting the model pick the path would void the guarantee that hard constraints are checked exhaustively. Object-Spatial Programming makes traversal first-class, so the safety property lives in the control flow instead of in a README.\n\nThe one thing that never ships is an outbound path. Alongside renders a page, and the patient carries it.",
    "images": [],
    "link": "projects.html#alongside"
  },
  {
    "id": "rollaway-hackathon-win",
    "title": "RollAway won the Beginner Track at the MLH × DigitalOcean AI Hackathon",
    "date": "2026-07",
    "tags": ["hackathon", "award", "rollaway"],
    "blurb": "I spent the weekend pretending I knew how to code — and somehow won my first-ever hackathon. In under 24 hours we built RollAway, a map-first copilot for SF's mobile food vendors.",
    "body": "Spent this entire weekend pretending I knew how to code. Somehow, I ended up winning my first-ever hackathon.\n\nOn Friday, I joined the Major League Hacking x DigitalOcean AI for Social Good hackathon with Bryan Pham and Dat Nguyen, and in less than 24 hours we built **RollAway**, a map-first copilot for SF's mobile food vendors.\n\n**The problem:** Local vendors are competing in a $2 billion industry with razor-thin margins, where one slow day or an out-of-order permit can put you out of business.\n\nWe built RollAway to close that gap. Tell it your vendor type, menu, and range, and it scores real locations on foot traffic, competition, and legality, then turns the permit process into a verified, deadline-aware checklist.\n\nWorking with a new tech stack, fixing broken deployments at 2 am, and coding on trains with no wifi (ironic, for an app about vendors who can't afford to be offline) meant we spent half the weekend debugging issues unrelated to our actual idea.\n\nThe one part that never gave us trouble was our inference layer. It ran seamlessly on DigitalOcean's Gradient AI throughout the weekend, with no babysitting required.\n\nThank you to my teammates Bryan Pham and Dat Nguyen for pretending to know how to code with me, and a massive thanks to Major League Hacking and DigitalOcean for a great first hackathon.\n\nYou can check out our live demo [here](https://rollaway-frontend-production.up.railway.app/).",
    "images": [],
    "link": "projects.html#rollaway"
  }
];




// Helpers
// Accepts "YYYY-MM" or "YYYY-MM-DD". A day component, when present, is rendered
// ("Jul 25, 2026"); month-only values keep the original format ("Jul 2026").
// Both forms sort correctly under a plain string compare, which is how the
// projects grid and the blog feed order themselves.
export function fmtDate(date) {
  if (!date) return '';
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('en-US',
    d ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'short' });
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
