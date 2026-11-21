const COLORS = ['#5b3a7a', '#1d5f8a', '#7a2e3a', '#8a5f12', '#2f6b4f', '#44506e']

export default function BookCover({ book }) {
  if (book.coverImage) {
    return (
      <img
        src={book.coverImage}
        alt={`Cover of ${book.title}`}
        className="aspect-[2/3] w-full rounded-r-lg rounded-l-sm object-cover shadow-md"
      />
    )
  }

  return (
    <div
      className="flex aspect-[2/3] w-full flex-col justify-between rounded-r-lg rounded-l-sm p-4 pl-5 text-white"
      style={{
        backgroundColor: COLORS[book.genreId % COLORS.length],
        boxShadow: 'inset 7px 0 0 rgba(0,0,0,.22), 0 6px 14px rgba(0,0,0,.18)',
      }}
    >
      <span className="font-serif text-lg leading-tight font-bold">{book.title}</span>
      <span className="text-xs opacity-90">{book.author}</span>
    </div>
  )
}