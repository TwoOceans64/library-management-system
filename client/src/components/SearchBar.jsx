import { useEffect, useState } from 'react'

export default function SearchBar({ onSearch, delay = 400 }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value.trim()), delay)
    return () => clearTimeout(timer)
  }, [value, delay, onSearch])

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search by title or author"
      aria-label="Search by title or author"
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 sm:max-w-sm"
    />
  )
}