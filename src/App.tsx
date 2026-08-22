import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TechnicalArsenal } from './components/TechnicalArsenal';
import { TrialAndErrorSection } from './components/TrialAndErrorSection';
import { ProjectShowcase } from './components/ProjectShowcase';
import { Footer } from './components/Footer';
import { CodeViewerModal } from './components/CodeViewerModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BackgroundTheme, Language, Project, SkillItem } from './types';
import { FullPortfolioData } from '../server/db';
import {
  fetchPortfolioData,
  checkAdminSession,
  fallbackPortfolioData,
} from './services/api';

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  return (
    path.startsWith('/admin') ||
    hash.startsWith('#/admin') ||
    hash === '#admin' ||
    search.includes('admin')
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('dots');
  const [codeModalOpen, setCodeModalOpen] = useState<boolean>(false);
  const [initialSkillId, setInitialSkillId] = useState<string>('micropython');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Routing and Auth states
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => checkIsAdminRoute());
  const [adminUser, setAdminUser] = useState<{
    id: string;
    username: string;
    name: string;
    role: string;
  } | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Dynamic portfolio data from DB
  const [portfolioData, setPortfolioData] = useState<FullPortfolioData>(fallbackPortfolioData);

  // Fetch portfolio data and check session on startup
  useEffect(() => {
    let isMounted = true;

    async function initApp() {
      // 1. Fetch public portfolio data
      const data = await fetchPortfolioData();
      if (isMounted && data) {
        setPortfolioData(data);
      }

      // 2. Check admin auth session
      const auth = await checkAdminSession();
      if (isMounted) {
        if (auth.authenticated && auth.user) {
          setAdminUser(auth.user);
        } else {
          setAdminUser(null);
        }
        setAuthChecking(false);
      }
    }

    initApp();

    // Listen to browser navigation (back/forward and hash changes)
    const handleRouteSync = () => {
      setIsAdminMode(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setIsAdminMode(checkIsAdminRoute());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  const handleSelectSkill = (skill: SkillItem) => {
    setInitialSkillId(skill.id);
    setCodeModalOpen(true);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine container classes based on selected theme
  const getThemeClasses = () => {
    switch (bgTheme) {
      case 'dots':
        return 'bg-dot-pattern text-slate-800';
      case 'waves':
        return 'bg-seigaiha-pattern text-slate-800';
      case 'neon':
        return 'bg-dark-neon dark text-slate-100';
      default:
        return 'bg-dot-pattern text-slate-800';
    }
  };

  // -------------------------------------------------------------
  // If in /admin route
  // -------------------------------------------------------------
  if (isAdminMode) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#070e18] flex flex-col items-center justify-center text-slate-300">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">관리자 세션 확인 중...</p>
        </div>
      );
    }

    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
          }}
          onBackToHome={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminDashboard
        user={adminUser}
        initialData={portfolioData}
        onDataSaved={(newData) => {
          setPortfolioData(newData);
        }}
        onLogout={() => {
          setAdminUser(null);
        }}
        onViewPublic={() => navigateTo('/')}
      />
    );
  }

  // -------------------------------------------------------------
  // Public Portfolio View (/)
  // -------------------------------------------------------------
  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-cyan-500 selection:text-white transition-colors duration-300 ${getThemeClasses()} ${
        bgTheme === 'neon' ? 'dark bg-[#060d17]' : ''
      }`}
    >
      {/* Navigation Bar */}
      <Navbar
        language={language}
        onToggleLanguage={toggleLanguage}
        onChangeLanguage={(lang: Language) => setLanguage(lang)}
        bgTheme={bgTheme}
        onChangeTheme={setBgTheme}
        onOpenCode={() => {
          setInitialSkillId('micropython');
          setCodeModalOpen(true);
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          language={language}
          onViewProjects={scrollToProjects}
          customHeroContent={portfolioData.heroContent}
        />

        <TechnicalArsenal
          language={language}
          onSelectSkill={handleSelectSkill}
          customSkillsData={portfolioData.skillsData}
        />

        <TrialAndErrorSection
          language={language}
          customTrialLogs={portfolioData.trialLogsData}
          customTimelineEvents={portfolioData.timelineEventsData}
        />

        <ProjectShowcase
          language={language}
          onSelectProject={handleSelectProject}
          customProjectsData={portfolioData.projectsData}
        />
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Interactive Modals */}
      {codeModalOpen && (
        <CodeViewerModal
          isOpen={codeModalOpen}
          onClose={() => setCodeModalOpen(false)}
          language={language}
          initialSkillId={initialSkillId}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          language={language}
        />
      )}
    </div>
  );
}
