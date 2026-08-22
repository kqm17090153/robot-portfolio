import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Cpu, ShieldCheck } from 'lucide-react';
import { skillsData } from '../data/portfolioData';
import { Language, SkillItem } from '../types';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialSkillId?: string;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({
  isOpen,
  onClose,
  language,
  initialSkillId = 'micropython',
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialSkillId);
  const [copied, setCopied] = useState(false);

  const isKo = language === 'ko';
  const currentSkill =
    skillsData.find((s) => s.id === selectedSkillId) || skillsData[0];

  const handleCopy = () => {
    if (!currentSkill.codeSnippet) return;
    navigator.clipboard.writeText(currentSkill.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isKo ? '로봇 제어 소스코드 & 아키텍처' : 'Robotics Firmware & Logic Explorer'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                firmware/{currentSkill.id}.py
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6 gap-2 overflow-x-auto">
          {skillsData.map((skill) => (
            <button
              key={skill.id}
              onClick={() => {
                setSelectedSkillId(skill.id);
                setCopied(false);
              }}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                selectedSkillId === skill.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{skill.name}</span>
            </button>
          ))}
        </div>

        {/* Description Header */}
        <div className="px-6 py-3 bg-slate-850/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <p className="line-clamp-1">{currentSkill.fullDesc[language]}</p>
          <button
            onClick={handleCopy}
            className="ml-4 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 whitespace-nowrap">{isKo ? '복사됨' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{isKo ? '코드 복사' : 'Copy Code'}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Body with Line Numbers */}
        <div className="p-6 overflow-y-auto bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="overflow-x-auto">
            <code>{currentSkill.codeSnippet}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>WRO 2026 Competition Tested & Verified</span>
          </div>
          <span className="font-mono text-cyan-400/80">MicroPython v1.22</span>
        </div>
      </div>
    </div>
  );
};
