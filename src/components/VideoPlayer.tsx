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
  onPlayPause?: () => void;
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
  onPlayPause,
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
      videoRef.current.play().then(() => {
        console.log('Video play() called');
      }).catch(err => {
        console.error('Video play() failed:', err);
      });
    } else {
      videoRef.current.pause();
      console.log('Video pause() called');
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
      <video
        ref={videoRef}
        src={src}
        muted
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