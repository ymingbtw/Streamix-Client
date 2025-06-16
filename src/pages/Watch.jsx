// Watch.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HlsPlayer from "./components/HlsPlayer";
import axios from "axios";

const Watch = () => {
  const { id } = useParams();
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://45.149.206.238:80/api/movies/" + id).then((res) => {
      setUrl(res.data.video);
      setLoading(false);
    });
  }, [id]);
  if (loading) {
    return null;
  }
  if (!url) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Video not found</h2>
        <button onClick={() => navigate("/")}>Go back</button>
      </div>
    );
  }

  return (
    <>
      <HlsPlayer src={url} />
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1100,
          padding: "10px 15px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          background: "#fff",
          border: "none",
        }}
      >
        Close
      </button>
    </>
  );
};

export default Watch;
