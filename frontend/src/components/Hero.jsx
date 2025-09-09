import React, { useEffect, useState} from 'react'
import HeroBg from '../assets/herobg2.jpg'
import { Bookmark, Play } from 'lucide-react'
import { Link } from 'react-router'
const Hero = () => {
  const [movies, setMovies] = useState(null);
  const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTdlMWQ1YzhiZTlhMjJhMmRkYTAwN2Q2ZjU3YjNhYiIsIm5iZiI6MTc1NjIyMzAyMS45NSwic3ViIjoiNjhhZGQ2MmRmNzE3ZTQ2NGUyNzgyNmUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IZtGLOvxjYOcR7M3yG-jImp4i943NerMq2bMtO-V0h0'
  }
};
useEffect(() => {
fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
  .then(res => res.json())
  .then(res => {
    if(res.results && res.results.length > 0){
      const randomIndex = Math.floor(Math.random() * res.results.length);
      setMovies(res.results[randomIndex]);
    }
  })
  .catch(err => console.error(err));
}, []);
if(!movies) return <p>Loading...</p>
  return (
    <div className="relative w-full h-[480px] md:h-[600px] rounded-2xl overflow-hidden text-white">
      <img
        src={`https://image.tmdb.org/t/p/original/${movies.backdrop_path}`}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Netflix-style dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818cc] to-transparent"></div>
      <div className="absolute left-4 md:left-12 bottom-24 md:bottom-32 max-w-xl z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{movies.title}</h1>
        <p className="text-base md:text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-lg">{movies.overview}</p>
        <div className="flex space-x-3 md:space-x-6">
          <Link to={`/movie/${movies.id}`}>
            <button className="flex items-center bg-[#e50914] hover:bg-[#b0060f] text-white font-semibold py-2 md:py-3 px-5 md:px-7 rounded-lg md:rounded-full text-base md:text-lg shadow-lg transition">
              <Play className="mr-2 w-5 h-5" />Watch Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero