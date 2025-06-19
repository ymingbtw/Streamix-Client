import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUserContext } from "../../contexts/UserProvider";

export default function GenreDialog({ genre, setGenre }) {
  const [genres, setGenres] = useState([]);
  const [selection, setSelection] = useState(false);
  const { token } = useUserContext();
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://api.ecnet.website/api/genres/main", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        if (!res.data.isAuthorized) return;
        setGenres(res.data);
      })
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSelection(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="text-white flex items-baseline gap-2">
      <h1
        onClick={() => {
          if (genre) {
            setGenre("");
          }
        }}
        className={`font-bold text-[clamp(1rem,3vw,3rem)] ${
          genre && "hover:cursor-pointer hover:text-white/75"
        }`}
      >
        Movie
      </h1>

      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => setSelection((prev) => !prev)}
          className="text-[clamp(0.5rem,2vw,2rem)] hover:cursor-pointer px-[clamp(0.5rem,2vw,1rem)] border border-white bg-black text-white"
        >
          {genre || "Genre"}
        </button>

        {selection && (
          <div className="absolute text-[clamp(0.5rem,2vw,2rem)] bg-black translate-y-[100%] left-0 top-0 grid grid-cols-3 z-20 border border-white p-2 gap-2">
            {genres.map((g) => (
              <span
                key={g.id}
                onClick={() => {
                  setGenre(g.genre);
                  setSelection(false);
                }}
                className="text-white hover:bg-white/25 px-2 py-1 cursor-pointer rounded transition"
              >
                {g.genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
