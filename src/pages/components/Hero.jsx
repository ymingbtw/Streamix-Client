import axios from "axios";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import MovieInfo from "./MovieInfo";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserProvider";

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [movie, setMovies] = useState({});
  const [openInfo, setOpenInfo] = useState(false);
  const { token } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchHero() {
      const res = await axios("https://api.ecnet.website/api/movies/hero", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setLoading(false);
      if (!res.data.isAuthorized) return;
      setMovies(res.data);
    }
    fetchHero();
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
    <div className="relative w-full">
      {openInfo && <MovieInfo id={movie.id} setOpenInfo={setOpenInfo} />}
      {!loading && movie.id && (
        <div className="flex items-center w-full text-white">
          {/* Background image */}
          <img
            src={movie.backdrop}
            className="w-full aspect-video inset-0"
            alt=""
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent"></div>
          {/* Hero content */}
          <div className="absolute z-10 h-[50%] justify-center max-w-[50%] flex flex-col gap-[clamp(0.2rem,2vw,1rem)] p-[clamp(0.5rem,2vw,1rem)]">
            {/* <h1 className="text-[2vw] font-extrabold leading-tight">
              {movie.title}
            </h1> */}
            <p className="text-[clamp(0.25rem,2vw,2rem)] h-50% line-clamp-5 text-ellipsis text-white font-bold w-full">
              {movie.description}
            </p>
            <div className="flex text-black text-[clamp(0.5rem,3vw,2rem)] gap-1">
              <button
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="flex items-center hover:cursor-pointer font-bold w-fit bg-white px-[clamp(0.5rem,3vw,1rem)] py-[clamp(0.25rem,3vw,0.5rem)] rounded-[clamp(0.25rem,3vw,0.5rem)] hover:bg-white/75 transition duration-300"
              >
                <Play className="size-[clamp(0.5rem,3vw,2rem)]" color="black" />
                <span>Play</span>
              </button>

              <button
                onClick={() => setOpenInfo(true)}
                className="px-[clamp(0.5rem,3vw,1rem)] text-white text-[clamp(0.5rem,3vw,2rem)] font-bold py-[clamp(0.25rem,3vw,0.5rem)] hover:cursor-pointer bg-black/75 hover:bg-black/37 z-40 transition duration-300 rounded-[clamp(0.25rem,3vw,0.5rem)] w-fit"
              >
                Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
