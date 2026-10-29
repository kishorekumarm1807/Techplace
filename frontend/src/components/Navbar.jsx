import React from 'react';
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  Calculator,
  HelpCircle,
  History,
  User,
  LogOut,
  Target
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user, onLogout, onOpenProfile, readinessScore }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Tracker', icon: Code2 },
    { id: 'core-cs', label: 'Core CS Prep', icon: BookOpen },
    { id: 'aptitude', label: 'Aptitude', icon: Calculator },
    { id: 'quiz', label: 'Quiz & Practice', icon: HelpCircle },
    { id: 'history', label: 'Quiz History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Tech<span className="text-blue-600">Place</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Readiness System
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Section: Readiness Score Pill & Profile */}
          <div className="flex items-center space-x-3">
            {readinessScore !== undefined && (
              <div
                onClick={() => setActivePage('dashboard')}
                className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
                title="Your Overall Placement Readiness Score"
              >
                <span className="text-slate-500">Readiness:</span>
                <span className={`font-bold ${
                  readinessScore >= 75 ? 'text-emerald-600' :
                  readinessScore >= 45 ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  {readinessScore}%
                </span>
              </div>
            )}

            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-700"
              title="Profile & Settings"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline-block text-xs font-medium text-slate-800 max-w-[100px] truncate">
                {user?.name || user?.username}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center py-1 px-2.5 rounded text-[11px] font-medium whitespace-nowrap ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
