import { useEffect, useState } from 'react'
import axios from 'axios'
import BookGrid from '../components/BookGrid'
import SearchBar from '../components/SearchBar'

export default function HomePage() {
  const [genres, setGenres] = useState([])
  const [genreId, setGenreId] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('')

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/genres`)
      .then((res) => setGenres(res.data))
      .catch(() => setGenres([]))
  }, [])

  const chip = (active) =>
    `rounded-full border px-3 py-1 text-sm font-semibold ${
      active
        ? 'border-slate-900 bg-slate-900 text-white'
        : 'border-slate-300 bg-white text-slate-700'
    }`

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar onSearch={setSearch} />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-2"
          >
            <option value="">Newest first</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by genre">
        <button onClick={() => setGenreId(null)} className={chip(genreId === null)}>
          All books
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setGenreId(g.id)}
            className={chip(genreId === g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      <BookGrid
        key={`${genreId}-${search}-${sortBy}`}
        genreId={genreId}
        search={search}
        sortBy={sortBy}
      />
    </div>
  )
}