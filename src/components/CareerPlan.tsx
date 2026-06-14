import React, { useState } from "react";
import { Sparkles, TrendingUp, Route, Award, DollarSign, Building2, HelpCircle } from "lucide-react";
import { CareerPathReport } from "../types";

export default function CareerPlan() {
  const [currentRole, setCurrentRole] = useState("Junior Web Developer");
  const [targetRole, setTargetRole] = useState("Senior Engineering Lead");
  const [experience, setExperience] = useState("0-2 Years");

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CareerPathReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    setError(null);

    try {
      const res = await fetch("/api/career-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentRole, targetRole, experience })
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.error || "Failed to generate pathway specifications.");
      }
    } catch (err) {
      console.error(err);
      setError("AI model analysis service is temporarily offline. Please retry in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  const loadSamplePlanner = () => {
    setCurrentRole("QA Tester");
    setTargetRole("DevOps Architect");
    setExperience("2-4 Years");
  };

  return (
    <div id="career-planning-panel" className="space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-500 fill-indigo-100" />
          Indian Salary Benchmarking & Upskilling Roadmap
        </h2>
        <p className="text-slate-500 mt-1 max-w-2xl text-sm leading-relaxed">
          Plan your leap from client operations/service roles to top product tier configurations. Compare salary packages 
          for Tier-1 and Tier-2 metros, map specific skill milestones, and track Indian sectors with high demand.
        </p>

        <form onSubmit={generateReport} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Role</label>
            <input
              id="current-role-input"
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-205 rounded-xl focus:border-indigo-550 focus:outline-none"
              placeholder="e.g. Associate Tech Consultant"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Role</label>
            <input
              id="target-role-input"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-205 rounded-xl focus:border-indigo-550 focus:outline-none"
              placeholder="e.g. Solutions Architect"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              id="planner-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl cursor-pointer transition-all active:scale-95 text-xs inline-flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-300 fill-indigo-400" />
                  Generate Tech Roadmap
                </>
              )}
            </button>
          </div>

          <div className="sm:col-span-3 flex justify-between items-center text-xs mt-1">
            <span className="text-slate-400 font-medium">Select Experience Level :</span>
            <div className="flex gap-2">
              {["0-2 Years", "2-5 Years", "5-8 Years", "8+ Years"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  id={`exp-btn-${lvl.replace(/\+/g, "plus").replace(/\s/g, "-")}`}
                  onClick={() => setExperience(lvl)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold text-[10px] cursor-pointer transition-all ${
                    experience === lvl
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200/80 hover:bg-slate-50 text-slate-500"
                  }`}
                >
                  {lvl}
                </button>
              ))}
              <span className="text-slate-350 mx-1">|</span>
              <button
                id="load-planner-sample-btn"
                type="button"
                onClick={loadSamplePlanner}
                className="text-indigo-600 hover:text-indigo-850 font-bold"
              >
                Load Preset
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 text-xs py-3 px-4 rounded-xl border border-rose-100">
          {error}
        </div>
      )}

      {/* REPORT VIEWER MODULE */}
      {report && (
        <div id="pathway-planner-report" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Block: Benchmarking Visualization & Hot Sectors */}
          <div className="lg:col-span-5 space-y-6">
            {/* Metric Chart Benchmarks */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                  <DollarSign className="w-5 h-5 text-indigo-500" />
                  Annual Compensation Benchmarks
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">Calculations tailored specifically in Lakhs Per Annum (LPA)</p>
              </div>

              {/* Benchmarking Comparison chart bar blocks */}
              <div className="space-y-4">
                {/* Metro High Decile */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Metro Tier-1 High Decile (Top 10%)</span>
                    <span className="font-extrabold text-indigo-600">{report.salaryBenchmark.metroHighLpa} LPA</span>
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-100 h-6 rounded-xl overflow-hidden flex items-center px-1">
                    <div className="h-4 bg-indigo-600 rounded-lg transition-all" style={{ width: "95%" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-semibold italic">Bangalore (HSR / Indiranagar), Gurgaon Cyber City, Mumbai BKC</span>
                </div>

                {/* Metro Median */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Metro Tier-1 Median Base Pay</span>
                    <span className="font-extrabold text-emerald-600">{report.salaryBenchmark.metroMedianLpa} LPA</span>
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-100 h-6 rounded-xl overflow-hidden flex items-center px-1">
                    <div className="h-4 bg-emerald-500 rounded-lg transition-all" style={{ width: `${(report.salaryBenchmark.metroMedianLpa / report.salaryBenchmark.metroHighLpa) * 100}%` }} />
                  </div>
                </div>

                {/* Tier-2 Median */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Tier-2 Cities Median Base Pay</span>
                    <span className="font-extrabold text-slate-600">{report.salaryBenchmark.tier2MedianLpa} LPA</span>
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-100 h-6 rounded-xl overflow-hidden flex items-center px-1">
                    <div className="h-4 bg-slate-400 rounded-lg transition-all" style={{ width: `${(report.salaryBenchmark.tier2MedianLpa / report.salaryBenchmark.metroHighLpa) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-semibold italic">Pune (Hinjewadi), Jaipur, Kochi Infopark, Coimbatore</span>
                </div>
              </div>
            </div>

            {/* Indian Hot Sectors */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-5 shadow-lg">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Indian Growth Arenas</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Sectors currently driving aggressive multi-fold upskilling budgets and hiring packages in India.
              </p>

              <div className="space-y-3 pt-2">
                {report.hotSectors.map((sector, idx) => (
                  <div key={idx} className="bg-slate-850 p-4 border border-slate-800 rounded-2xl flex justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-bold text-white block">{sector.name}</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{sector.brief}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                      sector.demandRating.includes("Explosive") || sector.demandRating.includes("High")
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-indigo-500/20 text-indigo-300"
                    }`}>
                      {sector.demandRating}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Block: Progression Milestones Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <Route className="w-5 h-5 text-indigo-500" />
                  3-Stage Professional Leap
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">Curated skillset targets, milestones, and compensation projections</p>
              </div>

              {/* Steps timeline vertical structure */}
              <div className="relative border-l-2 border-slate-100 pl-6 ml-4 space-y-8 py-2">
                {report.progressionMilestones.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Node Dot icon */}
                    <span className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-white text-xs font-bold text-white flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">{step.title}</h4>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Timeline Target: {step.duration}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                          ~ {step.expectedLpaRange}
                        </span>
                      </div>

                      {/* Skills Array */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {step.skillsToAcquire.map((skill, sIdx) => (
                          <span key={sIdx} className="bg-indigo-50/50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Certifications or Specific Focus */}
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-600 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>
                          <strong className="text-slate-800">Target Credential:</strong> {step.certificationsOrFocus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
