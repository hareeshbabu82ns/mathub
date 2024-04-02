import { differenceInSeconds, format } from 'date-fns'
import {
  IAbacusCollectiveTestSummary,
  IAbacusDailyTestSummary,
  IAbacusQuestionData,
  IAbacusQuestionSummary,
  IAbacusTestData,
  IAbacusTestSummary,
} from './abacus_types'

export const abacusTestQuestionSummary = (
  data: IAbacusQuestionData,
  answerPicked: string,
) => {
  const isCorrect = answerPicked !== '' && Number(answerPicked) === data.answer

  return {
    isCorrect,
    questionLength: data.question.length,
    isSkipped: answerPicked === '',
  } satisfies IAbacusQuestionSummary
}

export const abacusTestSummary = (data: IAbacusTestData) => {
  const timeTaken = differenceInSeconds(
    new Date(data.updatedAt),
    new Date(data.createdAt),
  )
  const totalQuestions = data.questions.length
  const testSummary: IAbacusQuestionSummary[] = data.questions.map((q, i) =>
    abacusTestQuestionSummary(q, data.answers[i].value),
  )

  const correctAnswers = testSummary.reduce(
    (acc, q) => (q.isCorrect ? acc + 1 : acc),
    0,
  )
  const skipped = testSummary.reduce(
    (acc, q) => (q.isSkipped ? acc + 1 : acc),
    0,
  )
  const wrongAnswers = totalQuestions - correctAnswers - skipped
  const avgTimePerQuestion = Math.round(timeTaken / (totalQuestions - skipped))
  const avgWrongAnswers = Math.round(
    (100 / (totalQuestions - skipped)) * wrongAnswers,
  )
  const avgCorrectAnswers = Math.round(
    (100 / (totalQuestions - skipped)) * correctAnswers,
  )
  const avgSkippedAnswers = Math.round((100 / totalQuestions) * skipped)
  const avgTargetTimePerQuestion = Math.round(480 / 100)

  return {
    id: data.id,
    dateShort: format(data.createdAt, 'MMM dd'),
    timeTaken,
    totalQuestions,
    correctAnswers,
    skipped,
    wrongAnswers,
    avgTimePerQuestion,
    avgTargetTimePerQuestion,
    avgWrongAnswers,
    avgCorrectAnswers,
    avgSkippedAnswers,
  } satisfies IAbacusTestSummary
}

export const collectiveSummary = (data: IAbacusTestData[] = []) => {
  const dailySeriesMap = new Map<string, IAbacusDailyTestSummary>()
  const timeSeries = data.map((test) => {
    const summary = abacusTestSummary(test)
    // console.log(`collectiveSummary: ${i}: Math.round((100 / ${numOfQs}) * ${diff}) = ${normalizedValue}`)

    const dailySummary = dailySeriesMap.get(summary.dateShort)
    if (dailySummary) {
      dailySummary.totalQuestions += summary.totalQuestions
      dailySummary.correctAnswers += summary.correctAnswers
      dailySummary.skipped += summary.skipped
      dailySummary.wrongAnswers += summary.wrongAnswers
      dailySummary.totalTests += 1
    } else {
      dailySeriesMap.set(summary.dateShort, {
        dateShort: summary.dateShort,
        totalQuestions: summary.totalQuestions,
        correctAnswers: summary.correctAnswers,
        skipped: summary.skipped,
        wrongAnswers: summary.wrongAnswers,
        totalTests: 1,
      })
    }

    return {
      ...summary,
    }
  })

  const dailySeries = Array.from(dailySeriesMap.values())

  return {
    timeSeries,
    dailySeries,
  } satisfies IAbacusCollectiveTestSummary
}
