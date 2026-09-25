import { Link } from 'react-router-dom'
import { MOCKS } from '../data'
import { getLatestAttempt, loadSession } from '../storage'

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Technical MCQ Mock Tests
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Section 3 only — Technical MCQ, mixed topics. No instant feedback. Submit (or wait for the
          timer) to see your score, accuracy, and a full answer review.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCKS.map((mock) => {
          const latest = getLatestAttempt(mock.id)
          const inProgress = loadSession(mock.id)
          const attempted = Boolean(latest)
          return (
            <article
              key={mock.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{mock.title}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    attempted
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {attempted ? 'Attempted' : 'Not attempted'}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{mock.section}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {mock.questions.length} questions · {mock.durationMinutes} min
              </p>
              {latest && (
                <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Last score: {latest.score}/{latest.total} ({latest.percentage}%)
                </p>
              )}
              {inProgress && (
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">In progress — resume saved</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  id={`btn-start-${mock.id}`}
                  to={`/test/${mock.id}`}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  {inProgress ? 'Resume' : 'Start'}
                </Link>
                {latest && (
                  <>
                    <Link
                      id={`btn-result-${mock.id}`}
                      to={`/test/${mock.id}/result`}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      View result
                    </Link>
                    <Link
                      id={`btn-retake-${mock.id}`}
                      to={`/test/${mock.id}?retake=1`}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Retake
                    </Link>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
