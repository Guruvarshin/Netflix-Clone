import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const RecommendedMovies = ({ movieTitles }) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.log("Error fetching movie: ", error);
      return null;
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const results = await Promise.all(
        movieTitles.map((title) => fetchMovie(title))
      );
      //filter the null results
      setMovies(results.filter(Boolean));
      setLoading(false);
      console.log(movies);
    };

    if (movieTitles?.length) {
      loadMovies();
    }
  }, [movieTitles]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          key={movie.id}
          className="bg-[#232323] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 group"
        >
          {movie.poster_path ? (
            <div className="relative">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="w-full h-[330px] object-cover object-center group-hover:opacity-80 transition"
                alt={movie.title}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                <h3 className="text-base font-bold text-white truncate">
                  {movie.title}
                </h3>
                <span className="text-xs text-gray-300">
                  {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[330px] bg-gray-800 text-gray-400">
              No Image
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

export default RecommendedMovies;