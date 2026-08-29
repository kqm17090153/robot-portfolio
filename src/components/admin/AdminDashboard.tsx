import React, { useState, useRef, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Code,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
  Edit3,
  Flame,
  Award,
  Music,
  Volume2,
  Play,
  Pause,
  Disc3,
  Radio,
  Upload,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { FullPortfolioData } from '../../../server/db';
import { savePortfolioApi, resetPortfolioApi, logoutAdminApi } from '../../services/api';
import { SkillItem, TrialLog, TimelineEvent, Project, BgmTrack, BgmConfig } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface AdminDashboardProps {
  user: { id: string; username: string; name: string; role: string };
  initialData: FullPortfolioData;
  onDataSaved: (data: FullPortfolioData) => void;
  onLogout: () => void;
  onViewPublic: () => void;
}

type TabType = 'hero' | 'skills' | 'trials' | 'timeline' | 'projects' | 'bgm';

const BGM_PRESET_LIBRARY = [
  {
    title: 'Cyber Pulse (Future Robotics)',
    artist: 'Future Tech Ambient',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    category: 'Cyberpunk',
  },
  {
    title: 'Chill Lo-Fi Study & Code',
    artist: 'FASSounds',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    category: 'Lo-Fi',
  },
  {
    title: 'Creative Minds (Synth Tech)',
    artist: 'Benjamin Tissot',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    category: 'Synthwave',
  },
  {
    title: 'Inspiring Dreams (Gentle Acoustic)',
    artist: 'AudioCoffee',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3',
    category: 'Ambient',
  },
  {
    title: '8-Bit Retro Robot Arcade',
    artist: 'Arcade Master',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77230.mp3',
    category: '8-Bit',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  initialData,
  onDataSaved,
  onLogout,
  onViewPublic,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [formData, setFormData] = useState<FullPortfolioData>(JSON.parse(JSON.stringify(initialData)));
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to show temporary flash message
  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Save changes to server database
  const handleSave = async () => {
    setSaving(true);
    const res = await savePortfolioApi(formData);
    setSaving(false);
    if (res.success && res.data) {
      onDataSaved(res.data);
      showFeedback('success', '포트폴리오 내용이 안전하게 저장되었으며 공개 사이트에 즉시 반영되었습니다.');
    } else {
      showFeedback('error', res.error || '저장 중 오류가 발생했습니다.');
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (!window.confirm('정말 기본 포트폴리오 데이터로 초기화하시겠습니까? 현재 작성 중인 내용은 초기화됩니다.')) {
      return;
    }
    setSaving(true);
    const res = await resetPortfolioApi();
    setSaving(false);
    if (res.success && res.data) {
      setFormData(JSON.parse(JSON.stringify(res.data)));
      onDataSaved(res.data);
      showFeedback('success', '기본 포트폴리오 내용으로 성공적으로 초기화되었습니다.');
    } else {
      showFeedback('error', res.error || '초기화 중 오류가 발생했습니다.');
    }
  };

  // Logout
  const handleLogout = async () => {
    await logoutAdminApi();
    onLogout();
  };

  // -------------------------------------------------------------------------------------
  // Skills Management Handlers
  // -------------------------------------------------------------------------------------
  const addSkill = () => {
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: 'New Technology',
      iconType: 'code',
      shortDesc: { ko: '새로운 기술에 대한 간략한 설명입니다.', en: 'Brief description of this technology.' },
      fullDesc: { ko: '상세 구현 및 프로젝트 적용 설명입니다.', en: 'In-depth implementation and project usage details.' },
      tags: ['Embedded', 'Control'],
      codeLanguage: 'python',
      codeSnippet: '# Python code snippet\nprint("Hello Robot")',
    };
    setFormData((prev) => ({
      ...prev,
      skillsData: [...prev.skillsData, newSkill],
    }));
  };

  const removeSkill = (id: string) => {
    if (!window.confirm('이 기술 스택 항목을 삭제하시겠습니까?')) return;
    setFormData((prev) => ({
      ...prev,
      skillsData: prev.skillsData.filter((s) => s.id !== id),
    }));
  };

  // -------------------------------------------------------------------------------------
  // Trial Logs Handlers
  // -------------------------------------------------------------------------------------
  const addTrialLog = () => {
    const newLog: TrialLog = {
      id: `trial-${Date.now()}`,
      type: 'success',
      title: { ko: '새로운 시행착오 일지', en: 'New Trial & Error Log' },
      quotes: {
        ko: ['"시도와 실패를 통해 배운 교훈을 입력하세요."'],
        en: ['"Key quotes and takeaways from this trial."'],
      },
      reflectionDetail: {
        ko: '원인 분석 및 개선 조치 사항을 작성해 주세요.',
        en: 'Detailed root-cause analysis and action taken.',
      },
    };
    setFormData((prev) => ({
      ...prev,
      trialLogsData: [...prev.trialLogsData, newLog],
    }));
  };

  const removeTrialLog = (id: string) => {
    if (!window.confirm('이 시행착오 로그를 삭제하시겠습니까?')) return;
    setFormData((prev) => ({
      ...prev,
      trialLogsData: prev.trialLogsData.filter((t) => t.id !== id),
    }));
  };

  // -------------------------------------------------------------------------------------
  // Timeline Handlers
  // -------------------------------------------------------------------------------------
  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: `timeline-${Date.now()}`,
      tagType: 'trial',
      phase: { ko: 'Development Phase', en: 'Development Phase' },
      title: { ko: '새로운 타임라인 이벤트', en: 'New Timeline Event' },
      description: { ko: '이벤트의 주요 활동 내용을 입력하세요.', en: 'Description of key activities.' },
      highlightBox: {
        label: { ko: 'Key Takeaway', en: 'Key Takeaway' },
        content: { ko: '핵심 결과 또는 역할 요약입니다.', en: 'Summary of results or roles.' },
      },
    };
    setFormData((prev) => ({
      ...prev,
      timelineEventsData: [...prev.timelineEventsData, newEvent],
    }));
  };

  const removeTimelineEvent = (id: string) => {
    if (!window.confirm('이 타임라인 이벤트를 삭제하시겠습니까?')) return;
    setFormData((prev) => ({
      ...prev,
      timelineEventsData: prev.timelineEventsData.filter((e) => e.id !== id),
    }));
  };

  // -------------------------------------------------------------------------------------
  // Projects Handlers
  // -------------------------------------------------------------------------------------
  const addProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: { ko: '새로운 로보틱스 프로젝트', en: 'New Robotics Project' },
      version: 'v1.0',
      category: { ko: 'Robotics Control', en: 'Robotics Control' },
      shortSummary: { ko: '프로젝트에 대한 한 줄 요약입니다.', en: 'Single-line summary of this project.' },
      fullDescription: { ko: '프로젝트의 전체 아키텍처 및 상세 설명입니다.', en: 'Full description and architecture.' },
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
      tags: ['MicroPython', 'ESP32', 'Robotics'],
      specs: {
        controller: 'ESP32-S3 Dual-Core',
        servos: '4x Digital Metal Gear',
        vision: 'OpenCV Tracking',
        runtime: 'MicroPython Embedded',
        power: '7.4V LiPo Rail',
      },
      keyFeatures: {
        ko: ['핵심 특징 1', '핵심 특징 2', '핵심 특징 3'],
        en: ['Key feature 1', 'Key feature 2', 'Key feature 3'],
      },
    };
    setFormData((prev) => ({
      ...prev,
      projectsData: [...prev.projectsData, newProject],
    }));
  };

  const removeProject = (id: string) => {
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) return;
    setFormData((prev) => ({
      ...prev,
      projectsData: prev.projectsData.filter((p) => p.id !== id),
    }));
  };

  // -------------------------------------------------------------------------------------
  // Background Music (BGM) Handlers & Audio Preview
  // -------------------------------------------------------------------------------------
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const currentBgmConfig: BgmConfig = formData.bgmConfig || {
    enabled: true,
    autoPlay: false,
    defaultVolume: 0.4,
    currentTrackId: 'track-cyber-pulse',
    tracks: [
      {
        id: 'track-cyber-pulse',
        title: 'Cyber Pulse (Future Robotics)',
        artist: 'Future Tech Ambient',
        url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
        category: 'Cyberpunk',
      },
    ],
  };

  const togglePreview = (track: BgmTrack) => {
    if (previewTrackId === track.id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPreviewTrackId(null);
    } else {
      if (!previewAudioRef.current) {
        previewAudioRef.current = new Audio();
      }
      previewAudioRef.current.src = track.url;
      previewAudioRef.current.volume = currentBgmConfig.defaultVolume || 0.4;
      previewAudioRef.current
        .play()
        .then(() => {
          setPreviewTrackId(track.id);
        })
        .catch((err) => {
          alert('미리듣기 재생 오류: ' + err.message);
          setPreviewTrackId(null);
        });
    }
  };

  const updateBgmConfig = (updates: Partial<BgmConfig>) => {
    setFormData((prev) => ({
      ...prev,
      bgmConfig: {
        ...(prev.bgmConfig || currentBgmConfig),
        ...updates,
      },
    }));
  };

  const handleAddCustomTrack = () => {
    const newTrack: BgmTrack = {
      id: `track-${Date.now()}`,
      title: '새로운 배경음악',
      artist: '아티스트 이름',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
      category: 'Ambient',
    };
    updateBgmConfig({
      tracks: [...(currentBgmConfig.tracks || []), newTrack],
    });
  };

  const handleAddPresetTrack = (preset: typeof BGM_PRESET_LIBRARY[0]) => {
    const newTrack: BgmTrack = {
      id: `track-${Date.now()}`,
      title: preset.title,
      artist: preset.artist,
      url: preset.url,
      category: preset.category,
    };
    updateBgmConfig({
      tracks: [...(currentBgmConfig.tracks || []), newTrack],
      currentTrackId: newTrack.id,
    });
    showFeedback('success', `"${preset.title}" 프리셋 곡이 추가 및 활성화되었습니다.`);
  };

  const handleRemoveTrack = (id: string) => {
    if (currentBgmConfig.tracks.length <= 1) {
      alert('최소 1개 이상의 배경음악 트랙이 필요합니다.');
      return;
    }
    if (!window.confirm('이 트랙을 삭제하시겠습니까?')) return;
    const remaining = currentBgmConfig.tracks.filter((t) => t.id !== id);
    const newActiveId =
      currentBgmConfig.currentTrackId === id ? remaining[0]?.id : currentBgmConfig.currentTrackId;

    updateBgmConfig({
      tracks: remaining,
      currentTrackId: newActiveId,
    });
  };

  const handleAudioUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    trackIdx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('오디오 파일 크기는 최대 20MB까지 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        const updatedTracks = [...currentBgmConfig.tracks];
        updatedTracks[trackIdx] = {
          ...updatedTracks[trackIdx],
          url: result,
          title: updatedTracks[trackIdx].title || file.name.replace(/\.[^/.]+$/, ''),
        };
        updateBgmConfig({ tracks: updatedTracks });
        showFeedback('success', '음원 파일이 성공적으로 로드되었습니다.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#070e18] text-slate-100 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
              ADM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-white">Robotfolio 관리자 콘솔</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                  {user.username} (최고 관리자)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">실시간 수정 사항이 즉시 공개 포트폴리오에 반영됩니다.</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onViewPublic}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="공개 포트폴리오 보기"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">공개 포트폴리오</span>
            </button>

            <button
              onClick={handleReset}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 hover:text-red-300 text-slate-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 hover:border-red-900/50 transition-colors cursor-pointer disabled:opacity-50"
              title="초기 기본 데이터로 리셋"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">기본값 복원</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? '저장 중...' : '저장 & 공개 반영'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="관리자 로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div
          className={`px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-800'
              : 'bg-red-950/90 text-red-300 border-b border-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Content Area with Sidebar Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full md:w-60 shrink-0 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">
            콘텐츠 카테고리
          </div>
          <button
            onClick={() => setActiveTab('hero')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>히어로 & 소개 (Hero)</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <span>기술 스택 (Skills)</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300">
                {formData.skillsData.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('trials')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
              activeTab === 'trials'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <span>시행착오 일지 (Trials)</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300">
                {formData.trialLogsData.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <span>대회 타임라인 (Timeline)</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300">
                {formData.timelineEventsData.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <span>프로젝트 (Projects)</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300">
                {formData.projectsData.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('bgm')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
              activeTab === 'bgm'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <span>배경음악 (BGM)</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  currentBgmConfig.enabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentBgmConfig.enabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </button>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
          {/* TAB 1: HERO & BIO */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  히어로 섹션 & 자기소개 설정
                </h2>
                <p className="text-xs text-slate-400 mt-1">포트폴리오 최상단 헤드라인 및 바이오 카드 문구를 설정합니다.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">상단 뱃지 (한국어)</label>
                  <input
                    type="text"
                    value={formData.heroContent.badge.ko}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroContent: {
                          ...formData.heroContent,
                          badge: { ...formData.heroContent.badge, ko: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">상단 뱃지 (영어)</label>
                  <input
                    type="text"
                    value={formData.heroContent.badge.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroContent: {
                          ...formData.heroContent,
                          badge: { ...formData.heroContent.badge, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Headline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-cyan-400">메인 헤드라인 (한국어)</h3>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">접두사 (Prefix)</label>
                    <input
                      type="text"
                      value={formData.heroContent.headline.ko.prefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heroContent: {
                            ...formData.heroContent,
                            headline: {
                              ...formData.heroContent.headline,
                              ko: { ...formData.heroContent.headline.ko, prefix: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">강조 텍스트 (Highlight)</label>
                    <input
                      type="text"
                      value={formData.heroContent.headline.ko.highlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heroContent: {
                            ...formData.heroContent,
                            headline: {
                              ...formData.heroContent.headline,
                              ko: { ...formData.heroContent.headline.ko, highlight: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-cyan-400">메인 헤드라인 (English)</h3>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Prefix</label>
                    <input
                      type="text"
                      value={formData.heroContent.headline.en.prefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heroContent: {
                            ...formData.heroContent,
                            headline: {
                              ...formData.heroContent.headline,
                              en: { ...formData.heroContent.headline.en, prefix: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Highlight</label>
                    <input
                      type="text"
                      value={formData.heroContent.headline.en.highlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heroContent: {
                            ...formData.heroContent,
                            headline: {
                              ...formData.heroContent.headline,
                              en: { ...formData.heroContent.headline.en, highlight: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Cards list */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-200">바이오 소개 카드 목록</h3>
                {formData.heroContent.bioItems.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400">카드 #{idx + 1} ({item.id})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">제목 (한국어)</label>
                        <input
                          type="text"
                          value={item.text.ko}
                          onChange={(e) => {
                            const newBio = [...formData.heroContent.bioItems];
                            newBio[idx].text.ko = e.target.value;
                            setFormData({
                              ...formData,
                              heroContent: { ...formData.heroContent, bioItems: newBio },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Title (English)</label>
                        <input
                          type="text"
                          value={item.text.en}
                          onChange={(e) => {
                            const newBio = [...formData.heroContent.bioItems];
                            newBio[idx].text.en = e.target.value;
                            setFormData({
                              ...formData,
                              heroContent: { ...formData.heroContent, bioItems: newBio },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">상세 설명 (한국어)</label>
                        <textarea
                          rows={2}
                          value={item.detail.ko}
                          onChange={(e) => {
                            const newBio = [...formData.heroContent.bioItems];
                            newBio[idx].detail.ko = e.target.value;
                            setFormData({
                              ...formData,
                              heroContent: { ...formData.heroContent, bioItems: newBio },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Detail (English)</label>
                        <textarea
                          rows={2}
                          value={item.detail.en}
                          onChange={(e) => {
                            const newBio = [...formData.heroContent.bioItems];
                            newBio[idx].detail.en = e.target.value;
                            setFormData({
                              ...formData,
                              heroContent: { ...formData.heroContent, bioItems: newBio },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS (TECHNICAL ARSENAL) */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    기술 스택 관리 (Technical Arsenal)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">포트폴리오의 마이크로파이썬, 로봇 구조, 모터 제어 카드와 코드 스니펫을 수정합니다.</p>
                </div>
                <button
                  onClick={addSkill}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>스킬 추가</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.skillsData.map((skill, idx) => (
                  <div key={skill.id} className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-xs font-mono font-bold">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsData];
                            newSkills[idx].name = e.target.value;
                            setFormData({ ...formData, skillsData: newSkills });
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-white outline-none focus:border-cyan-500"
                          placeholder="기술명 (예: MicroPython)"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={skill.iconType}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsData];
                            newSkills[idx].iconType = e.target.value as any;
                            setFormData({ ...formData, skillsData: newSkills });
                          }}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
                        >
                          <option value="code">Icon: Code</option>
                          <option value="robot">Icon: Robot</option>
                          <option value="motor">Icon: Motor</option>
                        </select>

                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">요약 설명 (한국어)</label>
                        <input
                          type="text"
                          value={skill.shortDesc.ko}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsData];
                            newSkills[idx].shortDesc.ko = e.target.value;
                            setFormData({ ...formData, skillsData: newSkills });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Short Desc (English)</label>
                        <input
                          type="text"
                          value={skill.shortDesc.en}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsData];
                            newSkills[idx].shortDesc.en = e.target.value;
                            setFormData({ ...formData, skillsData: newSkills });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">상세 설명 (한국어)</label>
                        <textarea
                          rows={2}
                          value={skill.fullDesc.ko}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsData];
                            newSkills[idx].fullDesc.ko = e.target.value;
                            setFormData({ ...formData, skillsData: newSkills });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Full Desc (English)</label>
                        <textarea
                          rows={2}
                          value={skill.fullDesc.en}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsData];
                            newSkills[idx].fullDesc.en = e.target.value;
                            setFormData({ ...formData, skillsData: newSkills });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">태그 (쉼표로 구분)</label>
                      <input
                        type="text"
                        value={skill.tags.join(', ')}
                        onChange={(e) => {
                          const newSkills = [...formData.skillsData];
                          newSkills[idx].tags = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          setFormData({ ...formData, skillsData: newSkills });
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        코드 스니펫 (MicroPython / Python / JSON)
                      </label>
                      <textarea
                        rows={4}
                        value={skill.codeSnippet || ''}
                        onChange={(e) => {
                          const newSkills = [...formData.skillsData];
                          newSkills[idx].codeSnippet = e.target.value;
                          setFormData({ ...formData, skillsData: newSkills });
                        }}
                        className="w-full p-3 bg-[#0a101b] border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRIAL LOGS */}
          {activeTab === 'trials' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    시행착오 일지 (Trial & Error Logs)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">대회 준비 및 현장 수리/배터리/모터 시행착오 기록을 추가·수정합니다.</p>
                </div>
                <button
                  onClick={addTrialLog}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>일지 추가</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.trialLogsData.map((trial, idx) => (
                  <div key={trial.id} className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 text-xs font-mono font-bold">
                          로그 #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={trial.title.ko}
                          onChange={(e) => {
                            const newTrials = [...formData.trialLogsData];
                            newTrials[idx].title.ko = e.target.value;
                            setFormData({ ...formData, trialLogsData: newTrials });
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-white outline-none focus:border-cyan-500"
                          placeholder="일지 제목 (한국어)"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={trial.type}
                          onChange={(e) => {
                            const newTrials = [...formData.trialLogsData];
                            newTrials[idx].type = e.target.value as any;
                            setFormData({ ...formData, trialLogsData: newTrials });
                          }}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
                        >
                          <option value="success">유형: 성공/신속수리 (Success)</option>
                          <option value="reflection">유형: 반성/모터전략 (Reflection)</option>
                          <option value="note">유형: 배터리/주의사항 (Note)</option>
                        </select>

                        <button
                          onClick={() => removeTrialLog(trial.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">제목 (English)</label>
                        <input
                          type="text"
                          value={trial.title.en}
                          onChange={(e) => {
                            const newTrials = [...formData.trialLogsData];
                            newTrials[idx].title.en = e.target.value;
                            setFormData({ ...formData, trialLogsData: newTrials });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">핵심 인용문 (한국어, 줄바꿈으로 구분)</label>
                        <textarea
                          rows={2}
                          value={trial.quotes.ko.join('\n')}
                          onChange={(e) => {
                            const newTrials = [...formData.trialLogsData];
                            newTrials[idx].quotes.ko = e.target.value.split('\n').filter(Boolean);
                            setFormData({ ...formData, trialLogsData: newTrials });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Quotes (English, one per line)</label>
                        <textarea
                          rows={2}
                          value={trial.quotes.en.join('\n')}
                          onChange={(e) => {
                            const newTrials = [...formData.trialLogsData];
                            newTrials[idx].quotes.en = e.target.value.split('\n').filter(Boolean);
                            setFormData({ ...formData, trialLogsData: newTrials });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">상세 반성 및 대책 (한국어)</label>
                        <textarea
                          rows={2}
                          value={trial.reflectionDetail?.ko || ''}
                          onChange={(e) => {
                            const newTrials = [...formData.trialLogsData];
                            newTrials[idx].reflectionDetail = {
                              ...(newTrials[idx].reflectionDetail || { ko: '', en: '' }),
                              ko: e.target.value,
                            };
                            setFormData({ ...formData, trialLogsData: newTrials });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-sky-400" />
                    대회 타임라인 (Competition Timeline)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">준비 기간, 센서 이슈 해결, 본선 경기 주행 타임라인을 관리합니다.</p>
                </div>
                <button
                  onClick={addTimelineEvent}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>타임라인 추가</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.timelineEventsData.map((ev, idx) => (
                  <div key={ev.id} className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 text-xs font-mono font-bold">
                          단계 #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={ev.phase.ko}
                          onChange={(e) => {
                            const newEv = [...formData.timelineEventsData];
                            newEv[idx].phase.ko = e.target.value;
                            setFormData({ ...formData, timelineEventsData: newEv });
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-white outline-none focus:border-cyan-500"
                          placeholder="단계명 (예: Preparation Phase)"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={ev.tagType || 'prep'}
                          onChange={(e) => {
                            const newEv = [...formData.timelineEventsData];
                            newEv[idx].tagType = e.target.value as any;
                            setFormData({ ...formData, timelineEventsData: newEv });
                          }}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
                        >
                          <option value="prep">태그: Prep (준비)</option>
                          <option value="trial">태그: Trial (시행착오)</option>
                          <option value="competition">태그: Competition (본선)</option>
                        </select>

                        <button
                          onClick={() => removeTimelineEvent(ev.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">제목 (한국어)</label>
                        <input
                          type="text"
                          value={ev.title.ko}
                          onChange={(e) => {
                            const newEv = [...formData.timelineEventsData];
                            newEv[idx].title.ko = e.target.value;
                            setFormData({ ...formData, timelineEventsData: newEv });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Title (English)</label>
                        <input
                          type="text"
                          value={ev.title.en}
                          onChange={(e) => {
                            const newEv = [...formData.timelineEventsData];
                            newEv[idx].title.en = e.target.value;
                            setFormData({ ...formData, timelineEventsData: newEv });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">설명 (한국어)</label>
                        <textarea
                          rows={2}
                          value={ev.description.ko}
                          onChange={(e) => {
                            const newEv = [...formData.timelineEventsData];
                            newEv[idx].description.ko = e.target.value;
                            setFormData({ ...formData, timelineEventsData: newEv });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">하이라이트 박스 요약 (한국어)</label>
                        <textarea
                          rows={2}
                          value={ev.highlightBox.content.ko}
                          onChange={(e) => {
                            const newEv = [...formData.timelineEventsData];
                            newEv[idx].highlightBox.content.ko = e.target.value;
                            setFormData({ ...formData, timelineEventsData: newEv });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-cyan-400" />
                    프로젝트 쇼케이스 (Projects)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Red Tower Stacker 등 로봇팔 프로젝트의 상세 스펙과 하이라이트를 관리합니다.</p>
                </div>
                <button
                  onClick={addProject}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>프로젝트 추가</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.projectsData.map((project, idx) => (
                  <div key={project.id} className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-xs font-mono font-bold">
                          프로젝트 #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={project.title.ko}
                          onChange={(e) => {
                            const newProj = [...formData.projectsData];
                            newProj[idx].title.ko = e.target.value;
                            setFormData({ ...formData, projectsData: newProj });
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-white outline-none focus:border-cyan-500"
                          placeholder="프로젝트 제목 (한국어)"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={project.version}
                          onChange={(e) => {
                            const newProj = [...formData.projectsData];
                            newProj[idx].version = e.target.value;
                            setFormData({ ...formData, projectsData: newProj });
                          }}
                          className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-center text-cyan-300 font-mono"
                          placeholder="V1.0"
                        />

                        <button
                          onClick={() => removeProject(project.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">제목 (English)</label>
                      <input
                        type="text"
                        value={project.title.en}
                        onChange={(e) => {
                          const newProj = [...formData.projectsData];
                          newProj[idx].title.en = e.target.value;
                          setFormData({ ...formData, projectsData: newProj });
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Image File Upload & Preview */}
                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <ImageUploadField
                        label="프로젝트 대표 이미지 (내 컴퓨터 사진 파일 선택 / 드래그)"
                        value={project.imageUrl}
                        onChange={(newVal) => {
                          const newProj = [...formData.projectsData];
                          newProj[idx].imageUrl = newVal;
                          setFormData({ ...formData, projectsData: newProj });
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">한 줄 요약 (한국어)</label>
                        <input
                          type="text"
                          value={project.shortSummary.ko}
                          onChange={(e) => {
                            const newProj = [...formData.projectsData];
                            newProj[idx].shortSummary.ko = e.target.value;
                            setFormData({ ...formData, projectsData: newProj });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Short Summary (English)</label>
                        <input
                          type="text"
                          value={project.shortSummary.en}
                          onChange={(e) => {
                            const newProj = [...formData.projectsData];
                            newProj[idx].shortSummary.en = e.target.value;
                            setFormData({ ...formData, projectsData: newProj });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">전체 상세 설명 (한국어)</label>
                        <textarea
                          rows={3}
                          value={project.fullDescription.ko}
                          onChange={(e) => {
                            const newProj = [...formData.projectsData];
                            newProj[idx].fullDescription.ko = e.target.value;
                            setFormData({ ...formData, projectsData: newProj });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Full Description (English)</label>
                        <textarea
                          rows={3}
                          value={project.fullDescription.en}
                          onChange={(e) => {
                            const newProj = [...formData.projectsData];
                            newProj[idx].fullDescription.en = e.target.value;
                            setFormData({ ...formData, projectsData: newProj });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Hardware Specs */}
                    <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-[11px] font-bold text-cyan-400">하드웨어 및 센서 구성 (Hardware Specs)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">스파이크프라임 허브</label>
                          <input
                            type="text"
                            value={project.specs.hub || project.specs.controller || ''}
                            onChange={(e) => {
                              const newProj = [...formData.projectsData];
                              newProj[idx].specs.hub = e.target.value;
                              newProj[idx].specs.controller = e.target.value;
                              setFormData({ ...formData, projectsData: newProj });
                            }}
                            className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white outline-none focus:border-cyan-500"
                            placeholder="스파이크프라임 허브"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">스파이크프라임 모터</label>
                          <input
                            type="text"
                            value={project.specs.motors || project.specs.servos || ''}
                            onChange={(e) => {
                              const newProj = [...formData.projectsData];
                              newProj[idx].specs.motors = e.target.value;
                              newProj[idx].specs.servos = e.target.value;
                              setFormData({ ...formData, projectsData: newProj });
                            }}
                            className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white outline-none focus:border-cyan-500"
                            placeholder="스파이크프라임 모터"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">컬러센서</label>
                          <input
                            type="text"
                            value={project.specs.colorSensor || project.specs.vision || ''}
                            onChange={(e) => {
                              const newProj = [...formData.projectsData];
                              newProj[idx].specs.colorSensor = e.target.value;
                              newProj[idx].specs.vision = e.target.value;
                              setFormData({ ...formData, projectsData: newProj });
                            }}
                            className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white outline-none focus:border-cyan-500"
                            placeholder="컬러센서"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BACKGROUND MUSIC (BGM) */}
          {activeTab === 'bgm' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Global BGM Settings */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Music className="w-5 h-5 text-cyan-400" />
                      배경음악 (BGM) 및 플레이어 설정
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      포트폴리오 방문자에게 재생될 배경음악 곡 목록, 대표곡 및 볼륨을 관리합니다.
                    </p>
                  </div>

                  {/* Master Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-700 hover:border-cyan-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={currentBgmConfig.enabled}
                      onChange={(e) => updateBgmConfig({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <span className="text-xs font-bold text-slate-300 peer-checked:text-cyan-400">
                      {currentBgmConfig.enabled ? 'BGM 기능 활성화됨' : 'BGM 기능 비활성화됨'}
                    </span>
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 relative" />
                  </label>
                </div>

                {/* Sub Controls: Autoplay & Volume */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  {/* Default Volume */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                        기본 볼륨 설정 (Default Volume)
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {Math.round((currentBgmConfig.defaultVolume ?? 0.4) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={currentBgmConfig.defaultVolume ?? 0.4}
                      onChange={(e) => updateBgmConfig({ defaultVolume: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <p className="text-[11px] text-slate-500">
                      방문자가 처음 페이지에 들어왔을 때 설정되는 초기 음량입니다.
                    </p>
                  </div>

                  {/* AutoPlay Toggle */}
                  <div className="space-y-2 sm:pl-4 sm:border-l sm:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        접속 시 자동 재생 시도
                      </span>
                      <input
                        type="checkbox"
                        checked={currentBgmConfig.autoPlay}
                        onChange={(e) => updateBgmConfig({ autoPlay: e.target.checked })}
                        className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      브라우저 보안 정책에 따라 첫 클릭/스크롤 상호작용 후 부드럽게 재생이 시작됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preset Track Quick Library */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    추천 BGM 프리셋 라이브러리 (One-Click Presets)
                  </h3>
                  <span className="text-[11px] text-slate-400">클릭하여 곡 목록에 즉시 추가 및 적용</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {BGM_PRESET_LIBRARY.map((preset, pIdx) => {
                    const isAlreadyAdded = currentBgmConfig.tracks?.some((t) => t.url === preset.url);
                    const isActive = currentBgmConfig.tracks?.find((t) => t.id === currentBgmConfig.currentTrackId)?.url === preset.url;

                    return (
                      <div
                        key={pIdx}
                        className={`p-3 rounded-lg border text-xs flex flex-col justify-between gap-2 transition-all ${
                          isActive
                            ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm shadow-cyan-500/20'
                            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-cyan-300">
                              {preset.category}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-extrabold text-[10px]">
                                현재 대표곡
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-white truncate">{preset.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{preset.artist}</p>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                          {/* Preview button */}
                          <button
                            type="button"
                            onClick={() =>
                              togglePreview({
                                id: `preset-preview-${pIdx}`,
                                title: preset.title,
                                artist: preset.artist,
                                url: preset.url,
                              })
                            }
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {previewTrackId === `preset-preview-${pIdx}` ? (
                              <>
                                <Pause className="w-3 h-3 text-cyan-400" />
                                <span>정지</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-cyan-400" />
                                <span>미리듣기</span>
                              </>
                            )}
                          </button>

                          {/* Add / Select */}
                          <button
                            type="button"
                            onClick={() => handleAddPresetTrack(preset)}
                            className="flex-1 px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all border border-cyan-500/30"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isAlreadyAdded ? '다시 추가' : '트랙 추가'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Track List & Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <Disc3 className="w-4 h-4 text-cyan-400" />
                    등록된 BGM 트랙 목록 ({currentBgmConfig.tracks?.length || 0}곡)
                  </h3>

                  <button
                    type="button"
                    onClick={handleAddCustomTrack}
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 text-xs font-extrabold rounded-lg hover:from-cyan-400 hover:to-sky-400 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>새 트랙 직접 추가</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentBgmConfig.tracks?.map((track, idx) => {
                    const isMain = track.id === currentBgmConfig.currentTrackId;

                    return (
                      <div
                        key={track.id || idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isMain
                            ? 'bg-slate-950 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-sm text-white">{track.title || 'Untitled Track'}</span>
                            {isMain ? (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-[10px] flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                현재 대표곡 (Active)
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => updateBgmConfig({ currentTrackId: track.id })}
                                className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 text-[10px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                              >
                                대표곡으로 지정
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Preview playback */}
                            <button
                              type="button"
                              onClick={() => togglePreview(track)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              {previewTrackId === track.id ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>정지</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>미리듣기</span>
                                </>
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleRemoveTrack(track.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                              title="트랙 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">곡 제목 (Title)</label>
                            <input
                              type="text"
                              value={track.title}
                              onChange={(e) => {
                                const newTracks = [...currentBgmConfig.tracks];
                                newTracks[idx].title = e.target.value;
                                updateBgmConfig({ tracks: newTracks });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                              placeholder="예: Cyber Pulse"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">아티스트 / 출처 (Artist)</label>
                            <input
                              type="text"
                              value={track.artist}
                              onChange={(e) => {
                                const newTracks = [...currentBgmConfig.tracks];
                                newTracks[idx].artist = e.target.value;
                                updateBgmConfig({ tracks: newTracks });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                              placeholder="예: Future Tech"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">장르 / 분위기 (Category)</label>
                            <input
                              type="text"
                              value={track.category || ''}
                              onChange={(e) => {
                                const newTracks = [...currentBgmConfig.tracks];
                                newTracks[idx].category = e.target.value;
                                updateBgmConfig({ tracks: newTracks });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                              placeholder="예: Cyberpunk / Lo-Fi / Ambient"
                            />
                          </div>
                        </div>

                        {/* Audio Source: URL or File Upload */}
                        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-2">
                          <label className="block text-[11px] font-bold text-slate-300 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                              음원 스트림 URL 또는 직접 파일 업로드
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">MP3, WAV, OGG, WebM 지원</span>
                          </label>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={track.url}
                              onChange={(e) => {
                                const newTracks = [...currentBgmConfig.tracks];
                                newTracks[idx].url = e.target.value;
                                updateBgmConfig({ tracks: newTracks });
                              }}
                              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500 truncate"
                              placeholder="https://.../music.mp3 또는 아래 파일 업로드 버튼 사용"
                            />

                            {/* Direct File Upload button */}
                            <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors shrink-0">
                              <Upload className="w-3.5 h-3.5 text-cyan-400" />
                              <span>내 파일 업로드</span>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleAudioUpload(e, idx)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
