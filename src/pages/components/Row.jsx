import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

const Row = ({ genre }) => {
  const [movies, setMovies] = useState([]);
  const ref = useRef();

  useEffect(() => {
    async function initMovies() {
      if (!genre) return;
      const res = await axios.get(
        `http://45.149.206.238:80/api/movies?genre=${genre}`
      );
      setMovies(res.data.movies);
    }
    initMovies();
  }, [genre]);

  return (
    <div ref={ref} style={{ marginBottom: "2rem" }}>
      <h2>{genre}</h2>
      <div style={{ display: "flex", overflowX: "scroll" }}>
        {movies.length === 0 ? (
          <p>Loading...</p>
        ) : (
          movies.map((movie) => (
            <img
              key={movie.id}
              src={movie.backdrop}
              alt={movie.title}
              style={{ width: "150px", marginRight: "10px" }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Row;
