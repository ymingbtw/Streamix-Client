import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AddSearchDialog from "./AddSearchDialog";

export default function MovieForm({ setMovieForm, movieForm, setOpenNewForm }) {
  const formDialog = useRef(null);
  useEffect(() => {
    function detectClick(e) {
      if (!formDialog.current.contains(e.target)) {
        setOpenNewForm(false);
      }
    }
    document.addEventListener("mousedown", detectClick);
    return () => {
      document.removeEventListener("mousedown", detectClick);
    };
  }, []);
  return (
    <div
      ref={formDialog}
      className="backdrop-blur-md overflow-scroll flex flex-col gap-4 translate-y-[10%] h-[75vh] hide-scrollbar left-[50%] translate-x-[-50%] z-20 absolute text-white bg-[#141414] rounded-xl shadow-lg w-[75vw] p-[1rem]"
    >
      <h2 className="text-xl font-bold">New Movie</h2>
      <div className="flex flex-col gap-4 p-1 min-[950px]:grid min-[950px]:grid-cols-[25%_75%] ">
        <span className="">Title</span>
        <input
          defaultValue={movieForm.title}
          onBlur={(e) => {
            setMovieForm({ ...movieForm, title: e.currentTarget.value });
          }}
          className="border px-[1rem] py-[0.2rem] border-white rounded-[0.7rem] w-full"
          type="text"
        />
        <span className="">Description</span>
        <textarea
          defaultValue={movieForm.description}
          onBlur={(e) => {
            setMovieForm({
              ...movieForm,
              description: e.currentTarget.value,
            });
          }}
          className="border h-[100px] px-[1rem] py-[0.2rem] border-white rounded-[0.7rem] resize-none w-full"
          type="text"
        />
        <span>Duration</span>
        <input
          defaultValue={movieForm.duration}
          onBlur={(e) => {
            setMovieForm({
              ...movieForm,
              duration: e.currentTarget.value,
            });
          }}
          className="border w-[100px] px-[1rem] py-[0.2rem] border-white rounded-[0.7rem]"
          type="text"
        />
        <span>Release Date</span>
        <input
          defaultValue={movieForm.release_date}
          onBlur={(e) => {
            setMovieForm({
              ...movieForm,
              release_date: e.currentTarget.value,
            });
          }}
          className="border w-[100px] px-[1rem] py-[0.2rem] border-white rounded-[0.7rem]"
          type="text"
        />
        <span>Maturity Rating</span>
        <input
          defaultValue={movieForm.maturity_rating}
          onBlur={(e) => {
            setMovieForm({
              ...movieForm,
              maturity_rating: e.currentTarget.value,
            });
          }}
          className="border w-[100px] px-[1rem] py-[0.2rem] border-white rounded-[0.7rem]"
          type="text"
        />
        <span>Backdrop</span>
        <input
          defaultValue={movieForm.backdrop}
          onBlur={(e) => {
            setMovieForm({
              ...movieForm,
              backdrop: e.currentTarget.value,
            });
          }}
          className="border w-full px-[1rem] py-[0.2rem] border-white rounded-[0.7rem]"
          type="text"
        />
        <span>Video</span>
        <input
          defaultValue={movieForm.video}
          onBlur={(e) => {
            setMovieForm({ ...movieForm, video: e.currentTarget.value });
          }}
          className="border w-full px-[1rem] py-[0.2rem] border-white rounded-[0.7rem]"
          type="text"
        />
        <span className="flex items-center">Genres</span>
        <div className="flex relative items-center gap-[1rem]">
          {Object.entries(movieForm.genres).map((genre) => {
            return (
              <button
                onClick={() => {
                  const genres = { ...movieForm.genres };
                  delete genres[genre[0]];
                  setMovieForm({
                    ...movieForm,
                    genres,
                  });
                }}
                className="px-[1rem] hover:cursor-pointer py-[0.5rem] rounded-[0.7rem] bg-gray-600"
                key={genre[0]}
              >
                {genre[1]}
              </button>
            );
          })}
          <AddSearchDialog movieForm={movieForm} setMovieForm={setMovieForm} />
        </div>
        <button
          onClick={async () => {
            console.log({
              ...movieForm,
              genres: Object.keys(movieForm.genres),
            });
            const res = await axios.post(
              "http://45.149.206.238:80/api/movies",
              {
                movieForm: {
                  ...movieForm,
                  genres: Object.keys(movieForm.genres),
                },
              },
              { headers: { "Content-Type": "application/json" } }
            );
          }}
          className="bg-blue-500 col-span-full hover:cursor-pointer text-white w-fit px-[1rem] mx-auto py-[0.5rem] rounded-[0.7rem]"
        >
          Add
        </button>
      </div>
    </div>
  );
}
