import React, { useState, useRef, useCallback } from 'react';
import { Upload, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';

interface ImageUploaderProps {
  onImageReady: (file: File, stages: (stage: string, pct: number) => void) => Promise<void>;
  onReset: () => void;
  hasPortrait: boolean;
  isProcessing: boolean;
  processingStage: string;
  processingProgress: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageReady,
  onReset,
  hasPortrait,
  isProcessing,
  processingStage,
  processingProgress,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const accepted = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!accepted.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    soundFX.playScan();
    const noop = (_s: string, _p: number) => {};
    await onImageReady(file, noop);
  }, [onImageReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const progressBar = (pct: number) => {
    const filled = Math.round((pct / 100) * 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  if (isProcessing) {
    return (
      <div className="space-y-3 py-4 font-mono text-xs text-cyber-textMuted">
        <div className="flex items-center gap-2 text-cyber-cyan">
          <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          <span className="tracking-wider uppercase text-[11px]">{processingStage}</span>
        </div>
        <div className="space-y-2 pl-4">
          <div className="flex items-center gap-2">
            <span className="text-cyber-textDim w-32 truncate">ANALYZING PIXELS</span>
            <span className="text-cyber-cyan">{progressBar(Math.min(processingProgress, 60))}</span>
            <span>{Math.min(processingProgress, 60)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyber-textDim w-32 truncate">GENERATING FIELD</span>
            <span className="text-cyber-cyan">{progressBar(Math.max(0, processingProgress - 60))}</span>
            <span>{Math.max(0, processingProgress - 60)}%</span>
          </div>
        </div>
      </div>
    );
  }

  if (hasPortrait) {
    return (
      <div className="flex items-center gap-3 pt-1 flex-wrap">
        <button
          onClick={() => {
            soundFX.playClick();
            fileInputRef.current?.click();
          }}
          className="flex items-center gap-2 text-xs font-mono text-cyber-textMuted hover:text-cyber-cyan border border-cyber-border hover:border-cyber-cyan px-3 py-2 transition-all tracking-wider"
        >
          <div ref={useHoverEffect({ scale: 1.05, offsetX: 2, offsetY: 0, duration: 0.1 })}>
            <ImageIcon className="w-3.5 h-3.5" />
            <span>CHANGE IMAGE</span>
          </div>
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            onReset();
          }}
          className="flex items-center gap-2 text-xs font-mono text-cyber-textMuted hover:text-cyber-cyan border border-cyber-border hover:border-cyber-cyan px-3 py-2 transition-all tracking-wider"
        >
          <div ref={useHoverEffect({ scale: 1.05, offsetX: 2, offsetY: 0, duration: 0.1 })}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET DEFAULT</span>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="sr-only"
          onChange={handleInputChange}
          aria-label="Upload portrait image"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => {
          soundFX.playClick();
          fileInputRef.current?.click();
        }}
        className={`cursor-pointer border transition-all duration-300 p-6 text-center space-y-3 ${
          dragOver
            ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-cyan-sm'
            : 'border-cyber-border hover:border-cyber-cyan/50 hover:bg-cyber-bgLight'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload portrait image"
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-2">
          <div ref={useHoverEffect({ scale: 1.05, offsetX: 2, offsetY: 0, duration: 0.15 })}>
            <div className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all ${
              dragOver ? 'border-cyber-cyan text-cyber-cyan' : 'border-cyber-border text-cyber-textMuted'
            }`}>
              <Upload className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-cyber-cyan tracking-wider uppercase">
              UPLOAD PORTRAIT
            </p>
            <p className="font-mono text-[10px] text-cyber-textDim tracking-wider">
              Create your digital identity
            </p>
            <p className="font-mono text-[10px] text-cyber-textDim">
              JPG · PNG · WEBP accepted
            </p>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        onChange={handleInputChange}
        aria-label="Upload portrait image"
      />
    </div>
  );
};
