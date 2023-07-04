import { ARITHMETIC_ADDITION, ARITHMETIC_DIVISION, ARITHMETIC_MULTIPLICATION, ARITHMETIC_OPERATIONS_ALL, ARITHMETIC_SUBTRACTION, generate } from './gen_arithmetic_qa';

const TEST_REPEATE_COUNT = 5

describe('common tests', () => {

  const settings = {
    max: 20,
    maxDigits: 1,
  }

  test('length', () => {
    ARITHMETIC_OPERATIONS_ALL.map(a => {
      const res = generate({ ...settings, includingOperations: [a] })
      expect(res).toHaveLength(settings.max)
    })
  })

  test('non negatives', () => {
    ARITHMETIC_OPERATIONS_ALL.map(a => {
      const res = generate({ ...settings, includingOperations: [a], nonNegative: true })
      res.map(o => expect(o.result).toBeGreaterThanOrEqual(0))
    })
  })

})

describe('generate additions', () => {

  const settings = {
    max: 20,
    maxDigits: 1,
    includingOperations: [ARITHMETIC_ADDITION],
  }

  test('length', () => {
    ARITHMETIC_OPERATIONS_ALL.map(a => {
      const res = generate({ ...settings, includingOperations: [a] })
      expect(res).toHaveLength(settings.max)
    })
  })


});

describe('generate subtractions', () => {

  const settings = {
    max: 20,
    maxDigits: 1,
    nonNegative: true,
    includingOperations: [ARITHMETIC_SUBTRACTION],
  }

  test('length', () => {
    const res = generate(settings)
    expect(res).toHaveLength(settings.max)
  })

});

describe('generate multiplications', () => {

  const settings = {
    max: 20,
    maxDigits: 1,
    includingOperations: [ARITHMETIC_MULTIPLICATION],
  }

  test('length', () => {
    const res = generate(settings)
    expect(res).toHaveLength(settings.max)
  })


});

describe('generate divisions', () => {

  const settings = {
    max: 20,
    maxDigits: 1,
    nonReminder: true,
    includingOperations: [ARITHMETIC_DIVISION],
  }

  test('non reminder', () => {
    new Array(TEST_REPEATE_COUNT).fill(0).map(r => {
      const res = generate(settings)
      // console.log(res)
      res.map(r => expect(r.operand1 % r.operand2).toBe(0))
    })
  })


});