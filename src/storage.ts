import type { AttemptResult, TestSession } from './types'

const SESSION_PREFIX = 'mcq_session_'
const ATTEMPTS_KEY = 'mcq_attempts'
const THEME_KEY = 'mcq_theme'

export function sessionKey(mockId: string) {
  return `${SESSION_PREFIX}${mockId}`
}

export function loadSession(mockId: string): TestSession | null {
  try {
    const raw = localStorage.getItem(sessionKey(mockId))
    return raw ? (JSON.parse(raw) as TestSession) : null
  } catch {
    return null
  }
}

export function saveSession(session: TestSession) {
  localStorage.setItem(sessionKey(session.mockId), JSON.stringify(session))
}

export function clearSession(mockId: string) {
  localStorage.removeItem(sessionKey(mockId))
}

export function loadAttempts(): AttemptResult[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    return raw ? (JSON.parse(raw) as AttemptResult[]) : []
  } catch {
    return []
  }
}

export function saveAttempt(attempt: AttemptResult) {
  const all = loadAttempts()
  all.unshift(attempt)
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(all))
  localStorage.setItem(`mcq_result_${attempt.mockId}`, JSON.stringify(attempt))
}

export function getLatestAttempt(mockId: string): AttemptResult | undefined {
  return loadAttempts().find((a) => a.mockId === mockId)
}

export function getAttemptByTimestamp(mockId: string, timestamp: number): AttemptResult | undefined {
  return loadAttempts().find((a) => a.mockId === mockId && a.completedAt === timestamp)
}

export function clearAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY)
}

export function loadTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function saveTheme(theme: 'light' | 'dark') {
  localStorage.setItem(THEME_KEY, theme)
}

export function shuffleIds(ids: number[]): number[] {
  const copy = [...ids]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
