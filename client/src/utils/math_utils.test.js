import {
  ARITHMETIC_OPERATION_SIGNS_ALL,
  ARITHMETIC_SIGN_ADDITION,
  ARITHMETIC_SIGN_DIVISION,
  ARITHMETIC_SIGN_MULTIPLICATION,
  ARITHMETIC_SIGN_SUBTRACTION,
} from './gen_arithmetic_qa';
import { MathUtil } from './math_utils';

describe('math utils tests', () => {
  test('basic', () => {
    expect(ARITHMETIC_OPERATION_SIGNS_ALL.includes(MathUtil.generateRandomSign())).toBeTruthy();
    expect(MathUtil.generateRandomSigns().length).toBe(1);
    const signs = MathUtil.generateRandomSigns(3);
    expect(signs.length).toBe(3);
    expect(signs.filter((s) => ARITHMETIC_OPERATION_SIGNS_ALL.includes(s)).length).toBe(3);

    expect(MathUtil.generateRandomAnswer(10, 20)).toBeGreaterThanOrEqual(10);
    expect(MathUtil.generateRandomAnswer(10, 15)).toBeLessThanOrEqual(15);
  });

  test('isOperator', () => {
    expect(MathUtil.isOperator(ARITHMETIC_SIGN_ADDITION)).toBeTruthy();
    expect(MathUtil.isOperator(ARITHMETIC_SIGN_SUBTRACTION)).toBeTruthy();
    expect(MathUtil.isOperator(ARITHMETIC_SIGN_MULTIPLICATION)).toBeTruthy();
    expect(MathUtil.isOperator(ARITHMETIC_SIGN_DIVISION)).toBeTruthy();
    expect(MathUtil.isOperator('#')).toBeFalsy();
  });

  test('evaluate', () => {
    expect(MathUtil.evaluate(22, ARITHMETIC_SIGN_ADDITION, 11)).toBe(33);
    expect(MathUtil.evaluate(22, ARITHMETIC_SIGN_SUBTRACTION, 11)).toBe(11);
    expect(MathUtil.evaluate(3, ARITHMETIC_SIGN_MULTIPLICATION, 6)).toBe(18);
    expect(MathUtil.evaluate(22, ARITHMETIC_SIGN_DIVISION, 11)).toBe(2);
    expect(MathUtil.evaluate(7, ARITHMETIC_SIGN_DIVISION, 3)).toBe(2);
  });

  test('generateRandomNumbers', () => {
    expect(MathUtil.generateRandomNumbers(10, 15).length).toBe(1);

    const nums = MathUtil.generateRandomNumbers(10, 15, 3);
    expect(nums.length).toBe(3);

    expect(nums.filter((n) => n >= 10).length).toBe(3);
    expect(nums.filter((n) => n <= 15).length).toBe(3);
  });

  test('Generate Expressions Basic', () => {
    const expAdd = MathUtil.getPlusSignExp(2, 10);
    expect(expAdd.operator1).toBe(ARITHMETIC_SIGN_ADDITION);
    expect(expAdd.result).toBe(
      MathUtil.evaluate(expAdd.operand1, expAdd.operator1, expAdd.operand2),
    );

    const expSub = MathUtil.getMinusSignExp(2, 10);
    expect(expSub.operator1).toBe(ARITHMETIC_SIGN_SUBTRACTION);
    expect(expSub.result).toBe(
      MathUtil.evaluate(expSub.operand1, expSub.operator1, expSub.operand2),
    );

    const expMul = MathUtil.getMultiplySignExp(2, 10);
    expect(expMul.operator1).toBe(ARITHMETIC_SIGN_MULTIPLICATION);
    expect(expMul.result).toBe(
      MathUtil.evaluate(expMul.operand1, expMul.operator1, expMul.operand2),
    );

    const expDiv = MathUtil.getDivideSignExp(1, 10);
    expect(expDiv.operator1).toBe(ARITHMETIC_SIGN_DIVISION);
    expect(expDiv.result).toBe(
      MathUtil.evaluate(expDiv.operand1, expDiv.operator1, expDiv.operand2),
    );

    const expMix = MathUtil.getMixExp(1, 100);
    // console.log(expMix);
    expect(expMix.operator2).toBeTruthy();
    expect(expMix.operand3).toBeTruthy();

    const expMental = MathUtil.getMentalExp(1);
    // console.log(expMental);
    expect(expMental.operator2).toBeTruthy();
    expect(expMental.operand3).toBeTruthy();

    const expPairs = MathUtil.getMathPairs(1, 3);
    // console.log(expPairs);
    expect(expPairs.length).toBe(3);
  });

  test('Generate Expressions Advanced', () => {
    const expExpressionsSigns = MathUtil.generateExpressions({
      min: 1,
      max: 10,
      count: 5,
      includingOperations: ['-'],
    });
    // console.log(expExpressionsSigns);
    expect(expExpressionsSigns.length).toBe(5);
    expect(expExpressionsSigns.filter(({ operator1 }) => ['-'].includes(operator1)).length).toBe(5);

    const expExpressions = MathUtil.generateExpressions({ min: 1, max: 10, count: 3 });
    // console.log(expExpressions);
    expect(expExpressions.length).toBe(3);
    expect(expExpressions[0].operator2).toBeFalsy();
    expect(expExpressions[0].operand3).toBeFalsy();

    const expExpressions5 = MathUtil.generateExpressions({
      min: 1,
      max: 10,
      count: 3,
      mixed: true,
    });
    // console.log(expExpressions5);
    expect(expExpressions5.length).toBe(3);
    expect(expExpressions5[0].operator2).toBeTruthy();
    expect(expExpressions5[0].operand3).toBeTruthy();
  });
});
