import React from 'react';

interface EditorControlsProps {
  onAddVideo: (files: FileList) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  onSplit: () => void;
  onTrim: () => void;
  onRemove: () => void;
  onRemoveAllEffects: () => void;
  onVolumeChange: (v: number) => void;
  volume: number;
  onFilterChange: (f: string) => void;
  filter: string;
  onBrightnessChange: (v: number) => void;
  brightness: number;
  onContrastChange: (v: number) => void;
  contrast: number;
  onSaturationChange: (v: number) => void;
  saturation: number;
  onSpeedChange: (v: number) => void;
  speed: number;
  onTransitionChange: (t: string) => void;
  transition: string;
  onSetTextOverlay: (text: string) => void;
  onClearTextOverlay: () => void;
  textOverlay: string;
  onSetImageOverlay: (file: File) => void;
  onClearImageOverlay: () => void;
  timelineZoom: number;
  onTimelineZoomChange: (v: number) => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  onAddVideo,
  onPlayPause,
  isPlaying,
  onSplit,
  onTrim,
  onRemove,
  onRemoveAllEffects,
  onVolumeChange,
  volume,
  onFilterChange,
  filter,
  onBrightnessChange,
  brightness,
  onContrastChange,
  contrast,
  onSaturationChange,
  saturation,
  onSpeedChange,
  speed,
  onTransitionChange,
  transition,
  onSetTextOverlay,
  onClearTextOverlay,
  textOverlay,
  onSetImageOverlay,
  onClearImageOverlay,
  timelineZoom,
  onTimelineZoomChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center p-4 border border-gray-300 bg-white rounded-lg shadow mb-4" style={{color: '#222'}}>
      {/* Add Video */}
      <label className="file-input-wrapper cursor-pointer">
        <span className="button button-primary bg-indigo-600 text-white hover:bg-indigo-700">Add Video</span>
        <input type="file" accept="video/*" multiple className="hidden" onChange={e => e.target.files && onAddVideo(e.target.files)} />
      </label>
      {/* Play/Pause */}
      <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onPlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      {/* Split */}
      <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onSplit}>Split Clip</button>
      {/* Trim */}
      <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onTrim}>Trim</button>
      {/* Remove */}
      <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onRemove}>Remove Selected</button>
      {/* Remove All Effects */}
      <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onRemoveAllEffects}>Remove All Effects</button>
      {/* Volume */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Volume:</label>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => onVolumeChange(Number(e.target.value))} className="w-24 accent-indigo-600" />
      </div>
      {/* Filter */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Filter:</label>
        <select value={filter} onChange={e => onFilterChange(e.target.value)} className="p-2 border rounded bg-white text-gray-900">
          <option value="none">None</option>
          <option value="grayscale(100%)">Grayscale</option>
          <option value="sepia(100%)">Sepia</option>
          <option value="invert(100%)">Invert</option>
          <option value="blur(5px)">Blur</option>
        </select>
      </div>
      {/* Brightness */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Brightness:</label>
        <input type="range" min={0} max={200} step={1} value={brightness} onChange={e => onBrightnessChange(Number(e.target.value))} className="w-24 accent-indigo-600" />
        <span className="font-mono">{brightness}%</span>
      </div>
      {/* Contrast */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Contrast:</label>
        <input type="range" min={0} max={200} step={1} value={contrast} onChange={e => onContrastChange(Number(e.target.value))} className="w-24 accent-indigo-600" />
        <span className="font-mono">{contrast}%</span>
      </div>
      {/* Saturation */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Saturation:</label>
        <input type="range" min={0} max={200} step={1} value={saturation} onChange={e => onSaturationChange(Number(e.target.value))} className="w-24 accent-indigo-600" />
        <span className="font-mono">{saturation}%</span>
      </div>
      {/* Speed */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Speed:</label>
        <select value={speed} onChange={e => onSpeedChange(Number(e.target.value))} className="p-2 border rounded bg-white text-gray-900">
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1}>1x (Normal)</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
      {/* Transition */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Transition:</label>
        <select value={transition} onChange={e => onTransitionChange(e.target.value)} className="p-2 border rounded bg-white text-gray-900">
          <option value="none">None</option>
          <option value="fade">Fade</option>
          <option value="slide-left">Slide Left</option>
          <option value="wipe-up">Wipe Up</option>
        </select>
      </div>
      {/* Text Overlay */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Text Overlay:</label>
        <input type="text" value={textOverlay} onChange={e => onSetTextOverlay(e.target.value)} placeholder="Enter text" className="p-2 border rounded w-40 bg-white text-gray-900" />
        <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={() => onSetTextOverlay(textOverlay)}>Set Text</button>
        <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onClearTextOverlay}>Clear Text</button>
      </div>
      {/* Image Overlay */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Image Overlay:</label>
        <input type="file" accept="image/*" onChange={e => e.target.files && onSetImageOverlay(e.target.files[0])} className="bg-white text-gray-900" />
        <button className="button button-secondary bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onClearImageOverlay}>Clear Image</button>
      </div>
      {/* Timeline Zoom */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Timeline Zoom:</label>
        <input type="range" min={0.5} max={2} step={0.1} value={timelineZoom} onChange={e => onTimelineZoomChange(Number(e.target.value))} className="w-32 accent-indigo-600" />
      </div>
    </div>
  );
};

export default EditorControls; 