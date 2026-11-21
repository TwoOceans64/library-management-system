import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookDetail from './pages/BookDetail'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link to="/" className="font-serif text-2xl font-bold">
            Library catalog
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route
            path="*"
            element={<p className="py-10 text-slate-600">Page not found.</p>}
          />
        </Routes>
      </main>
    </div>
  )
}