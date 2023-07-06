import { ARITHMETIC_OPERATION_SIGNS_ALL } from './gen_arithmetic_qa';
export const MAX_RETRIES = 10;
export const MathUtil = {
  evaluate: function (x1, sign, x3) {
    switch (sign) {
      case '+':
        return x1 + x3;
      case '-':
        return x1 - x3;
      case '*':
        return x1 * x3;
      default:
        return Math.floor(x1 / x3);
    }
  },
  isOperator: function (sign) {
    return ['+', '-', '*', '/'].includes(sign);
  },
  getPrecedence: function (sign) {
    switch (sign) {
      case '+':
        return 1;
      case '-':
        return 1;
      case '*':
        return 2;
      default:
        return 3;
    }
  },
  generateRandomAnswer: function (min, max) {
    const result = Math.floor(Math.random() * (max - min) + min);
    return result;
  },
  generateRandomSign: function () {
    const x = ['/', '*', '-', '+'];
    const result = x[Math.floor(Math.random() * x.length)];
    return result;
  },
  generateRandomSigns: function (count = 1, fromSigns = ARITHMETIC_OPERATION_SIGNS_ALL) {
    const listOfSign = [];
    const list = [
      [...MathUtil.arrayShuffle(fromSigns)],
      [...MathUtil.arrayShuffle(fromSigns)],
      [...MathUtil.arrayShuffle(fromSigns)],
      [...MathUtil.arrayShuffle(fromSigns)],
    ];
    // const list = [
    //   ['/', '*', '-', '+'],
    //   ['/', '*', '-', '+'],
    //   ['/', '*', '-', '+'],
    //   ['/', '*', '-', '+'],
    // ];
    while (listOfSign.length < count) {
      const row = Math.floor(Math.random() * fromSigns.length);
      const col = Math.floor(Math.random() * fromSigns.length);
      if (
        listOfSign.length === 0 ||
        fromSigns.length === 1 ||
        list[row][col] !== listOfSign[listOfSign.length - 1]
      ) {
        listOfSign.push(list[row][col]);
      }
    }
    return listOfSign;
  },
  generateRandomNumbers: function (min, max, count = 1) {
    const list = [];
    const listOfSign = [];
    const listTemp = [];

    for (var i = min; i <= max; i++) {
      listTemp.push(i);
    }
    for (i = min; i <= max; i++) {
      list.push(listTemp);
    }
    while (listOfSign.length < count) {
      const row = Math.floor(Math.random() * (max - min));
      const col = Math.floor(Math.random() * (max - min));
      if (listOfSign.length === 0 || list[row][col] !== listOfSign[listOfSign.length - 1]) {
        listOfSign.push(list[row][col]);
      }
    }
    return listOfSign;
  },

  getPlusSignExp: function (min, max) {
    const x = MathUtil.generateRandomNumbers(min, max, 2);
    return {
      operand1: x[0],
      operator1: '+',
      operand2: x[1],
      result: x[0] + x[1],
      operand3: '',
      operator2: null,
    };
  },

  getMinusSignExp: function (min, max) {
    const x1 = MathUtil.generateRandomNumbers(Math.floor(max / 2), max, 1);
    let x2 = MathUtil.generateRandomNumbers(min, max, 1);
    while (x2[0] > x1[0]) {
      x2 = MathUtil.generateRandomNumbers(min, max, 1);
    }
    return {
      operand1: x1[0],
      operator1: '-',
      operand2: x2[0],
      result: x1[0] - x2[0],
      operand3: '',
      operator2: null,
    };
  },

  getMultiplySignExp: function (min, max) {
    const x = MathUtil.generateRandomNumbers(min, max, 2);

    return {
      operand1: x[0],
      operator1: '*',
      operand2: x[1],
      result: x[0] * x[1],
      operand3: '',
      operator2: null,
    };
  },

  getDivideSignExp: function (min, max) {
    const listTemp = [];
    for (let i = min; i <= max; i++) {
      for (let j = min; j <= max; j++) {
        if (i !== 1 && j !== 1 && j !== i && j % i === 0) {
          listTemp.push({ j, i });
        }
      }
    }
    MathUtil.arrayShuffle(listTemp);
    if (listTemp.length > 0) {
      var x = listTemp[Math.floor(Math.random() * listTemp.length)];
      return {
        operand1: x.j,
        operator1: '/',
        operand2: x.i,
        result: x.j / x.i,
        operand3: '',
        operator2: null,
      };
    } else {
      return null;
    }
  },

  getSignExp: function (min, max, sign) {
    switch (sign) {
      case '+':
        return MathUtil.getPlusSignExp(min, max);
      case '-':
        return MathUtil.getMinusSignExp(min, max);
      case '*':
        return MathUtil.getMultiplySignExp(min, max);
      case '/':
        return MathUtil.getDivideSignExp(min, max);
      default:
        break;
    }
  },

  getMixExp: function (min, max, fromSigns = ARITHMETIC_OPERATION_SIGNS_ALL) {
    const operand = MathUtil.generateRandomNumbers(min, max, 1)[0];
    const signList = MathUtil.generateRandomSigns(2, fromSigns);
    const firstSign =
      MathUtil.getPrecedence(signList[0]) >= MathUtil.getPrecedence(signList[1]) ? signList[0] : '';
    const secondSign =
      MathUtil.getPrecedence(signList[0]) >= MathUtil.getPrecedence(signList[1]) ? '' : signList[1];
    let expression;
    let finalExpression;
    expression = MathUtil.getSignExp(min, max, firstSign !== '' ? firstSign : secondSign);
    if (expression != null) {
      switch (firstSign !== '' ? signList[1] : signList[0]) {
        case '+':
          if (firstSign !== '')
            finalExpression = {
              operand1: expression.operand1,
              operator1: expression.operator1,
              operand2: expression.operand2,
              operator2: '+',
              operand3: operand,
              result: expression.result + operand,
            };
          else
            finalExpression = {
              operand1: operand,
              operator1: '+',
              operand2: expression.operand1,
              operator2: expression.operator1,
              operand3: expression.operand2,
              result: operand + expression.result,
            };
          break;
        case '-':
          if (firstSign !== '') {
            if (expression.result - operand < 0) {
              finalExpression = null;
            } else {
              finalExpression = {
                operand1: expression.operand1,
                operator1: expression.operator1,
                operand2: expression.operand2,
                operator2: '-',
                operand3: operand,
                result: expression.result - operand,
              };
            }
          } else {
            if (operand - expression.result < 0) {
              finalExpression = null;
            } else {
              finalExpression = {
                operand1: operand,
                operator1: '-',
                operand2: expression.operand1,
                operator2: expression.operator1,
                operand3: expression.operand2,
                result: operand - expression.result,
              };
            }
          }
          break;
        case '*':
          if (firstSign !== '')
            finalExpression = {
              operand1: expression.operand1,
              operator1: expression.operator1,
              operand2: expression.operand2,
              operator2: '*',
              operand3: operand,
              result: expression.result * operand,
            };
          else
            finalExpression = {
              operand1: operand,
              operator1: '*',
              operand2: expression.operand1,
              operator2: expression.operator1,
              operand3: expression.operand2,
              result: operand * expression.result,
            };

          break;
        case '/':
          if (firstSign !== '') {
            if (expression.result % operand === 0) {
              finalExpression = null;
            } else {
              finalExpression = {
                operand1: expression.operand1,
                operator1: expression.operator1,
                operand2: expression.operand2,
                operator2: '/',
                operand3: operand,
                result: Math.floor(expression.result / operand),
              };
            }
          } else {
            if (operand % expression.result === 0) {
              finalExpression = null;
            } else {
              finalExpression = {
                operand1: operand,
                operator1: '/',
                operand2: expression.operand1,
                operator2: expression.operator1,
                operand3: expression.operand2,
                result: Math.floor(operand / expression.result),
              };
            }
          }
          break;
        default:
          break;
      }
    } else {
      finalExpression = expression;
    }
    return finalExpression;
  },

  getMentalExp: function (level = 1, fromSigns = ARITHMETIC_OPERATION_SIGNS_ALL) {
    let min;
    let max;
    if (level <= 3) {
      min = level = 1;
      max = level = 10;
    } else if (level <= 6) {
      min = level = 5;
      max = level = 20;
    } else {
      min = level = 10;
      max = level = 30;
    }
    const operand = MathUtil.generateRandomNumbers(min, max, 1)[0];
    const signList = MathUtil.generateRandomSigns(2, fromSigns);
    let expression;
    let finalExpression;
    expression = MathUtil.getSignExp(min, max, signList[0]);
    // switch (signList[0]) {
    //   case '+':
    //     expression = MathUtil.getPlusSignExp(min, max);
    //     break;
    //   case '-':
    //     expression = MathUtil.getMinusSignExp(min, max);
    //     break;
    //   case '*':
    //     expression = MathUtil.getMultiplySignExp(min, max);
    //     break;
    //   case '/':
    //     expression = MathUtil.getDivideSignExp(min, max);
    //     break;
    //   default:
    //     break;
    // }
    if (expression != null) {
      switch (signList[1]) {
        case '+':
          finalExpression = {
            operand1: expression.operand1,
            operator1: expression.operator1,
            operand2: expression.operand2,
            operator2: signList[1],
            operand3: operand,
            result: operand + expression.result,
          };
          break;
        case '-':
          finalExpression = {
            operand1: expression.operand1,
            operator1: expression.operator1,
            operand2: expression.operand2,
            operator2: signList[1],
            operand3: operand,
            result: expression.result - operand,
          };
          break;
        case '*':
          finalExpression = {
            operand1: expression.operand1,
            operator1: expression.operator1,
            operand2: expression.operand2,
            operator2: signList[1],
            operand3: operand,
            result: expression.result * operand,
          };

          break;
        case '/':
          if (expression.result % operand !== 0) {
            finalExpression = null;
          } else {
            finalExpression = {
              operand1: expression.operand1,
              operator1: expression.operator1,
              operand2: expression.operand2,
              operator2: signList[1],
              operand3: operand,
              result: Math.floor(expression.result / operand),
            };
          }
          break;
        default:
          break;
      }
    } else {
      finalExpression = expression;
    }
    return finalExpression;
  },

  getMathPairs: function (
    level = 1,
    count = 10,
    fromSigns = ARITHMETIC_OPERATION_SIGNS_ALL,
    maxRetries = MAX_RETRIES,
  ) {
    const list = [];
    const min = level === 1 ? 1 : 5 * level - 5; //1 5 10 15 20 25
    const max = level === 1 ? 10 : 10 * level; //10 20 30 40 50 60
    let retries = 0;
    while (list.length < count && retries < maxRetries) {
      const signs = MathUtil.generateRandomSigns(count - list.length, fromSigns);
      for (let sign of signs) {
        let expression;
        if (level <= 2) {
          expression = MathUtil.getSignExp(min, max, sign);
          // switch (sign) {
          //   case '+':
          //     expression = MathUtil.getPlusSignExp(min, max);
          //     break;
          //   case '-':
          //     expression = MathUtil.getMinusSignExp(min, max);
          //     break;
          //   case '*':
          //     expression = MathUtil.getMultiplySignExp(min, max);
          //     break;
          //   case '/':
          //     expression = MathUtil.getDivideSignExp(min, max);
          //     break;
          //   default:
          //     break;
          // }
        } else if (level <= 3) {
          expression = MathUtil.getSignExp(min, max, sign);
        } else {
          expression = MathUtil.getSignExp(min, max, sign);
        }
        if (expression != null && !MathUtil.containsExpression(list, expression)) {
          list.push(expression);
        } else {
          retries = retries + 1;
          console.log('retries: ', retries);
        }
      }
    }
    return list;
  },

  generateExpressions: function ({
    min = 1,
    max = 100,
    count = 10,
    mixed = false,
    includingOperations = ARITHMETIC_OPERATION_SIGNS_ALL,
    maxRetries = MAX_RETRIES,
  }) {
    const list = [];
    let retries = 0;
    // console.log(includingOperations);
    while (list.length < count && retries < maxRetries) {
      const signs = MathUtil.generateRandomSigns(count - list.length, includingOperations);
      for (let sign of signs) {
        let expression;
        if (!mixed) {
          expression = MathUtil.getSignExp(min, max, sign);
        } else {
          expression = MathUtil.getMixExp(min, max);
        }
        if (expression != null && !MathUtil.containsExpression(list, expression)) {
          list.push(expression);
        } else {
          retries = retries + 1;
          console.log('expression: ', expression);
          console.log('retries: ', retries);
        }
      }
    }
    return list;
  },

  generateExpressionsByLevel: function (
    level = 1,
    count = 10,
    fromSigns = ARITHMETIC_OPERATION_SIGNS_ALL,
  ) {
    const list = [];
    const min = level === 1 ? 1 : 5 * level - 5; //1 5 10 15 20 25
    const max = level === 1 ? 10 : 10 * level; //10 20 30 40 50 60
    while (list.length < count) {
      MathUtil.generateRandomSigns(count - list.length, fromSigns).forEach((sign) => {
        let expression;
        if (level <= 2) {
          expression = MathUtil.getSignExp(min, max, sign);
        } else if (level <= 4) {
          expression = MathUtil.getSignExp(min, max, sign);
        } else if (level < 5) {
          expression = MathUtil.getMixExp(1, 25);
        } else if (level < 6) {
          expression = MathUtil.getMixExp(1, 30);
        } else {
          expression = MathUtil.getMixExp(1, 50);
        }
        if (expression != null && !MathUtil.containsExpression(list, expression)) {
          list.push(expression);
        }
      });
    }
    return list;
  },

  containsExpression: function (array = [], exp = {}) {
    return (
      array.findIndex(
        (e) =>
          e.operand1 === exp?.operand1 &&
          e.operator1 === exp?.operand1 &&
          e.operand2 === exp?.operand1 &&
          e.result === exp?.operand1 &&
          e.operand3 === exp?.operand1 &&
          e.operator2 === exp?.operand1,
      ) >= 0
    );
  },

  arrayShuffle: function (array = []) {
    if (array.length <= 1) return [...array];
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  },
};
