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

const NewandPopular = () => {
  const [nowPlaying, setNowPlaying] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [onTheAir, setOnTheAir] = useState([])
  const [popularTV, setPopularTV] = useState([])

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
      .then(r => r.json()).then(j => setNowPlaying(j.results || [])).catch(console.error)

    fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
      .then(r => r.json()).then(j => setPopularMovies(j.results || [])).catch(console.error)

    fetch('https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1', options)
      .then(r => r.json()).then(j => setOnTheAir(j.results || [])).catch(console.error)

    fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options)
      .then(r => r.json()).then(j => setPopularTV(j.results || [])).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6 md:p-8 space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-4">New in Theatres</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {nowPlaying.map(item => <MovieCard key={item.id} item={item} />)}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Popular Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {popularMovies.map(item => <MovieCard key={item.id} item={item} />)}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Airing Soon / On The Air</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {onTheAir.map(item => <TVCard key={item.id} item={item} />)}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Popular TV</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {popularTV.map(item => <TVCard key={item.id} item={item} />)}
        </div>
      </section>
    </div>
  )
}

export default NewandPopular
