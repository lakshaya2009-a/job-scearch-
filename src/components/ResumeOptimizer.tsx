import React, { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw, FileText, UploadCloud, Linkedin, Eye } from "lucide-react";
import { ResumeAnalysis } from "../types";

interface ResumeOptimizerProps {
  initialJobDescription: string;
}

export default function ResumeOptimizer({ initialJobDescription }: ResumeOptimizerProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState(initialJobDescription || "");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync state if initialJobDescription changes
  React.useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription]);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError("Please paste or upload your resume first!");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please specify the target job description!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Failed to analyze resume.");
      }
    } catch (err) {
      console.error(err);
      setError("Analysis server took too long to respond. Please review settings and retry.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleResume = () => {
    setResumeText(
      `LAKSHAYA SHARMA
Software Engineer | Bangalore, India | lakshaya@email.com

SUMMARY:
Motivated Developer with 2+ years of experience working with React and Node.js. Experienced in designing UI layout and connecting standard databases. Looking for SSE roles.

EXPERIENCE:
Software Engineer at Indian Tech Services (2024 - Present)
- Worked on client dashboards using React and Express.
- Assisted with database schema optimizations.
- Handled UI updates for payment page, reducing some bugs.
- Managed code deployments directly to development servers.

SKILLS:
JavaScript, React, Node.js, Express, HTML, CSS, SQL, Git`
    );
    if (!jobDescription) {
      setJobDescription(
        `ROLE: Senior Software Engineer (Backend/Fullstack)
SKILLS REQUIRED: Node.js, TypeScript, Next.js, Redis, PostgreSQL, gRPC.
OVERVIEW:
We are looking for a backend-heavy Fullstack developer to optimize checkout transaction speeds, implement high productivity UPI flows, and manage SQL tables cleanly.`
      );
    }
  };

  // Mock Upload parsing for usability
  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate reading pdf/docx text
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(
          `[PARSED FILE CONTENTS: ${file.name}]\n\nLAKSHAYA SHARMA\nFullstack Engineer\n\nExperience:\n- Built payment gateway connectors using React & Node.\n- Streamlined database migrations in AWS environments.\n\nSkills: JavaScript, AWS, SQL, React, Node.js`
        );
      };
      reader.readAsText(file);
    }
  };

  return (
    <div id="resume-optimizer-panel" className="space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-100" />
          ATS Resume Tuner
        </h2>
        <p className="text-slate-500 mt-1 max-w-2xl text-sm leading-relaxed">
          Check ATS score alignment, extract critical skill gaps, and optimize your bullet points 
          into the high-impact Google XYZ format (Accomplished [X] measured by [Y], by doing [Z]).
        </p>

        <form onSubmit={handleOptimize} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Input Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Your Resume Text
                </label>
                <div className="flex gap-2">
                  <button
                    id="sample-resume-btn"
                    type="button"
                    onClick={loadSampleResume}
                    className="text-indigo-600 hover:text-indigo-850 text-xs font-semibold cursor-pointer"
                  >
                    Load Sample
                  </button>
                  <span className="text-slate-350 text-xs">|</span>
                  <label className="text-indigo-600 hover:text-indigo-850 text-xs font-semibold cursor-pointer flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload File
                    <input
                      id="resume-file-upload"
                      type="file"
                      accept=".txt,.pdf,.docx"
                      onChange={handleUploadSimulate}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <textarea
                id="resume-textbox"
                rows={10}
                placeholder="Paste plain text content of your current CV here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-505/20 focus:border-indigo-500 transition-all text-xs font-medium font-mono leading-relaxed resize-y"
              />
            </div>

            {/* Target JD Area */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Target Job Description
              </label>
              <textarea
                id="jd-textbox"
                rows={10}
                placeholder="Paste target job role details, tech stack, and responsibilities..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-505/20 focus:border-indigo-500 transition-all text-xs font-medium font-mono leading-relaxed resize-y"
              />
              {initialJobDescription && (
                <p className="text-[10px] text-indigo-500 font-semibold italic">
                  ✓ Successfully preloaded blueprint from your clicked role!
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 text-xs py-3 px-4 rounded-xl border border-rose-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              id="optimize-submit-btn"
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl cursor-pointer hover:bg-slate-850 active:scale-95 transition-all text-sm disabled:opacity-50 inline-flex items-center gap-2 min-h-[44px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Neural Parsing Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-white fill-indigo-205" />
                  Evaluate & Match ATS Score
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ANALYSIS RESULTS BLOCK */}
      {analysis && (
        <div id="ats-results-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feedback & XYZ Bullets */}
          <div className="lg:col-span-8 space-y-6">
            {/* ATS Score Header */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">ATS Alignment Strategy</h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-medium">Comparison against the target Indian startup requirements</p>
                </div>
                <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-2 rounded-2xl border border-indigo-100/30">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">ATS Score</span>
                  <div className="text-3xl font-black text-indigo-600 font-mono">{analysis.atsScore}%</div>
                </div>
              </div>

              {/* Score Bar Graphic */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      analysis.atsScore >= 80
                        ? "bg-emerald-500"
                        : analysis.atsScore >= 60
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${analysis.atsScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>UNFIT (&lt;50%)</span>
                  <span>OPTIMIZED (80%+)</span>
                </div>
              </div>
            </div>

            {/* Google XYZ Bullets Refactoring */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                Google XYZ Achievement Optimizer
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                We've converted vague resume statements into action-driven narratives containing measurable metrics. 
                Replace original statements directly into your target CV.
              </p>

              <div className="space-y-4">
                {analysis.optimizedBulletPoints.map((bullet, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl p-4 space-y-3 hover:border-slate-200 transition-all bg-slate-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Before (Weak Match)</span>
                        <p className="text-xs text-slate-500 italic font-medium">"{bullet.original}"</p>
                      </div>
                      {/* Optimized */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">After (XYZ Optimized)</span>
                          <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                        </div>
                        <p className="text-xs text-slate-900 font-bold leading-relaxed">"{bullet.optimized}"</p>
                      </div>
                    </div>
                    {/* Why this is superior */}
                    <div className="bg-indigo-50/45 border border-indigo-100/30 p-2.5 rounded-xl text-[11px] text-indigo-900">
                      <span className="font-bold">Neural Impact Insight:</span> {bullet.impactBenefit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skills Gap & Structural Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            {/* Matching vs Missing */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Keyword Extraction</h4>

              <div className="space-y-4">
                {/* Matched */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Matched Criteria ({analysis.matchedSkills.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedSkills.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">None yet matched</span>
                    ) : (
                      analysis.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100/30 px-2.5 py-1 rounded-xl text-xs font-semibold">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="space-y-2">
                  <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">Missing High-Value Terms ({analysis.missingSkills.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingSkills.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">All major skills matched!</span>
                    ) : (
                      analysis.missingSkills.map((skill, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-100/30 px-2.5 py-1 rounded-xl text-xs font-semibold">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Structure Enhancements */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Formatting & Layout Advice</h4>
              <div className="space-y-3">
                {analysis.structuralSuggestions.map((advice, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-slate-500 leading-relaxed font-medium">
                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                    <span>{advice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* copyable LinkedIn Sections */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">Social Amplification</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                LinkedIn recommendations generated according to matching industry keywords.
              </p>
              <div className="space-y-3 bg-slate-850 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-indigo-350 font-bold uppercase block tracking-widest">Optimized Headline</span>
                <p className="text-xs text-slate-200 mt-1 select-all font-mono leading-relaxed font-semibold">
                  {analysis.linkedInProfileSuggestions || "Senior Platform Engineer @ Top Startup"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
