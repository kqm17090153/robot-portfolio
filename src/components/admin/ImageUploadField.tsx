import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, Link as LinkIcon, Check, FileImage } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function processImageFile(file: File, maxWidth = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('이미지 파일만 업로드할 수 있습니다.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down if larger than maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Draw and compress to jpeg
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (e) {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = '프로젝트 이미지 (사진 업로드)',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    setUploadError(null);
    setIsProcessing(true);
    try {
      const processedDataUrl = await processImageFile(file);
      onChange(processedDataUrl);
    } catch (err: any) {
      setUploadError(err?.message || '이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isDataUrl = value && value.startsWith('data:image/');
  const isHttpUrl = value && (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/'));

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
          <FileImage className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? '파일 드래그 영역으로 전환' : 'URL 직접 입력'}</span>
        </button>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Direct URL input if toggled */}
      {showUrlInput && (
        <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/robot-photo.jpg 또는 /assets/photo.jpg"
              className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white outline-none focus:border-cyan-500 font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                title="지우기"
              >
                지우기
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400">외부 웹 이미지 링크 또는 로컬 경로를 직접 입력할 수 있습니다.</p>
        </div>
      )}

      {/* Main Upload Box & Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all p-3 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
            : 'border-slate-700 hover:border-slate-600 bg-slate-950/60'
        }`}
      >
        {value ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Image Preview Thumbnail */}
            <div className="relative w-full sm:w-28 h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0 group">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-md bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer shadow"
                  title="사진 교체"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-500 cursor-pointer shadow"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Info & Action Buttons */}
            <div className="flex-1 w-full space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                  <Check className="w-3 h-3" />
                  {isDataUrl ? '로컬 파일 업로드됨' : '이미지 연결됨'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {isDataUrl ? '내 컴퓨터 사진 (Base64)' : value}
                </span>
              </div>

              <p className="text-[11px] text-slate-300">
                사진이 등록되었습니다. 언제든 다른 파일로 교체할 수 있습니다.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>{isProcessing ? '변환 중...' : '다른 사진으로 변경'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>제거</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Upload State */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-4 px-2 text-center cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>

            <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
              {isProcessing ? '이미지 최적화 중...' : '클릭하여 내 컴퓨터에서 사진 파일 선택'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              또는 사진 파일을 이 박스로 직접 드래그 & 드롭하세요 (JPG, PNG, WEBP)
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-[11px] text-rose-400 font-medium">{uploadError}</p>
      )}
    </div>
  );
};
