import type { AnswersMap } from '../types'

interface Props {
  total: number
  currentIndex: number
  questionIds: number[]
  answers: AnswersMap
  onJump: (index: number) => void
}

export default function Sidebar({
  total,
  currentIndex,
  questionIds,
  answers,
  onJump,
}: Props) {
  const attempted = Object.keys(answers).length

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Questions</h3>
        <span className="text-xs text-slate-500">
          {attempted}/{total} done
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {questionIds.map((qid, index) => {
          const attemptedQ = answers[qid] !== undefined
          const active = index === currentIndex
          return (
            <button
              key={qid}
              id={`sidebar-q-${index + 1}`}
              type="button"
              onClick={() => onJump(index)}
              className={`h-9 rounded-lg text-sm font-semibold transition ${
                active
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                  : ''
              } ${
                attemptedQ
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500" /> Attempted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-slate-300 dark:bg-slate-700" /> Not attempted
        </span>
      </div>
    </aside>
  )
}
