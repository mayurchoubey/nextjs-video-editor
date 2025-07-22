import React from 'react';

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  x: number; // percent (0-100)
  y: number; // percent (0-100)
  width: number; // percent (0-100)
  height: number; // percent (0-100)
}
export interface ImageOverlay {
  id: string;
  imageUrl: string;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
  textOverlays: TextOverlay[];
  imageOverlays: ImageOverlay[];
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

  // Helper: get project time offset for each clip
  const getClipOffset = (idx: number) => clips.slice(0, idx).reduce((sum, c) => sum + (c.trimEnd - c.trimStart), 0);

  // Drag and drop logic (same as before)
  const dragClipIdx = React.useRef<number | null>(null);
  const handleDragStart = (idx: number) => { dragClipIdx.current = idx; };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (dragClipIdx.current === null || dragClipIdx.current === idx) return;
    const newOrder = [...clips];
    const [removed] = newOrder.splice(dragClipIdx.current, 1);
    newOrder.splice(idx, 0, removed);
    onReorderClips(newOrder);
    dragClipIdx.current = idx;
  };
  const handleDragEnd = () => { dragClipIdx.current = null; };

  // Playhead position
  let playheadPx = playheadTime * pixelsPerSecond;

  // Render overlay blocks for all overlays in all clips
  const renderOverlayBlocks = (type: 'text' | 'image') => {
    let blocks: React.ReactNode[] = [];
    let acc = 0;
    clips.forEach((clip, clipIdx) => {
      const overlays = type === 'text' ? clip.textOverlays : clip.imageOverlays;
      overlays.forEach(overlay => {
        const overlayStart = acc + (overlay.startTime - clip.trimStart);
        const overlayEnd = acc + (overlay.endTime - clip.trimStart);
        blocks.push(
          <div
            key={overlay.id}
            className={`absolute top-0 h-6 rounded ${type === 'text' ? 'bg-green-500' : 'bg-pink-500'} opacity-90 cursor-pointer`}
            style={{
              left: overlayStart * pixelsPerSecond,
              width: (overlayEnd - overlayStart) * pixelsPerSecond,
              minWidth: 16,
            }}
            title={type === 'text' ? (overlay as TextOverlay).text : 'Image Overlay'}
          >
            <span className="text-xs text-white px-1 truncate">
              {type === 'text' ? (overlay as TextOverlay).text : 'Image'}
            </span>
          </div>
        );
      });
      acc += (clip.trimEnd - clip.trimStart);
    });
    return (
      <div className="relative w-full" style={{ height: 24, width: totalDuration * pixelsPerSecond }}>
        {blocks}
      </div>
    );
  };

  return (
    <div className="timeline-section bg-gray-50 rounded-lg border p-4 overflow-x-auto relative" style={{ minHeight: 180 }}>
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
      {/* Overlay Tracks */}
      <div className="mt-4">
        <div className="text-xs text-gray-700 mb-1">Text Overlay Track</div>
        {renderOverlayBlocks('text')}
        <div className="text-xs text-gray-700 mb-1 mt-2">Image Overlay Track</div>
        {renderOverlayBlocks('image')}
      </div>
    </div>
  );
};

export default Timeline; 