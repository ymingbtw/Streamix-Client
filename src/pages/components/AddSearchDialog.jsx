import axios from "axios";
import { useState, useRef, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useUserContext } from "../../contexts/UserProvider";

export default function AddSearchDialog({ movieForm, setMovieForm }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const [query, setQuery] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useUserContext();
  const fetchGenres = useCallback(
    debounce(async (searchQuery) => {
      try {
        const res = await axios(
          `https://api.ecnet.website/api/genres/q/${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (!res.data.isAuthorized) return;
        setGenres(res.data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      } finally {
        setLoading(false);
      }
    }, 300),
    [] // only create once
  );
  // Click outside to close
  useEffect(() => {
    function handleOutsideClick(e) {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);
  useEffect(() => {
    return () => {
      fetchGenres.cancel(); // prevent memory leaks
    };
  }, [fetchGenres]);
  useEffect(() => {
    setLoading(true);
    if (query) {
      fetchGenres(query);
    } else {
      fetchGenres.cancel();
      setGenres([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="">
      {/* Add Button (Icon) */}
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
        title="Add Genre"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Search Dialog */}
      {open && (
        <div
          ref={dialogRef}
          className="absolute flex flex-col overflow-scroll h-[300px] translate-y-[-100%] hide-scrollbar top-0 right-[50%] translate-x-[50%] z-50 bg-[#1f1f1f] text-white rounded-xl shadow-xl w-72"
        >
          <div className="p-[1rem]">
            <h2 className="text-lg font-semibold mb-2">Search Genre</h2>
            <input
              defaultValue={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
              }}
              type="text"
              placeholder="Type to search..."
              className="w-full bg-black border border-white rounded-lg px-3 py-2 text-white focus:outline-none "
            />
          </div>
          {loading ? (
            <div className="flex items-center justify-center">searching...</div>
          ) : (
            <div className="flex scrollbar-hide flex-col py-[1rem] gap-[1rem]">
              {genres.map((genre) => {
                return (
                  <div
                    onClick={() => {
                      setMovieForm({
                        ...movieForm,
                        genres: {
                          ...movieForm.genres,
                          [genre.id]: genre.genre,
                        },
                      });
                    }}
                    className="hover:cursor-pointer px-[1rem] py-[0.5rem] bg-[#141414]/60"
                    key={genre.id}
                  >
                    {genre.genre}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
