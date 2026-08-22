import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lightbulb,
  GitCommit,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  competitionData,
  timelineEventsData,
  trialLogsData,
} from '../data/portfolioData';
import { Language, TimelineEvent, TrialLog } from '../types';

interface TrialAndErrorSectionProps {
  language: Language;
  customTrialLogs?: TrialLog[];
  customTimelineEvents?: TimelineEvent[];
}

export const TrialAndErrorSection: React.FC<TrialAndErrorSectionProps> = ({
  language,
  customTrialLogs,
  customTimelineEvents,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const isKo = language === 'ko';
  const comp = competitionData;
  const logs = customTrialLogs || trialLogsData;
  const timeline = customTimelineEvents || timelineEventsData;

  const toggleLogExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  const renderBadge = (type: TrialLog['type']) => {
    switch (type) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            SUCCESS
          </span>
        );
      case 'reflection':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 whitespace-nowrap shrink-0">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            REFLECTION
          </span>
        );
      case 'note':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0">
            <FileText className="w-3 h-3 shrink-0" />
            NOTE
          </span>
        );
    }
  };

  const getBorderColor = (type: TrialLog['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-cyan-500';
      case 'reflection':
        return 'border-l-rose-400';
      case 'note':
        return 'border-l-slate-400';
    }
  };

  return (
    <section id="journey" className="py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {comp.summaryTitle[language]}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              {comp.summarySubtitle[language]}
            </p>
          </div>

          {/* View Mode Toggle (Cards vs Timeline) */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold self-start sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isKo ? '로그 카드 뷰' : 'Log Cards View'}
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isKo ? '타임라인 여정' : 'Timeline Journey'}
            </button>
          </div>
        </div>

        {viewMode === 'cards' ? (
          /* Desktop Two-Column Layout matching Image 4 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Card: 2026 WRO Card matching Image 4 */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#0a1526] to-[#0d1e38] text-white p-7 sm:p-8 shadow-xl shadow-slate-900/10 border border-cyan-900/40 relative overflow-hidden">
                {/* Background decorative trophy glow */}
                <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none">
                  <Trophy className="w-48 h-48" />
                </div>

                {/* Competition Badge */}
                <div className="inline-block px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold tracking-wider uppercase mb-5">
                  {comp.badge[language]}
                </div>

                {/* Main Heading & Trophy Icon */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-cyan-400/90 font-medium mt-0.5">
                      {comp.subtitle}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>

                {/* Team Info */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs block">
                        {comp.team.label[language]}
                      </span>
                      <span className="font-bold text-white tracking-wide">
                        {comp.team.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300 shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs block">
                        {comp.role.label[language]}
                      </span>
                      <span className="font-bold text-white">
                        {comp.role.name[language]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status achievement pill */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>{isKo ? '목표 달성치' : 'Target Metric'}</span>
                  <span className="font-mono text-cyan-300 font-bold">150+ PTS Target</span>
                </div>
              </div>
            </div>

            {/* Right Column: Trial & Error Log Cards */}
            <div className="lg:col-span-8 space-y-4">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    className={`p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all ${
                      log.type === 'reflection'
                        ? 'bg-rose-50/20 dark:bg-rose-950/10'
                        : ''
                    }`}
                  >
                    {/* Header: Title & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {log.title[language]}
                      </h4>
                      {renderBadge(log.type)}
                    </div>

                    {/* Quotes with left accent line matching Image 4 */}
                    <div className="space-y-2.5">
                      {log.quotes[language].map((quote, idx) => (
                        <div
                          key={idx}
                          className={`pl-4 border-l-[3px] ${getBorderColor(
                            log.type
                          )} py-0.5`}
                        >
                          <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                            {quote}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Engineering Reflection Analysis */}
                    {log.reflectionDetail && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => toggleLogExpand(log.id)}
                          className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center gap-1"
                        >
                          <span>
                            {isExpanded
                              ? isKo
                                ? '상세 분석 접기'
                                : 'Hide Root Cause Analysis'
                              : isKo
                              ? '원인 분석 및 개선 프로토콜 보기'
                              : 'View Root Cause & Protocol'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5 animate-fadeIn">
                            <span className="font-bold text-slate-800 dark:text-slate-100 block">
                              {isKo ? '🔍 엔지니어링 피드백:' : '🔍 Engineering Takeaway:'}
                            </span>
                            <p>{log.reflectionDetail[language]}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Highlight Quote with Lightbulb Icon matching Image 4 bottom */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-50/80 via-white to-sky-50/80 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-cyan-200/70 dark:border-cyan-900/60 shadow-xs flex items-center justify-center gap-3 text-center">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950/90 text-cyan-500 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {comp.highlightQuote[language]}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile / Timeline View matching Image 6 */
          <div className="max-w-2xl mx-auto relative pl-6 sm:pl-8 border-l-2 border-cyan-200 dark:border-cyan-900 space-y-10 my-6">
            {timeline.map((evt, idx) => (
              <div key={evt.id} className="relative group">
                {/* Timeline Dot Node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-cyan-500 flex items-center justify-center shadow-xs">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      evt.tagType === 'competition'
                        ? 'bg-cyan-500 animate-ping'
                        : evt.tagType === 'trial'
                        ? 'bg-rose-500'
                        : 'bg-cyan-500'
                    }`}
                  ></div>
                </div>

                {/* Event Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                    {evt.phase[language]}
                  </span>
                  <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {evt.title[language]}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {evt.description[language]}
                  </p>

                  {/* Highlight Box inside timeline card */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      {evt.highlightBox.label[language]}:
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {evt.highlightBox.content[language]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
