import { Link } from 'react-router-dom'
import BookCover from './BookCover'

export default function BookCard({ book }) {
  const inStock = book.availableCopies > 0

  return (
    <Link
      to={`/books/${book.id}`}
      className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4"
    >
      <BookCover book={book} />
      <p className="mt-2 text-sm text-slate-600">
        {inStock
          ? `${book.availableCopies} of ${book.totalCopies} available`
          : 'All copies out'}
      </p>
    </Link>
  )
}