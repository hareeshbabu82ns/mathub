import moment from "moment"
import { remainingDurationFormat } from "./formatting"

export const summary = (testData) => {
  const { answers, questions, createdAt, updatedAt, type } = testData

  const correctAnswers = questions.filter((q, i) => q.result === Number(answers[i]?.value))
  const testTimeDiff = remainingDurationFormat(moment(updatedAt).diff(createdAt, 'seconds'))

  const operations = new Set()
  const operationWise = {}
  const defaultOpSummary = {
    operation: '',
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
  }

  questions.forEach((q, i) => {
    operations.add(q.operation)
    const opWise = operationWise[q.operation] || { ...defaultOpSummary }

    opWise.operation = q.operation
    opWise.totalQuestions = opWise.totalQuestions + 1
    if (q.result === Number(answers[i]?.value))
      opWise.correctAnswers = opWise.correctAnswers + 1

    opWise.wrongAnswers = opWise.totalQuestions - opWise.correctAnswers

    operationWise[q.operation] = opWise
  })


  return {
    totalQuestions: questions.length,
    wrongAnswers: questions.length - correctAnswers.length,
    correctAnswers: correctAnswers.length,
    testTimeDiff,
    operations: [...operations].sort(),
    operationWise,
    type,
  }
}

export const collectiveSummary = (testData = []) => {

  const timeSeries = testData.map((d, i) => {
    const diff = moment(d.updatedAt).diff(d.createdAt, 'seconds')
    const numOfQs = d.questions.length
    const normalizedValue = Math.round((100 / numOfQs) * diff)
    // console.log(`collectiveSummary: ${i}: Math.round((100 / ${numOfQs}) * ${diff}) = ${normalizedValue}`)

    return {
      time: moment(d.createdAt).format('MMM DD'),
      value: normalizedValue,
    }
  })

  return {
    timeSeries,
  }
}

