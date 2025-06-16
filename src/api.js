// Mock API to simulate backend
export const fetchHomeRows = async () => [
  { title: "Trending Now", type: "genre", slug: "trending" },
  { title: "Action Movies", type: "genre", slug: "action" },
  { title: "Comedy Movies", type: "genre", slug: "comedy" },
];

export const fetchMoviesByGenre = async (slug) => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `${slug}-${i}`,
    title: `${slug} Movie ${i + 1}`,
    thumbnail: `https://via.placeholder.com/150?text=${slug}+${i + 1}`,
  }));
};
