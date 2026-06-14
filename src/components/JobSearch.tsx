import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Calendar, Clock, Sparkles, Building, ChevronRight, CheckCircle2, DollarSign } from "lucide-react";
import { Job } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface JobSearchProps {
  onSelectJobForATS: (jobDescription: string) => void;
}

export default function JobSearch({ onSelectJobForATS }: JobSearchProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Search filter states
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Any");
  const [workMode, setWorkMode] = useState("Any");
  const [noticePeriod, setNoticePeriod] = useState("Any");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setWarning(null);
    try {
      const res = await fetch("/api/search-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location, workMode, noticePeriod })
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        if (data.warning) {
          setWarning(data.warning);
        }
      }
    } catch (err) {
      console.error(err);
      setWarning("Could not retrieve AI job feeds. Showing offline search results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div id="job-search-panel" className="space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-100" />
          AI Job Matching Agent
        </h2>
        <p className="text-slate-500 mt-1 max-w-2xl text-sm">
          Discover high-paying technical opportunities in India. Search by skill, filter by specific standard 
          notice periods, and track active compensation packages in LPA format.
        </p>

        {/* Search Bar & Filters Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Search job title, skills, or company (e.g. 'React', 'Go', 'Razorpay', 'Zepto')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/85 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>
            <button
              id="search-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-slate-850 active:scale-95 transition-all text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Search Active Gigs"
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Target Work Location</label>
              <select
                id="location-filter"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/85 text-slate-700 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium"
              >
                <option value="Any">Any Metros & Tier-2</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Gurgaon">Gurgaon / Delhi NCR</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Noida">Noida</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Workplace Policy</label>
              <select
                id="workmode-filter"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/85 text-slate-700 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium"
              >
                <option value="Any">Any Mode</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-office">In-Office</option>
                <option value="Remote">Remote Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Notice Period Cap</label>
              <select
                id="notice-filter"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/85 text-slate-700 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium"
              >
                <option value="Any">Skip Filter</option>
                <option value="Immediate">Immediate</option>
                <option value="30 days">Max 30 Days (Standard Startup)</option>
                <option value="60 days">Max 60 Days</option>
                <option value="90 days">Max 90 Days (Enterprise Standard)</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {warning && (
        <div className="bg-amber-50 text-amber-800 text-xs py-3 px-4 rounded-xl border border-amber-100 flex items-center gap-2">
          <span className="font-semibold">Note:</span> {warning}
        </div>
      )}

      {/* JOBS DISPLAY SHIELD */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl animate-pulse space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
              <div className="h-20 bg-slate-200 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-16 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-slate-100 text-center py-16 px-4 rounded-3xl">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto stroke-[1.5]" />
          <p className="mt-4 text-slate-700 font-bold text-lg">No matching roles found</p>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Try adjusting your search query, location preset, or notice period criteria to find active listings.
          </p>
          <button
            id="clear-filters-btn"
            onClick={() => {
              setQuery("");
              setLocation("Any");
              setWorkMode("Any");
              setNoticePeriod("Any");
              fetchJobs();
            }}
            className="mt-6 px-5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold rounded-2xl text-xs sm:text-xs tracking-wide transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layoutId={`card-${job.id}`}
              whileHover={{ y: -4, boxShadow: "0 10px 30px -15px rgba(15, 23, 42, 0.08)" }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3.5">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 tracking-tight text-base group-hover:text-indigo-650 transition-colors">
                        {job.role}
                      </h4>
                      <p className="text-sm font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                    {job.salary}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <Clock className="w-3 h-3" />
                    {job.noticePeriod}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <Briefcase className="w-3 h-3" />
                    {job.workMode}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-4 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Key Skills Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.skillsRequired.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {job.skillsRequired.length > 4 && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase py-0.5 px-1">
                      +{job.skillsRequired.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Exp: {job.experience}</span>
                <button
                  id={`view-details-${job.id}`}
                  onClick={() => setSelectedJob(job)}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  View Blueprint
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* JOB SPECIFIC BluePrint Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              layoutId={`card-${selectedJob.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-100 shadow-2xl p-6 md:p-8 space-y-6 relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src={selectedJob.logo}
                    alt={selectedJob.company}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {selectedJob.company}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-1">{selectedJob.role}</h3>
                    <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedJob.location}
                    </p>
                  </div>
                </div>
                <button
                  id="close-modal-btn"
                  onClick={() => setSelectedJob(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-100 rounded-full cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Tag Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase">Expected Package</span>
                  <span className="text-sm font-bold text-emerald-600 block mt-0.5">{selectedJob.salary}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase">Notice Period</span>
                  <span className="text-sm font-bold text-slate-700 block mt-0.5">{selectedJob.noticePeriod}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase">Experience</span>
                  <span className="text-sm font-bold text-slate-700 block mt-0.5">{selectedJob.experience}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase">Work Mode</span>
                  <span className="text-sm font-bold text-slate-700 block mt-0.5">{selectedJob.workMode}</span>
                </div>
              </div>

              {/* Core Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-700 tracking-tight">Role Overview</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Skills Required */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-slate-700 tracking-tight">Required Tech Stack & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-205/60 px-3 py-1 rounded-xl text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interview Steps Blueprint */}
              <div className="bg-indigo-50/50 border border-indigo-100/40 p-4 md:p-5 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-700 tracking-widest uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  Interview Assessment Sequence
                </h4>
                <p className="text-xs text-indigo-950 font-semibold leading-relaxed">
                  {selectedJob.applySteps}
                </p>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  id="pivot-opt-btn"
                  onClick={() => {
                    // Compose optimized prompt payload for ATS Optimizer
                    const payload = `JOB TITLE: ${selectedJob.role}\nCOMPANY: ${selectedJob.company}\nSALARY: ${selectedJob.salary}\nNOTICE PERIOD CAP: ${selectedJob.noticePeriod}\n\nOVERVIEW:\n${selectedJob.description}\n\nREQUIRED SKILLS:\n${selectedJob.skillsRequired.join(", ")}`;
                    onSelectJobForATS(payload);
                    setSelectedJob(null);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-2xl text-xs cursor-pointer shadow-md inline-flex items-center justify-center gap-2 tracking-wide transition-all min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-white fill-indigo-200" />
                  Align and Score ATS Resume
                </button>
                <button
                  id="apply-direct-btn"
                  onClick={() => {
                    alert(`Congratulations! You've premium mock applied to ${selectedJob.company} for the "${selectedJob.role}" role! \n\nTip: Navigate to the Mock Interview module to practice specifically with generated AI panels!`);
                  }}
                  className="py-3 px-6 bg-slate-950 hover:bg-slate-850 text-white font-bold rounded-2xl text-xs cursor-pointer tracking-wide transition-all min-h-[44px]"
                >
                  Premium Apply Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
