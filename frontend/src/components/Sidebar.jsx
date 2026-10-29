import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Code2,
  Calculator,
  BookOpen,
  HelpCircle,
  History,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Flame,
  Award
} from 'lucide-react';

export default function Sidebar({
  activePage,
  onNavigate,
  user,
  onLogout,
  readinessScore,
  streakInfo,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'readiness', label: 'Placement Readiness', icon: Target },
      ],
    },
    {
      group: 'Preparation',
      items: [
        { id: 'coding', label: 'Coding / DSA Tracker', icon: Code2 },
        { id: 'aptitude', label: 'Aptitude Practice', icon: Calculator },
        { id: 'core-cs', label: 'Core CS Preparation', icon: BookOpen },
      ],
    },
    {
      group: 'Assessment',
      items: [
        { id: 'quiz', label: 'Quiz Practice', icon: HelpCircle },
        { id: 'history', label: 'Quiz History', icon: History },
      ],
    },
    {
      group: 'Account',
      items: [
        { id: 'profile', label: 'Profile & Settings', icon: User },
      ],
    },
  ];

  const handleItemClick = (pageId) => {
    onNavigate(pageId);
    setMobileOpen(false);
  };

  const streak = streakInfo?.currentStreak ?? 0;

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleItemClick('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shadow-xs">
            TP
          </div>
          <span className="font-bold text-primary text-lg tracking-tight">TechPlace</span>
        </div>

        <div className="flex items-center space-x-2">
          {readinessScore !== undefined && (
            <div
              onClick={() => handleItemClick('readiness')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold cursor-pointer"
            >
              <span className="text-muted text-[10px]">Readiness</span>
              <span className="text-accent font-bold">{readinessScore}%</span>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-charcoal hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 bg-white h-full shadow-xl flex flex-col p-4 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                  TP
                </div>
                <span className="font-bold text-primary text-base">TechPlace</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-5">
              {navGroups.map((g) => (
                <div key={g.group} className="space-y-1">
                  <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted">
                    {g.group}
                  </div>
                  {g.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-primary text-white shadow-xs'
                            : 'text-charcoal hover:bg-slate-100 hover:text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Collapsible Left Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          <div
            className="flex items-center space-x-3 cursor-pointer overflow-hidden"
            onClick={() => handleItemClick('dashboard')}
            title="TechPlace - Placement Readiness System"
          >
            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
              TP
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <span className="font-extrabold text-primary text-base tracking-tight">Tech<span className="text-accent">Place</span></span>
                <span className="block text-[10px] text-muted font-medium">Readiness System</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-muted hover:text-charcoal hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((g) => (
            <div key={g.group} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                  {g.group}
                </div>
              )}
              {g.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
                      collapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-charcoal hover:bg-slate-100 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer with Readiness & Streak */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          {!collapsed ? (
            <>
              {/* Readiness Pill */}
              <div
                onClick={() => handleItemClick('readiness')}
                className="p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-accent/60 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted text-[11px] font-medium">Placement Readiness</span>
                  <span className="text-accent font-extrabold text-xs">{readinessScore ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-accent h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${readinessScore ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Streak Pill */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 font-medium">
                <span className="flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Daily Streak</span>
                </span>
                <span className="font-bold">{streak} {streak === 1 ? 'day' : 'days'}</span>
              </div>

              {/* User Profile & Sign Out */}
              <div className="pt-1 flex items-center justify-between">
                <div
                  onClick={() => handleItemClick('profile')}
                  className="flex items-center space-x-2 cursor-pointer truncate hover:opacity-80"
                  title="View Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-charcoal truncate max-w-[110px]">
                    {user?.name || user?.username}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleItemClick('profile')}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center hover:opacity-80"
                title={user?.name || user?.username}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
