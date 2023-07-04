import _ from 'lodash'

export const ARITHMETIC_ADDITION = 'ADD'
export const ARITHMETIC_MULTIPLICATION = 'MUL'
export const ARITHMETIC_SUBTRACTION = 'SUB'
export const ARITHMETIC_DIVISION = 'DIV'

const MAX_RANDOM_RETRIES = 5

export const ARITHMETIC_OPERATIONS_DEFAULT = [
  ARITHMETIC_ADDITION,
  ARITHMETIC_SUBTRACTION,
]
export const ARITHMETIC_OPERATIONS_ALL = [
  ARITHMETIC_ADDITION,
  ARITHMETIC_SUBTRACTION,
  ARITHMETIC_MULTIPLICATION,
  ARITHMETIC_DIVISION
]

export const ARITHMETIC_OPERATION = {
  [ARITHMETIC_ADDITION]: {
    symbol: '+',
    calculate: (a, b) => a + b
  },
  [ARITHMETIC_SUBTRACTION]: {
    symbol: '-',
    calculate: (a, b) => a - b
  },
  [ARITHMETIC_MULTIPLICATION]: {
    symbol: 'x',
    calculate: (a, b) => a * b
  },
  [ARITHMETIC_DIVISION]: {
    symbol: '÷',
    calculate: (a, b) => a / b
  },
}

const genNonNearZeroRandom = (maxNum) => {
  let rand = Math.floor(Math.random() * maxNum)
  while (rand === 0 || rand === 1)
    rand = Math.floor(Math.random() * maxNum)
  return rand
}

const genRandomOperand = ({
  prevOperands = [], maxNum }) => {
  let rand = genNonNearZeroRandom(maxNum)
  let i = 0
  while (i < MAX_RANDOM_RETRIES &&
    prevOperands.findIndex(p => p === rand) >= 0) {
    rand = genNonNearZeroRandom(maxNum)
    i = i + 1
  }
  return rand
}

export const generate = ({
  max = 10, maxDigits = 2,
  nonNegative = true,
  nonReminder = true,
  includingOperations = ARITHMETIC_OPERATIONS_DEFAULT,
} = {}) => {
  const res = new Array(max).fill(null)
  const maxNum = Math.pow(10, maxDigits)
  const op1 = []
  const op2 = []

  for (let i = 0; i < max; i++) {
    const operation = includingOperations[Math.floor(Math.random() * includingOperations.length)]
    let rand1 = genRandomOperand({ prevOperands: op1, maxNum })
    let rand2 = genRandomOperand({ prevOperands: [...op2, rand1], maxNum })

    switch (operation) {
      case ARITHMETIC_SUBTRACTION:
        if (nonNegative && rand2 > rand1) {
          // switch operands
          const rand = rand1
          rand1 = rand2
          rand2 = rand
        }
        break
      case ARITHMETIC_DIVISION:
        if (nonReminder && rand1 % rand2 !== 0) {
          rand1 = rand2 * rand1
        }
        break
    }

    const question = {
      operation: ARITHMETIC_OPERATION[operation].symbol,
      operand1: rand1,
      operand2: rand2,
      result: ARITHMETIC_OPERATION[operation].calculate(rand1, rand2),
    }

    res[i] = question
    op1.push(rand1)
    op2.push(rand2)
  }

  return res
}