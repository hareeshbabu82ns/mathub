import { TestType } from './utils'

export interface IAbacusSettingsData {
  id?: string
  totalQuestions: number
  minCount: number
  maxCount: number
  minLengthOfDigits: number
  maxLengthOfDigits: number
  minNumber: number
  maxNumber: number
  minSum: number
  maxSum: number
  isNegativeAllowed: boolean
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
  minLengthOfDigits: 1,
  maxLengthOfDigits: 1,
  minNumber: 1,
  maxNumber: 9,
  minSum: 0,
  maxSum: 100,
  isNegativeAllowed: true,
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
  id: number
  question: number[]
  choices: number[]
  answer: number
}

export interface IAbacusTestSummary {
  id: string
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
  createdAt: string
  updatedAt: string
  questions: IAbacusQuestionData[]
  answers: { value: string }[]
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
