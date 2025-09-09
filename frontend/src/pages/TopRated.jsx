import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import TVCard from '../components/TVCard'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTdlMWQ1YzhiZTlhMjJhMmRkYTAwN2Q2ZjU3YjNhYiIsIm5iZiI6MTc1NjIyMzAyMS45NSwic3ViIjoiNjhhZGQ2MmRmNzE3ZTQ2NGUyNzgyNmUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IZtGLOvxjYOcR7M3yG-jImp4i943NerMq2bMtO-V0h0'
  }
};

const TopRated = () => {
  const [movies, setMovies] = useState([])
  const [tv, setTv] = useState([])

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
      .then(r => r.json()).then(j => setMovies(j.results || [])).catch(console.error)
    fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', options)
      .then(r => r.json()).then(j => setTv(j.results || [])).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6 md:p-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Top Rated Movies</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {movies.map(item => <MovieCard key={item.id} item={item} />)}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Top Rated TV Shows</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {tv.map(item => <TVCard key={item.id} item={item} />)}
        </div>
      </section>
    </div>
  )
}

export default TopRated
