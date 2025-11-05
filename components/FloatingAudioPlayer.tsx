'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX, FiPlay, FiPause, FiVolume2 } from 'react-icons/fi';

export function FloatingAudioPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | undefined>(undefined);
  const sourceRef = useRef<MediaElementAudioSourceNode | undefined>(undefined);

  useEffect(() => {
    if (isPlaying && canvasRef.current) {
      setupAudioVisualization();
      visualize();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const setupAudioVisualization = () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        // White visualizer bars
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    draw();
  };

  const handleTogglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsExpanded(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsExpanded(true);
      } catch (err) {
        console.error('Audio play error:', err);
      }
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setIsExpanded(false);
  };

  return (
    <>
      <audio ref={audioRef} src="/Media/Videos/Afribit Explanation.mp4" />
      
      {/* Dynamic Island Style - Mobile Only */}
      <div className="md:hidden fixed top-2 left-1/2 -translate-x-1/2 z-60">
        <div className="relative">
          <div
            className={`bg-black border border-white/20 backdrop-blur-xl flex items-center gap-3 transition-all duration-500 ease-out ${
              isExpanded 
                ? 'px-3 py-2 rounded-full min-w-[200px]' 
                : 'px-3 py-1.5 rounded-full'
            }`}
          >
            {/* Left Side - Visualizer (only when expanded and playing) */}
            {isExpanded && isPlaying && (
              <div className="flex-shrink-0">
                <canvas
                  ref={canvasRef}
                  width={60}
                  height={20}
                  className="rounded"
                />
              </div>
            )}

            {/* Center - Tap to listen text (only when collapsed) */}
            {!isExpanded && (
              <span className="text-[10px] text-gray-300 font-medium">Tap to listen</span>
            )}

            {/* Right Side - Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`ml-auto rounded-full flex items-center justify-center transition-all ${
                isExpanded 
                  ? 'w-7 h-7 bg-white hover:bg-white/90' 
                  : 'w-6 h-6 bg-bitcoin hover:bg-bitcoin/90'
              }`}
            >
              {isPlaying ? (
                <FiPause className={`${isExpanded ? 'w-3.5 h-3.5 text-black' : 'w-3 h-3 text-black'}`} />
              ) : (
                <FiPlay className={`${isExpanded ? 'w-3.5 h-3.5 text-black ml-0.5' : 'w-3 h-3 text-black ml-0.5'}`} />
              )}
            </button>
          </div>

          {/* Close Button - appears when expanded */}
          {isExpanded && (
            <button
              onClick={handleClose}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all shadow-lg"
            >
              <FiX className="w-3 h-3 text-black" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
