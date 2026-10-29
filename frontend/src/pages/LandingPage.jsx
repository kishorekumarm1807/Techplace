import React from 'react';
import { Target, Code2, BookOpen, Calculator, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function LandingPage({ onGoLogin, onGoRegister }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-between">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoLogin}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <span className="font-extrabold text-sm tracking-wider">TP</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-primary">Tech<span className="text-accent">Place</span></span>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 bg-primary/5 text-primary rounded-full border border-primary/20">
                Placement Readiness
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onGoLogin}
              className="px-4 py-2 text-xs font-bold text-charcoal hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGoRegister}
              className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-800 rounded-lg shadow-xs transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Campus & Off-Campus Tech Placement Readiness System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-charcoal tracking-tight leading-tight mb-5">
            Know Exactly How Ready You Are For <span className="text-primary">Tech Placements</span>
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            Track coding problems, master core CS interview fundamentals, log quantitative aptitude progress, and build consistent daily study streaks with a deterministic Placement Readiness Score.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoRegister}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 text-xs font-bold text-white bg-primary hover:bg-primary-800 rounded-lg shadow-xs transition-colors"
            >
              <span>Create Free Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoLogin}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-charcoal bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>

        {/* 3 Pillars Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal mb-2">1. DSA & Coding Tracker</h3>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Log solved problems across 13 core topics (Arrays, Trees, DP, Graphs) and track difficulty distribution across platforms with personal revision notes.
            </p>
            <div className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md inline-block">
              40% Contribution to Readiness
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal mb-2">2. Core CS Preparation</h3>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Curated placement topics across DBMS, Operating Systems, Computer Networks, OOP, DSA theory, COA, and Software Engineering with key explanations.
            </p>
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              35% Contribution to Readiness
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal mb-2">3. Quantitative Aptitude</h3>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Track problem volume across all 16 aptitude categories (Time & Work, Profit & Loss, Series, Permutations) required for clearing preliminary online rounds.
            </p>
            <div className="text-[11px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-md inline-block">
              25% Contribution to Readiness
            </div>
          </div>
        </div>

        {/* Readiness vs Quiz distinction callout */}
        <div className="mt-10 bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 mt-1 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal">Separated Practice Quiz System</h4>
              <p className="text-xs text-muted mt-0.5 max-w-2xl">
                Test your knowledge with 10-question rotating practice sessions for Core CS & Aptitude. Quiz attempts are kept strictly independent from your Placement Readiness Score.
              </p>
            </div>
          </div>
          <button
            onClick={onGoRegister}
            className="text-xs font-bold text-primary hover:text-accent whitespace-nowrap"
          >
            Start Preparing Now &rarr;
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted">
          TechPlace — Pure Core Java OOP Architecture & Local File Persistence. Built for placement candidates.
        </div>
      </footer>
    </div>
  );
}
