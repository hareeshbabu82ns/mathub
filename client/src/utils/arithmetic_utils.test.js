import { summary } from "./arithmetic_utils"

describe('common tests', () => {

  const sampleTestData = { "id": "61b60e71c9705d1c0bd28a07", "type": "ARITHMETIC", "createdAt": "2021-12-12T14:00:00.000Z", "updatedAt": "2021-12-12T14:01:12.000Z", "questions": [{ "operation": "-", "operand1": 6, "operand2": 3, "result": 3 }, { "operation": "+", "operand1": 8, "operand2": 5, "result": 13 }, { "operation": "+", "operand1": 7, "operand2": 4, "result": 3 }, { "operation": "-", "operand1": 8, "operand2": 2, "result": 6 }, { "operation": "-", "operand1": 6, "operand2": 2, "result": 4 }, { "operation": "-", "operand1": 9, "operand2": 5, "result": 4 }, { "operation": "-", "operand1": 9, "operand2": 3, "result": 6 }, { "operation": "-", "operand1": 8, "operand2": 3, "result": 5 }, { "operation": "+", "operand1": 3, "operand2": 6, "result": 9 }, { "operation": "+", "operand1": 5, "operand2": 9, "result": 14 }], "answers": [{ "value": "3" }, { "value": "4" }, { "value": "5" }, { "value": "6" }, { "value": "4" }, { "value": "4" }, { "value": "6" }, { "value": "3" }, { "value": "9" }, { "value": "14" }] }

  const res = summary(sampleTestData)

  test('top level summary', () => {
    expect(res.totalQuestions).toBe(10)
    expect(res.correctAnswers).toBe(7)
    expect(res.wrongAnswers).toBe(3)
    expect(res.testTimeDiff).toBe('01:12s')
  })

  test('operation level summary', () => {
    expect(res.operations).toHaveLength(2)
    expect(Object.keys(res.operationWise)).toHaveLength(2)

    expect(res.operationWise['-'].totalQuestions).toBe(6)
    expect(res.operationWise['-'].correctAnswers).toBe(5)
    expect(res.operationWise['-'].wrongAnswers).toBe(1)

    expect(res.operationWise['+'].totalQuestions).toBe(4)
    expect(res.operationWise['+'].correctAnswers).toBe(2)
    expect(res.operationWise['+'].wrongAnswers).toBe(2)
  })

})