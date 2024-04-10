import { TestType } from './utils'

export interface IAbacusSettingsData {
  id?: string
  totalQuestions: number
  minCount: number
  maxCount: number
  minNumber: number
  maxNumber: number
  minAnswer: number
  maxAnswer: number
  maxRetries: number
  timeLimit: number
  timeLimitPerQuestion: number
}
export interface IAbacusSettings {
  id: string
  type: TestType
  settings: IAbacusSettingsData
}

export const INIT_ABACUS_SETTINGS: IAbacusSettingsData = {
  totalQuestions: 50,
  minCount: 3,
  maxCount: 6,
  minNumber: 1,
  maxNumber: 9,
  minAnswer: 0,
  maxAnswer: 100,
  maxRetries: 15,
  timeLimit: 8,
  timeLimitPerQuestion: 15,
}

export interface IAbacusQuestionSummary {
  isCorrect: boolean
  questionLength: number
  isSkipped: boolean
}
export interface IAbacusQuestionData {
  id?: number
  question: number[]
  choices: number[]
  answer: number
}

export interface IAbacusTestSummary {
  id: string
  type: string
  dateShort: string
  timeTaken: number
  totalQuestions: number
  correctAnswers: number
  skipped: number
  wrongAnswers: number
  avgTimePerQuestion: number
  avgTargetTimePerQuestion: number
  avgWrongAnswers: number
  avgCorrectAnswers: number
  avgSkippedAnswers: number
}
export interface IAbacusTestData {
  id: string
  type: string
  createdAt: string
  updatedAt: string
  questions: IAbacusQuestionData[]
  answers: { value: string }[]
  summary?: IAbacusTestSummary
}

export interface IAbacusDailyTestSummary {
  dateShort: string
  totalQuestions: number
  correctAnswers: number
  skipped: number
  wrongAnswers: number
  totalTests: number
}

export interface IAbacusCollectiveTestSummary {
  timeSeries: IAbacusTestSummary[]
  dailySeries: IAbacusDailyTestSummary[]
}
