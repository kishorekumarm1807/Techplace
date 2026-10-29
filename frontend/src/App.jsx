import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReadinessPage from './pages/ReadinessPage';
import DSATrackerPage from './pages/DSATrackerPage';
import CoreCSPage from './pages/CoreCSPage';
import AptitudePage from './pages/AptitudePage';
import QuizPage from './pages/QuizPage';
import QuizHistoryPage from './pages/QuizHistoryPage';
import ProfilePage from './pages/ProfilePage';
import { api } from './api/client';

function parseHashRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw) return 'dashboard';
  const clean = raw.toLowerCase().split('?')[0];
  if (clean === 'dsa') return 'coding';
  const VALID_PAGES = [
    'dashboard',
    'readiness',
    'coding',
    'aptitude',
    'core-cs',
    'quiz',
    'history',
    'profile',
    'login',
    'register',
    'landing'
  ];
  return VALID_PAGES.includes(clean) ? clean : 'dashboard';
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [guestView, setGuestView] = useState('landing'); // 'landing' | 'login' | 'register'

  const [activePage, setActivePage] = useState('dashboard');
  const [quizTopic, setQuizTopic] = useState(null);
  const [openAddFlag, setOpenAddFlag] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Authenticate user on startup
  useEffect(() => {
    const token = localStorage.getItem('techplace_token');
    if (token) {
      api.getMe()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('techplace_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('techplace_token');
        })
        .finally(() => {
          setAuthChecked(true);
        });
    } else {
      setAuthChecked(true);
    }
  }, []);

  // Fetch Dashboard & Scores
  const fetchDashboard = async () => {
    if (!user) return;
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  // Synchronize Browser Hash & History for Back / Forward
  useEffect(() => {
    const handleHashChange = () => {
      const target = parseHashRoute();
      if (user) {
        if (target === 'login' || target === 'register' || target === 'landing') {
          setActivePage('dashboard');
          if (window.location.hash !== '#/dashboard') {
            window.location.hash = '#/dashboard';
          }
        } else {
          setActivePage(target);
        }
      } else {
        if (target === 'register') setGuestView('register');
        else if (target === 'login') setGuestView('login');
        else setGuestView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Navigation Helper that writes to history
  const navigateTo = (pageId, options = {}) => {
    if (options.quizTopic) {
      setQuizTopic(options.quizTopic);
    }
    if (options.openAdd) {
      setOpenAddFlag(true);
    } else {
      setOpenAddFlag(false);
    }

    const targetHash = `#/${pageId}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setActivePage(pageId);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    window.location.hash = '#/dashboard';
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setDashboardData(null);
    window.location.hash = '#/login';
  };

  const handleStartQuizFromOtherPage = (topicId) => {
    setQuizTopic(topicId || 'core_cs');
    navigateTo('quiz', { quizTopic: topicId });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-xs font-bold text-muted animate-pulse">
          Starting TechPlace...
        </div>
      </div>
    );
  }

  // Unauthenticated Guest Views
  if (!user) {
    if (guestView === 'login') {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onGoRegister={() => { window.location.hash = '#/register'; }}
          onGoLanding={() => { window.location.hash = '#/'; }}
        />
      );
    }
    if (guestView === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={handleLoginSuccess}
          onGoLogin={() => { window.location.hash = '#/login'; }}
          onGoLanding={() => { window.location.hash = '#/'; }}
        />
      );
    }
    return (
      <LandingPage
        onGoLogin={() => { window.location.hash = '#/login'; }}
        onGoRegister={() => { window.location.hash = '#/register'; }}
      />
    );
  }

  // Authenticated Application with Left Sidebar & Clean Layout
  const readinessScore = dashboardData?.scores?.overallReadiness;
  const streakInfo = dashboardData?.streak || dashboardData?.scores?.streak;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col lg:flex-row text-charcoal">
      {/* Left Sidebar on Desktop / Header Drawer on Mobile */}
      <Sidebar
        activePage={activePage}
        onNavigate={navigateTo}
        user={user}
        onLogout={handleLogout}
        readinessScore={readinessScore}
        streakInfo={streakInfo}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'dashboard' && (
          <DashboardPage
            data={dashboardData}
            onNavigate={navigateTo}
            onRefresh={fetchDashboard}
          />
        )}

        {activePage === 'readiness' && (
          <ReadinessPage
            data={dashboardData}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'coding' && (
          <DSATrackerPage
            initialOpenAdd={openAddFlag}
            onScoreChange={fetchDashboard}
          />
        )}

        {activePage === 'aptitude' && (
          <AptitudePage
            initialOpenAdd={openAddFlag}
            onStartQuiz={handleStartQuizFromOtherPage}
            onScoreChange={fetchDashboard}
          />
        )}

        {activePage === 'core-cs' && (
          <CoreCSPage
            onStartQuiz={handleStartQuizFromOtherPage}
            onScoreChange={fetchDashboard}
          />
        )}

        {activePage === 'quiz' && (
          <QuizPage
            initialTopic={quizTopic}
            onGoHistory={() => navigateTo('history')}
            onScoreChange={fetchDashboard}
          />
        )}

        {activePage === 'history' && (
          <QuizHistoryPage
            onStartQuiz={(topic) => {
              setQuizTopic(topic || 'core_cs');
              navigateTo('quiz', { quizTopic: topic });
            }}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            user={user}
            onUserUpdated={(updatedUser) => {
              setUser(updatedUser);
              fetchDashboard();
            }}
            dashboardData={dashboardData}
          />
        )}
      </main>
    </div>
  );
}
