import React from 'react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isKo = language === 'ko';

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-[#060d17]/80 backdrop-blur-sm py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        {/* Brand */}
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <div className="w-5 h-5 rounded-md bg-cyan-500 flex items-center justify-center text-slate-950">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect width="14" height="10" x="5" y="9" rx="2" />
              <path d="M12 4v5" />
            </svg>
          </div>
          <span className="text-sm font-extrabold tracking-tight">Robotfolio</span>
        </div>

        {/* Links matching Image 6 */}
        <div className="flex items-center space-x-6 font-medium">
          <a
            href="#about"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            {isKo ? '소개' : 'About'}
          </a>
          <a
            href="#skills"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            {isKo ? '기술 스택' : 'Skills'}
          </a>
          <a
            href="#journey"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            {isKo ? '대회 여정' : 'Competition'}
          </a>
          <a
            href="#projects"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            {isKo ? '프로젝트' : 'Projects'}
          </a>
        </div>

        {/* Copyright matching Image 4 & Image 6 */}
        <div className="font-mono text-slate-400 dark:text-slate-500">
          © 2026 WRO Q's Portfolio
        </div>
      </div>
    </footer>
  );
};
