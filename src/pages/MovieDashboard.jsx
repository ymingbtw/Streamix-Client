import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MovieForm from "./components/MovieForm";
import axios from "axios";
import { debounce, set } from "lodash";
import MoviesContainer from "./components/MoviesContainer";
import GenreSelection from "./components/GenreSelection";
import { useUserContext } from "../contexts/UserProvider";

const movie = {
  title: "",
  description: "",
  duration: "",
  release_date: "",
  maturity_rating: "",
  backdrop: "",
  video: "",
  genres: {},
};

export default function MovieDashboard() {
  const [genres, setGenres] = useState([]);
  const { token } = useUserContext();
  const [openNewForm, setOpenNewForm] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [movieForm, setMovieForm] = useState(movie);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [nextPart, setNextPart] = useState(null);
  const [loading, setLoading] = useState(false);
  const newMovieButton = useRef(null);
  const genreRef = useRef(null);
  const queryMovies = debounce(async function () {
    setLoading(true);
    setMovies([]);
    const res = await axios.get(
      `http://ecnet.website/api/movies?genre=${selectedGenre}&title=${query}`,
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
    setNextPart(res.data.next_part);
  }, 300);
  useEffect(() => {
    queryMovies();
    return () => {
      queryMovies.cancel();
    };
  }, [query]);
  useEffect(() => {
    async function queryMovies() {
      if (!selectedGenre) return;
      setLoading(true);
      setMovies([]);
      const res = await axios.get(
        `http://ecnet.website/api/movies?genre=${selectedGenre}&title=${query}`,
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
      setNextPart(res.data.next_part);
    }
    queryMovies();
  }, [selectedGenre]);
  useEffect(() => {
    async function fetchGenres() {
      const res = await axios.get("http://ecnet.website/api/genres/main", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (!res.data.isAuthorized) return;
      setGenres(res.data);
    }
    async function initMovies() {
      setLoading(true);
      const res = await axios.get(`http://ecnet.website/api/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setLoading(false);
      if (!res.data.isAuthorized) return;
      setMovies(res.data.movies);
      setNextPart(res.data.next_part);
    }
    initMovies();
    fetchGenres();
  }, []);
  console.log("dashboard");
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      className="bg-[#141414] relative min-h-screen select-none"
    >
      {openNewForm && (
        <MovieForm
          setMovieForm={setMovieForm}
          movieForm={movieForm}
          setOpenNewForm={setOpenNewForm}
        />
      )}
      <div className="z-10 p-[1rem] flex relative gap-[2rem] text-white">
        <h1 className="font-bold text-[1.5rem] text-nowrap">Movie Dashboard</h1>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
          }}
          className="h-[2rem] px-[1rem] shrink items-center min-w-0 rounded-lg border border-gray-300 focus:outline-none "
          type="text"
          placeholder="Search"
        />
      </div>
      <div className="relative p-[2rem] z-10 text-white">
        <div className="flex items-center relative gap-[1rem]">
          <h1
            ref={genreRef}
            onMouseDown={(e) => {
              if (openGenre) return;
              setOpenGenre(true);
            }}
            className="border font-bold rounded-[0.7rem] border-white px-[1rem] py-[0.5rem] select-none hover:cursor-pointer"
          >
            {selectedGenre ? selectedGenre : "Genres"}
          </h1>
          {openGenre && (
            <GenreSelection
              genreRef={genreRef}
              setSelectedGenre={setSelectedGenre}
              setOpenGenre={setOpenGenre}
              genres={genres}
            />
          )}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              setOpenNewForm(true);
            }}
            ref={newMovieButton}
            className="font-bold hover:cursor-pointer px-[1rem] py-[0.5rem] bg-green-600 rounded-[0.7rem]"
          >
            New Movie
          </div>
        </div>
        <MoviesContainer
          query={query}
          selectedGenre={selectedGenre}
          movies={movies}
          setMovies={setMovies}
          loading={loading}
          nextPart={nextPart}
          setNextPart={setNextPart}
          setLoading={setLoading}
        />
      </div>
    </motion.div>
  );
}
