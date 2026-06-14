/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Route, Award, Briefcase, FileText, MessageSquare, TrendingUp, HelpCircle, CheckCircle } from "lucide-react";
import JobSearch from "./components/JobSearch";
import ResumeOptimizer from "./components/ResumeOptimizer";
import MockInterview from "./components/MockInterview";
import CareerPlan from "./components/CareerPlan";

export default function App() {
  const [activeTab, setActiveTab] = useState<"jobs" | "resume" | "interview" | "career">("jobs");
  const [passedJobDescription, setPassedJobDescription] = useState("");

  const handleSelectJobForATS = (jobDesc: string) => {
    setPassedJobDescription(jobDesc);
    setActiveTab("resume");
  };

  return (
    <div id="app-root-container" className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Left Sidebar: Navigation & Session */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">C</div>
          <span className="text-white font-semibold tracking-tight text-lg">CareerAgent AI</span>
        </div>

        {/* Modules Navigation Links */}
        <div className="flex-1 py-6 overflow-y-auto space-y-6">
          <div className="px-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Service Modules</h3>
          </div>
          <nav className="space-y-1 px-3">
            <button
              id="tab-btn-jobs"
              onClick={() => setActiveTab("jobs")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                activeTab === "jobs"
                  ? "bg-indigo-650 text-white font-bold shadow-md"
                  : "hover:bg-slate-800 hover:text-white font-semibold text-slate-400"
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span className="text-sm">Job Matching Agent</span>
            </button>

            <button
              id="tab-btn-resume"
              onClick={() => setActiveTab("resume")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                activeTab === "resume"
                  ? "bg-indigo-650 text-white font-bold shadow-md"
                  : "hover:bg-slate-800 hover:text-white font-semibold text-slate-400"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="text-sm">ATS Resume Optimizer</span>
            </button>

            <button
              id="tab-btn-interview"
              onClick={() => setActiveTab("interview")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                activeTab === "interview"
                  ? "bg-indigo-650 text-white font-bold shadow-md"
                  : "hover:bg-slate-800 hover:text-white font-semibold text-slate-400"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="text-sm">Interactive Mock Panel</span>
            </button>

            <button
              id="tab-btn-career"
              onClick={() => setActiveTab("career")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                activeTab === "career"
                  ? "bg-indigo-650 text-white font-bold shadow-md"
                  : "hover:bg-slate-800 hover:text-white font-semibold text-slate-400"
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="text-sm">Salary & Upskilling Map</span>
            </button>
          </nav>
        </div>

        {/* User profile footer block */}
        <div className="p-6 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-705 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
              LS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Lakshaya Sharma</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-450 rounded-full animate-ping" />
                Active Talent Profile
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Main Nav Header */}
        <header className="h-20 bg-white border-b border-slate-200/85 px-6 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-850">
              {activeTab === "jobs" && "Job Search Terminal"}
              {activeTab === "resume" && "ATS Optimization Engine"}
              {activeTab === "interview" && "Simulator Workspace & Interviewer"}
              {activeTab === "career" && "Compensation & Benchmarking Tool"}
            </h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
              Premium Track
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">Local Target Market: India (LPA Format)</span>
          </div>
        </header>

        {/* Mobile quick tabs */}
        <div className="flex md:hidden bg-slate-900 text-white p-2 shrink-0 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 ${activeTab === "jobs" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
          >
            Job Match
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 ${activeTab === "resume" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
          >
            ATS Tuner
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 ${activeTab === "interview" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
          >
            Interviews
          </button>
          <button
            onClick={() => setActiveTab("career")}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 ${activeTab === "career" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
          >
            Benchmarking
          </button>
        </div>

        {/* Tab content viewer */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === "jobs" && (
            <JobSearch onSelectJobForATS={handleSelectJobForATS} />
          )}

          {activeTab === "resume" && (
            <ResumeOptimizer initialJobDescription={passedJobDescription} />
          )}

          {activeTab === "interview" && (
            <MockInterview />
          )}

          {activeTab === "career" && (
            <CareerPlan />
          )}
        </div>
      </main>
    </div>
  );
}

