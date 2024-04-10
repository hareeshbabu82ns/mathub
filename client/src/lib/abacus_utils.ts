import { differenceInSeconds, format } from 'date-fns'
import {
  IAbacusCollectiveTestSummary,
  IAbacusDailyTestSummary,
  IAbacusQuestionData,
  IAbacusQuestionSummary,
  IAbacusTestData,
  IAbacusTestSummary,
} from './abacus_types'
import { generateRandomNumber } from './utils'

export function isMinusBigFriends(sum: number, randomNumber: number) {
  // for each digit in randomNumber, if its grater than equals 5, corresponding digit in sum should be graeter than equals 5
  // example: sum = 1295, randomNumber = 675, 0 <= 1 (false), 6 >= 2 (true), 7 <= 9 (false), 5 >= 5 (false)
  if (randomNumber >= 0) return false
  const sumStr = sum.toString()
  const randomNumberStr = Math.abs(randomNumber)
    .toString()
    .padStart(sumStr.length, '0')
  for (let i = 0; i < randomNumberStr.length; i++) {
    const numSum = Number(sumStr[i])
    const numRandom = Number(randomNumberStr[i])
    if (numRandom > numSum) {
      return true
    } else if (numSum % 5 < numRandom % 5) {
      return true
    }
  }
  return false
}

function isValidRandom({
  numbers,
  randomNumber,
  minAnswer,
  maxAnswer,
  index,
  count,
  minNumber,
  maxNumber,
}: {
  numbers: number[]
  randomNumber: number
  minAnswer: number
  maxAnswer: number
  index: number
  count: number
  minNumber: number
  maxNumber: number
}) {
  if (randomNumber === 0 || maxAnswer - randomNumber === 0) return false
  if (randomNumber < minNumber || randomNumber > maxNumber) return false

  //check for repeating numbers more than 2 times
  if (
    numbers.length > 1 &&
    Math.abs(numbers[numbers.length - 1]) === Math.abs(randomNumber)
  )
    return false

  const sum = numbers.reduce((acc, num) => acc + num, randomNumber)
  if (sum < 0 || sum > maxAnswer) return false
  // Temp: avoid -BigFriends as Laasya is not comfortable with it
  if (isMinusBigFriends(sum - randomNumber, randomNumber)) return false

  if (index === count && sum < minAnswer) return false
  // if (maxAnswer - randomNumber < minAnswer) return false;
  return true
}

export function generateAbacusNumbers({
  minCount = 3,
  maxCount = 6,
  minNumber = 1,
  maxNumber,
  minAnswer = 0,
  maxAnswer,
  maxRetries = 15,
}: {
  minCount?: number
  maxCount?: number
  minNumber?: number
  maxNumber: number
  minAnswer?: number
  maxAnswer: number
  maxRetries?: number
}) {
  const numbers: number[] = []

  if (minNumber > maxNumber) {
    throw new Error('maxNumber should be greater than minNumber')
  } else if (minAnswer > maxAnswer) {
    throw new Error('minAnswer should be less than or equal to maxAnswer')
  } else if (minCount < 1 || maxCount < 1 || minCount > maxCount) {
    throw new Error(
      'minCount and maxCount should be greater than 0 and minCount <= maxCount',
    )
  }

  const count = generateRandomNumber({ min: minCount, max: maxCount })

  for (let i = 0; i < count; i++) {
    let randomNumber = 0
    let retryCount = 0
    // const sum = numbers.reduce((acc, num) => acc + num, 0)
    for (; retryCount < maxRetries; retryCount++) {
      randomNumber = generateRandomNumber({
        min: minNumber,
        max: maxNumber,
      })
      // if (randomNumber !== 0 && i === count - 1) {
      //   // last number
      //   const sumWithRandomNumber = sum + randomNumber
      //   if (sumWithRandomNumber > maxAnswer) {
      //     // console.log('last number before', randomNumber);
      //     randomNumber = randomNumber - (sumWithRandomNumber - maxAnswer)
      //     // console.log('last number after', randomNumber);
      //   } else if (sumWithRandomNumber < minAnswer) {
      //     // console.log('last number before', randomNumber);
      //     randomNumber = randomNumber + (minAnswer - sumWithRandomNumber)
      //     // console.log('last number after', randomNumber);
      //   }
      // }

      const isValidNumber = isValidRandom({
        numbers,
        randomNumber,
        minAnswer,
        maxAnswer,
        index: i,
        count,
        minNumber,
        maxNumber,
      })

      if (isValidNumber) {
        numbers.push(randomNumber)
        break
      }
    }
    // remainingSum -= randomNumber;
    // if (retryCount >= maxRetries) {
    // console.log(
    //   'generateAbacusNumbers: retryMax',
    //   retryCount,
    //   minNumber,
    //   maxNumber,
    //   randomNumber,
    // )
    // }
  }

  return numbers
}

export function generateAbacusQuestions({
  totalQuestions = 10,
  minCount = 3,
  maxCount = 6,
  minNumber = 1,
  maxNumber,
  minAnswer = 0,
  maxAnswer,
  maxRetries = 15,
}: {
  totalQuestions?: number
  minCount?: number
  maxCount?: number
  minNumber?: number
  maxNumber: number
  minAnswer?: number
  maxAnswer: number
  maxRetries?: number
}) {
  const questions: IAbacusQuestionData[] = []
  for (let i = 0; i < totalQuestions; i++) {
    let numbers

    let retries = 0
    do {
      numbers = generateAbacusNumbers({
        minCount,
        maxCount,
        minNumber,
        maxNumber,
        minAnswer,
        maxAnswer,
        maxRetries,
      })

      // check if numbers sum ever goes below zero
      let sum = 0
      const hasNegative = numbers.some((num) => {
        sum += num
        if (sum < 0) {
          // console.log('sum < 0', sum, arr);
          return true
        }
        return false
      })
      retries++
      if (!hasNegative) break
    } while (retries < maxRetries)

    // generate answers randomly and add sum to the answers in random place
    const randomIndex = Math.round(Math.random() * 100) % 4
    const answer = numbers.reduce((acc, num) => acc + num, 0)
    const min = Math.max(0, answer - 10)
    const max = Math.min(maxAnswer, min + answer + 10)
    const choices: number[] = []
    Array(4)
      .fill(0)
      .forEach((_, index) => {
        if (index === randomIndex) {
          choices.push(answer)
        } else {
          let retries = 0
          let randomNumber = 0
          do {
            randomNumber = generateRandomNumber({
              min,
              max,
              zeroAllowed: true,
              maxRetries,
            })
            retries++
            if (!choices.includes(randomNumber) || randomNumber !== answer)
              break
          } while (retries < maxRetries)
          choices.push(randomNumber)
        }
      })

    questions.push({
      question: numbers,
      choices,
      answer,
    })
  }
  return questions
}

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

export const abacusTestSummary = (data: Omit<IAbacusTestData, 'summary'>) => {
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
    type: data.type,
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
    const summary = test?.summary
      ? { ...test.summary, id: test.id }
      : abacusTestSummary(test)
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
