// HlsPlayerFullscreen.jsx
import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

const HlsPlayer = ({ src }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
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
    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement;
      setFullscreen(fsElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
        flexDirection: "column",
        overflow: "hidden", // prevent scrollbars if video overflows slightly
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // <-- fill and crop if needed
          backgroundColor: "black",
        }}
        preload="auto"
        tabIndex={-1}
        controls={true}
      />
    </div>
  );
};

export default HlsPlayer;
