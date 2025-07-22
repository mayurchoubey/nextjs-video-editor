import React from 'react';

interface VideoPlayerProps {
  src?: string;
  filter?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  playbackRate?: number;
  volume?: number;
  onLoadedMetadata?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
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
  onLoadedMetadata,
  onTimeUpdate,
  children,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.volume = volume;
    }
  }, [playbackRate, volume]);

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
      <video
        ref={videoRef}
        src={src}
        controls
        className="w-full h-full object-contain"
        style={{ filter: filterString }}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
      {children}
    </div>
  );
};

export default VideoPlayer; 