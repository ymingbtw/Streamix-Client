import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

// ... keep your formatTime and other logic unchanged

const HlsPlayer = ({ src }) => {
  const containerRef = useRef(null); // Wrap video + controls container for fullscreen
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);

  // ... your HLS loading code unchanged

  // Fullscreen change listener to sync UI state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement;
      // Check if the fullscreen element is the containerRef current
      setFullscreen(fsElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen on container div, not just video
  const handleFullscreen = () => {
    if (!fullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // ... rest of your handlers (togglePlay, handleSeek, handleVolume, showAndHideControls) remain the same

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        flexDirection: "column", // keep controls below video
      }}
      onMouseMove={showAndHideControls}
      onClick={showAndHideControls}
    >
      <video
        ref={videoRef}
        autoPlay
        style={{ width: "90vw", height: "90vh", backgroundColor: "black" }}
        preload="auto"
        tabIndex={-1}
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      />
      {showControls && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80vw",
            background: "rgba(20,20,20,0.7)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            gap: 16,
            zIndex: 1200,
            transition: "opacity 0.3s",
          }}
        >
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: 24,
            }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="5" width="4" height="14" rx="2" fill="#fff" />
                <rect x="14" y="5" width="4" height="14" rx="2" fill="#fff" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7z" fill="#fff" />
              </svg>
            )}
          </button>

          {/* Current Time */}
          <span
            style={{
              color: "#fff",
              fontVariantNumeric: "tabular-nums",
              minWidth: 48,
            }}
          >
            {formatTime(current)}
          </span>

          {/* Seek Bar */}
          <input
            type="range"
            min={0}
            max={100}
            value={duration ? (current / duration) * 100 : 0}
            onChange={handleSeek}
            style={{ flex: 1, accentColor: "#e50914", height: 4 }}
            aria-label="Seek"
          />

          {/* Duration */}
          <span
            style={{
              color: "#fff",
              fontVariantNumeric: "tabular-nums",
              minWidth: 48,
            }}
          >
            {formatTime(duration)}
          </span>

          {/* Volume */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            style={{ width: 80, accentColor: "#e50914" }}
            aria-label="Volume"
          />

          {/* Fullscreen Toggle */}
          <button
            onClick={handleFullscreen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: 24,
            }}
            aria-label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {fullscreen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 9H5V5h4V3H3v6h2V5h4V3zm6 0h4V5h-4V3h6v6h-2V5h-4V3zm0 6h4v4h-4v2h6v-6h-2v4h-4v2zm-6 0H5v4h4v2H3v-6h2v4h4v2z"
                  fill="#fff"
                />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3h6v2H5v4H3V3zm18 0v6h-2V5h-4V3h6zm0 18h-6v-2h4v-4h2v6zm-18 0v-6h2v4h4v2H3z"
                  fill="#fff"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HlsPlayer;
