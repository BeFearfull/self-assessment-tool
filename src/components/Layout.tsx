import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../theme'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-sm font-bold tracking-tight sm:text-base">
            Accenture Technical MCQ
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
              }
            >
              Past attempts
            </NavLink>
            <button
              type="button"
              onClick={toggle}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs dark:border-slate-700"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">{children}</main>
    </div>
  )
}
