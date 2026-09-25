import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import Sidebar from '../components/Sidebar'
import Timer from '../components/Timer'
import { getMock } from '../data'
import {
  clearSession,
  loadSession,
  saveAttempt,
  saveSession,
  shuffleIds,
} from '../storage'
import type { AnswersMap, AttemptResult, OptionLetter, TestSession } from '../types'

function scoreAttempt(
  mockId: string,
  answers: AnswersMap,
  questionOrder: number[],
  shuffle: boolean,
  timedOut: boolean,
  questions: { id: number; correctAnswer: OptionLetter }[],
): AttemptResult {
  let score = 0
  for (const q of questions) {
    if (answers[q.id] === q.correctAnswer) score += 1
  }
  const total = questions.length
  const attempted = Object.keys(answers).length
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100)
  const accuracy = attempted === 0 ? 0 : Math.round((score / attempted) * 100)
  return {
    mockId,
    answers,
    score,
    total,
    percentage,
    accuracy,
    questionOrder,
    shuffle,
    completedAt: Date.now(),
    timedOut,
  }
}

export default function TestPage() {
  const { mockId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mock = getMock(mockId)
  const retake = searchParams.get('retake') === '1'
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const submittedRef = useRef(false)

  useEffect(() => {
    if (retake) {
      navigate(`/test/${mockId}`, { replace: true })
    }
  }, [retake, mockId, navigate])

  const initialSession = useMemo((): TestSession | null => {
    if (!mock) return null
    if (retake) return null
    return loadSession(mock.id)
  }, [mock, retake])

  const shouldShuffle = searchParams.get('shuffle') !== '0'

  const [session, setSession] = useState<TestSession | null>(() => {
    if (!mock) return null
    if (initialSession) return initialSession
    const ids = mock.questions.map((q) => q.id)
    return {
      mockId: mock.id,
      answers: {},
      remainingSeconds: mock.durationMinutes * 60,
      questionOrder: shouldShuffle ? shuffleIds(ids) : ids,
      shuffle: shouldShuffle,
      currentIndex: 0,
      startedAt: Date.now(),
    }
  })
  const sessionRef = useRef(session)
  sessionRef.current = session

  useEffect(() => {
    if (!session || submittedRef.current) return
    saveSession(session)
  }, [session])

  useEffect(() => {
    if (!session || submittedRef.current) return
    const id = window.setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev
        if (prev.remainingSeconds <= 1) {
          return { ...prev, remainingSeconds: 0 }
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 }
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [session?.mockId])

  function finish(timedOut: boolean) {
    const current = sessionRef.current
    if (!mock || !current || submittedRef.current) return
    submittedRef.current = true
    const result = scoreAttempt(
      mock.id,
      current.answers,
      current.questionOrder,
      current.shuffle,
      timedOut,
      mock.questions,
    )
    saveAttempt(result)
    clearSession(mock.id)
    navigate(`/test/${mock.id}/result`, { replace: true })
  }

  useEffect(() => {
    if (session && session.remainingSeconds <= 0) {
      finish(true)
    }
  }, [session?.remainingSeconds])

  // Keyboard navigation for MCQ test
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (confirmSubmit) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return

      const key = e.key.toUpperCase()
      if (key === 'A' || key === '1') selectAnswer('A')
      else if (key === 'B' || key === '2') selectAnswer('B')
      else if (key === 'C' || key === '3') selectAnswer('C')
      else if (key === 'D' || key === '4') selectAnswer('D')
      else if (e.key === 'ArrowRight') {
        setSession((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            currentIndex: Math.min(prev.questionOrder.length - 1, prev.currentIndex + 1),
          }
        })
      } else if (e.key === 'ArrowLeft') {
        setSession((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            currentIndex: Math.max(0, prev.currentIndex - 1),
          }
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [confirmSubmit, session?.currentIndex, session?.questionOrder.length])

  if (!mock) return <Navigate to="/" replace />
  if (!session) return null

  const questionId = session.questionOrder[session.currentIndex]
  const question = mock.questions.find((q) => q.id === questionId)
  if (!question) return <Navigate to="/" replace />

  const answeredCount = Object.keys(session.answers).length
  const progress = Math.round((answeredCount / mock.questions.length) * 100)

  function selectAnswer(letter: OptionLetter) {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: letter },
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            ← All mocks
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{mock.title}</h1>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {session.shuffle ? 'Shuffled' : 'Standard order'}
            </span>
          </div>
          <p className="text-sm text-slate-500">{mock.section} · answers saved locally</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-palette"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold lg:hidden dark:border-slate-600"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            Question Palette
          </button>
          <Timer remainingSeconds={session.remainingSeconds} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>{answeredCount} of {mock.questions.length} answered</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-h-0">
          <div className="max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
            <div className="space-y-2">
              <QuestionCard
                question={question}
                displayNumber={session.currentIndex + 1}
                total={mock.questions.length}
                selected={session.answers[question.id]}
                onSelect={selectAnswer}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  id="btn-prev"
                  disabled={session.currentIndex === 0}
                  onClick={() =>
                    setSession((prev) =>
                      prev ? { ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) } : prev,
                    )
                  }
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                >
                  ← Previous
                </button>
                {session.currentIndex < session.questionOrder.length - 1 ? (
                  <button
                    type="button"
                    id="btn-next"
                    onClick={() =>
                      setSession((prev) =>
                        prev
                          ? {
                              ...prev,
                              currentIndex: Math.min(prev.questionOrder.length - 1, prev.currentIndex + 1),
                            }
                          : prev,
                      )
                    }
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-submit"
                    onClick={() => setConfirmSubmit(true)}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    Submit Test
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  id="btn-submit-quick"
                  onClick={() => setConfirmSubmit(true)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Submit test now
                </button>
                <span className="text-xs text-slate-400">
                  Shortcut: Keys 1–4 or A–D select option · ← → navigate
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            <Sidebar
              total={mock.questions.length}
              currentIndex={session.currentIndex}
              questionIds={session.questionOrder}
              answers={session.answers}
              onJump={(index) => {
                setSession((prev) => (prev ? { ...prev, currentIndex: index } : prev))
                setSidebarOpen(false)
              }}
            />
          </div>
        </div>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900">
            <h2 className="text-lg font-bold">Submit this test?</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {Object.keys(session.answers).length} of {mock.questions.length} questions answered.
              After submit you will see score, percentage, accuracy, and the full review.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                id="btn-modal-cancel"
                onClick={() => setConfirmSubmit(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep going
              </button>
              <button
                type="button"
                id="btn-modal-confirm"
                onClick={() => finish(false)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
