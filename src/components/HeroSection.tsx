import React from 'react';
import { MapPin, Flag, ArrowRight } from 'lucide-react';
import { heroContent } from '../data/portfolioData';
import { Language } from '../types';

interface HeroSectionProps {
  language: Language;
  onViewProjects: () => void;
  customHeroContent?: typeof heroContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onViewProjects,
  customHeroContent,
}) => {
  const content = customHeroContent || heroContent;
  const isKo = language === 'ko';

  return (
    <section id="about" className="pt-10 pb-12 md:pt-16 md:pb-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Pill Badge matching Image 4 & Image 6 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-300 text-xs font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            {content.badge[language]}
          </div>

          {/* Main Headline with exact styling */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {isKo ? (
                <>
                  <span>{content.headline.ko.prefix}</span>
                  <br />
                  <span className="text-[#00b4d8] dark:text-[#00d2ff]">
                    {content.headline.ko.highlight}
                  </span>
                </>
              ) : (
                <>
                  <span>{content.headline.en.prefix}</span>
                  <br />
                  <span className="text-[#00b4d8] dark:text-[#00d2ff]">
                    {content.headline.en.highlight}
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* Bio Points matching exact items from the screenshot */}
          <div className="space-y-3.5 pt-2 max-w-2xl">
            {/* Item 1: 여러 시도로 성장하는 사람 */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-md bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-[#00b4d8] shrink-0 border border-cyan-100 dark:border-cyan-900">
                <MapPin className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <p className="text-[17px] font-semibold text-slate-800 dark:text-slate-100">
                  {content.bioItems[0].text[language]}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {content.bioItems[0].detail[language]}
                </p>
              </div>
            </div>

            {/* Item 2: 목표: 포기하지 않고 계속 도전하는 것 */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-md bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-[#00b4d8] shrink-0 border border-cyan-100 dark:border-cyan-900">
                <Flag className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <p className="text-[17px] font-semibold text-slate-800 dark:text-slate-100">
                  {content.bioItems[1].text[language]}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {content.bioItems[1].detail[language]}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            {/* Primary CTA button matching Image 4 */}
            <button
              onClick={onViewProjects}
              id="hero-view-projects-btn"
              className="px-7 py-3 rounded-lg bg-[#0c182a] dark:bg-cyan-500 hover:bg-[#162a45] dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-[13px] tracking-wider uppercase transition-all shadow-md shadow-slate-900/10 dark:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="whitespace-nowrap">{content.cta.viewProjects[language]}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
