import { useEffect, useState } from 'react'
import axios from 'axios'
import BookCard from './BookCard'

const LIMIT = 12

export default function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    axios
      .get(`${import.meta.env.VITE_API_URL}/books`, {
        params: {
          genreId: genreId || undefined,
          search: search || undefined,
          sortBy: sortBy || undefined,
          page,
          limit: LIMIT,
        },
        signal: controller.signal,
      })
      .then((res) => {
        setBooks(res.data.data)
        setMeta(res.data.meta)
        setLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        setError('Could not load books. Check that the API is running, then try again.')
        setLoading(false)
      })

    return () => controller.abort()
  }, [genreId, search, sortBy, page, attempt])

  if (loading) {
    return (
      <div
        className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
        aria-busy="true"
      >
        <span className="sr-only">Loading books…</span>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] rounded-lg bg-slate-200" />
            <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
        <p>{error}</p>
        <button
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-1.5 font-semibold"
        >
          Try again
        </button>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <p className="py-10 text-slate-600">
        No books match. Try another title, author or genre.
      </p>
    )
  }

  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">
        {meta.total} {meta.total === 1 ? 'book' : 'books'}
      </p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-slate-600">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.totalPages}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}