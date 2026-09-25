import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getMock } from '../data'
import { clearAttempts, loadAttempts } from '../storage'

export default function History() {
  const [attempts, setAttempts] = useState(() => loadAttempts())

  function handleClear() {
    if (window.confirm('Are you sure you want to clear all past attempts?')) {
      clearAttempts()
      setAttempts([])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Past Attempts</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Completed tests stored in this browser (localStorage).
          </p>
        </div>
        {attempts.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
          >
            Clear History
          </button>
        )}
      </div>

      {attempts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No completed attempts yet.{' '}
          <Link to="/" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Start a mock test
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3">Mock Test</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Completed At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => {
                const mock = getMock(attempt.mockId)
                return (
                  <tr
                    key={`${attempt.mockId}-${attempt.completedAt}`}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {mock?.title ?? attempt.mockId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">
                      {attempt.score}/{attempt.total}
                    </td>
                    <td className="px-4 py-3">{attempt.percentage}%</td>
                    <td className="px-4 py-3">{attempt.accuracy}%</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(attempt.completedAt).toLocaleString()}
                      {attempt.timedOut ? (
                        <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                          Auto-submitted
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/test/${attempt.mockId}/result?attempt=${attempt.completedAt}`}
                        className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
