import FuturisticLogo from "./FuturisticLogo";
import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { debounce } from "lodash";
import MovieInfo from "./MovieInfo";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useUserContext } from "../../contexts/UserProvider";
export default function Navbar() {
  const [showInput, setShowInput] = useState(false);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [fire, setFire] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { token } = useUserContext();
  const navigate = useNavigate();
  const path = window.location.pathname;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current.contains(event.target) && !openInfo) {
        setShowInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openInfo]);
  const queryMovie = debounce(async () => {
    setFire(true);
    setLoading(true);
    const res = await axios.get(
      `https://api.ecnet.website/api/movies?title=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    setLoading(false);
    if (!res.data.isAuthorized) return;
    setMovies(res.data.movies);
    console.log(res.data);
  }, 500);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        // adjust scroll threshold as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    // Cleanup on unmount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!query) {
      setFire(false);
      setMovies([]);
      queryMovie.cancel();
      return;
    }
    queryMovie();
    return () => {
      queryMovie.cancel();
    };
  }, [query]);
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
    <div className="fixed top-0 left-0 w-full z-20 pr-[clamp(1rem,2vw,2rem)] flex justify-between items-center gap-[1rem]">
      {openInfo && <MovieInfo id={openId} setOpenInfo={setOpenInfo} />}
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/0 to-transparent pointer-events-none"></div>

      {/* Black overlay with smooth opacity transition */}
      <div
        className={`absolute inset-0 -z-10 bg-black transition-opacity duration-500 pointer-events-none ${
          scrolled ? "opacity-90" : "opacity-0"
        }`}
      ></div>
      <div className="flex items-center">
        <FuturisticLogo hover={true} />
        <div className="flex ml-[1rem] text-gray-300 gap-[1rem] font-bold text-[0.7rem] min-[400px]:text-[1rem]">
          <div
            onClick={() => navigate("/")}
            className={`${path == "/" && "text-white"} hover:cursor-pointer`}
          >
            Home
          </div>
          <div
            onClick={() => navigate("/browse")}
            className={`${
              path == "/browse" && "text-white"
            } hover:cursor-pointer`}
          >
            Movies
          </div>
        </div>
      </div>
      <div
        className={`fixed right-2 transition-all duration-500 ease-in-out origin-right
          ${showInput ? "w-[clamp(3rem,50vw,20rem)]" : "w-0"}`}
      >
        <div
          ref={wrapperRef}
          className="relative flex flex-row-reverse gap-2 items-center space-x-2"
        >
          {/* Animated container */}
          <ProfileMenu />
          <MagnifyingGlassIcon
            className="h-6 shrink-0 w-6 text-white cursor-pointer hover:text-white/80"
            onClick={() => setShowInput(!showInput)}
          />
          <div className={`w-full z-30 overflow-hidden`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              autoFocus={showInput}
              className="w-full px-4  py-2 rounded-lg backdrop-blur-lg bg-black/50 text-white  border border-transparent focus:outline-none focus:border-transparent"
            />
            {query && showInput && (
              <div className="absolute top-full flex flex-col gap-2 scrollbar-hide overflow-scroll h-[10rem] left-0 mt-1 w-full bg-black/80 text-white rounded-md p-2 text-sm shadow-lg z-10">
                {!fire && movies.length == 0 ? (
                  ""
                ) : loading ? (
                  <div>Searching...</div>
                ) : movies.length > 0 ? (
                  movies.map((movie) => {
                    return (
                      <div
                        onClick={() => {
                          setOpenId(movie.id);
                          setOpenInfo(true);
                        }}
                        className="grid hover:cursor-pointer grid-cols-2 gap-1"
                        key={movie.id}
                      >
                        <img src={movie.backdrop} alt={movie.description} />
                        <span className="w-full line-clamp-3 text-ellipsis">
                          {movie.title}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  "No results"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
