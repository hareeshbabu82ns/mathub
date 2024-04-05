import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum TestType {
  Abacus = 'ABACUS',
  Arithmetic = 'ARITHMETIC',
}

export function generateRandomNumber({
  min = 0,
  max = 10,
  maxRetries = 5,
  zeroAllowed = false,
}: {
  min: number
  max: number
  maxRetries?: number
  zeroAllowed?: boolean
}) {
  let retries = 0
  let randomNumber = 0

  const maxNumFactor = Math.pow(10, max.toString().length)

  do {
    // randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    randomNumber =
      (Math.round(Math.random() * maxNumFactor) % (max - min + 1)) + min

    if (zeroAllowed || randomNumber !== 0) {
      return randomNumber
    }

    retries++
  } while (retries < maxRetries)

  return randomNumber + 1
}

export function generateRandomLengthNumber({
  minLengthOfDigits = 1,
  maxLengthOfDigits = 2,
  minNumber,
  maxNumber,
  zeroAllowed = false,
  negativesAllowed = false,
  maxRetries = 5,
}: {
  minLengthOfDigits: number
  maxLengthOfDigits: number
  minNumber?: number
  maxNumber?: number
  zeroAllowed?: boolean
  negativesAllowed?: boolean
  maxRetries?: number
}) {
  let retries = 0
  let randomNumber = 0

  const min = Math.pow(10, minLengthOfDigits - 1)
  const max = Math.pow(10, maxLengthOfDigits) - 1
  const sign = negativesAllowed ? (Math.random() < 0.5 ? -1 : 1) : 1

  if (minNumber && (minNumber < min || minNumber > max)) {
    throw new Error('minNumber should be between min and max')
  }
  if (maxNumber && (maxNumber < min || maxNumber > max)) {
    throw new Error('maxNumber should be between min and max')
  }

  if (minNumber && maxNumber && minNumber > maxNumber) {
    throw new Error('minNumber should be less than maxNumber')
  }

  const minNum = Math.max(min, minNumber || min)
  const maxNum = Math.min(max, maxNumber || max)

  do {
    // randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    randomNumber = generateRandomNumber({
      min: minNum,
      max: maxNum,
      zeroAllowed,
      maxRetries,
    })

    const lengthOfNumber = randomNumber.toString().length

    if (
      lengthOfNumber >= minLengthOfDigits &&
      lengthOfNumber <= maxLengthOfDigits &&
      (zeroAllowed || randomNumber !== 0) &&
      (negativesAllowed || randomNumber > 0)
    ) {
      return randomNumber * sign
    }

    retries++
  } while (retries < maxRetries)

  return randomNumber + 1
}
