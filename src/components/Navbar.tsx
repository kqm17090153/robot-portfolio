import React, { useState } from 'react';
import { Bot, Globe, Menu, X, Cpu, Sparkles, Layers, Terminal } from 'lucide-react';
import { BackgroundTheme, Language } from '../types';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  onChangeLanguage?: (lang: Language) => void;
  bgTheme: BackgroundTheme;
  onChangeTheme: (theme: BackgroundTheme) => void;
  onOpenCode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onChangeLanguage,
  bgTheme,
  onChangeTheme,
  onOpenCode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: language === 'ko' ? '소개 (About)' : 'About' },
    { href: '#skills', label: language === 'ko' ? '기술 스택 (Skills)' : 'Skills' },
    {
      href: '#journey',
      label: language === 'ko' ? '대회 여정 (Journey)' : 'Journey',
    },
    { href: '#projects', label: language === 'ko' ? '프로젝트 (Projects)' : 'Projects' },
  ];

  const handleSetLang = (target: Language) => {
    if (onChangeLanguage) {
      onChangeLanguage(target);
    } else if (language !== target) {
      onToggleLanguage();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#091322]/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo matching Image 1 & Image 4 */}
        <a
          href="#"
          className="flex items-center gap-2 group focus:outline-none shrink-0"
          id="brand-logo"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            {/* Custom glowing robot circuit icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="10" x="5" y="9" rx="2" />
              <circle cx="9.5" cy="14" r="1" fill="currentColor" />
              <circle cx="14.5" cy="14" r="1" fill="currentColor" />
              <path d="M12 4v5" />
              <circle cx="12" cy="3.5" r="1.5" />
              <path d="M2 13h3" />
              <path d="M19 13h3" />
              <path d="M9 19v2" />
              <path d="M15 19v2" />
            </svg>
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
            Robotfolio
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-5 text-[13px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-cyan-500 after:transition-all whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls (Language switch, Theme switcher, Code trigger) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Quick Code Sandbox button */}
          <button
            onClick={onOpenCode}
            id="nav-code-btn"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            title="View MicroPython Code"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap">Code</span>
          </button>

          {/* Background pattern theme switcher (Dots / Waves / Neon) */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs shrink-0" id="nav-theme-switcher">
            <button
              onClick={() => onChangeTheme('dots')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer text-[11px] sm:text-xs ${
                bgTheme === 'dots'
                  ? 'bg-white dark:bg-slate-700 font-bold text-cyan-600 dark:text-cyan-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Dot Matrix Grid"
            >
              Dots
            </button>
            <button
              onClick={() => onChangeTheme('waves')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer text-[11px] sm:text-xs ${
                bgTheme === 'waves'
                  ? 'bg-white dark:bg-slate-700 font-bold text-cyan-600 dark:text-cyan-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Seigaiha Wave Pattern"
            >
              Waves
            </button>
            <button
              onClick={() => onChangeTheme('neon')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer text-[11px] sm:text-xs ${
                bgTheme === 'neon'
                  ? 'bg-white dark:bg-slate-700 font-bold text-cyan-600 dark:text-cyan-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Dark Cyber Neon"
            >
              Neon
            </button>
          </div>

          {/* Explicit Segmented Language Switcher [ 한국어 | ENG ] */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs shrink-0" id="nav-lang-segmented-toggle">
            <button
              onClick={() => handleSetLang('ko')}
              id="lang-btn-ko"
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-all font-bold whitespace-nowrap cursor-pointer text-[11px] sm:text-xs ${
                language === 'ko'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="한국어로 보기"
            >
              한국어
            </button>
            <button
              onClick={() => handleSetLang('en')}
              id="lang-btn-en"
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-all font-bold whitespace-nowrap cursor-pointer text-[11px] sm:text-xs ${
                language === 'en'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="View in English"
            >
              ENG
            </button>
          </div>

          {/* Mobile drawer toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-btn"
            className="xl:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-4 pt-3 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-3 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-slate-800 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Theme switcher on mobile */}
          <div className="sm:hidden flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 whitespace-nowrap font-medium">배경 테마 (Theme):</span>
            <div className="flex gap-1.5 text-xs">
              {(['dots', 'waves', 'neon'] as BackgroundTheme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onChangeTheme(theme)}
                  className={`px-3 py-1.5 rounded-md capitalize whitespace-nowrap cursor-pointer text-xs ${
                    bgTheme === theme
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
