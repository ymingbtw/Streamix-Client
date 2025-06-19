// HlsPlayerFullscreen.jsx
import React, { useEffect, useRef, useState } from "react";
// import Hls from "hls.js"; // Remove static import
import debounce from "lodash/debounce";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === Infinity) return "00:00:00";
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const HlsPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;
    let isMounted = true;
    (async () => {
      const Hls = (await import("hls.js")).default;
      if (!isMounted) return;
      hls = new Hls({
        maxBufferLength: 10,
        maxBufferSize: 20_000_000,
        backBufferLength: 5,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      const debouncedStartLoad = debounce(() => {
        hls.startLoad();
        hls.resumeBuffering();
      }, 500);

      const onSeeking = () => {
        hls.stopLoad();
        hls.pauseBuffering();
        debouncedStartLoad();
      };
      video.addEventListener("seeking", onSeeking);
      return () => {
        if (hls) hls.destroy();
        debouncedStartLoad.cancel();
        video.removeEventListener("seeking", onSeeking);
        isMounted = false;
      };
    })();
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => {
      setCurrent(video.currentTime);
      setDuration(video.duration || 0);
      setPlaying(!video.paused);
      setVolume(video.volume);
    };
    video.addEventListener("timeupdate", update);
    video.addEventListener("play", update);
    video.addEventListener("pause", update);
    video.addEventListener("volumechange", update);
    video.addEventListener("loadedmetadata", update);
    return () => {
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("play", update);
      video.removeEventListener("pause", update);
      video.removeEventListener("volumechange", update);
      video.removeEventListener("loadedmetadata", update);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement === video ||
        (video.parentElement &&
          document.fullscreenElement === video.parentElement);
      setFullscreen(isFullscreen);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };
  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const percent = e.target.value;
    const newTime = (percent / 100) * duration;
    video.currentTime = newTime;
    setCurrent(newTime); // update UI immediately
  };
  const handleVolume = (e) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = e.target.value;
  };
  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!fullscreen) {
      if (video.requestFullscreen) video.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setFullscreen(false);
    }
  };
  // Hide controls after 3s inactivity
  const showAndHideControls = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
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
        controls={false} // Remove default controls, including fullscreen
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
          <span
            style={{
              color: "#fff",
              fontVariantNumeric: "tabular-nums",
              minWidth: 48,
            }}
          >
            {formatTime(current)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={duration ? (current / duration) * 100 : 0}
            onChange={handleSeek}
            style={{ flex: 1, accentColor: "#e50914", height: 4 }}
            aria-label="Seek"
          />
          <span
            style={{
              color: "#fff",
              fontVariantNumeric: "tabular-nums",
              minWidth: 48,
            }}
          >
            {formatTime(duration)}
          </span>
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
