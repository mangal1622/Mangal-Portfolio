import { PortfolioData } from '../types/portfolio';

export const portfolioData: PortfolioData = {
  personal: {
    name: "MANGAL PANDEY",
    role: "{ SOFTWARE DEVELOPER }",
    title: "AI & Full-Stack Systems Engineer",
    tagline: "BUILDING INTELLIGENT SYSTEMS FOR A BETTER TOMORROW",
    shortBio: "I'm Mangal Pandey, a developer who loves turning ideas into real-world solutions. I work at the intersection of AI, software, and creative technology — building systems that make a difference.",
    longBio: "Passionate about building scalable distributed systems, computer vision models, and expressive interactive web interfaces. Driven by curiosity and dedicated to crafting engineering solutions with artistic precision.",
    email: "mangal@example.com",
    linkedin: "linkedin.com/in/mangal",
    github: "github.com/mangal",
    location: "India",
    stats: {
      experience: "3+",
      projectsCount: "10+",
      ideasCount: "∞"
    },
    metaPillars: [
      "// PASSION",
      "// PROBLEM SOLVING",
      "// CONTINUOUS LEARNING",
      "// REAL WORLD IMPACT"
    ]
  },
  projects: [
    {
      id: "crop-health-ai",
      number: "03 / 01",
      title: "AgroMitR",
      subtitle: "Computer Vision",
      category: "AI & Computer Vision",
      tags: ["AI", "COMPUTER VISION", "FASTAPI", "REACT"],
      description: "An AI-powered system to detect plant diseases from leaf images, helping farmers take faster and smarter decisions with 98.4% diagnostic accuracy.",
      liveUrl: "https://agromitr.vercel.app/",
      githubUrl: "https://github.com/mangal1622/AgroMitR",
      featured: true,
      image: "/images/agromitr-logo.png",
      metrics: {
        accuracy: "98.4%",
        latency: "140ms",
        users: "12k+"
      },
      diagnostics: [
        {
          label: "Healthy",
          confidence: 98.4,
          status: "optimal",
          color: "#10b981",
          details: "Optimal chlorophyll cellular density. No parasitic fungal lesions or viral pathogens detected."
        },
        {
          label: "Leaf Blight",
          confidence: 87.2,
          status: "warning",
          color: "#f59e0b",
          details: "Early necrotic tissue spotting along peripheral veins. Responsive to copper fungicide."
        },
        {
          label: "Rust Disease",
          confidence: 91.0,
          status: "warning",
          color: "#f97316",
          details: "Puccinia fungal spore pustules developing on lower epidermal surfaces."
        },
        {
          label: "Early Scorch",
          confidence: 84.5,
          status: "critical",
          color: "#ef4444",
          details: "Severe marginal chlorosis caused by bacterial scorch. Immediate containment suggested."
        }
      ]
    },
    {
      id: "WeatherPro",
      number: "03 / 02",
      title: "WEATHERPRO",
      subtitle: "Weather Forecasting",
      category: "Full Stack & EdTech",
      tags: ["REACT", "NODE.JS", "EXPRESS", "MONGODB", "TAILWIND"],
      description: "A comprehensive educational marketplace connecting instructors with students worldwide, featuring interactive course players and payments.",
      liveUrl: "https://weather-pro-tau.vercel.app",
      githubUrl: "https://github.com/mangal1622/WeatherPro",
      featured: true,
      image: "/images/weatherpro-logo.png",
      metrics: {
        users: "45k+",
        stars: "1.2k"
      }
    },
    {
      id: "portfolio-3",
      number: "03 / 03",
      title: "PORTFOLIO 3.0",
      subtitle: "Creative Web",
      category: "Creative Engineering",
      tags: ["THREE.JS", "WEBGL", "REACT", "TYPESCRIPT", "TAILWIND"],
      description: "An experimental sci-fi digital interface portfolio utilizing WebGL particle systems, real-time image pixel synthesis, and cinematic sound design.",
      liveUrl: "https://mangal.dev",
      githubUrl: "https://github.com/mangal/portfolio-3.0",
      featured: true,
      image: "/images/portfolio-logo.png"
    },
    {
      id: "ai-resume-parser",
      number: "03 / 04",
      title: "AI RESUME PARSER",
      subtitle: "NLP • Automation",
      category: "Machine Learning & NLP",
      tags: ["PYTHON", "NLP", "SPACY", "FASTAPI", "STREAMLIT"],
      description: "Automated candidate assessment pipeline parsing PDF/DOCX resumes, extracting skill vectors, and matching job descriptions with semantic embeddings.",
      liveUrl: "https://resume-ai.example.com",
      githubUrl: "https://github.com/mangal/ai-resume-parser",
      featured: true,
      image: "/images/resume-parser-logo.png",
      metrics: {
        accuracy: "96.1%",
        latency: "320ms"
      }
    },
    {
      id: "more-projects",
      number: "03 / 05",
      title: "NEURAL SENTINEL",
      subtitle: "Coming Soon",
      category: "Autonomous Systems",
      tags: ["PYTORCH", "CUDA", "ROBOTICS", "DOCKER"],
      description: "Edge-computed real-time anomaly detection system for autonomous aerial vehicles and industrial robotics telemetry.",
      featured: false,
      image: "/images/neural-sentinel-logo.png"
    }
  ],
  technologies: [
    {
      name: "Python",
      category: "core",
      icon: "python",
      level: 95,
      experience: "3+ Years",
      description: "Core language for AI/ML pipelines, FastAPI microservices, automated data analysis, and mathematical computing.",
      featuredProjects: ["Crop Health AI", "AI Resume Parser"]
    },
    {
      name: "React",
      category: "framework",
      icon: "react",
      level: 92,
      experience: "3+ Years",
      description: "Building responsive, reactive component-based web interfaces, state management, and real-time interactive systems.",
      featuredProjects: ["Crop Health AI", "StudyNotion", "Portfolio 3.0"]
    },
    {
      name: "Next.js",
      category: "framework",
      icon: "nextjs",
      level: 88,
      experience: "2+ Years",
      description: "Server-side rendering, App Router, optimized API routes, and high-performance production web applications.",
      featuredProjects: ["NextGen LMS", "Portfolio"]
    },
    {
      name: "MongoDB",
      category: "core",
      icon: "mongodb",
      level: 85,
      experience: "2+ Years",
      description: "NoSQL document modeling, high-throughput aggregation pipelines, indexing, and scalable cloud databases.",
      featuredProjects: ["StudyNotion", "Auth Service"]
    },
    {
      name: "AWS",
      category: "cloud",
      icon: "aws",
      level: 82,
      experience: "2+ Years",
      description: "Cloud infrastructure, S3 bucket management, EC2 compute scaling, Lambda serverless functions, and CloudFront CDN.",
      featuredProjects: ["StudyNotion Cloud", "AI Inference API"]
    },
    {
      name: "Figma",
      category: "design",
      icon: "figma",
      level: 85,
      experience: "3+ Years",
      description: "UI/UX wireframing, high-fidelity dark sci-fi design systems, component libraries, and interactive prototypes.",
      featuredProjects: ["All Projects Design Systems"]
    },
    {
      name: "GSAP",
      category: "tool",
      icon: "gsap",
      level: 90,
      experience: "2+ Years",
      description: "High-performance timeline choreography, kinetic typography, SVG morphing, and silky-smooth scroll animations.",
      featuredProjects: ["Portfolio 3.0", "Interactive Showcases"]
    },
    {
      name: "Tailwind",
      category: "framework",
      icon: "tailwind",
      level: 95,
      experience: "3+ Years",
      description: "Utility-first rapid styling, dark mode configuration, custom glowing design tokens, and modular layouts.",
      featuredProjects: ["StudyNotion", "Portfolio 3.0", "Crop Health AI"]
    }
  ],
  journey: [
    {
      year: "2026",
      period: "Present",
      title: "Building AI Products",
      description: "Working on impactful AI & software solutions. Architecting scalable computer vision inference pipelines and next-generation developer tooling.",
      skills: ["PyTorch", "FastAPI", "React", "Distributed Systems"],
      highlight: true
    },
    {
      year: "2025",
      title: "Freelance Developer",
      description: "Engineered robust web and mobile applications for global clients. Specialized in full-stack architecture, API design, and intuitive interfaces.",
      skills: ["Next.js", "React Native", "TypeScript", "Node.js"]
    },
    {
      year: "2024",
      title: "Explored AI & ML",
      description: "Deepened expertise in computer vision, convolutional neural networks, and NLP transformers. Built early plant disease detection models.",
      skills: ["Python", "TensorFlow", "OpenCV", "Scikit-Learn"]
    },
  ],
  socials: {
    email: "mangalpandey2305@example.com",
    linkedin: "https://linkedin.com/in/mangal-pandey-66a2293a5",
    github: "https://github.com/mangal1622",
    location: "India"
  }
};
