export type OptionLetter = 'A' | 'B' | 'C' | 'D'

export interface Question {
  id: number
  question: string
  options: [string, string, string, string] | string[]
  correctAnswer: OptionLetter
  explanation?: string
}

export interface MockTest {
  id: string
  title: string
  section: string
  durationMinutes: number
  questions: Question[]
}

export type AnswersMap = Record<number, OptionLetter>

export interface TestSession {
  mockId: string
  answers: AnswersMap
  remainingSeconds: number
  questionOrder: number[]
  shuffle: boolean
  currentIndex: number
  startedAt: number
}

export interface AttemptResult {
  mockId: string
  answers: AnswersMap
  score: number
  total: number
  percentage: number
  accuracy: number
  questionOrder: number[]
  shuffle: boolean
  completedAt: number
  timedOut: boolean
}

export const OPTION_LETTERS: OptionLetter[] = ['A', 'B', 'C', 'D']
