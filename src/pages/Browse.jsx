import { useEffect, useRef, useState } from "react";
import GenreDialog from "./components/GenreDialog";
import axios from "axios";
import MovieInfo from "./components/MovieInfo";
import { motion } from "framer-motion";
import { useUserContext } from "../contexts/UserProvider";

export default function Browse() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [genre, setGenre] = useState("");
  const [openId, setOpenId] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const { token } = useUserContext();
  const lastMovie = useRef(null);

  useEffect(() => {
    if (!lastMovie.current || !nextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(lastMovie.current);
          setLoading(true);
          axios
            .get(
              `http://api.ecnet.website/api/movies?part=${nextPage}&genre=${genre}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            )
            .then((res) => {
              setLoading(false);
              if (!res.data.isAuthorized) return;
              setMovies((prev) => [...prev, ...res.data.movies]);
              setCurrentPage(res.data.current_part);
              setNextPage(res.data.next_part);
            });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(lastMovie.current);
    return () => {
      observer.disconnect();
    };
  }, [nextPage, genre]);
  useEffect(() => {
    setMovies([]);
    setLoading(true);
    axios
      .get(`http://api.ecnet.website/api/movies?genre=${genre}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        if (!res.data.isAuthorized) return;
        setMovies(res.data.movies);
        setCurrentPage(res.data.current_part);
        setNextPage(res.data.next_part);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [genre]);
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
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      className="bg-[#141414] relative min-h-screen select-none"
    >
      {openInfo && <MovieInfo id={openId} setOpenInfo={setOpenInfo} />}
      <div className="absolute w-screen flex flex-col gap-[1rem] overflow-hidden p-[1.5rem] left-[0] top-[clamp(2rem,5vw,6rem)]">
        <GenreDialog setMovies={setMovies} genre={genre} setGenre={setGenre} />
        <div className="grid grid-cols-2 h-[65vh] gap-2 min-[768px]:grid-cols-4 overflow-scroll hide-scrollbar">
          {movies.map((m, idx) => {
            if (movies.length === idx + 1) {
              return (
                <div
                  onClick={() => {
                    setOpenId(m.id);
                    setOpenInfo(true);
                  }}
                  ref={lastMovie}
                  key={m.id}
                >
                  <img
                    className="aspect-video hover:cursor-pointer w-full"
                    src={m.backdrop}
                    alt={m.description}
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setOpenId(m.id);
                    setOpenInfo(true);
                  }}
                >
                  <img
                    className="aspect-video hover:cursor-pointer w-full"
                    src={m.backdrop}
                    alt={m.description}
                  />
                </div>
              );
            }
          })}
          {loading && <div className="text-white">Loading...</div>}
        </div>
      </div>
    </motion.div>
  );
}
