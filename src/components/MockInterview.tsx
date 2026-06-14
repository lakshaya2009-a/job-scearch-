import React, { useState } from "react";
import { Sparkles, MessageSquare, CornerDownRight, CheckCircle2, ChevronRight, RefreshCw, Award, Smile, Play, Copy } from "lucide-react";
import { InterviewQuestion, GradedAnswer } from "../types";

export default function MockInterview() {
  const [role, setRole] = useState("Software Engineer (Fullstack)");
  const [experience, setExperience] = useState("3 years");
  const [skills, setSkills] = useState("React, Node.js, Spring Boot, UPI payments, PostgreSQL");

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number | null>(null);

  // User input states during interview
  const [userAnswer, setUserAnswer] = useState("");
  const [grading, setGrading] = useState<GradedAnswer | null>(null);
  const [gradingLoading, setGradingLoading] = useState(false);
  const [completedList, setCompletedList] = useState<{ [key: number]: GradedAnswer }>({});

  const startInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);
    setActiveQuestionIdx(null);
    setUserAnswer("");
    setGrading(null);
    setCompletedList({});

    try {
      const res = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, experience, skills })
      });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        if (data.questions.length > 0) {
          setActiveQuestionIdx(0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    if (!userAnswer.trim() || activeQuestionIdx === null) return;

    setGradingLoading(true);
    setGrading(null);
    const activeQuestion = questions[activeQuestionIdx];

    try {
      const res = await fetch("/api/interview/grade-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestion.questionText,
          userAnswer,
          role,
          experience
        })
      });
      const data = await res.json();
      if (data.success) {
        setGrading(data.feedback);
        // Persist completed responses for this interview round
        setCompletedList(prev => ({
          ...prev,
          [activeQuestionIdx]: data.feedback
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGradingLoading(false);
    }
  };

  const loadPresetAnswer = () => {
    if (activeQuestionIdx === null) return;
    const q = questions[activeQuestionIdx].questionText;
    if (q.toLowerCase().includes("design") || q.toLowerCase().includes("system") || q.toLowerCase().includes("microservice")) {
      setUserAnswer(
        "I would design the system with a microservices-based model using Spring Boot. We can place a message queue like Kafka for critical transactional ordering. Redis will serve as a high-speed caching tier in front of PostgreSQL to scale throughput during high volumes, reducing checkout latency from 3.5 seconds down to 400 milliseconds. We use database indexing and transaction pools properly."
      );
    } else {
      setUserAnswer(
        "I have a 30-day standard notice period with buy-out capability. I feel this role presents a perfect opportunities to scale transactional code. In my previous role, I worked in a hybrid environment with cross-functional support, completing code reviews daily."
      );
    }
  };

  const nextQuestion = () => {
    if (activeQuestionIdx !== null && activeQuestionIdx < questions.length - 1) {
      setActiveQuestionIdx(activeQuestionIdx + 1);
      setUserAnswer("");
      setGrading(null);
    }
  };

  return (
    <div id="mock-interview-panel" className="space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-500 fill-indigo-100" />
          Interactive AI Interviewer
        </h2>
        <p className="text-slate-500 mt-1 max-w-2xl text-sm leading-relaxed">
          Prepare for modern Technical Panel, System Design, and Behavioral rounds at elite companies 
          like Swiggy, Razorpay, or TCS with real-time scoring, constructive insights, and follow-ups.
        </p>

        {/* Configurations Form */}
        <form onSubmit={startInterview} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Role</label>
            <input
              id="role-input"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 border border-slate-205 rounded-xl focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Senior Backend Engineer"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience Band</label>
            <input
              id="exp-input"
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 border border-slate-205 rounded-xl focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 4+ years"
            />
          </div>
          <div className="md:col-span-1 flex flex-col justify-end">
            <button
              id="start-interview-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl cursor-pointer transition-all active:scale-95 text-xs inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white text-white" />
              )}
              Spawn AI Interview Panel
            </button>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">My Tech Stack & Background Focus</label>
            <input
              id="skills-input"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 border border-slate-205 rounded-xl focus:border-indigo-500 focus:outline-none"
              placeholder="React, AWS, PostgreSQL, Go, Docker, etc."
            />
          </div>
        </form>
      </div>

      {/* ACTIVE INTERVIEW INTERACTIVE INTERFACE */}
      {questions.length > 0 && activeQuestionIdx !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Navigator Drawer */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Assessment Timeline</h3>
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const isCompleted = completedList[idx] !== undefined;
                const isActive = activeQuestionIdx === idx;
                return (
                  <button
                    key={q.id}
                    id={`stage-step-${idx}`}
                    type="button"
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setUserAnswer("");
                      setGrading(completedList[idx] || null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "border-indigo-500 bg-indigo-50/10 text-indigo-950 font-bold"
                        : "border-slate-105 hover:bg-slate-50 text-slate-650"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center ${
                        isActive ? "bg-indigo-600 text-white" : isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{q.category} Round</span>
                        {isCompleted && (
                          <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Scored: {completedList[idx].score}%</span>
                        )}
                      </div>
                    </div>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Playground */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/40">
                <span className="text-xs font-bold text-indigo-750 uppercase tracking-widest">{questions[activeQuestionIdx].category} STAGE</span>
                <span className="text-[10px] text-slate-400 font-bold">RECRUITER BLUEPRINT: ACTIVE</span>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-md font-bold text-slate-800 tracking-tight leading-relaxed">
                  "{questions[activeQuestionIdx].questionText}"
                </h3>
                <p className="text-xs text-slate-400 font-medium italic">
                  💡 Hint: {questions[activeQuestionIdx].contextHint}
                </p>
              </div>

              {/* Text Input area */}
              <div className="space-y-2.5 pt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Candidate Response</label>
                  <button
                    id="preset-ans-btn"
                    type="button"
                    onClick={loadPresetAnswer}
                    className="text-indigo-650 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    Simulate Solid Answer
                  </button>
                </div>

                <textarea
                  id="candidate-response-textbox"
                  rows={6}
                  placeholder="Articulate your structured answer here. Include concrete design metrics and operational parameters where appropriate..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-xs font-medium font-mono p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed resize-y"
                />
              </div>

              <div className="flex justify-between gap-4 pt-2">
                <div>
                  {activeQuestionIdx < questions.length - 1 && (
                    <button
                      id="skip-question-btn"
                      type="button"
                      onClick={nextQuestion}
                      className="px-5 py-2.5 text-slate-600 hover:text-slate-800 font-bold text-xs"
                    >
                      Skip to Next
                    </button>
                  )}
                </div>
                <button
                  id="submit-answer-btn"
                  type="button"
                  disabled={gradingLoading || !userAnswer.trim()}
                  onClick={handleGrade}
                  className="px-6 py-3 bg-indigo-650 text-white font-semibold rounded-2xl text-xs hover:bg-indigo-750 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50 min-h-[44px]"
                >
                  {gradingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Evaluating Answers...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Submit & Evaluate Response
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* GRADING RESULTS SCREEN */}
            {grading && (
              <div id="grading-results-panel" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">AI Assessment Feedback</h4>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Scored by the senior architectural evaluator</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 border border-slate-100 rounded-3xl shrink-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Score</span>
                    <span className="text-3xl font-black font-mono text-indigo-600">{grading.score}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key Strengths */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest block">Strengths Recognized</span>
                    <div className="space-y-2">
                      {grading.keyStrengths.map((str, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-slate-600 leading-relaxed font-medium">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Terms / Gaps */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest block">Gaps & Refinement Needs</span>
                    <div className="space-y-2">
                      {grading.weaknessesAndGaps.map((gap, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-slate-600 leading-relaxed font-medium">
                          <span className="text-amber-500 font-bold">⚠</span>
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Perfect Model Answer */}
                <div className="bg-indigo-50/50 p-5 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-750 font-bold uppercase tracking-widest">Recommended Premium Model Answer</span>
                    <button
                      id="copy-model-ans-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(grading.suggestedBetterAnswer);
                        alert("Model answer copied to clipboard!");
                      }}
                      className="text-slate-500 hover:text-slate-700 font-semibold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Text
                    </button>
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed font-medium">
                    "{grading.suggestedBetterAnswer}"
                  </p>
                </div>

                {/* subsequent Follow up feedback block */}
                <div className="bg-rose-50/45 border border-rose-100/30 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] text-rose-700 font-bold uppercase tracking-widest flex items-center gap-1">
                    <CornerDownRight className="w-4 h-4 text-rose-600" />
                    AI Probe (Tricky Follow-up Question)
                  </span>
                  <p className="text-xs text-rose-950 font-semibold leading-relaxed">
                    "{grading.followUpTrickyQuestion}"
                  </p>
                </div>

                {activeQuestionIdx < questions.length - 1 && (
                  <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <button
                      id="next-question-btn"
                      onClick={nextQuestion}
                      className="py-3 px-6 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-all inline-flex items-center gap-1 cursor-pointer min-h-[44px]"
                    >
                      Advance to Next Stage
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
