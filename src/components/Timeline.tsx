import React from 'react';

export interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
}

interface TimelineProps {
  clips: VideoClip[];
  activeClipIndex: number;
  onSelectClip: (idx: number) => void;
  onReorderClips: (newOrder: VideoClip[]) => void;
  playheadTime: number;
  onPlayheadChange: (t: number) => void;
  timelineZoom: number;
}

const Timeline: React.FC<TimelineProps> = ({
  clips,
  activeClipIndex,
  onSelectClip,
  onReorderClips,
  playheadTime,
  onPlayheadChange,
  timelineZoom,
}) => {
  // Calculate total project duration
  const totalDuration = clips.reduce((sum, c) => sum + (c.trimEnd - c.trimStart), 0);
  const pixelsPerSecond = 100 * timelineZoom;

  // Drag and drop logic
  const dragClipIdx = React.useRef<number | null>(null);

  const handleDragStart = (idx: number) => {
    dragClipIdx.current = idx;
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (dragClipIdx.current === null || dragClipIdx.current === idx) return;
    const newOrder = [...clips];
    const [removed] = newOrder.splice(dragClipIdx.current, 1);
    newOrder.splice(idx, 0, removed);
    onReorderClips(newOrder);
    dragClipIdx.current = idx;
  };
  const handleDragEnd = () => {
    dragClipIdx.current = null;
  };

  // Playhead position
  let playheadPx = 0;
  let acc = 0;
  for (let i = 0; i < clips.length; i++) {
    const c = clips[i];
    const clipStart = acc;
    const clipEnd = acc + (c.trimEnd - c.trimStart);
    if (playheadTime >= clipStart && playheadTime <= clipEnd) {
      playheadPx = (playheadTime) * pixelsPerSecond;
      break;
    }
    acc = clipEnd;
  }

  return (
    <div className="timeline-section bg-gray-50 rounded-lg border p-4 overflow-x-auto relative" style={{ minHeight: 140 }}>
      {/* Timescale */}
      <div className="flex h-8 border-b mb-2 relative" style={{ width: totalDuration * pixelsPerSecond }}>
        {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
          <div key={i} className="border-l h-full" style={{ left: i * pixelsPerSecond, position: 'absolute', width: 1 }}>
            <span className="absolute text-xs text-gray-500 -top-5 left-0">{i}s</span>
          </div>
        ))}
      </div>
      {/* Playhead */}
      <div className="absolute top-0 left-0 h-full w-0.5 bg-red-500 z-10" style={{ left: playheadPx }} />
      {/* Video Track */}
      <div className="flex items-center gap-2 relative" style={{ width: totalDuration * pixelsPerSecond, minHeight: 60 }}>
        {clips.map((clip, idx) => {
          const width = (clip.trimEnd - clip.trimStart) * pixelsPerSecond;
          return (
            <div
              key={clip.id}
              className={`bg-indigo-500 text-white rounded p-2 cursor-pointer select-none shadow ${idx === activeClipIndex ? 'ring-4 ring-orange-400' : ''}`}
              style={{ width, minWidth: 80 }}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelectClip(idx)}
            >
              <div className="font-semibold truncate">{clip.name}</div>
              <div className="text-xs">{(clip.trimEnd - clip.trimStart).toFixed(2)}s</div>
            </div>
          );
        })}
      </div>
      {/* Overlay Tracks (empty for now) */}
      <div className="mt-4">
        <div className="text-xs text-gray-400">Text Overlay Track (coming soon)</div>
        <div className="h-8 bg-green-100 rounded mb-2" />
        <div className="text-xs text-gray-400">Image Overlay Track (coming soon)</div>
        <div className="h-8 bg-pink-100 rounded" />
      </div>
    </div>
  );
};

export default Timeline; 