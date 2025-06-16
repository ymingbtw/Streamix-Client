import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import React from "react";
import MovieInfoAdmin from "./MovieInfoAdmin";
import { debounce } from "lodash";

function MoviesContainer({
  selectedGenre,
  query,
  movies,
  setMovies,
  nextPart,
  loading,
  setNextPart,
  setLoading,
}) {
  const [openInfo, setOpenInfo] = useState(false);
  const [openId, setOpenId] = useState(null);
  const scrollRef = useRef(null);
  const lastRef = useRef(null);
  const deleteMovieUI = useCallback((id) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
  }, []);
  useEffect(() => {
    if (!lastRef.current || nextPart == null) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && nextPart) {
          observer.unobserve(lastRef.current);
          setLoading(true);
          const res = await axios.get(
            `http://45.149.206.238:80/api/movies?part=${nextPart}&genre=${selectedGenre}&title=${query}`
          );
          setLoading(false);
          setNextPart(res.data.next_part);
          setMovies((prev) => [...prev, ...res.data.movies]);
        }
      },
      { root: scrollRef.current, threshold: 0.1 }
    );
    observer.observe(lastRef.current);
    return () => {
      observer.disconnect();
    };
  }, [nextPart]);
  console.log("movie container");
  return (
    <div
      ref={scrollRef}
      className="grid h-[65vh] relative border p-[1rem] mt-[1rem] border-white rounded-[1rem] overflow-scroll gap-4 hide-scrollbar grid-cols-1 min-[500px]:grid-cols-2 min-[1000px]:grid-cols-3"
    >
      {openInfo && (
        <MovieInfoAdmin
          id={openId}
          setOpenInfo={setOpenInfo}
          deleteMovieUI={deleteMovieUI}
        />
      )}
      {movies.map((movie, idx) => {
        if (movies.length == idx + 1) {
          return (
            <div
              onClick={(e) => {
                setOpenId(movie.id);
                setOpenInfo(true);
              }}
              ref={lastRef}
              key={movie.id}
              className=" h-fit hover:cursor-pointer flex flex-col "
            >
              <img
                loading="lazy"
                src={movie.backdrop}
                className="aspect-video w-full"
                alt={movie.description}
              />
              <div>{movie.title}</div>
            </div>
          );
        }
        return (
          <div
            onClick={(e) => {
              setOpenId(movie.id);
              setOpenInfo(true);
            }}
            key={movie.id}
            className=" h-fit hover:cursor-pointer flex flex-col "
          >
            <img
              className="aspect-video"
              src={movie.backdrop}
              alt={movie.description}
            />
            <div>{movie.title}</div>
          </div>
        );
      })}
      {loading && <div>Loading...</div>}
    </div>
  );
}
export default React.memo(MoviesContainer);
