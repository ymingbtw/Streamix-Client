import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import MovieInfoSkeleton from "./MovieInfoSkeleton";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserProvider";

async function fetchMovieInfo(id, setMovie, setLoading, token) {
  const res = await axios.get(`https://api.ecnet.website/api/movies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  if (!res.data.isAuthorized) return;
  setMovie(res.data);
  setLoading(false);
}

export default function MovieInfo({ id, setOpenInfo }) {
  const [loading, setLoading] = useState(true);
  const { token } = useUserContext();
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    duration: "",
    release_date: "",
    maturity_rating: "",
    backdrop: "",
    video: "",
    genres: {},
  });
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const detectClick = useCallback((e) => {
    if (!dialogRef.current?.contains(e.target) && dialogRef.current) {
      setOpenInfo(false);
    }
  }, []);
  useEffect(() => {
    fetchMovieInfo(id, setMovie, setLoading, token);
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", detectClick);
    }, 0);

    return () => {
      document.removeEventListener("mousedown", detectClick);
      clearTimeout(timer);
    };
  }, []);

  return loading ? (
    <MovieInfoSkeleton />
  ) : (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        className="flex m-[2rem] relative items-center justify-center"
      >
        <div className="bg-[#141414] relative overflow-scroll h-[75vh] hide-scrollbar rounded-2xl max-w-[750px]">
          <div className="absolute translate-y-[1rem] inset-0 bg-[linear-gradient(0deg,_#181818,_transparent_50%)]"></div>
          <img
            loading="lazy"
            src={movie.backdrop}
            className="w-full"
            alt={movie.description}
          />
          <div className="p-[2rem] flex flex-col gap-[1rem] absolute translate-y-[-6rem] z-10 ">
            <h1 className="font-bold text-white text-[1.5rem] w-fit">
              {movie.title}
            </h1>
            <button
              onClick={() => navigate("/watch/" + id)}
              className="flex hover:cursor-pointer font-bold w-fit bg-white px-[0.7rem] py-[0.5rem] rounded-[0.5rem] hover:bg-white/75 transition duration-300"
            >
              <Play size={24} color="black" />
              <span>Play</span>
            </button>
            <div className="grid gap-[1rem] grid-cols-[65%_35%]">
              <div className="flex flex-col gap-[1rem] text-[#bcbcbc]">
                <div className="flex gap-[1rem]">
                  <div>{movie.release_date}</div>
                  <div>{movie.duration}m</div>
                </div>
                <p>{movie.description}</p>
              </div>
              <div className="flex flex-col p-1">
                <div className="flex flex-wrap gap-1">
                  <span className="text-white mr-1 mb-1">Genres:</span>
                  {Object.entries(movie.genres).map((value) => {
                    return (
                      <span className="text-[#bcbcbc]" key={value[0]}>
                        {value[1]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
