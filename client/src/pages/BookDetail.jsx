import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import BookCover from '../components/BookCover'

export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    axios
      .get(`${import.meta.env.VITE_API_URL}/books/${id}`, { signal: controller.signal })
      .then((res) => {
        setBook(res.data)
        setLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        const status = err.response?.status
        setError(
          status === 404 || status === 400
            ? 'This book does not exist.'
            : 'Could not load this book. Check that the API is running.',
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [id])

  const back = (
    <Link to="/" className="mb-6 inline-block font-semibold text-slate-700 underline">
      Back to catalog
    </Link>
  )

  if (loading) {
    return (
      <div aria-busy="true">
        {back}
        <p className="text-slate-600">Loading book…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {back}
        <p className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {back}
      <div className="grid gap-8 sm:grid-cols-[220px_1fr]">
        <div className="max-w-[220px]">
          <BookCover book={book} />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold">{book.title}</h1>
          <p className="mt-1 text-lg text-slate-600">{book.author}</p>
          <dl className="mt-6 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="text-slate-500">Genre</dt>
            <dd>{book.genre.name}</dd>
            <dt className="text-slate-500">ISBN</dt>
            <dd>{book.isbn}</dd>
            <dt className="text-slate-500">Availability</dt>
            <dd>
              {book.availableCopies > 0
                ? `${book.availableCopies} of ${book.totalCopies} copies available`
                : 'All copies are out'}
            </dd>
          </dl>
          <p className="mt-6 max-w-prose text-slate-700">{book.description}</p>
        </div>
      </div>
    </div>
  )
}