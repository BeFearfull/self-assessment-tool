import { OPTION_LETTERS, type OptionLetter, type Question } from '../types'

interface Props {
  question: Question
  displayNumber: number
  total: number
  selected?: OptionLetter
  onSelect: (letter: OptionLetter) => void
  locked?: boolean
}

export default function QuestionCard({
  question,
  displayNumber,
  total,
  selected,
  onSelect,
  locked = false,
}: Props) {
  // If question contains multi-line code or pseudo-code, render header and code block separately
  const hasCodeBlock = question.question.includes('\n')
  const [promptText, ...codeLines] = hasCodeBlock ? question.question.split('\n') : [question.question]
  const codeContent = codeLines.join('\n')

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Question {displayNumber} of {total}
        </span>
        <span className="text-xs text-slate-400">Section 3: Technical MCQ</span>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold leading-relaxed text-slate-900 dark:text-slate-50 sm:text-xl">
          {promptText}
        </h2>
        {hasCodeBlock && (
          <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-3.5 font-mono text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-emerald-400">
            <code>{codeContent}</code>
          </pre>
        )}
      </div>

      <ul className="mt-6 space-y-3">
        {question.options.map((text, index) => {
          const letter = OPTION_LETTERS[index]
          const isSelected = selected === letter
          return (
            <li key={letter}>
              <button
                type="button"
                id={`opt-${question.id}-${letter}`}
                disabled={locked}
                onClick={() => onSelect(letter)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-400 dark:border-indigo-400 dark:bg-indigo-950/60'
                    : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-400 dark:hover:bg-slate-700'
                } ${locked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-600'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm leading-6 text-slate-800 dark:text-slate-100 sm:text-base">
                  {text}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
