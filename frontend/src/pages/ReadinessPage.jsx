import React from 'react';
import { Target, Code2, BookOpen, Calculator, Award, Info, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

export default function ReadinessPage({ data, onNavigate }) {
  const scores = data?.scores || {};
  const overall = scores?.overallReadiness ?? 0;
  const dsaScore = scores?.dsaScore ?? 0;
  const coreCsScore = scores?.coreCsScore ?? 0;
  const aptitudeScore = scores?.aptitudeScore ?? 0;

  const dsaStats = scores?.dsaStats || {};
  const coreStats = scores?.coreStats || {};
  const aptStats = scores?.aptitudeStats || {};

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-charcoal">Placement Readiness Analysis</h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Deterministic, transparent multi-pillar evaluation calibrated for tech campus & off-campus hiring.
            </p>
          </div>

          <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-[#F7F8FA] border border-slate-200">
            <span className="text-xs text-muted font-medium">Overall Score:</span>
            <span className="text-2xl font-black text-accent">{overall}%</span>
          </div>
        </div>

        {/* Scoring Formula Display */}
        <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-charcoal">
          <div className="font-bold text-primary mb-1">Scoring Formula:</div>
          <div className="font-mono text-[11px] sm:text-xs text-primary font-semibold">
            Readiness Score = (0.40 × DSA Score) + (0.35 × Core CS Score) + (0.25 × Aptitude Score)
          </div>
          <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
            Normalized to 0–100%. Quizzes and practice tests evaluate recall under timed pressure and are <strong>strictly separated</strong> from this readiness metric.
          </p>
        </div>
      </div>

      {/* 3 Pillars In-Depth Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* DSA Pillar */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-sm">1. DSA & Coding</h3>
                  <span className="text-[10px] font-semibold text-primary uppercase">40% Weight</span>
                </div>
              </div>
              <span className="text-lg font-extrabold text-primary">{dsaScore}%</span>
            </div>

            <div className="space-y-2 text-xs text-muted py-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Problems Solved:</span>
                <span className="font-bold text-charcoal">{dsaStats.totalSolved ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Easy / Med / Hard:</span>
                <span className="font-semibold text-charcoal">
                  <span className="text-emerald-600">{dsaStats.easyCount ?? 0}</span> / <span className="text-amber-600">{dsaStats.mediumCount ?? 0}</span> / <span className="text-rose-600">{dsaStats.hardCount ?? 0}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Categories Covered:</span>
                <span className="font-bold text-charcoal">{dsaStats.categoriesCovered ?? 0} / 13</span>
              </div>
            </div>

            <p className="text-[11px] text-muted mt-2 leading-relaxed">
              Calculated from problem difficulty weighting (Easy: 1.5 pts, Med: 3.5 pts, Hard: 6.0 pts) plus topic breadth across 13 core structures.
            </p>
          </div>

          <button
            onClick={() => onNavigate('coding')}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <span>Open Coding Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Core CS Pillar */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-sm">2. Core CS Theory</h3>
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase">35% Weight</span>
                </div>
              </div>
              <span className="text-lg font-extrabold text-emerald-700">{coreCsScore}%</span>
            </div>

            <div className="space-y-2 text-xs text-muted py-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Completed Topics:</span>
                <span className="font-bold text-charcoal">{coreStats.completedTopics ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Key Topics:</span>
                <span className="font-bold text-charcoal">{coreStats.totalTopics ?? 36}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Topics:</span>
                <span className="font-bold text-amber-600">{coreStats.remainingTopics ?? 0}</span>
              </div>
            </div>

            <p className="text-[11px] text-muted mt-2 leading-relaxed">
              Curated across 7 foundational subjects: DBMS, OS, Computer Networks, OOP, DSA Concepts, COA, and Software Engineering.
            </p>
          </div>

          <button
            onClick={() => onNavigate('core-cs')}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <span>Review Core CS Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Aptitude Pillar */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-sm">3. Quantitative Aptitude</h3>
                  <span className="text-[10px] font-semibold text-accent uppercase">25% Weight</span>
                </div>
              </div>
              <span className="text-lg font-extrabold text-accent">{aptitudeScore}%</span>
            </div>

            <div className="space-y-2 text-xs text-muted py-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Problems Solved:</span>
                <span className="font-bold text-charcoal">{aptStats.totalProblemsSolved ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Topics Practiced:</span>
                <span className="font-bold text-charcoal">{aptStats.topicsCovered ?? 0} / 16</span>
              </div>
              <div className="flex justify-between">
                <span>Screening Benchmark:</span>
                <span className="font-bold text-charcoal">80+ problems</span>
              </div>
            </div>

            <p className="text-[11px] text-muted mt-2 leading-relaxed">
              Covers 16 placement aptitude topics (Numbers, Series, Time & Work, Profit & Loss, Probability, Permutations, etc.).
            </p>
          </div>

          <button
            onClick={() => onNavigate('aptitude')}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/15 rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <span>Open Aptitude Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Milestone Checklist */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-charcoal text-sm flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>Milestones to Reach 85%+ Placement Readiness</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-[#F7F8FA] space-y-1">
            <span className="font-bold text-charcoal block">1. Solve 40+ Medium & Hard DSA Problems</span>
            <p className="text-muted text-[11px]">Ensure you cover Dynamic Programming, Trees, Graphs, and HashMaps.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-[#F7F8FA] space-y-1">
            <span className="font-bold text-charcoal block">2. Complete 25+ Core CS Topics</span>
            <p className="text-muted text-[11px]">Master ACID properties, Normalization, Process Synchronization, and TCP Handshake.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-[#F7F8FA] space-y-1">
            <span className="font-bold text-charcoal block">3. Practice Across All 16 Aptitude Topics</span>
            <p className="text-muted text-[11px]">Clear speed barriers in Time & Work, Percentage, and Speed & Distance.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-[#F7F8FA] space-y-1">
            <span className="font-bold text-charcoal block">4. Maintain a 7-Day Study Streak</span>
            <p className="text-muted text-[11px]">Consistent daily practice is the highest indicator of placement clearance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
