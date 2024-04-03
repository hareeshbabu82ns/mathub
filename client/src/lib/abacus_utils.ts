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
  if (sum > maxAnswer) return false
  if (sum < 0) {
    // console.log('sum', sum);
    return false
  }
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
  const numbers = []

  if (minNumber > maxNumber) {
    throw new Error('maxNumber should be greater than minNumber')
  } else if (minAnswer > maxAnswer) {
    throw new Error('minAnswer should be less than or equal to maxAnswer')
  } else if (minCount < 1 || maxCount < 1 || minCount > maxCount) {
    throw new Error(
      'minCount and maxCount should be greater than 0 and minCount <= maxCount',
    )
  }

  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount

  for (let i = 0; i < count; i++) {
    let randomNumber = 0,
      retryCount = 0
    do {
      randomNumber = generateRandomNumber({
        min: minNumber,
        max: maxNumber,
      })
      if (randomNumber !== 0 && i === count - 1) {
        // last number
        const sum = numbers.reduce((acc, num) => acc + num, randomNumber)
        if (sum > maxAnswer) {
          // console.log('last number before', randomNumber);
          randomNumber = randomNumber - (sum - maxAnswer)
          // console.log('last number after', randomNumber);
        } else if (sum < minAnswer) {
          // console.log('last number before', randomNumber);
          randomNumber = randomNumber + (minAnswer - sum)
          // console.log('last number after', randomNumber);
        }

        // const len = Math.abs(randomNumber).toString().length
        // if (len > maxLengthOfDigits) {
        //   // console.log('last number before', randomNumber);
        //   randomNumber = Math.floor(
        //     randomNumber / Math.pow(10, len - maxLengthOfDigits),
        //   )
        // } else if (len < minLengthOfDigits) {
        //   // console.log('last number before', randomNumber);
        //   randomNumber = Math.floor(
        //     randomNumber * Math.pow(10, minLengthOfDigits - len),
        //   )
        // }
      }
      retryCount++
    } while (
      !isValidRandom({
        numbers,
        randomNumber,
        minAnswer,
        maxAnswer,
        index: i,
        count,
        minNumber,
        maxNumber,
      }) &&
      retryCount < maxRetries
    )
    numbers.push(randomNumber)
    // remainingSum -= randomNumber;
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
    const randomIndex = Math.floor(Math.random() * 1000) % 4
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

// function isValidRandom({
//   numbers,
//   randomNumber,
//   minAnswer,
//   maxAnswer,
//   index,
//   count,
//   minLengthOfDigits,
//   maxLengthOfDigits,
// }: {
//   numbers: number[]
//   randomNumber: number
//   minAnswer: number
//   maxAnswer: number
//   index: number
//   count: number
//   minLengthOfDigits: number
//   maxLengthOfDigits: number
// }) {
//   if (randomNumber === 0 || maxAnswer - randomNumber === 0) return false
//   // if (Math.abs(randomNumber) > Math.round((maxAnswer - minAnswer) / 4)) return false;
//   // if (Math.abs(randomNumber) > Math.round((maxAnswer - minAnswer) * 0.3)) return false;
//   const numLength = Math.abs(randomNumber).toString().length
//   if (numLength < minLengthOfDigits || numLength > maxLengthOfDigits) {
//     console.log('numLength', numLength, minLengthOfDigits, maxLengthOfDigits)
//     return false
//   }

//   if (numbers.length === 0 && randomNumber <= 0) return false
//   // check sum of previous number and current number less than 0
//   // if (numbers.length > 0 && numbers[numbers.length - 1] + randomNumber < 0) return false;

//   //check for repeating numbers more than 2 times
//   if (
//     numbers.length > 1 &&
//     Math.abs(numbers[numbers.length - 1]) === Math.abs(randomNumber)
//   )
//     return false

//   const sum = numbers.reduce((acc, num) => acc + num, randomNumber)
//   if (sum > maxAnswer) return false
//   if (sum < 0) {
//     // console.log('sum', sum);
//     return false
//   }
//   if (index === count && sum < minAnswer) return false
//   // if (maxAnswer - randomNumber < minAnswer) return false;
//   return true
// }

// export function generateAbacusNumbers({
//   minCount = 3,
//   maxCount = 6,
//   minLengthOfDigits = 1,
//   maxLengthOfDigits = 1,
//   minNumber: minDigit = 1,
//   maxNumber: maxDigit,
//   minAnswer,
//   maxAnswer,
//   negativesAllowed = true,
//   maxRetries = 15,
// }: {
//   minCount?: number
//   maxCount?: number
//   minLengthOfDigits?: number
//   maxLengthOfDigits?: number
//   minNumber?: number
//   maxNumber: number
//   minAnswer: number
//   maxAnswer: number
//   negativesAllowed?: boolean
//   maxRetries?: number
// }) {
//   const numbers = []

//   if (
//     minLengthOfDigits < 1 ||
//     maxLengthOfDigits < 1 ||
//     minLengthOfDigits > maxLengthOfDigits
//   ) {
//     throw new Error(
//       'minLengthOfDigits and maxLengthOfDigits should be greater than 0 and minLengthOfDigits <= maxLengthOfDigits',
//     )
//   } else if (minAnswer > maxAnswer) {
//     throw new Error('minAnswer should be less than or equal to maxAnswer')
//   } else if (minCount < 1 || maxCount < 1 || minCount > maxCount) {
//     throw new Error(
//       'minCount and maxCount should be greater than 0 and minCount <= maxCount',
//     )
//   }

//   // find min and max numbers based on minLengthOfDigits and maxLengthOfDigits
//   const minNumber = Math.pow(10, minLengthOfDigits - 1)
//   // const minNumber = minLengthOfDigits === 1 ? 1 : Math.pow(10, minLengthOfDigits - 1);
//   const maxNumber = Math.pow(10, maxLengthOfDigits) - 1

//   if (maxDigit && (maxDigit > maxNumber || maxDigit < minNumber)) {
//     throw new Error(
//       `maxDigit ${maxDigit} should be between ${minNumber} and ${maxNumber}`,
//     )
//   }

//   if (minDigit && (minDigit > maxNumber || minDigit < minNumber)) {
//     throw new Error(
//       `minDigit ${minDigit} should be between ${minNumber} and ${maxNumber}`,
//     )
//   }

//   const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount

//   for (let i = 0; i < count; i++) {
//     let randomNumber = 0,
//       retryCount = 0
//     do {
//       // if (retryCount > 0)
//       //   console.log(
//       //     `retrying ${retryCount} randomNumber: ${randomNumber} remainingSum: ${maxAnswer} diff: ${
//       //       maxAnswer - randomNumber
//       //     }`,
//       //   );

//       randomNumber = generateRandomLengthNumber({
//         minLengthOfDigits,
//         maxLengthOfDigits,
//         minNumber: minNumber,
//         maxNumber: Math.min(maxDigit, maxNumber),
//         // minNumber: negativesAllowed ? -maxDigit : 1,
//         // maxNumber: maxDigit,
//         negativesAllowed: negativesAllowed && i !== 0,
//       })
//       if (randomNumber !== 0 && i === count - 1) {
//         // last number
//         const sum = numbers.reduce((acc, num) => acc + num, randomNumber)
//         if (sum > maxAnswer) {
//           // console.log('last number before', randomNumber);
//           randomNumber = randomNumber - (sum - maxAnswer)
//           // console.log('last number after', randomNumber);
//         } else if (sum < minAnswer) {
//           // console.log('last number before', randomNumber);
//           randomNumber = randomNumber + (minAnswer - sum)
//           // console.log('last number after', randomNumber);
//         }

//         const len = Math.abs(randomNumber).toString().length
//         if (len > maxLengthOfDigits) {
//           // console.log('last number before', randomNumber);
//           randomNumber = Math.floor(
//             randomNumber / Math.pow(10, len - maxLengthOfDigits),
//           )
//         } else if (len < minLengthOfDigits) {
//           // console.log('last number before', randomNumber);
//           randomNumber = Math.floor(
//             randomNumber * Math.pow(10, minLengthOfDigits - len),
//           )
//         }
//       }
//       retryCount++
//     } while (
//       !isValidRandom({
//         numbers,
//         randomNumber,
//         minAnswer,
//         maxAnswer,
//         index: i,
//         count,
//         minLengthOfDigits,
//         maxLengthOfDigits,
//       }) &&
//       retryCount < maxRetries
//     )
//     numbers.push(randomNumber)
//     // remainingSum -= randomNumber;
//   }

//   return numbers
// }

// export function generateAbacusQuestions({
//   totalQuestions = 10,
//   minCount = 3,
//   maxCount = 6,
//   minLengthOfDigits = 1,
//   maxLengthOfDigits = 1,
//   maxNumber,
//   minAnswer,
//   maxAnswer,
//   isNegativeAllowed = true,
//   maxRetries = 15,
// }: {
//   totalQuestions: number
//   minCount: number
//   maxCount: number
//   minLengthOfDigits: number
//   maxLengthOfDigits: number
//   maxNumber: number
//   minAnswer: number
//   maxAnswer: number
//   isNegativeAllowed: boolean
//   maxRetries: number
// }) {
//   const questions: IAbacusQuestionData[] = []
//   for (let i = 0; i < totalQuestions; i++) {
//     let numbers

//     let retries = 0
//     do {
//       numbers = generateAbacusNumbers({
//         minCount,
//         maxCount,
//         minLengthOfDigits,
//         maxLengthOfDigits,
//         maxNumber,
//         minAnswer,
//         maxAnswer,
//         negativesAllowed: isNegativeAllowed,
//         maxRetries,
//       })

//       // check if numbers sum ever goes below zero
//       let sum = 0
//       const hasNegative = numbers.some((num) => {
//         sum += num
//         if (sum < 0) {
//           // console.log('sum < 0', sum, arr);
//           return true
//         }
//         return false
//       })
//       retries++
//       if (!hasNegative) break
//     } while (retries < maxRetries)

//     // generate answers randomly and add sum to the answers in random place
//     const randomIndex = Math.floor(Math.random() * 1000) % 4
//     const answer = numbers.reduce((acc, num) => acc + num, 0)
//     const min = Math.max(0, answer - 10)
//     const max = Math.min(maxAnswer, min + answer + 10)
//     const choices: number[] = []
//     Array(4)
//       .fill(0)
//       .forEach((_, index) => {
//         if (index === randomIndex) {
//           choices.push(answer)
//         } else {
//           let retries = 0
//           let randomNumber = 0
//           do {
//             randomNumber = generateRandomNumber({
//               min,
//               max,
//               zeroAllowed: true,
//               maxRetries,
//             })
//             retries++
//             if (!choices.includes(randomNumber) || randomNumber !== answer)
//               break
//           } while (retries < maxRetries)
//           choices.push(randomNumber)
//         }
//       })

//     questions.push({
//       question: numbers,
//       choices,
//       answer,
//     })
//   }
//   return questions
// }
