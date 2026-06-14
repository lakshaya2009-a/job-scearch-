import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters as mandated by specifications
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Seed data representing realistic top Indian IT & Startup roles
const SEED_JOBS = [
  {
    id: "1",
    company: "Swiggy India",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&h=100&fit=crop",
    role: "Senior Software Engineer (Backend)",
    location: "Bangalore (HSR Layout)",
    salary: "28 - 35 LPA",
    experience: "5+ years",
    noticePeriod: "30 days",
    workMode: "Hybrid",
    description: "Build robust distributed microservices handling millions of orders a day. Work closely with logistics, checkout, and search ranking systems.",
    skillsRequired: ["Java", "Spring Boot", "Microservices", "Redis", "Kafka", "PostgreSQL"],
    applySteps: "1. Resume Screening | 2. Machine Coding | 3. System Design | 4. HM Interview"
  },
  {
    id: "2",
    company: "Razorpay",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    role: "Core Payments Platform Engineer",
    location: "Bangalore",
    salary: "18 - 24 LPA",
    experience: "3+ years",
    noticePeriod: "30 days (Buy-out available)",
    workMode: "In-office",
    description: "Design and implement payment processing nodes, banking gateways, and high-throughput transactional flows supporting India's UPI infrastructure.",
    skillsRequired: ["Go", "Go-Micro", "Docker", "MySQL", "gRPC", "Distributed Routing"],
    applySteps: "1. Online Assessment | 2. Backend Design | 3. Culture Fitment"
  },
  {
    id: "3",
    company: "TCS Research",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop",
    role: "AI & NLP Specialist",
    location: "Pune (Hinjewadi)",
    salary: "12 - 18 LPA",
    experience: "2-4 years",
    noticePeriod: "90 days",
    workMode: "Hybrid",
    description: "Advance internal AI initiatives, working on custom enterprise chatbots, retrieval models, and multi-lingual translation layers for manufacturing client bases.",
    skillsRequired: ["Python", "PyTorch", "Hugging Face", "NLP", "LLMs", "Retrieval Augmented Generation (RAG)"],
    applySteps: "1. Technical Test | 2. Research Panel Panel Presentation | 3. HR Discussion"
  },
  {
    id: "4",
    company: "Zomato",
    logo: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=100&fit=crop",
    role: "Frontend Engineer (React / React Native)",
    location: "Gurgaon",
    salary: "20 - 28 LPA",
    experience: "4+ years",
    noticePeriod: "Immediate",
    workMode: "In-office",
    description: "Craft pixel-perfect, highly responsive frontend screens for consumer ordering platforms. Track performance and optimize core-web vitals aggressively.",
    skillsRequired: ["React", "TypeScript", "React Native", "Tailwind CSS", "Redux Toolkit", "Web Performance"],
    applySteps: "1. Portfolio Review | 2. Component Design | 3. HM Round"
  },
  {
    id: "5",
    company: "Flipkart Commerce",
    logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop",
    role: "Systems Development Engineer 1",
    location: "Hyderabad",
    salary: "15 - 20 LPA",
    experience: "1-3 years",
    noticePeriod: "60 days",
    workMode: "Hybrid",
    description: "Involved in optimizing warehouse inventory algorithms, pricing pipelines, and search index updates for seasonal sales events.",
    skillsRequired: ["Java", "C++", "System Design", "SQL", "Spring Boot", "Data Structures"],
    applySteps: "1. Coding Assessment | 2. DSA Technical Panel | 3. System Design Basics"
  },
  {
    id: "6",
    company: "Cred",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop",
    role: "Product & UI Developer",
    location: "Bangalore (Indiranagar)",
    salary: "25 - 32 LPA",
    experience: "3+ years",
    noticePeriod: "30 days",
    workMode: "Hybrid",
    description: "Create sleek, highly interactive, almost gamified visual experiences. High-fidelity layouts, micro-animations, custom canvases.",
    skillsRequired: ["TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", "WebGL", "Creative Design"],
    applySteps: "1. Design Critique | 2. UI Engineering Live Assignment | 3. Culture Fit"
  },
  {
    id: "7",
    company: "Tech Mahindra",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop",
    role: "Associate Cloud Architect",
    location: "Noida",
    salary: "8 - 12 LPA",
    experience: "2-5 years",
    noticePeriod: "90 days",
    workMode: "Remote",
    description: "Manage migration projects from local data centers to AWS/GCP, setting up serverless resources and establishing secure corporate subnets.",
    skillsRequired: ["AWS", "Terraform", "Kubernetes", "Linux Shell", "IAM Security", "Networking"],
    applySteps: "1. Certification Screening | 2. Cloud Architecture Panel | 3. Project Lead Round"
  }
];

// Helper to interact with Gemini gracefully
async function runGeminiJSON<T>(prompt: string, schema: any, systemPrompt: string = ""): Promise<T> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt || "You are a professional recruiting assistant specialized in the Indian IT and Startup job markets.",
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as T;
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    throw new Error(error.message || "Unable to parse responses from AI.");
  }
}

// ENDPOINTS

// 1. Search and match Indian Job Listings using seeded criteria + AI-enhanced search relevance
app.post("/api/search-jobs", async (req, res) => {
  const { query, location, experience, salaryMin, noticePeriod, workMode } = req.body;

  try {
    // We'll pass the search query and options along with the existing jobs into Gemini
    // to search, rank, rate compatibility, and even synthesize 3 customized bonus high-matching job postings of leading Indian firms (such as Zepto, Infy, Wipro, Paytm)
    // so the catalog feels highly relevant, endless, and exactly matching whatever the user typed.

    const parserSchema = {
      type: Type.OBJECT,
      properties: {
        tailoredJobs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              company: { type: Type.STRING },
              logo: { type: Type.STRING },
              role: { type: Type.STRING },
              location: { type: Type.STRING },
              salary: { type: Type.STRING },
              experience: { type: Type.STRING },
              noticePeriod: { type: Type.STRING },
              workMode: { type: Type.STRING },
              description: { type: Type.STRING },
              skillsRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
              applySteps: { type: Type.STRING }
            },
            required: ["id", "company", "role", "location", "salary", "experience", "noticePeriod", "workMode", "description", "skillsRequired", "applySteps"]
          },
          description: "List of 3 additional fictional or realistic job postings that closely fit the query and preferences."
        }
      },
      required: ["tailoredJobs"]
    };

    const sysInstruction = `You are a professional Indian recruiter. Generate 3 unique, highly realistic Indian job opportunities corresponding to user needs. Use Indian locations (Bangalore, Hyderabad, Delhi NCR, Pune, Mumbai, Chennai, Gurgaon, Noida), salary representations in LPA (Lakhs Per Annum), and notice period expectations (Immediate, 30 days, 60 days, 90 days) standard to the Indian job market. For logos, specify clean, elegant Unsplash technology/office placeholders.`;

    const userInstructions = `Based on User Search Settings:
- Keywords searched: "${query || "All Roles"}"
- Preferred Metro/Location: "${location || "Any"}"
- Experience level: "${experience || "Any"}"
- Notice period limit: "${noticePeriod || "Any"}"
- Work Mode: "${workMode || "Any"}"
- Target Minimum salary: "${salaryMin || "Any"}"

Generate 3 precise, high-matching matching jobs in the Indian landscape using top companies (e.g., Paytm, Zepto, Tata Digital, Swiggy, TCS, PhonePe, Ola, PhonePe, Myntra, Jio).`;

    const aiResponse = await runGeminiJSON<{ tailoredJobs: any[] }>(userInstructions, parserSchema, sysInstruction);
    const generatedJobs = aiResponse.tailoredJobs || [];

    // Merge static seeded jobs with generated jobs
    let combinedJobs = [...SEED_JOBS, ...generatedJobs.map((j, idx) => ({ ...j, id: `gen-${idx}-${Date.now()}` }))];

    // Filter combined jobs client-side/server-side for perfect accuracy
    if (query) {
      const qLower = query.toLowerCase();
      combinedJobs = combinedJobs.filter(j => 
        j.role.toLowerCase().includes(qLower) || 
        j.description.toLowerCase().includes(qLower) ||
        j.skillsRequired.some(s => s.toLowerCase().includes(qLower)) ||
        j.company.toLowerCase().includes(qLower)
      );
    }

    if (location && location !== "Any") {
      const locLower = location.toLowerCase();
      combinedJobs = combinedJobs.filter(j => j.location.toLowerCase().includes(locLower));
    }

    if (workMode && workMode !== "Any") {
      combinedJobs = combinedJobs.filter(j => j.workMode.toLowerCase() === workMode.toLowerCase());
    }

    if (noticePeriod && noticePeriod !== "Any") {
      // Find matches where notice period matches user selection
      combinedJobs = combinedJobs.filter(j => j.noticePeriod.toLowerCase().includes(noticePeriod.toLowerCase()) || noticePeriod === "90 days");
    }

    res.json({ success: true, jobs: combinedJobs });
  } catch (err: any) {
    console.error("Jobs search endpoint failure:", err);
    // Graceful fallback with seed jobs filtered
    let filteredSeeds = [...SEED_JOBS];
    if (query) {
      const qLower = query.toLowerCase();
      filteredSeeds = filteredSeeds.filter(j => 
        j.role.toLowerCase().includes(qLower) || 
        j.description.toLowerCase().includes(qLower) ||
        j.skillsRequired.some(s => s.toLowerCase().includes(qLower))
      );
    }
    res.json({ success: true, jobs: filteredSeeds, warning: "Fitted with pre-populated active listings." });
  }
});


// 2. Resume Optimization & ATS Engine (Track B specialized standard)
app.post("/api/optimize-resume", async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ success: false, error: "Please enter your resume text and target job description." });
  }

  const atsSchema = {
    type: Type.OBJECT,
    properties: {
      atsScore: { type: Type.INTEGER, description: "Total score from 0 to 100 based on ATS criteria matches." },
      matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exact keywords or skills present in both." },
      missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills requested in job criteria but missing or weak in resume." },
      structuralSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Advice on layout, structure, and readability enhancements." },
      optimizedBulletPoints: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            optimized: { type: Type.STRING, description: "An action-oriented, quantifiable re-write in Google XYZ format." },
            impactBenefit: { type: Type.STRING, description: "Why this re-write is superior (mention metrics, action verbs, etc.)." }
          },
          required: ["original", "optimized", "impactBenefit"]
        }
      },
      linkedInProfileSuggestions: { type: Type.STRING, description: "Custom tailored headline and about section for LinkedIn updates." }
    },
    required: ["atsScore", "matchedSkills", "missingSkills", "structuralSuggestions", "optimizedBulletPoints", "linkedInProfileSuggestions"]
  };

  const systemInstructions = "You are an advanced Professional ATS (Applicant Tracking System) parser and resume engineer. You analyze CV text objectively, identify exact matching/missing technical skills, and re-write bullets to maximize match percentage using the XYZ format: 'Accomplished [X] as measured by [Y], by doing [Z]'. Make suggestions highly Indian IT/startup-aligned.";

  const prompt = `Analyze this state:
  --- RESUME TEXT ---
  ${resumeText}

  --- TARGET JOB DESCRIPTION ---
  ${jobDescription}

  Calculate ATS score (0-100), extract matching/missing skillsets, suggest structural layout enhancements, refine up to 4 resume achievement bullet points (or create hypothetical templates if actual ones are missing), and supply a polished LinkedIn headline and summary block.`;

  try {
    const analysis = await runGeminiJSON(prompt, atsSchema, systemInstructions);
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to analyze resume data." });
  }
});


// 3. Indian Mock Interviewer Question Generation
app.post("/api/interview/generate-questions", async (req, res) => {
  const { role, experience, skills } = req.body;

  const questionsSchema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            category: { type: Type.STRING, description: "Technical, HR, Behavior, or System Design" },
            questionText: { type: Type.STRING },
            contextHint: { type: Type.STRING, description: "What high-quality signals recruiters look for in this answer." }
          },
          required: ["id", "category", "questionText", "contextHint"]
        }
      }
    },
    required: ["questions"]
  };

  const sysPrompt = "You are an experienced technical and management interviewer from Razorpay/Uber/TCS. You ask smart, relevant technical and behavioral questions specific to the candidate's target profile.";

  const prompt = `Generate exactly 5 custom interview questions for a candidate with:
  Roles: ${role || "Software Engineer"}
  Experience: ${experience || "3 years"}
  Key Skills listed: ${skills || "Full Stack JavaScript/TypeScript"}

  Include at least 3 deep technical/system-design questions, 1 behavioral scenario, and 1 specific Indian HR scenario (e.g., notice period buy-out, flexible work arrangements, cross-cultural collaboration).`;

  try {
    const results = await runGeminiJSON<Record<string, any>>(prompt, questionsSchema, sysPrompt);
    res.json({ success: true, ...results });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to generate custom interview assessment." });
  }
});


// 4. Mock Interview Grading / Feedback Loop
app.post("/api/interview/grade-answer", async (req, res) => {
  const { question, userAnswer, role, experience } = req.body;

  if (!userAnswer) {
    return res.status(400).json({ success: false, error: "Candidate answer cannot be empty." });
  }

  const gradingSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "Score out of 100 based on technical depth, structure, and communication." },
      keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific accurate details mentioned by user." },
      weaknessesAndGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Important technical metrics or concepts they missed." },
      suggestedBetterAnswer: { type: Type.STRING, description: "A comprehensive, high-quality sample model answer they should have said." },
      followUpTrickyQuestion: { type: Type.STRING, description: "A specific follow up prompt based on their answer." }
    },
    required: ["score", "keyStrengths", "weaknessesAndGaps", "suggestedBetterAnswer", "followUpTrickyQuestion"]
  };

  const sysPrompt = "You are a senior technical interviewer scoring key engineers on system architecture, code hygiene, and technical metrics. Be constructive, analytical, and provide direct feedback.";

  const prompt = `Question Asked: "${question}"
  Candidate Answer: "${userAnswer}"
  Target Role: "${role}"
  Target Experience: "${experience}"

  Evaluate the response. Score out of 100. Pinpoint weaknesses or missing key terms. Provide a perfectly articulated target model response and ask a critical follow-up question.`;

  try {
    const feedback = await runGeminiJSON(prompt, gradingSchema, sysPrompt);
    res.json({ success: true, feedback });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Evaluation engine failed to load feedback." });
  }
});


// 5. Job Market Salary Benchmarking & Career Path Progression (Indian Focus)
app.post("/api/career-plan", async (req, res) => {
  const { currentRole, targetRole, experience } = req.body;

  const planSchema = {
    type: Type.OBJECT,
    properties: {
      salaryBenchmark: {
        type: Type.OBJECT,
        properties: {
          metroHighLpa: { type: Type.NUMBER, description: "LPA in Tier 1 Metros (Bangalore, Gurgaon, Mumbai) - top decile" },
          metroMedianLpa: { type: Type.NUMBER, description: "LPA in Tier 1 Metros (Bangalore, Gurgaon, Mumbai) - median" },
          tier2MedianLpa: { type: Type.NUMBER, description: "LPA in Tier 2 cities (Pune, Jaipur, Kochi) - median" }
        },
        required: ["metroHighLpa", "metroMedianLpa", "tier2MedianLpa"]
      },
      progressionMilestones: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING, description: "Estimated months/years" },
            skillsToAcquire: { type: Type.ARRAY, items: { type: Type.STRING } },
            certificationsOrFocus: { type: Type.STRING, description: "Recommended courses or industry credentials to validate skill" },
            expectedLpaRange: { type: Type.STRING, description: "Expected pay grade range in LPA" }
          },
          required: ["title", "duration", "skillsToAcquire", "certificationsOrFocus", "expectedLpaRange"]
        }
      },
      hotSectors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Sector e.g. Fintech, DeepTech, QuickCommerce" },
            demandRating: { type: Type.STRING, description: "High / Medium / Explosive" },
            brief: { type: Type.STRING }
          },
          required: ["name", "demandRating", "brief"]
        }
      }
    },
    required: ["salaryBenchmark", "progressionMilestones", "hotSectors"]
  };

  const sysPrompt = "You are an elite Indian career advisor and HR researcher who counsels tech professionals on upskilling paths and negotiating higher packages (Lakhs Per Annum format).";

  const prompt = `Establish a perfect salary benchmark and a 3-step dynamic training career map:
  Current Status: "${currentRole || "Fresher Systems Engineer"}"
  Target Aspirational Status: "${targetRole || "Senior Staff Engineer"}"
  Experience Level: "${experience || "0-2 years"}"

  Build a salary framework, 3 specific progression milestones (skill checklists & credentials), and list 3 hot sectors in India for this skillset.`;

  try {
    const report = await runGeminiJSON(prompt, planSchema, sysPrompt);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to generate custom salary benchmarks." });
  }
});


// MAIN VITE SERVER MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully at http://localhost:${PORT}`);
  });
}

startServer();
