import React from 'react';
import { X, GitBranch, Star, GitFork, File, Folder, Download, ExternalLink, BookOpen, Check } from 'lucide-react';
import { githubRepoInfo } from '../data/portfolioData';
import { Language } from '../types';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isKo = language === 'ko';
  const repo = githubRepoInfo;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <GitBranch className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {repo.repoName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                branch: {repo.branch}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: File List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isKo ? '저장소 파일 목록' : 'Repository Files & Schematics'}
            </span>
            <span>7 Files total</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {repo.files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50/50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <File className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </span>
                  <span className="text-slate-400 hidden sm:inline truncate">
                    - {file.desc}
                  </span>
                </div>
                <span className="text-slate-400 shrink-0 ml-2">{file.size}</span>
              </div>
            ))}
          </div>

          {/* Quick README highlight */}
          <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>README.md Summary</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isKo
                ? '2026 WRO 대회 출전용 하드웨어 펌웨어, 기구학 연산 모듈, PID 주행 제어기 및 3D 프린팅 CAD 모델이 포함된 공식 레포지토리입니다.'
                : 'Official repository containing WRO 2026 robotics firmware, inverse kinematics solvers, dual PID closed-loop drivers, and printable 3D CAD models.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">MIT License • Open Source</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isKo ? '닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
