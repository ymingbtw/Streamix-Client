import { useEffect, useRef, useCallback } from "react";

export default function GenreSelection({
  setSelectedGenre,
  genres,
  setOpenGenre,
  genreRef,
}) {
  const genreDialog = useRef(null);
  const detectClick = useCallback((e) => {
    if (genreDialog.current && !genreDialog.current.contains(e.target)) {
      if (e.target == genreRef.current) return;
      setOpenGenre(false);
    }
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", detectClick);
    }, 0);
    return () => {
      document.removeEventListener("mousedown", detectClick);
      clearTimeout(timeout);
    };
  }, []);

  console.log("genre selection");
  return (
    <div
      ref={genreDialog}
      className="grid gap-4 grid-cols-3 top-[100%] z-30 bg-black absolute"
    >
      {genres.map((value) => {
        return (
          <div
            onClick={() => {
              setSelectedGenre(value.genre);
              setOpenGenre(false);
            }}
            key={value.id}
            className="p-[0.5rem] hover:cursor-pointer"
          >
            {value.genre}
          </div>
        );
      })}
    </div>
  );
}
