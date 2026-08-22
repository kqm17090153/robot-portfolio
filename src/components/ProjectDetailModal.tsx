import React from 'react';
import { X, Cpu, FileCode2, Layers } from 'lucide-react';
import { Language, Project } from '../types';

interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const isKo = language === 'ko';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        id="project-detail-modal"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-cyan-500 text-slate-950">
              {project.version}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {project.title[language]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Visual Image Banner */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img
              src={project.imageUrl}
              alt={project.title[language]}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
              {project.category[language]}
            </div>
          </div>

          {/* Short Summary & Description */}
          <div>
            <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1 font-mono">
              Project Overview
            </h4>
            <p className="text-base font-medium text-slate-900 dark:text-white mb-2">
              {project.shortSummary[language]}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.fullDescription[language]}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>{isKo ? '하드웨어 구성 및 센서 스펙' : 'Hardware & Sensor Specs'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium block">
                  {isKo ? '스파이크프라임 허브' : 'SPIKE Prime Hub'}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono truncate block" title={project.specs.hub || project.specs.controller || '스파이크프라임 허브'}>
                  {project.specs.hub || project.specs.controller || '스파이크프라임 허브'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium block">
                  {isKo ? '스파이크프라임 모터' : 'SPIKE Motors'}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono truncate block" title={project.specs.motors || project.specs.servos || '스파이크프라임 모터'}>
                  {project.specs.motors || project.specs.servos || '스파이크프라임 모터'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium block">
                  {isKo ? '컬러센서' : 'Color Sensor'}
                </span>
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono truncate block" title={project.specs.colorSensor || project.specs.vision || '컬러센서'}>
                  {project.specs.colorSensor || project.specs.vision || '컬러센서'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            {isKo ? '닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
