"use client";

import { useEffect, useState, useRef } from "react";

export function FloatingVideo() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Show video immediately if not closed
    if (!isClosed) {
      setIsVisible(true);
    }
  }, [isClosed]);

  const handleClose = () => {
    setIsClosed(true);
    setIsVisible(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      {/* Glassmorphism Container */}
      <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-bitcoin/30 rounded-2xl p-2 md:p-3 shadow-2xl overflow-hidden">
        {/* Animated Glow Effect */}
        <div className="absolute inset-0 bg-bitcoin/5 rounded-2xl animate-pulse" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-bold font-heading">Learn About Afribit</span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Video Container */}
          <div className="relative w-72 sm:w-80 md:w-96 aspect-video rounded-xl overflow-hidden border border-white/10">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls
            >
              <source src="/Media/Videos/Afribit Explanation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Overlay */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-16 h-16 bg-bitcoin/90 rounded-full flex items-center justify-center hover:bg-bitcoin transition-all hover:scale-110">
                  <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Label */}
          <div className="mt-2 px-2">
            <p className="text-xs text-gray-400 text-center">
              Discover how Bitcoin is transforming Kibera
            </p>
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-bitcoin/10 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-500/10 rounded-tr-full" />
      </div>
    </div>
  );
}
