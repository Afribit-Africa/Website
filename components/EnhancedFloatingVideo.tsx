'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function EnhancedFloatingVideo() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video sequence: Yeti videos first, then Afribit Explanation
  const videos = [
    { url: '/Media/Videos/Yeti video.mp4', title: 'Yeti on Afribit' },
    { url: '/Media/Videos/Yeti fun video of Afribit.mp4', title: 'Yeti Fun Video' },
    { url: '/Media/Videos/Afribit%20Explanation.mp4', title: 'Afribit Explanation' }
  ];

  useEffect(() => {
    if (!isClosed) {
      setIsVisible(true);
    }
  }, [isClosed]);

  useEffect(() => {
    // Ensure video plays when index changes
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {}); // Suppress video autoplay errors
    }
  }, [currentVideoIndex]);

  const handleVideoEnd = () => {
    // Move to next video
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else {
      // Loop back to first video after all videos play
      setCurrentVideoIndex(0);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const goToPrevious = () => {
    setCurrentVideoIndex(prev => (prev - 1 + videos.length) % videos.length);
  };

  const goToNext = () => {
    setCurrentVideoIndex(prev => (prev + 1) % videos.length);
  };

  const handleClose = () => {
    setIsClosed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="relative group">
        {/* Glass Container */}
        <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-bitcoin/30 rounded-2xl overflow-hidden shadow-2xl hover:border-bitcoin/50 transition-all duration-300">
          {/* Video Container */}
          <div className="relative w-80 md:w-96 aspect-video bg-black">
            <video
              ref={videoRef}
              key={currentVideoIndex}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadStart={() => setIsLoading(true)}
              onCanPlay={() => {
                setIsLoading(false);
                setHasError(false);
              }}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
                console.error(`Failed to load video: ${videos[currentVideoIndex].url}`);
              }}
              className="w-full h-full object-cover"
            >
              <source src={videos[currentVideoIndex].url} type="video/mp4" />
            </video>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-bitcoin/30 border-t-bitcoin rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="text-center px-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiX className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-white text-sm font-medium mb-2">Video failed to load</p>
                  <p className="text-gray-400 text-xs mb-3">Please check your connection</p>
                  <button
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                      if (videoRef.current) {
                        videoRef.current.load();
                      }
                    }}
                    className="text-bitcoin text-sm hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {/* Top Bar - Title & Close */}
              <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between pointer-events-auto">
                <span className="text-white text-sm font-semibold font-heading">
                  {videos[currentVideoIndex].title}
                </span>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all duration-300 relative z-50"
                  aria-label="Close video"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Center Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 bg-bitcoin/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:bg-bitcoin"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <FiPause className="w-8 h-8 text-black" />
                  ) : (
                    <FiPlay className="w-8 h-8 text-black ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
                <div className="flex items-center justify-between gap-4">
                  {/* Left Controls - Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPrevious}
                      className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all"
                      aria-label="Previous video"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all"
                      aria-label="Next video"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Center - Progress Dots */}
                  <div className="flex gap-2">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentVideoIndex ? 'bg-bitcoin w-8' : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to video ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Right Controls - Volume */}
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <FiVolumeX className="w-5 h-5" />
                    ) : (
                      <FiVolume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
