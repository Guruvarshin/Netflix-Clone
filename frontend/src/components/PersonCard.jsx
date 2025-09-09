import React from 'react'
import { Link } from 'react-router'

const PersonCard = ({ person }) => {
  if (!person) return null
  const { id, name, profile_path, known_for_department, popularity } = person
  return (
    <Link to={`/person/${id}`}>
      <div className="bg-[#232323] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 group">
        <div className="relative">
          <img
            src={profile_path ? `https://image.tmdb.org/t/p/w500${profile_path}` : ''}
            className="w-full h-72 object-cover group-hover:opacity-80 transition"
            alt={name}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
            <h3 className="text-base font-bold text-white truncate">{name}</h3>
            <div className="text-xs text-gray-300 flex items-center gap-2">
              <span>{known_for_department}</span>
              <span>🔥 {Math.round(popularity)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PersonCard
