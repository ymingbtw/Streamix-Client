import axios from "axios";
import { useEffect, useState } from "react";

export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [part, setPart] = useState(1);
  const [nextPart, setNextpart] = useState(2);
  const [loading, setLoading] = useState(null);
  async function fetchMovies(part) {
    const res = await axios.get(
      `https://api.ecnet.space/api/movies?part=${part}`
    );

    setPart(res.data.part);
    setNextpart(res.data.next_part);
    setMovies([...movies, ...res.data.movies]);
  }
  useEffect(() => {
    setLoading(true);
    fetchMovies(part);
  }, []);
  return { movies, fetchMovies, part, nextPart, loading, setLoading };
}
