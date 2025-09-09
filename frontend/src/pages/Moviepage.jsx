import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { Play } from 'lucide-react'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTdlMWQ1YzhiZTlhMjJhMmRkYTAwN2Q2ZjU3YjNhYiIsIm5iZiI6MTc1NjIyMzAyMS45NSwic3ViIjoiNjhhZGQ2MmRmNzE3ZTQ2NGUyNzgyNmUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IZtGLOvxjYOcR7M3yG-jImp4i943NerMq2bMtO-V0h0',
  },
};

/** Sentence-aware truncation (keeps whole sentences up to ~max chars). */
const truncateToSentence = (text = '', max = 220) => {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= max) return clean;

  const slice = clean.slice(0, max);
  const lastDot = slice.lastIndexOf('. ');
  const lastQ = slice.lastIndexOf('? ');
  const lastEx = slice.lastIndexOf('! ');
  const cut = Math.max(lastDot, lastQ, lastEx);

  if (cut > 0) return slice.slice(0, cut + 1);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + '…';
};

// Reusable image with graceful fallback
const PosterImage = ({
  path,
  alt,
  size = 'w500',
  className = '',
  fixedHeight = 'h-72',
  fallbackText = 'No Image',
}) => {
  const [errored, setErrored] = useState(false);
  const src = path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

  if (!src || errored) {
    return (
      <div
        className={`bg-[#2a2a2a] ${fixedHeight} w-full flex items-center justify-center text-gray-400 text-sm select-none ${className}`}
        aria-label={`${alt || 'image'} unavailable`}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setErrored(true)}
      loading="eager"
    />
  );
};

const Moviepage = () => {
  const params = useParams();
  const id = params.id;
  const type = params.type || 'movie';

  const [item, setItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    if (!id || !type) return;

    setItem(null);
    setRecommendations([]);
    setTrailerKey(null);

    const base = `https://api.themoviedb.org/3/${type}/${id}`;

    // Details
    fetch(`${base}?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => setItem(res))
      .catch((err) => console.error(err));

    if (type === 'movie' || type === 'tv') {
      // Recommendations
      fetch(`${base}/recommendations?language=en-US&page=1`, options)
        .then((res) => res.json())
        .then((res) => setRecommendations(res.results || []))
        .catch((err) => console.error(err));

      // Trailer
      fetch(`${base}/videos?language=en-US`, options)
        .then((res) => res.json())
        .then((res) => {
          const trailer = res.results?.find(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          if (trailer) setTrailerKey(trailer.key || null);
        })
        .catch((err) => console.error(err));
    } else if (type === 'person') {
      // Known for
      fetch(`${base}/combined_credits?language=en-US`, options)
        .then((res) => res.json())
        .then((res) => {
          const combined = [...(res.cast || []), ...(res.crew || [])];
          setRecommendations(combined);
        })
        .catch((err) => console.error(err));
    }
  }, [id, type]);

  if (!item) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-red-500">Loading...</span>
      </div>
    );
  }

  const isMovie = type === 'movie';
  const isTV = type === 'tv';
  const isPerson = type === 'person';

  const title = isMovie ? item.title : item.name;
  const poster = isPerson ? item.profile_path : item.poster_path;
  const backdrop = item.backdrop_path || null;

  const rating =
    typeof item.vote_average === 'number' ? item.vote_average.toFixed(1) : null;

  const date = isMovie ? item.release_date : isTV ? item.first_air_date : null;
  const runtime = isMovie ? item.runtime : isTV ? item.episode_run_time?.[0] ?? null : null;
  const genres = item.genres || [];
  const overview = isPerson ? item.biography : item.overview;
  const subline = isPerson ? item.known_for_department : (date || '');

  // Deduplicate recs
  const dedupedRecs = (() => {
    const seen = new Set();
    const out = [];
    for (const rec of recommendations) {
      const t =
        rec.media_type ||
        (isPerson ? (rec.title ? 'movie' : 'tv') : (isMovie ? 'movie' : 'tv'));
      const key = `${t}-${rec.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ ...rec, __linkType: t });
      }
      if (out.length >= 20) break;
    }
    return out;
  })();

  // HERO snippet: short, sentence-aware preview
  const heroSnippet = truncateToSentence(overview || '', 220);

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* HERO (shows only a small, complete-sentence snippet) */}
      <div
        className="relative h-[60vh] flex items-end"
        style={
          backdrop
            ? {
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${backdrop})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
        <div className="relative z-10 flex items-end p-8 gap-8">
          <PosterImage
            path={poster || null}
            size="original"
            alt={title}
            className="rounded-lg shadow-lg w-48 hidden md:block object-cover"
            fixedHeight="h-72"
          />

          <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-4 mb-3">
              {!isPerson && rating && <span>⭐ {rating}</span>}
              {subline && <span>{subline}</span>}
              {!isPerson && runtime && <span>{runtime} mins</span>}
            </div>

            {!isPerson && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-sm bg-gray-800 px-3 py-1 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {heroSnippet && (
              <p className="max-w-2xl text-gray-200">
                {heroSnippet}
              </p>
            )}

            {trailerKey && !isPerson && (
              <Link
                to={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex justify-center items-center bg-[#e50914] hover:bg-gray-200 text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base mt-4">
                  <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" />
                  Watch Trailer
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* DETAILS with sentence-aware expandable text */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>

        <div className="bg-[#232323] p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              {isPerson ? (
                <>
                  <li>
                    <span className="font-semibold text-white">Known For: </span>
                    <span className="ml-2">{item.known_for_department || 'N/A'}</span>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Birthday: </span>
                    <span className="ml-2">{item.birthday || 'N/A'}</span>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Place of Birth: </span>
                    <span className="ml-2">{item.place_of_birth || 'N/A'}</span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <span className="font-semibold text-white">Status: </span>
                    <span className="ml-2">{item.status}</span>
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      {isMovie ? 'Release Date:' : 'First Air Date:'}{' '}
                    </span>
                    <span className="ml-2">{date}</span>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Original Language: </span>
                    <span className="ml-2">{item.original_language?.toUpperCase()}</span>
                  </li>

                  {isMovie && (
                    <>
                      <li>
                        <span className="font-semibold text-white">Budget: </span>
                        <span className="ml-2">
                          {item.budget ? `$${item.budget.toLocaleString()}` : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="font-semibold text-white">Revenue: </span>
                        <span className="ml-2">
                          {item.revenue ? `$${item.revenue.toLocaleString()}` : 'N/A'}
                        </span>
                      </li>
                    </>
                  )}

                  <li>
                    <span className="font-semibold text-white">Production Companies: </span>
                    <span className="ml-2">
                      {item.production_companies?.length
                        ? item.production_companies.map((c) => c.name).join(', ')
                        : 'N/A'}
                    </span>
                  </li>

                  <li>
                    <span className="font-semibold text-white">Countries: </span>
                    <span className="ml-2">
                      {item.production_countries?.length
                        ? item.production_countries.map((c) => c.name).join(', ')
                        : 'N/A'}
                    </span>
                  </li>

                  <li>
                    <span className="font-semibold text-white">Spoken Languages: </span>
                    <span className="ml-2">
                      {item.spoken_languages?.length
                        ? item.spoken_languages.map((l) => l.english_name).join(', ')
                        : 'N/A'}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">
              {isPerson ? 'Biography' : 'Overview'}
            </h3>
            <ExpandableText
              text={overview || (isPerson ? 'No biography available.' : 'No overview available.')}
              previewChars={420}
            />
          </div>
        </div>
      </div>

      {dedupedRecs.length > 0 && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            {isPerson ? 'Known For' : 'You might also like...'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {dedupedRecs.map((rec, idx) => {
              const linkType = rec.__linkType || 'movie';
              const recTitle = rec.title || rec.name || 'Untitled';
              const posterPath = rec.poster_path || rec.profile_path || null;
              const key = `${linkType}-${rec.id}-${idx}`;

              return (
                <Link key={key} to={`/${linkType}/${rec.id}`}>
                  <div className="bg-[#232323] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 group">
                    <div className="relative">
                      <PosterImage
                        path={posterPath}
                        alt={recTitle}
                        className="w-full h-72 object-cover group-hover:opacity-80 transition"
                        fixedHeight="h-72"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                        <h3 className="text-base font-bold text-white truncate">
                          {recTitle}
                        </h3>
                        <span className="text-xs text-gray-300">
                          {(rec.release_date || rec.first_air_date || '').slice(0, 4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ExpandableText = ({ text = '', previewChars = 420 }) => {
  const [expanded, setExpanded] = useState(false);
  const full = String(text).trim();
  const preview = truncateToSentence(full, previewChars);
  const isTruncated = preview !== full;

  return (
    <div className="relative">
      <p className="text-gray-200 whitespace-pre-line">
        {expanded ? full : preview}
      </p>

      {isTruncated && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm text-gray-300 underline underline-offset-2 hover:text-white"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default Moviepage
