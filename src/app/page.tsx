'use client';

import React, { useState, useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import EditorControls from '../components/EditorControls';
import Timeline, { VideoClip } from '../components/Timeline';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  // State for video clips and timeline
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [activeClipIndex, setActiveClipIndex] = useState<number>(-1);
  const [playheadTime, setPlayheadTime] = useState(0);
  const [timelineZoom, setTimelineZoom] = useState(1);

  // State for effects and overlays (per-clip, but for now, global for MVP)
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [transition, setTransition] = useState('none');
  const [textOverlay, setTextOverlay] = useState('');
  const [imageOverlay, setImageOverlay] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);

  // Add video(s)
  const handleAddVideo = (files: FileList) => {
    const newClips: VideoClip[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      // We'll get duration from metadata later
      const tempVideo = document.createElement('video');
      tempVideo.onloadedmetadata = () => {
        newClips.push({
          id: uuidv4(),
          name: file.name,
          url,
          duration: tempVideo.duration,
          trimStart: 0,
          trimEnd: tempVideo.duration,
        });
        if (newClips.length === files.length) {
          setVideoClips(prev => [...prev, ...newClips]);
          setActiveClipIndex(videoClips.length + newClips.length - 1);
        }
      };
      tempVideo.src = url;
    });
  };

  // Remove selected clip
  const handleRemove = () => {
    if (activeClipIndex === -1) return;
    setVideoClips(clips => {
      const newClips = [...clips];
      newClips.splice(activeClipIndex, 1);
      return newClips;
    });
    setActiveClipIndex(idx => {
      if (videoClips.length <= 1) return -1;
      return Math.max(0, idx - 1);
    });
  };

  // Reorder clips
  const handleReorderClips = (newOrder: VideoClip[]) => {
    setVideoClips(newOrder);
  };

  // Select a clip
  const handleSelectClip = (idx: number) => {
    setActiveClipIndex(idx);
    setPlayheadTime(
      videoClips.slice(0, idx).reduce((sum, c) => sum + (c.trimEnd - c.trimStart), 0)
    );
  };

  // Split clip at playhead
  const handleSplit = () => {
    if (activeClipIndex === -1) return;
    const currentClip = videoClips[activeClipIndex];
    const relTime = playheadTime - videoClips.slice(0, activeClipIndex).reduce((sum, c) => sum + (c.trimEnd - c.trimStart), 0);
    if (relTime <= 0 || relTime >= (currentClip.trimEnd - currentClip.trimStart)) return;
    const firstPart: VideoClip = {
      ...currentClip,
      id: uuidv4(),
      trimEnd: currentClip.trimStart + relTime,
    };
    const secondPart: VideoClip = {
      ...currentClip,
      id: uuidv4(),
      trimStart: currentClip.trimStart + relTime,
    };
    setVideoClips(clips => [
      ...clips.slice(0, activeClipIndex),
      firstPart,
      secondPart,
      ...clips.slice(activeClipIndex + 1),
    ]);
    setActiveClipIndex(activeClipIndex); // Stay on first part
  };

  // Trim clip (simple prompt for MVP)
  const handleTrim = () => {
    if (activeClipIndex === -1) return;
    const currentClip = videoClips[activeClipIndex];
    const start = parseFloat(prompt('Trim start (seconds):', currentClip.trimStart.toString()) || '0');
    const end = parseFloat(prompt('Trim end (seconds):', currentClip.trimEnd.toString()) || currentClip.duration.toString());
    if (isNaN(start) || isNaN(end) || start < 0 || end > currentClip.duration || start >= end) return;
    setVideoClips(clips => clips.map((c, i) => i === activeClipIndex ? { ...c, trimStart: start, trimEnd: end } : c));
  };

  // Remove all effects (MVP: just reset global state)
  const handleRemoveAllEffects = () => {
    setFilter('none'); setBrightness(100); setContrast(100); setSaturation(100); setSpeed(1); setTransition('none'); setTextOverlay(''); setImageOverlay(undefined);
  };

  // Play/pause logic
  const handlePlayPause = () => setIsPlaying(p => !p);

  // Video player source: show current clip
  let currentClip: VideoClip | undefined = undefined;
  let currentClipOffset = 0;
  if (activeClipIndex !== -1 && videoClips[activeClipIndex]) {
    currentClip = videoClips[activeClipIndex];
    currentClipOffset = videoClips.slice(0, activeClipIndex).reduce((sum, c) => sum + (c.trimEnd - c.trimStart), 0);
  }

  // Handler to sync playhead with video playback
  const handleVideoTimeUpdate = (currentTime: number) => {
    if (currentClip) {
      setPlayheadTime(currentClipOffset + (currentTime - currentClip.trimStart));
    }
  };

  // Overlay logic (MVP: global, not per-clip)
  const handleSetTextOverlay = (text: string) => setTextOverlay(text);
  const handleClearTextOverlay = () => setTextOverlay('');
  const handleSetImageOverlay = (file: File) => setImageOverlay(URL.createObjectURL(file));
  const handleClearImageOverlay = () => setImageOverlay(undefined);

  // Timeline playhead change (for scrubbing)
  const handlePlayheadChange = (t: number) => setPlayheadTime(t);

  // When playhead moves, update active clip
  React.useEffect(() => {
    let acc = 0;
    for (let i = 0; i < videoClips.length; i++) {
      const c = videoClips[i];
      const clipStart = acc;
      const clipEnd = acc + (c.trimEnd - c.trimStart);
      if (playheadTime >= clipStart && playheadTime < clipEnd) {
        setActiveClipIndex(i);
        break;
      }
      acc = clipEnd;
    }
  }, [playheadTime]);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 mt-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Video Editor (Next.js Port)</h1>
        <EditorControls
          onAddVideo={handleAddVideo}
          onPlayPause={handlePlayPause}
          isPlaying={isPlaying}
          onSplit={handleSplit}
          onTrim={handleTrim}
          onRemove={handleRemove}
          onRemoveAllEffects={handleRemoveAllEffects}
          onVolumeChange={setVolume}
          volume={volume}
          onFilterChange={setFilter}
          filter={filter}
          onBrightnessChange={setBrightness}
          brightness={brightness}
          onContrastChange={setContrast}
          contrast={contrast}
          onSaturationChange={setSaturation}
          saturation={saturation}
          onSpeedChange={setSpeed}
          speed={speed}
          onTransitionChange={setTransition}
          transition={transition}
          onSetTextOverlay={handleSetTextOverlay}
          onClearTextOverlay={handleClearTextOverlay}
          textOverlay={textOverlay}
          onSetImageOverlay={handleSetImageOverlay}
          onClearImageOverlay={handleClearImageOverlay}
          timelineZoom={timelineZoom}
          onTimelineZoomChange={setTimelineZoom}
        />
        <div className="my-8">
          <VideoPlayer
            src={currentClip?.url}
            filter={filter}
            brightness={brightness}
            contrast={contrast}
            saturation={saturation}
            playbackRate={speed}
            volume={volume}
            onTimeUpdate={handleVideoTimeUpdate}
          >
            {/* Overlays will be rendered here in future steps */}
            {textOverlay && (
              <div className="absolute left-1/2 top-1/2 text-white text-2xl font-bold bg-black bg-opacity-40 px-4 py-2 rounded pointer-events-none" style={{transform: 'translate(-50%, -50%)'}}>{textOverlay}</div>
            )}
            {imageOverlay && (
              <img src={imageOverlay} alt="Overlay" className="absolute left-1/2 top-1/2 max-w-[30%] max-h-[30%] rounded shadow-lg pointer-events-none" style={{transform: 'translate(-50%, -50%)'}} />
            )}
          </VideoPlayer>
        </div>
        <Timeline
          clips={videoClips}
          activeClipIndex={activeClipIndex}
          onSelectClip={handleSelectClip}
          onReorderClips={handleReorderClips}
          playheadTime={playheadTime}
          onPlayheadChange={handlePlayheadChange}
          timelineZoom={timelineZoom}
        />
      </div>
    </main>
  );
}
