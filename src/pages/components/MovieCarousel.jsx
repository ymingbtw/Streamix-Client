import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import PaginationDot from "./PaginationDot";

const MovieCarousel = ({ genre, setOpenId, setOpenInfo }) => {
  const containerRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(1);
  const [perPage, setPerpage] = useState(2);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef(null);

  function onPageChange(page) {
    if (total < page || page < 1) return;
    if (current < page) {
      setTranslateX(translateX + Math.abs(page - current) * -100);
    } else if (current > page) {
      setTranslateX(translateX + Math.abs(page - current) * 100);
    }
    setCurrent(page);
  }
  // Fetch movies
  useEffect(() => {
    if (!genre) return;
    axios
      .get(`http://45.149.206.238:80/api/movies?genre=${genre}`)
      .then((res) => setMovies(res.data.movies));
  }, [genre]);
  useEffect(() => {
    if (movies.length % perPage === 0) {
      setTotal(parseInt(movies.length / perPage));
    } else {
      setTotal(parseInt(movies.length / perPage + 1));
    }
  }, [perPage, movies]);
  useEffect(() => {
    if (total < current && total > 0) {
      setCurrent(current - 1);
      onPageChange(current - 1);
    }
  }, [total, current]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry.target.clientWidth >= 768) {
        setPerpage(3);
      } else {
        setPerpage(2);
      }
    });
    observer.observe(carouselRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={carouselRef}
      className="relative px-4 overflow-hidden text-[#e5e5e5] select-none"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[clamp(0.5rem,2vw,2rem)] font-bold hover:text-white cursor-pointer">
          {genre}
        </h2>
      </div>

      {/* Prev Button */}
      <button
        onClick={() => onPageChange(current - 1)}
        className="absolute hover:cursor-pointer left-0 top-1/2 -translate-y-[25%] z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className={`flex gap-2 transition-transform ease-in-out duration-700`}
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {movies.map((movie) => (
          <div
            onClick={() => {
              setOpenId(movie.id);
              setOpenInfo(true);
            }}
            key={movie.id}
            className=" grow-0 hover:cursor-pointer shrink-0 basis-[calc(1/2*100%-0.5rem)] translate-x-[0.25rem] min-[768px]:basis-[calc(1/3*100%-0.5rem)]"
          >
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="aspect-video w-full rounded-lg object-cover cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(current + 1)}
        className="absolute hover:cursor-pointer right-0 top-1/2 -translate-y-[25%] z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
      >
        <ChevronRight size={24} />
      </button>

      {/* Page Dots */}
      <PaginationDot
        totalPages={total}
        currentPage={current}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default MovieCarousel;
