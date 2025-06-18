import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import MovieInfoSkeleton from "./MovieInfoSkeleton";
import EditForm from "./EditForm";
import { useUserContext } from "../../contexts/UserProvider";

async function fetchMovieInfo(id, setMovie, setLoading) {
  const res = await axios.get(`http://ecnet.website/api/movies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  setLoading(false);
  if (!res.data.isAuthorized) return;
  setMovie(res.data);
}

export default function MovieInfoAdmin({ id, setOpenInfo, deleteMovieUI }) {
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
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState(movie);
  const dialogRef = useRef(null);
  const formDialog = useRef(null);
  const detectClick = useCallback((e) => {
    if (
      !dialogRef.current?.contains(e.target) &&
      dialogRef.current &&
      !formDialog.current
    ) {
      setOpenInfo(false);
    }
  }, []);
  async function deleteMovie() {
    const res = await axios.delete(`http://ecnet.website/api/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    if (!res.data.isAuthorized) return;
    if (res.data.status == 204) {
      setOpenInfo(false);
      deleteMovieUI(id);
    }
  }
  useEffect(() => {
    fetchMovieInfo(id, setMovie, setLoading);
  }, [id]);

  useEffect(() => {
    setForm(movie);
  }, [movie]);

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
      {openEdit && (
        <EditForm
          movieForm={form}
          setMovieForm={setForm}
          setOpenEdit={setOpenEdit}
          formDialog={formDialog}
          fetchMovieInfo={fetchMovieInfo}
          setMovie={setMovie}
        />
      )}
      <div
        ref={dialogRef}
        className="flex w-[750px] m-[2rem] relative items-center justify-center"
      >
        <div className=" absolute z-20 top-0 right-0 flex py-[0.5rem] px-[1.2rem] gap-2">
          <button
            onMouseDown={() => {
              setOpenEdit(true);
            }}
            className=" bg-green-600 rounded-[0.5rem] hover:cursor-pointer py-[0.5rem] px-[1.2rem]"
          >
            Edit
          </button>
          <button
            onMouseDown={() => {
              deleteMovie();
            }}
            className=" bg-red-600 rounded-[0.5rem] hover:cursor-pointer py-[0.5rem] px-[1.2rem]"
          >
            Delete
          </button>
        </div>
        <div className="bg-[#141414] relative overflow-scroll h-[75vh] hide-scrollbar rounded-2xl w-full">
          <div className="absolute translate-y-[1rem] inset-0 bg-[linear-gradient(0deg,_#181818,_transparent_50%)]"></div>
          <img
            loading="lazy"
            src={movie.backdrop}
            className="w-full aspect-video"
            alt={movie.description}
          />
          <div className="p-[2rem] absolute translate-y-[-6rem] w-full z-10 ">
            <h1 className="font-bold text-[1.5rem] w-fit">{movie.title}</h1>
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
                  <span className=" mr-1 mb-1">Genres:</span>
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
