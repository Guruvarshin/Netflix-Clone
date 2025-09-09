import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import TVCard from '../components/TVCard'
import PersonCard from '../components/PersonCard'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTdlMWQ1YzhiZTlhMjJhMmRkYTAwN2Q2ZjU3YjNhYiIsIm5iZiI6MTc1NjIyMzAyMS45NSwic3ViIjoiNjhhZGQ2MmRmNzE3ZTQ2NGUyNzgyNmUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IZtGLOvxjYOcR7M3yG-jImp4i943NerMq2bMtO-V0h0'
  }
};

const Trending = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', options)
      .then(r => r.json()).then(j => setItems(j.results || [])).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Trending Today</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {items.map(item => {
          if (item.media_type === 'movie') return <MovieCard key={`m-${item.id}`} item={item} />
          if (item.media_type === 'tv') return <TVCard key={`t-${item.id}`} item={item} />
          if (item.media_type === 'person') return <PersonCard key={`p-${item.id}`} person={item} />
          return null
        })}
      </div>
    </div>
  )
}

export default Trending
