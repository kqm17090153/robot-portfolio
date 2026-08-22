import React from 'react';
import { Terminal, Wrench, Gauge, ChevronRight, Zap, Code2, Cpu } from 'lucide-react';
import { skillsData } from '../data/portfolioData';
import { Language, SkillItem } from '../types';

interface TechnicalArsenalProps {
  language: Language;
  onSelectSkill: (skill: SkillItem) => void;
  customSkillsData?: SkillItem[];
}

export const TechnicalArsenal: React.FC<TechnicalArsenalProps> = ({
  language,
  onSelectSkill,
  customSkillsData,
}) => {
  const isKo = language === 'ko';
  const list = customSkillsData || skillsData;

  const getIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Terminal className="w-5 h-5 text-cyan-500" />;
      case 'robot':
        return <Wrench className="w-5 h-5 text-cyan-500" />;
      case 'motor':
        return <Gauge className="w-5 h-5 text-cyan-500" />;
      default:
        return <Cpu className="w-5 h-5 text-cyan-500" />;
    }
  };

  return (
    <section id="skills" className="py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Image 4 */}
        <div className="flex items-center gap-2.5 mb-8">
          <Zap className="w-5 h-5 text-cyan-500 fill-cyan-500" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isKo ? 'Technical Arsenal' : 'Technical Arsenal (Core Skills)'}
          </h2>
        </div>

        {/* 3 Grid Cards matching Image 4 layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((skill) => (
            <div
              key={skill.id}
              onClick={() => onSelectSkill(skill)}
              className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-cyan-400/80 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              id={`skill-card-${skill.id}`}
            >
              {/* Top Row: Icon Container */}
              <div>
                <div className="w-11 h-11 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/60 border border-cyan-100 dark:border-cyan-900 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                  {getIcon(skill.iconType)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {skill.name}
                </h3>

                {/* Description matching screenshot */}
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                  {skill.shortDesc[language]}
                </p>
              </div>

              {/* Bottom Tags matching Image 6 & Image 4 */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5" />
                    {isKo ? '코드 및 세부사항 확인' : 'View Code & Details'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
