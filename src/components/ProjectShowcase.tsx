import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { projectsData } from '../data/portfolioData';
import { Language, Project } from '../types';

interface ProjectShowcaseProps {
  language: Language;
  onSelectProject: (project: Project) => void;
  customProjectsData?: Project[];
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  language,
  onSelectProject,
  customProjectsData,
}) => {
  const isKo = language === 'ko';
  const list = customProjectsData || projectsData;
  const project = list[0] || projectsData[0];

  return (
    <section id="projects" className="py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Image 4 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isKo ? 'Project Showcase' : 'Project Showcase'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isKo
                ? 'Selected builds and practical applications.'
                : 'Selected builds and practical applications.'}
            </p>
          </div>

          <span className="hidden sm:inline-block text-xs font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase font-semibold">
            GRID VIEW
          </span>
        </div>

        {/* Project Grid matching Image 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Red Tower Project (8 cols on desktop) */}
          <div
            onClick={() => onSelectProject(project)}
            className="md:col-span-8 group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-400/80 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            id="project-card-red-tower"
          >
            {/* Image Container with Badges */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img
                src={project.imageUrl}
                alt="Red Tower Robotic Arm Manipulator"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Version & Category Top Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-cyan-500 text-slate-950 shadow-sm">
                  {project.version}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                  {project.category[language]}
                </span>
              </div>

              {/* Overlay gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

              {/* Title & Short description directly over image footer or card bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-black tracking-tight text-white mb-1 drop-shadow-sm">
                  {project.title[language]}
                </h3>
                <p className="text-sm text-slate-200 font-medium line-clamp-1 drop-shadow-sm">
                  {project.shortSummary[language]}
                </p>
              </div>
            </div>

            {/* Bottom Meta & Tags matching Image 6 */}
            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>{isKo ? '상세 스펙 & 코드 보기' : 'Full Specs & Code'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: In Progress Card matching Image 4 (4 cols on desktop) */}
          <div
            onClick={() => onSelectProject({
              ...project,
              id: 'in-progress-bot',
              title: {
                ko: 'WRO 자율주행 탐사 로버 X-1',
                en: 'WRO Autonomous Rover X-1',
              },
              shortSummary: {
                ko: '8채널 IR 센서 및 ToF LiDAR를 이용한 고속 자율 격자 주행 로봇',
                en: 'High-speed autonomous grid navigation robot equipped with 8-ch IR & ToF LiDAR.',
              },
              category: { ko: 'Mobile Robotics', en: 'Mobile Robotics' },
              version: 'V2.0 Dev',
            })}
            className="md:col-span-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-400/80 hover:bg-cyan-50/20 dark:hover:bg-cyan-950/20 transition-all duration-300 group min-h-[260px]"
            id="project-card-in-progress"
          >
            <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 group-hover:border-cyan-400/60 group-hover:scale-110 transition-all mb-4 shadow-2xs">
              <Plus className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-1">
              IN PROGRESS
            </span>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isKo ? 'Next build loading...' : 'Next build loading...'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
              {isKo
                ? 'ToF LiDAR 기반 장애물 회피 섀시 개발 중'
                : 'ToF LiDAR obstacle avoidance rover in design'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
