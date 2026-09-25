import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import ResultPage from '../components/ResultPage'
import { getMock } from '../data'
import { getAttemptByTimestamp, getLatestAttempt } from '../storage'

export default function ResultRoute() {
  const { mockId = '' } = useParams()
  const [params] = useSearchParams()
  const mock = getMock(mockId)
  const attemptParam = params.get('attempt')
  const result = attemptParam
    ? getAttemptByTimestamp(mockId, Number(attemptParam)) ?? getLatestAttempt(mockId)
    : getLatestAttempt(mockId)

  if (!mock) return <Navigate to="/" replace />
  if (!result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-xl font-bold">No saved result</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Complete this mock first to see score, percentage, and the detailed summary.
        </p>
        <Link
          to={`/test/${mockId}`}
          className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Start test
        </Link>
      </div>
    )
  }

  return (
    <ResultPage
      mock={mock}
      result={result}
      reviewIncorrectOnly={params.get('incorrect') === '1'}
    />
  )
}
