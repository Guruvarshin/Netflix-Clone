import { HelpCircle, LogOut, Search as SearchIcon, Settings, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const TMDB_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTdlMWQ1YzhiZTlhMjJhMmRkYTAwN2Q2ZjU3YjNhYiIsIm5iZiI6MTc1NjIyMzAyMS45NSwic3ViIjoiNjhhZGQ2MmRmNzE3ZTQ2NGUyNzgyNmUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IZtGLOvxjYOcR7M3yG-jImp4i943NerMq2bMtO-V0h0',
  },
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const avatarUrl = user ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}` : "";
  const [showMenu, setShowMenu] = useState(false);

  // Search overlay state
  const [q, setQ] = useState('');
  const [openOverlay, setOpenOverlay] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const overlayInputRef = useRef(null);

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
  };

  // Open overlay when navbar input focused or search icon clicked
  const openSearch = () => {
    setOpenOverlay(true);
  };

  const closeSearch = () => {
    setOpenOverlay(false);
    // keep query so user can reopen; comment next line if you want to clear
    // setQ('');
    setResults([]);
    setLoading(false);
    // blur any focused element
    requestAnimationFrame(() => {
      overlayInputRef.current?.blur?.();
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  };

  // Debounced multi-search (only runs while overlay is open)
  useEffect(() => {
    if (!openOverlay) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`,
          TMDB_OPTIONS
        );
        const json = await resp.json();
        const items = Array.isArray(json.results) ? json.results : [];

        // Dedup by (media_type-id)
        const seen = new Set();
        const deduped = [];
        for (const r of items) {
          const t = r.media_type || (r.title ? 'movie' : r.name ? 'tv' : 'person');
          const key = `${t}-${r.id}`;
          if (!seen.has(key)) { seen.add(key); deduped.push(r); }
        }
        setResults(deduped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [q, openOverlay]);

  // Focus overlay input when overlay opens
  useEffect(() => {
    if (openOverlay) {
      // prevent body scroll while overlay open (optional)
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => overlayInputRef.current?.focus?.(), 0);
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openOverlay]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleCardClick = (item) => {
    const t = item.media_type || (item.title ? 'movie' : item.name ? 'tv' : 'person');
    closeSearch();
    navigate(`/${t}/${item.id}`);
  };

  return (
    <>
      <nav className='bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap'>
        <Link to={'/'}>
          <img src={Logo} alt="Netflix Logo" className='w-24 cursor-pointer brightness-125' />
        </Link>

        <ul className='hidden xl:flex space-x-6'>
          <Link to='/'><li className='cursor-pointer hover:text-[#e50914]'>Home</li></Link>
          <Link to='/tv'><li className='cursor-pointer hover:text-[#e50914]'>TV Shows</li></Link>
          <Link to='/movies'><li className='cursor-pointer hover:text-[#e50914]'>Movies</li></Link>
          <Link to='/people'><li className='cursor-pointer hover:text-[#e50914]'>People</li></Link>
          <Link to='/top-rated'><li className='cursor-pointer hover:text-[#e50914]'>Top Rated</li></Link>
          <Link to='/new-and-popular'><li className='cursor-pointer hover:text-[#e50914]'>New and popular</li></Link>
          <Link to='/trending'><li className='cursor-pointer hover:text-[#e50914]'>Trending</li></Link>
        </ul>

        <div className='flex space-x-4 items-center relative'>
          {/* Navbar search input (opens overlay on focus/click) */}
          <div className='relative hidden md:inline-flex'>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={openSearch}
              className='bg-[#333333] px-2 py-2 ml-2 rounded-full min-w-72 pr-10 outline-none'
              placeholder='Search movies, TV shows & people...'
            />
            <SearchIcon
              className='absolute top-2 right-4 w-5 h-5 cursor-pointer'
              onClick={openSearch}
            />
          </div>

          <Link to={user? "ai-recommendations": "signin"}>
            <button className='bg-[#e50914] px-5 py-2 text-white cursor-pointer'>Get AI Movie Picks</button>
          </Link>

          {!user ? (
            <Link to={'/signin'}>
              <button className='border border-[#333333] py-2 px-4 cursor-pointer'>Sign In</button>
            </Link>
          ) : (
            <div className="text-white">
              <img
                src={avatarUrl}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-[#e50914] cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />

              {showMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                  <div className="flex flex-col items-center mb-2">
                    <span className="text-white font-semibold text-base">
                      {user.username}
                    </span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* SEARCH OVERLAY (scrollable, with its own input) */}
      {openOverlay && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm overflow-y-auto overscroll-contain"
          onClick={closeSearch}
        >
          <div
            className="max-w-6xl mx-auto px-4 py-6 md:py-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header with input & close */}
            <div className="sticky top-0 z-[61] bg-transparent pb-4">
              <div className="relative">
                <input
                  ref={overlayInputRef}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-[#232323] border border-[#2a2a2a] rounded-full pl-10 pr-12 py-3 text-white placeholder-gray-400 outline-none"
                  placeholder="Search movies, TV shows & people..."
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-300 hover:text-white"
                  onClick={closeSearch}
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-[#181818] rounded-xl p-4 border border-[#2a2a2a]">
              {loading ? (
                <div className="text-gray-300">Searching…</div>
              ) : (q.trim().length >= 2 && results.length === 0) ? (
                <div className="text-gray-400">No results. Try another query.</div>
              ) : (q.trim().length < 2) ? (
                <div className="text-gray-400">Type at least 2 characters to search.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {results.map((r, idx) => {
                    const mediaType = r.media_type || (r.title ? 'movie' : r.name ? 'tv' : 'person');
                    const title = r.title || r.name || 'Untitled';
                    const posterPath = r.poster_path || r.profile_path || null;
                    const year = (r.release_date || r.first_air_date || '').slice(0,4);
                    const rating = typeof r.vote_average === 'number' ? r.vote_average.toFixed(1) : null;

                    return (
                      <button
                        key={`${mediaType}-${r.id}-${idx}`}
                        className="text-left bg-[#232323] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 group"
                        onClick={() => handleCardClick(r)}
                      >
                        <ResultPoster path={posterPath} alt={title} />
                        <div className="px-3 py-2">
                          <h3 className="text-sm font-bold text-white truncate">{title}</h3>
                          <div className="text-xs text-gray-300 flex items-center gap-2">
                            <span className="capitalize">{mediaType}</span>
                            {year && <span>• {year}</span>}
                            {mediaType !== 'person' && rating && <span>• ⭐ {rating}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Spacer to ensure bottom content not blocked by OS UI */}
            <div className="h-10" />
          </div>
        </div>
      )}
    </>
  );
};

const ResultPoster = ({ path, alt }) => {
  const [err, setErr] = useState(false);
  const src = path ? `https://image.tmdb.org/t/p/w300${path}` : null;

  if (!src || err) {
    return (
      <div
        className="w-full h-48 bg-[#2a2a2a] flex items-center justify-center text-gray-400 text-xs select-none"
        aria-label={`${alt || 'image'} unavailable`}
      >
        No Image
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      className="w-full h-48 object-cover group-hover:opacity-80 transition"
      onError={() => setErr(true)}
      loading="eager"
    />
  );
};

export default Navbar
