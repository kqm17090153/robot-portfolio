import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
  Disc3,
  ListMusic,
  Sparkles,
  Radio,
  Sliders,
} from 'lucide-react';
import { BgmConfig, BgmTrack, Language } from '../types';

interface BackgroundMusicPlayerProps {
  bgmConfig?: BgmConfig;
  language: Language;
  onTrackChange?: (trackId: string) => void;
}

export const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  bgmConfig,
  language,
}) => {
  // If BGM is disabled in config, do not render
  if (bgmConfig && bgmConfig.enabled === false) {
    return null;
  }

  const tracks: BgmTrack[] = bgmConfig?.tracks && bgmConfig.tracks.length > 0
    ? bgmConfig.tracks
    : [
        {
          id: 'track-cyber-pulse',
          title: 'Cyber Pulse (Future Robotics)',
          artist: 'Future Tech Ambient',
          url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
          category: 'Cyberpunk',
        },
      ];

  const currentTrackId = bgmConfig?.currentTrackId || tracks[0]?.id;
  const currentTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(bgmConfig?.defaultVolume ?? 0.4);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(() => {
    const idx = tracks.findIndex((t) => t.id === currentTrackId);
    return idx >= 0 ? idx : 0;
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync with prop changes
  useEffect(() => {
    if (bgmConfig?.currentTrackId) {
      const idx = tracks.findIndex((t) => t.id === bgmConfig.currentTrackId);
      if (idx >= 0 && idx !== activeTrackIndex) {
        setActiveTrackIndex(idx);
      }
    }
  }, [bgmConfig?.currentTrackId]);

  const activeTrack = tracks[activeTrackIndex] || currentTrack;

  // Handle Audio element initialization & source update
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (activeTrack?.url) {
      setAudioError(null);
      const wasPlaying = isPlaying;
      audio.src = activeTrack.url;
      audio.volume = isMuted ? 0 : volume;

      if (wasPlaying) {
        audio.play().catch((err) => {
          console.warn('Audio play prevented:', err);
          setIsPlaying(false);
        });
      }
    }

    const handleEnded = () => {
      // Auto play next track in playlist
      setActiveTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    const handleError = () => {
      setAudioError('음원 로딩에 실패했습니다.');
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [activeTrack?.url]);

  // Volume updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Toggle Play / Pause
  const togglePlay = () => {
    setHasInteracted(true);
    if (!audioRef.current || !activeTrack?.url) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(null);
        })
        .catch((err) => {
          console.warn('Play error:', err);
          setAudioError('재생할 수 없습니다. 클릭하여 다시 시도하세요.');
          setIsPlaying(false);
        });
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTrackIndex((prev) => (prev + 1) % tracks.length);
    if (!isPlaying && audioRef.current) {
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
    }
  };

  const handlePrevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    if (!isPlaying && audioRef.current) {
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
    }
  };

  const handleSelectTrack = (index: number) => {
    setActiveTrackIndex(index);
    if (audioRef.current) {
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
    }
  };

  return (
    <div
      id="bgm-player-widget"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Expanded Playlist & Volume Modal Card */}
      {isExpanded && (
        <div className="mb-3 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 text-white rounded-2xl p-4 shadow-2xl shadow-cyan-950/50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase text-cyan-400">
                {language === 'ko' ? '배경음악 플레이어' : 'Background Audio'}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded-md hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          {/* Current track info & Animated Equalizer */}
          <div className="py-3 flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-700 flex items-center justify-center text-white shrink-0 shadow-md ${
                isPlaying ? 'ring-2 ring-cyan-400/50 animate-pulse' : 'opacity-80'
              }`}
            >
              <Disc3 className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {activeTrack?.title || 'Unknown Track'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {activeTrack?.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Equalizer Wave bar simulation */}
          <div className="flex items-center justify-center gap-1 h-4 my-1">
            {[40, 75, 50, 90, 65, 80, 45, 95, 60, 30].map((height, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isPlaying ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (height * Math.random() + 20))}%` : '20%',
                }}
              />
            ))}
          </div>

          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center justify-center gap-3 py-2">
            <button
              onClick={handlePrevTrack}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="이전 곡"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform"
              title={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={handleNextTrack}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="다음 곡"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              className="text-slate-400 hover:text-cyan-400 p-1"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400 font-mono w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Track Selection List */}
          {tracks.length > 1 && (
            <div className="mt-3 pt-2 border-t border-slate-800 space-y-1 max-h-32 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase px-1">
                {language === 'ko' ? '트랙 목록' : 'Track List'} ({tracks.length})
              </span>
              {tracks.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    activeTrackIndex === idx
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate pr-2">{t.title}</span>
                  {activeTrackIndex === idx && isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              ))}
            </div>
          )}

          {audioError && (
            <p className="mt-2 text-[10px] text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800">
              {audioError}
            </p>
          )}
        </div>
      )}

      {/* Main Floating Pill Button */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-400 text-white rounded-full p-1.5 sm:p-2 shadow-xl shadow-cyan-950/40 transition-all duration-200">
        {/* Toggle Play / Pause Main Trigger */}
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
            isPlaying
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title={isPlaying ? 'BGM 일시정지' : '배경음악 재생'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">BGM ON</span>
              {/* Equalizer animation mini bars */}
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-slate-950 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-2/3 bg-slate-950 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-full bg-slate-950 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 shrink-0 ml-0.5 text-cyan-400" />
              <span className="hidden sm:inline text-[11px] text-slate-300">
                {language === 'ko' ? 'BGM 켜기' : 'Play BGM'}
              </span>
              <Music className="w-3.5 h-3.5 text-slate-400 sm:hidden" />
            </>
          )}
        </button>

        {/* Current track title teaser on hover/active */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden md:flex items-center gap-1.5 px-2 py-1 text-slate-300 hover:text-cyan-300 cursor-pointer max-w-[140px] transition-colors"
          title="플레이어 설정 열기"
        >
          <span className="text-[11px] truncate font-medium">
            {activeTrack?.title || 'BGM Track'}
          </span>
        </div>

        {/* Expand / Settings Drawer Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors ${
            isExpanded ? 'bg-slate-800 text-cyan-400' : ''
          }`}
          title={isExpanded ? '플레이어 닫기' : '플레이어 상세 컨트롤'}
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
