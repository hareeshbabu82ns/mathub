import {
  generateAbacusNumbers,
  generateAbacusQuestions,
  generateRandomLengthNumber,
  generateRandomNumber,
} from './abacus_utils';

describe('Abacus Generation Tests', () => {
  describe('General', () => {
    test('should generate random length numbers with all constraints', () => {
      const maxGen = 50;
      for (let i = 0; i < maxGen; i++) {
        const minRandom = generateRandomNumber({ min: 1, max: 3 });
        const maxRandom = minRandom + generateRandomNumber({ min: 1, max: 2 });
        // console.log('maxRandom', maxRandom);
        const params = {
          minLengthOfDigits: Math.min(minRandom, maxRandom),
          maxLengthOfDigits: Math.max(minRandom, maxRandom),
          // maxNumber: 10,
          zeroAllowed: false,
          negativesAllowed: i % 2 === 0,
        };
        const num = generateRandomLengthNumber(params);
        // console.log('length numbers', params, num);
        // console.log('all constraints', num);
        // expect(num).toBeGreaterThanOrEqual(params.min);
        // expect(num).toBeLessThanOrEqual(params.max);

        expect(Math.abs(num).toString().length).toBeGreaterThanOrEqual(params.minLengthOfDigits);
        expect(Math.abs(num).toString().length).toBeLessThanOrEqual(params.maxLengthOfDigits);
        expect(num).not.toEqual(0);
      }
    });

    test('should generate random numbers with all constraints', () => {
      const maxGen = 50;
      for (let i = 0; i < maxGen; i++) {
        const maxRandom = Math.max(10, Math.round(Math.random() * 100));
        // console.log('maxRandom', maxRandom);
        const params = {
          // minLengthOfDigits: 1,
          // maxLengthOfDigits: 2,
          min: i % 2 === 0 ? 0 : -maxRandom,
          max: maxRandom,
          zeroAllowed: false,
        };
        const num = generateRandomNumber(params);
        // console.log('all constraints', num);
        expect(num).toBeGreaterThanOrEqual(params.min);
        expect(num).toBeLessThanOrEqual(params.max);

        // expect(Math.abs(num).toString().length).toBeGreaterThanOrEqual(params.minLengthOfDigits);
        // expect(Math.abs(num).toString().length).toBeLessThanOrEqual(params.maxLengthOfDigits);
        expect(num).not.toEqual(0);
      }
    });

    test('should return an array of numbers', () => {
      for (let i = 0; i < 10; i++) {
        const params = {
          minCount: generateRandomNumber({ min: 3, max: 6 }),
          maxCount: 0,
        };
        params.maxCount = generateRandomNumber({ min: 3, max: 6 }) + params.minCount;
        const res = generateAbacusNumbers(params);
        // console.log('array of numbers', res);
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBeLessThanOrEqual(params.maxCount);
        expect(res.length).toBeGreaterThanOrEqual(params.minCount);
        res.forEach((num) => {
          expect(typeof num).toBe('number');
        });
        const sum = res.reduce((acc, num) => acc + num, 0);
        expect(sum).toBeGreaterThanOrEqual(0);
        //   expect(sum).toBeLessThanOrEqual(params.maxSum);
        //   res.forEach((num) => {
        //     expect(Math.abs(num).toString().length).toBeGreaterThanOrEqual(params.minLengthOfDigits);
        //     expect(Math.abs(num).toString().length).toBeLessThanOrEqual(params.maxLengthOfDigits);
        //     expect(num).not.toEqual(0);
        //   });
      }
    });

    test('should return each number with digits length between 3 and 6', () => {
      for (let i = 0; i < 10; i++) {
        const params = {
          minLengthOfDigits: generateRandomNumber({ min: 1, max: 2 }),
          maxLengthOfDigits: 0,
        };
        params.maxLengthOfDigits =
          generateRandomNumber({ min: 1, max: 2 }) + params.minLengthOfDigits;
        const res = generateAbacusNumbers(params);
        // console.log('digit lengths', params, res);
        expect(res[0]).toBeGreaterThan(0);
        res.forEach((num) => {
          expect(Math.abs(num).toString().length).toBeGreaterThanOrEqual(params.minLengthOfDigits);
          expect(Math.abs(num).toString().length).toBeLessThanOrEqual(params.maxLengthOfDigits);
          expect(num).not.toEqual(0);
        });
      }
    });

    test('should return numbers with sum less than or equal to maxSum', () => {
      for (let i = 0; i < 50; i++) {
        const params = { maxSum: generateRandomNumber({ min: 10, max: 100 }) };
        const res = generateAbacusNumbers(params);
        const sum = res.reduce((acc, num) => acc + num, 0);
        // console.log('sum less than or equal to maxSum', params.maxSum, sum, res);
        expect(sum).toBeLessThanOrEqual(params.maxSum);
      }
    });

    test('should return 25 questions with all constraints', () => {
      const params = {
        count: 25,
        minCount: 3,
        maxCount: 6,
        minLengthOfDigits: 1,
        maxLengthOfDigits: 2,
        maxNumber: 10,
        maxSum: 60,
        isNegativeAllowed: true,
        maxRetries: 10,
      };
      const res = generateAbacusQuestions(params);
      console.log('questions all constraints', res);
      expect(res.length).toBe(params.count);
      res.forEach((question, idx) => {
        // console.log(`all constraints: question ${idx}:\n`, question);
        expect(question.numbers.length).toBeGreaterThanOrEqual(params.minCount);
        expect(question.numbers.length).toBeLessThanOrEqual(params.maxCount);
        const sum = question.numbers.reduce((acc, num) => acc + num, 0);
        // expect(sum).toBeGreaterThan(0);
        expect(sum).toBe(question.answer);
        expect(sum).toBeLessThanOrEqual(params.maxSum);
        expect(question.numbers[0]).toBeGreaterThan(0);
        // expect(question.numbers.some((num) => num < 0)).toBe(true);
        let sumCalc = 0;
        question.numbers.forEach((num) => {
          sumCalc += num;
          // if (sumCalc < 0) console.log(question.numbers);
          expect(sumCalc).toBeGreaterThanOrEqual(0);
          expect(Math.abs(num).toString().length).toBeGreaterThanOrEqual(params.minLengthOfDigits);
          expect(Math.abs(num).toString().length).toBeLessThanOrEqual(params.maxLengthOfDigits);
          expect(num).not.toEqual(0);
        });
      });
    });
  });
});
