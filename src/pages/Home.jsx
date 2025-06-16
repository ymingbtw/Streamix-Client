import { useState } from "react";
import { useEffect } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import MovieCarousel from "./components/MovieCarousel";
import axios from "axios";
import MovieInfo from "./components/MovieInfo";
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [openInfo, setOpenInfo] = useState(false);
  const [openId, setOpenId] = useState(null);
  console.log("home rendered");
  useEffect(() => {
    async function initTopGenres() {
      const res = await axios("http://45.149.206.238:80/api/genres/top");
      setGenres(res.data);
      setLoading(false);
    }
    initTopGenres();
  }, []);
  useEffect(() => {
    if (openInfo) {
      document.body.style.overflow = "hidden"; // Lock background scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable when closed
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup in case of unmount
    };
  }, [openInfo]);

  return (
    <div className={`bg-[#141414] relative min-h-screen select-none`}>
      <Hero />
      <div className="-translate-y-[clamp(2rem,2vw,4rem)]">
        {loading ? (
          <div>Loading...</div>
        ) : (
          genres.map((genre) => {
            return (
              <MovieCarousel
                setOpenId={setOpenId}
                setOpenInfo={setOpenInfo}
                genre={genre.genre}
                key={genre.genre_id}
              />
            );
          })
        )}
      </div>
      {openInfo && <MovieInfo id={openId} setOpenInfo={setOpenInfo} />}
    </div>
  );
}
