'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight, FiVideo } from 'react-icons/fi';

export function MobileVideoPlayer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    { url: '/Media/Videos/Yeti video.mp4', title: 'Yeti on Afribit' },
    { url: '/Media/Videos/Yeti fun video of Afribit.mp4', title: 'Yeti Fun Video' },
    { url: '/Media/Videos/Afribit Explanation.mp4', title: 'Afribit Explanation' }
  ];

  useEffect(() => {
    if (!isClosed) {
      setIsVisible(true);
    }
  }, [isClosed]);

  useEffect(() => {
    if (videoRef.current && isPlaying && showLightbox) {
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  }, [currentVideoIndex, showLightbox]);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else {
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

  const openLightbox = () => {
    setShowLightbox(true);
    setIsPlaying(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Video Icon - Mobile Only */}
      {!showLightbox && (
        <div className="md:hidden fixed bottom-20 right-4 z-50">
          <button
            onClick={openLightbox}
            className="w-14 h-14 rounded-full bg-black backdrop-blur-sm border-2 border-white/20 shadow-lg shadow-black/50 flex items-center justify-center hover:scale-110 transition-all hover:border-white/40"
          >
            <FiPlay className="w-6 h-6 text-white ml-0.5" />
          </button>
          <button
            onClick={handleClose}
            className="absolute -top-1 -right-1 w-5 h-5 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-black/10 hover:bg-white transition-all"
          >
            <FiX className="w-3 h-3 text-black" />
          </button>
        </div>
      )}

      {/* Video Lightbox */}
      {showLightbox && (
        <div className="md:hidden fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Video Container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
              <video
                ref={videoRef}
                key={currentVideoIndex}
                autoPlay={isPlaying}
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              >
                <source src={videos[currentVideoIndex].url} type="video/mp4" />
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40">
                {/* Top Bar - Title */}
                <div className="absolute top-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-heading font-bold">
                    {videos[currentVideoIndex].title}
                  </h3>
                </div>

                {/* Center Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 bg-bitcoin/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                      <FiPause className="w-8 h-8 text-black" />
                    ) : (
                      <FiPlay className="w-8 h-8 text-black ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
                  {/* Progress Dots */}
                  <div className="flex justify-center gap-2">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentVideoIndex ? 'bg-bitcoin w-8' : 'bg-white/40 w-2 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation & Volume */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={goToPrevious}
                      className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={toggleMute}
                      className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all"
                    >
                      {isMuted ? (
                        <FiVolumeX className="w-6 h-6" />
                      ) : (
                        <FiVolume2 className="w-6 h-6" />
                      )}
                    </button>

                    <button
                      onClick={goToNext}
                      className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bitcoin hover:text-black transition-all"
                    >
                      <FiChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
