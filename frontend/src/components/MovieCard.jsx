import React from 'react'
import { Link } from 'react-router'

const MovieCard = ({ item }) => {
  if (!item) return null
  const { id, title, poster_path, vote_average, release_date } = item
  return (
    <Link to={`/movie/${id}`}>
      <div className="bg-[#232323] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 group">
        <div className="relative">
          <img
            src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : ''}
            className="w-full h-72 object-cover group-hover:opacity-80 transition"
            alt={title}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
            <h3 className="text-base font-bold text-white truncate">{title}</h3>
            <div className="text-xs text-gray-300 flex items-center gap-2">
              <span>⭐ {vote_average?.toFixed?.(1) ?? '—'}</span>
              <span>{release_date?.slice?.(0,4) ?? ''}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
