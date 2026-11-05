import type { Project, SkillCategory, ExploringItem, EducationEntry } from '../types/portfolio';

export const personalData = {
  name: "Diptanu Ghosh",
  title: "Computer Science & Engineering Student / Developer",
  tagline: "Engineering intelligent systems, graph-based security models, and native software with uncompromising craftsmanship.",
  location: "India",
  locationDetailed: "Naihati, West Bengal, India",
  email: "dipghosh28032005@gmail.com",
  phone: "+91 7605871770",
  availability: "Available for Internships & Engineering Roles",
  socials: {
    github: "https://github.com/blackpegasusdg",
    letterboxd: "https://letterboxd.com/blackpegasusdg/",
    instagram: "https://www.instagram.com/_ghosh.d_/"
  },
  interests: [
    "Software Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Generative AI",
    "RAG Systems",
    "Agentic AI",
    "Graph Neural Networks",
    "Android Development"
  ]
};

export const projectsData: Project[] = [
  {
    id: "trustlens",
    index: "01",
    title: "TrustLens",
    subtitle: "AI Social Authenticity & Rating Attack Analyzer",
    category: "AI & Platform Security",
    description: "An AI-powered system designed to detect coordinated rating manipulation, fake engagement clusters, and bias attacks across social platforms.",
    longDescription: "TrustLens addresses coordinated review manipulation by analyzing temporal velocity, user behavioral graph clusters, and statistical anomaly distributions. It incorporates an attack simulator to generate synthetic manipulation scenarios, paired with an API backend and interactive visualization dashboard deployed live on Vercel.",
    technologies: ["Python", "FastAPI / Flask", "Machine Learning", "Vercel", "Statistical Modeling"],
    githubUrl: "https://github.com/blackpegasusdg/Trustlens",
    liveUrl: "https://trustlens-tau.vercel.app",
    highlights: [
      "Engineered attack simulator to synthesize adversarial bot-clustering scenarios",
      "Built detection pipeline evaluating rating bursts and sentiment incongruity",
      "Full-stack deployment featuring responsive analytics on Vercel"
    ],
    architecture: [
      "Data Ingestion & Event Stream Processor",
      "Temporal Anomaly & Rating Skew Engine",
      "Adversarial Attack Simulator & Benchmark Suite",
      "Vercel Cloud Edge Deployment"
    ]
  },
  {
    id: "gnn-fraud",
    index: "02",
    title: "GNN Fraud Detection",
    subtitle: "Graph Neural Networks for Financial Transaction Graphs",
    category: "Machine Learning & Research",
    description: "A financial transaction fraud detection project exploring relational graph structures and topological anomalies between high-velocity transacting accounts.",
    longDescription: "Traditional tabular fraud detection frequently misses coordinated, multi-hop laundering and sybil rings. This project models financial ecosystems as directed, heterogeneous graphs, utilizing Graph Neural Networks (GCN / GraphSAGE) to capture topological inter-dependencies and flag coordinated transaction anomalies.",
    technologies: ["Python", "PyTorch", "PyTorch Geometric", "NetworkX", "Graph Neural Networks"],
    githubUrl: "https://github.com/blackpegasusdg",
    highlights: [
      "Constructed multi-relational transaction graphs modeling node connectivity",
      "Evaluated inductive graph representation learning across dense payment topologies",
      "Researched resistance to adversarial transaction smurfing techniques"
    ],
    architecture: [
      "Graph Feature Extractor & Node Embedding Layer",
      "Message Passing Neural Network (GNN / GraphSAGE)",
      "Anomaly Classification Head with Threshold Tuning",
      "Relational Graph Visualizer"
    ]
  },
  {
    id: "a10s-walkman",
    index: "03",
    title: "A10s Walkman",
    subtitle: "Offline Lossless FLAC Player for Android",
    category: "Android & Systems",
    description: "A high-fidelity offline audio player engineered in Kotlin with Jetpack Compose, built specifically for lossless FLAC format enthusiasts.",
    longDescription: "A dedicated mobile audiophile application designed to bypass system sound degradation and deliver bit-perfect offline FLAC decoding. Built entirely using modern Android architecture components, Jetpack Compose for declarative UI, and optimized buffer handling for high-resolution audio files.",
    technologies: ["Kotlin", "Jetpack Compose", "Android SDK", "AudioTrack / Media3", "FLAC Codecs"],
    githubUrl: "https://github.com/blackpegasusdg/A10S-Walkman",
    highlights: [
      "Hardware-efficient FLAC decoding pipeline with uncompressed audio buffering",
      "Fluid, minimalist Jetpack Compose UI adhering to modern Material 3 design",
      "Zero telemetry, fully offline music playback with custom metadata parsing"
    ],
    architecture: [
      "Low-Latency Audio Rendering Pipeline",
      "Native Storage & Audio File Scanners (SAF / MediaStore)",
      "Jetpack Compose Declarative UI & Playback Controls",
      "High-Fidelity Audio Spectrum Buffer Processor"
    ]
  }
];

export const skillsData: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: [
      { name: "Java", level: "Core Fundamental", description: "OOP, Concurrency, Enterprise Foundations, DSA" },
      { name: "Python", level: "Primary ML / Backend", description: "NumPy, PyTorch, Scripting, REST APIs" },
      { name: "C", level: "Systems & Memory", description: "Pointers, Memory Management, Systems Fundamentals" },
      { name: "Kotlin", level: "Modern Mobile", description: "Coroutines, Android Development, Jetpack Compose" },
      { name: "SQL", level: "Relational Queries", description: "Complex Joins, Indexing, Schema Modeling" },
      { name: "JavaScript", level: "Web Interactive", description: "Modern ES6+, DOM APIs, Event Systems" }
    ]
  },
  {
    name: "Development",
    skills: [
      { name: "Android (Kotlin)", level: "Native Architecture", description: "Jetpack Compose, Lifecycle, Media3, Services" },
      { name: "React & TypeScript", level: "Frontend Architecture", description: "Modern Hooks, State Systems, Type Safety" },
      { name: "HTML5 & Modern CSS", level: "Responsive Layouts", description: "Grid, Flexbox, Animation Keyframes, Accessibility" },
      { name: "REST APIs", level: "Integration", description: "API Design, Endpoint Routing, JSON Serialization" }
    ]
  },
  {
    name: "AI & Machine Learning",
    skills: [
      { name: "Machine Learning", level: "Model Lifecycle", description: "Supervised Learning, Feature Engineering, Metric Evaluation" },
      { name: "Graph Neural Networks", level: "Relational Modeling", description: "Node Classification, Link Prediction, Topological Analysis" },
      { name: "Artificial Intelligence", level: "Core Principles", description: "Search Heuristics, Pattern Recognition, Decision Logic" },
      { name: "Data Analysis", level: "Exploratory & Prep", description: "Data Cleaning, Anomaly Filtering, Distribution Analysis" }
    ]
  },
  {
    name: "Tools & Core Concepts",
    skills: [
      { name: "Data Structures & Algorithms", level: "Computer Science Core", description: "Graphs, Trees, Dynamic Programming, Complexity Analysis" },
      { name: "Object-Oriented Programming", level: "Architecture", description: "Encapsulation, Polymorphism, Design Patterns" },
      { name: "DBMS", level: "Database Systems", description: "Relational Integrity, Normalization, ACID Transactions" },
      { name: "Git & GitHub", level: "Version Control", description: "Branching, Collaboration, CI Workflows, Releases" }
    ]
  }
];

export const exploringData: ExploringItem[] = [
  {
    id: "gen-ai",
    topic: "Generative AI",
    category: "Foundation Models",
    focus: "Transformer architectures, tokenization mechanics, and prompt optimization strategies for structured synthesis.",
    description: "Investigating modern LLM scaling behaviors, latency-budget trade-offs, and fine-tuning methodologies.",
    status: "Deep Diving"
  },
  {
    id: "rag",
    topic: "Retrieval-Augmented Generation (RAG)",
    category: "Knowledge Augmentation",
    focus: "Hybrid sparse/dense vector search, chunking strategies, and re-ranking pipelines to eliminate hallucination.",
    description: "Developing context-aware retrieval pipelines connecting vector databases with LLM orchestrators.",
    status: "Building Prototypes"
  },
  {
    id: "agentic-ai",
    topic: "Agentic AI",
    category: "Autonomous Systems",
    focus: "Multi-turn planning loops, tool calling protocols, state reconciliation, and multi-agent consensus networks.",
    description: "Exploring autonomous workflow execution where models reason, critique, and self-correct across multi-step tasks.",
    status: "Building Prototypes"
  },
  {
    id: "gnn",
    topic: "Graph Neural Networks",
    category: "Non-Euclidean ML",
    focus: "Spatial message passing, heterogeneous graphs, and dynamic financial fraud topology modeling.",
    description: "Advancing graph representation learning beyond euclidean boundaries for interconnected transaction security.",
    status: "Researching"
  },
  {
    id: "dsa-daa",
    topic: "Advanced Java DSA & DAA",
    category: "Algorithmic Rigor",
    focus: "Design & Analysis of Algorithms, amortized complexity, advanced graph algorithms, and memory-conscious data structures.",
    description: "Strengthening mathematical foundations and optimization techniques in high-concurrency Java environments.",
    status: "Deep Diving"
  }
];

export const educationData: EducationEntry = {
  degree: "B.Tech in Computer Science and Engineering",
  field: "Computer Science & Engineering",
  institution: "Academy of Technology",
  location: "West Bengal, India",
  period: "Undergraduate Program",
  status: "In Progress",
  highlights: [
    "Rigorous curriculum covering Data Structures, Algorithms, Operating Systems, Database Management Systems, and Theory of Computation.",
    "Active member of developer and computing initiatives, applying algorithmic concepts to practical software engineering.",
    "Focus on system architecture, machine learning implementations, and software performance optimization."
  ]
};

