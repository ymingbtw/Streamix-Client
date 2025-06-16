// HlsPlayerFullscreen.jsx
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HlsPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const seekTimeout = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls = new Hls({
      maxBufferLength: 10,
      maxBufferSize: 20_000_000,
      backBufferLength: 5,
    });
    hls.loadSource(src);
    hls.attachMedia(video);

    const onSeeking = () => {
      if (seekTimeout.current) clearTimeout(seekTimeout.current);
      hls.stopLoad();

      seekTimeout.current = setTimeout(() => {
        hls.startLoad();
      }, 500); // debounce delay
    };
    video.addEventListener("seeking", onSeeking);
    return () => {
      if (hls) hls.destroy();
      if (seekTimeout.current) clearTimeout(seekTimeout.current);
      video.removeEventListener("seeking", onSeeking);
    };
  }, [src]);

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
    >
      <video
        ref={videoRef}
        controls
        autoPlay
        className="video-js vjs-theme-city"
        style={{ width: "90vw", height: "90vh", backgroundColor: "black" }}
        preload="auto"
      />
    </div>
  );
};

export default HlsPlayer;
