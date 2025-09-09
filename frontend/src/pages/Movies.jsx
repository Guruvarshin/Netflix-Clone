import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTdlMWQ1YzhiZTlhMjJhMmRkYTAwN2Q2ZjU3YjNhYiIsIm5iZiI6MTc1NjIyMzAyMS45NSwic3ViIjoiNjhhZGQ2MmRmNzE3ZTQ2NGUyNzgyNmUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IZtGLOvxjYOcR7M3yG-jImp4i943NerMq2bMtO-V0h0'
  }
};

const Movies = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchMovies = async (nextPage = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${nextPage}`, options)
      const json = await res.json()
      setData(prev => nextPage === 1 ? (json.results || []) : [...prev, ...(json.results || [])])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMovies(1) }, [])

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Popular Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {data.map(item => <MovieCard key={item.id} item={item} />)}
      </div>
      <div className="flex justify-center mt-8">
        <button
          disabled={loading}
          onClick={() => { const np = page + 1; setPage(np); fetchMovies(np) }}
          className="bg-[#e50914] hover:opacity-90 px-6 py-3 rounded-md disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      </div>
    </div>
  )
}

export default Movies
