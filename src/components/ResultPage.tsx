import { Link } from 'react-router-dom'
import { OPTION_LETTERS, type AttemptResult, type MockTest } from '../types'

interface Props {
  mock: MockTest
  result: AttemptResult
  reviewIncorrectOnly?: boolean
}

export default function ResultPage({ mock, result, reviewIncorrectOnly = false }: Props) {
  const byId = new Map(mock.questions.map((q) => [q.id, q]))
  const ordered = result.questionOrder
    .map((id) => byId.get(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))

  const items = ordered
    .map((question, index) => {
      const selected = result.answers[question.id]
      const correct = question.correctAnswer
      const isCorrect = selected === correct
      return { question, index, selected, correct, isCorrect }
    })
    .filter((row) => (reviewIncorrectOnly ? !row.isCorrect : true))

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{mock.title}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Results</h1>
        {result.timedOut && (
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            Time ran out — your answers were submitted automatically.
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Total score" value={`${result.score}/${result.total}`} />
          <Stat label="Percentage" value={`${result.percentage}%`} />
          <Stat label="Accuracy" value={`${result.accuracy}%`} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            id="btn-review-incorrect"
            to={`/test/${mock.id}/result?incorrect=1&attempt=${result.completedAt}`}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              reviewIncorrectOnly
                ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                : 'bg-rose-600 text-white hover:bg-rose-500'
            }`}
          >
            Review incorrect questions
          </Link>
          <Link
            id="btn-full-summary"
            to={`/test/${mock.id}/result?attempt=${result.completedAt}`}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              !reviewIncorrectOnly
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-200'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Full summary
          </Link>
          <Link
            id="btn-retake-shuffled"
            to={`/test/${mock.id}?retake=1&shuffle=1`}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Retake (Shuffled)
          </Link>
          <Link
            id="btn-retake-ordered"
            to={`/test/${mock.id}?retake=1&shuffle=0`}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Retake (Standard order)
          </Link>
          <Link
            id="btn-home"
            to="/"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Home
          </Link>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {reviewIncorrectOnly ? 'Incorrect questions' : 'Detailed summary'}
      </h2>
      {items.length === 0 && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          {reviewIncorrectOnly ? 'No incorrect answers — great job.' : 'No questions found.'}
        </p>
      )}
      <div className="space-y-4">
        {items.map(({ question, index, selected, correct, isCorrect }) => (
          <article
            key={question.id}
            className={`rounded-2xl border p-5 dark:bg-slate-900 ${
              isCorrect
                ? 'border-emerald-200 bg-white dark:border-emerald-800'
                : 'border-rose-200 bg-white dark:border-rose-900'
            }`}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-500">Question {index + 1}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isCorrect
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                }`}
              >
                {isCorrect ? '✔ Correct' : '✘ Wrong'}
              </span>
            </div>
            <p className="whitespace-pre-wrap font-medium text-slate-900 dark:text-slate-50">
              {question.question}
            </p>
            <ul className="mt-4 space-y-2">
              {question.options.map((text, optIndex) => {
                const letter = OPTION_LETTERS[optIndex]
                const isCorrectOpt = letter === correct
                const isUser = letter === selected
                return (
                  <li
                    key={letter}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      isCorrectOpt
                        ? 'border-emerald-400 bg-emerald-50 font-medium dark:border-emerald-600 dark:bg-emerald-950/50'
                        : isUser
                          ? 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40'
                          : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="mr-2 font-bold">{letter})</span>
                    {text}
                    {isCorrectOpt && (
                      <span className="ml-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Correct answer
                      </span>
                    )}
                    {isUser && !isCorrectOpt && (
                      <span className="ml-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
                        Your answer
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Your answer: <strong>{selected ?? 'Not attempted'}</strong>
              {' · '}Correct answer: <strong>{correct}</strong>
            </p>

            {question.explanation && (
              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-slate-800 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-slate-200">
                <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-300">
                  <svg className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Explanation</span>
                </div>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">{question.explanation}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}
