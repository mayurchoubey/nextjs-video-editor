import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src?: string;
  filter?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  playbackRate?: number;
  volume?: number;
  isPlaying?: boolean;
  onLoadedMetadata?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
  isBlankPreview?: boolean;
  children?: React.ReactNode; // For overlays
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  filter = 'none',
  brightness = 100,
  contrast = 100,
  saturation = 100,
  playbackRate = 1,
  volume = 1,
  isPlaying = false,
  onLoadedMetadata,
  onTimeUpdate,
  isBlankPreview = false,
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.volume = volume;
    }
  }, [playbackRate, volume]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, src]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && onLoadedMetadata) {
      onLoadedMetadata(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const filterString = `${filter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg flex items-center justify-center min-h-[300px]">
      {isBlankPreview ? (
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
          className="w-full h-full object-contain bg-black"
          alt="Blank Preview"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          style={{ filter: filterString }}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
      {children}
    </div>
  );
};

export default VideoPlayer; 