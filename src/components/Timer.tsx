interface Props {
  remainingSeconds: number
}

function formatTime(total: number) {
  const safe = Math.max(0, total)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer({ remainingSeconds }: Props) {
  const urgent = remainingSeconds <= 60
  const warning = remainingSeconds <= 5 * 60

  return (
    <div
      id="test-timer"
      className={`rounded-xl px-4 py-2 font-mono text-lg font-bold tabular-nums ${
        urgent
          ? 'bg-red-600 text-white'
          : warning
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
      }`}
      aria-live="polite"
    >
      {formatTime(remainingSeconds)}
    </div>
  )
}
