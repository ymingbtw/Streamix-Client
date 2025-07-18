// Watch.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import HlsPlayer from "./components/HlsPlayer";
import { useUserContext } from "../contexts/UserProvider";

const Watch = () => {
  const { id } = useParams();
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const { token } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://api.ecnet.space/api/movies/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        if (!res.data.isAuthorized) return;
        setUrl(res.data.video);
        setTimeout(() => setShow(true), 10); // trigger transition after mount
      });
  }, [id, token]);

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
    <AnimatePresence>
      {show && (
        <motion.div
          key="watch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 1.2 },
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            background: "rgba(0,0,0,0.96)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              flex: "1 1 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 8,
              boxSizing: "border-box",
            }}
          >
            <HlsPlayer src={url} />
          </div>

          <button
            onClick={() => navigate("/")}
            style={{
              position: "fixed",
              top: "calc(24px + env(safe-area-inset-top))",
              left: "calc(24px + env(safe-area-inset-left))",
              zIndex: 1100,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(20,20,20,0.7)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              cursor: "pointer",
              transition: "background 0.2s, box-shadow 0.2s",
              touchAction: "manipulation",
            }}
            aria-label="Back"
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(40,40,40,0.85)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(20,20,20,0.7)")
            }
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="none" />
              <path
                d="M15.5 19L8.5 12L15.5 5"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Watch;
