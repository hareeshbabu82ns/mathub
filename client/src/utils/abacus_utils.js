// const crypto = require('crypto');

import moment from 'moment';
import { remainingDurationFormat } from './formatting';

// function getCryptoRandomNumber(min, max) {
//   const randomBytes = crypto.randomBytes(4);
//   const randomInt = (randomBytes.readUInt32BE(0) / 0x100000000) * (max - min + 1) + min;
//   return Math.floor(randomInt);
// }
// const getMathRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// const random = seedRandom(Math.random() * 10000);

// Helper function to generate random number within constraints
export function generateRandomNumber({ min = 0, max = 10, maxRetries = 5, zeroAllowed = false }) {
  let retries = 0;
  let randomNumber = 0;

  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (zeroAllowed || randomNumber !== 0) {
      return randomNumber;
    }

    retries++;
  } while (retries < maxRetries);

  return randomNumber + 1;
}

export function generateRandomLengthNumber({
  minLengthOfDigits = 1,
  maxLengthOfDigits = 2,
  minNumber,
  maxNumber,
  zeroAllowed = false,
  negativesAllowed = false,
  maxRetries = 5,
}) {
  let retries = 0;
  let randomNumber = 0;

  const min = Math.pow(10, minLengthOfDigits - 1);
  const max = Math.pow(10, maxLengthOfDigits) - 1;
  const sign = negativesAllowed ? (Math.random() < 0.5 ? -1 : 1) : 1;

  if (minNumber && (minNumber < min || minNumber > max || minNumber > maxNumber)) {
    throw new Error('minNumber should be between min and max');
  }
  if (maxNumber && (maxNumber < min || maxNumber > max)) {
    throw new Error('maxNumber should be between min and max');
  }

  const minNum = Math.max(min, minNumber || min);
  const maxNum = Math.min(max, maxNumber || max);

  do {
    // randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    randomNumber = generateRandomNumber({ min: minNum, max: maxNum, zeroAllowed, maxRetries });

    const lengthOfNumber = randomNumber.toString().length;

    if (
      lengthOfNumber >= minLengthOfDigits &&
      lengthOfNumber <= maxLengthOfDigits &&
      (zeroAllowed || randomNumber !== 0) &&
      (negativesAllowed || randomNumber > 0)
    ) {
      return randomNumber * sign;
    }

    retries++;
  } while (retries < maxRetries);

  return randomNumber + 1;
}

function isValidRandom({
  numbers,
  randomNumber,
  minSum,
  maxSum,
  index,
  count,
  minLengthOfDigits,
  maxLengthOfDigits,
}) {
  if (randomNumber === 0 || maxSum - randomNumber === 0) return false;
  // if (Math.abs(randomNumber) > Math.round((maxSum - minSum) / 4)) return false;
  // if (Math.abs(randomNumber) > Math.round((maxSum - minSum) * 0.3)) return false;
  const numLength = Math.abs(randomNumber).toString().length;
  if (numLength < minLengthOfDigits || numLength > maxLengthOfDigits) {
    console.log('numLength', numLength, minLengthOfDigits, maxLengthOfDigits);
    return false;
  }

  if (numbers.length === 0 && randomNumber <= 0) return false;
  // check sum of previous number and current number less than 0
  // if (numbers.length > 0 && numbers[numbers.length - 1] + randomNumber < 0) return false;

  //check for repeating numbers more than 2 times
  if (numbers.length > 1 && Math.abs(numbers[numbers.length - 1]) === Math.abs(randomNumber))
    return false;

  const sum = numbers.reduce((acc, num) => acc + num, randomNumber);
  if (sum > maxSum) return false;
  if (sum < 0) {
    // console.log('sum', sum);
    return false;
  }
  if (index === count && sum < minSum) return false;
  // if (maxSum - randomNumber < minSum) return false;
  return true;
}

export function generateAbacusNumbers({
  minCount = 3,
  maxCount = 6,
  minLengthOfDigits = 1,
  maxLengthOfDigits = 1,
  maxNumber: maxDigit,
  minSum,
  maxSum,
  negativesAllowed = true,
  maxRetries = 15,
}) {
  let numbers = [];

  if (minLengthOfDigits < 1 || maxLengthOfDigits < 1 || minLengthOfDigits > maxLengthOfDigits) {
    throw new Error(
      'minLengthOfDigits and maxLengthOfDigits should be greater than 0 and minLengthOfDigits <= maxLengthOfDigits',
    );
  } else if (minSum > maxSum) {
    throw new Error('minSum should be less than or equal to maxSum');
  } else if (minCount < 1 || maxCount < 1 || minCount > maxCount) {
    throw new Error('minCount and maxCount should be greater than 0 and minCount <= maxCount');
  }

  // find min and max numbers based on minLengthOfDigits and maxLengthOfDigits
  const minNumber = Math.pow(10, minLengthOfDigits - 1);
  // const minNumber = minLengthOfDigits === 1 ? 1 : Math.pow(10, minLengthOfDigits - 1);
  const maxNumber = Math.pow(10, maxLengthOfDigits) - 1;

  if (maxDigit && (maxDigit > maxNumber || maxDigit < minNumber)) {
    throw new Error(`maxDigit ${maxDigit} should be between ${minNumber} and ${maxNumber}`);
  }

  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

  for (let i = 0; i < count; i++) {
    let randomNumber = 0,
      retryCount = 0;
    do {
      // if (retryCount > 0)
      //   console.log(
      //     `retrying ${retryCount} randomNumber: ${randomNumber} remainingSum: ${maxSum} diff: ${
      //       maxSum - randomNumber
      //     }`,
      //   );

      randomNumber = generateRandomLengthNumber({
        minLengthOfDigits,
        maxLengthOfDigits,
        minNumber: minNumber,
        maxNumber: Math.min(maxDigit, maxNumber),
        // minNumber: negativesAllowed ? -maxDigit : 1,
        // maxNumber: maxDigit,
        negativesAllowed: negativesAllowed && i !== 0,
      });
      if (randomNumber !== 0 && i === count - 1) {
        // last number
        const sum = numbers.reduce((acc, num) => acc + num, randomNumber);
        if (sum > maxSum) {
          // console.log('last number before', randomNumber);
          randomNumber = randomNumber - (sum - maxSum);
          // console.log('last number after', randomNumber);
        } else if (sum < minSum) {
          // console.log('last number before', randomNumber);
          randomNumber = randomNumber + (minSum - sum);
          // console.log('last number after', randomNumber);
        }

        const len = Math.abs(randomNumber).toString().length;
        if (len > maxLengthOfDigits) {
          // console.log('last number before', randomNumber);
          randomNumber = Math.floor(randomNumber / Math.pow(10, len - maxLengthOfDigits));
        } else if (len < minLengthOfDigits) {
          // console.log('last number before', randomNumber);
          randomNumber = Math.floor(randomNumber * Math.pow(10, minLengthOfDigits - len));
        }
      }
      retryCount++;
    } while (
      !isValidRandom({
        numbers,
        randomNumber,
        minSum,
        maxSum,
        index: i,
        count,
        minLengthOfDigits,
        maxLengthOfDigits,
      }) &&
      retryCount < maxRetries
    );
    numbers.push(randomNumber);
    // remainingSum -= randomNumber;
  }

  return numbers;
}

export const ABACUS_SETTINGS_DEFAULT = {
  totalQuestions: 10,
  minCount: 3,
  maxCount: 6,
  minLengthOfDigits: 1,
  maxLengthOfDigits: 1,
  maxNumber: 9,
  minSum: 0,
  maxSum: 100,
  isNegativeAllowed: true,
  maxRetries: 15,
};

export function generateAbacusQuestions({
  totalQuestions = 10,
  minCount = 3,
  maxCount = 6,
  minLengthOfDigits = 1,
  maxLengthOfDigits = 1,
  maxNumber,
  minSum,
  maxSum,
  isNegativeAllowed = true,
  maxRetries = 15,
}) {
  const questions = [];
  for (let i = 0; i < totalQuestions; i++) {
    let numbers;

    let retries = 0;
    do {
      numbers = generateAbacusNumbers({
        minCount,
        maxCount,
        minLengthOfDigits,
        maxLengthOfDigits,
        maxNumber,
        minSum,
        maxSum,
        isNegativeAllowed,
        maxRetries,
      });

      // check if numbers sum ever goes below zero
      let sum = 0;
      const hasNegative = numbers.some((num, index, arr) => {
        sum += num;
        if (sum < 0) {
          // console.log('sum < 0', sum, arr);
          return true;
        }
        return false;
      });
      retries++;
      if (!hasNegative) break;
    } while (retries < maxRetries);

    questions.push({
      question: numbers,
      answer: numbers.reduce((acc, num) => acc + num, 0),
    });
  }
  return questions;
}

export const collectiveSummary = (testData = []) => {
  const timeSeries = testData.map((d, i) => {
    const diff = moment(d.updatedAt).diff(d.createdAt, 'seconds');
    const numOfQs = d.questions.length;
    const normalizedValue = Math.round((100 / numOfQs) * diff);
    // console.log(`collectiveSummary: ${i}: Math.round((100 / ${numOfQs}) * ${diff}) = ${normalizedValue}`)

    return {
      time: moment(d.createdAt).format('MMM DD'),
      value: normalizedValue,
    };
  });

  return {
    timeSeries,
  };
};

export const summary = (testData) => {
  const { answers, questions, createdAt, updatedAt, type } = testData;

  const correctAnswers = questions.filter((q, i) => q.result === Number(answers[i]?.value));
  const testTimeDiff = remainingDurationFormat(moment(updatedAt).diff(createdAt, 'seconds'));

  const operations = new Set();
  const operationWise = {};
  const defaultOpSummary = {
    operation: '',
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
  };

  questions.forEach((q, i) => {
    operations.add(q.operation || q.operator1);
    const opWise = operationWise[q.operation || q.operator1] || { ...defaultOpSummary };

    opWise.operation = q.operation || q.operator1;
    opWise.totalQuestions = opWise.totalQuestions + 1;
    if (q.result === Number(answers[i]?.value)) opWise.correctAnswers = opWise.correctAnswers + 1;

    opWise.wrongAnswers = opWise.totalQuestions - opWise.correctAnswers;

    operationWise[q.operation || q.operator1] = opWise;
  });

  return {
    totalQuestions: questions.length,
    wrongAnswers: questions.length - correctAnswers.length,
    correctAnswers: correctAnswers.length,
    testTimeDiff,
    operations: [...operations].sort(),
    operationWise,
    type,
  };
};
