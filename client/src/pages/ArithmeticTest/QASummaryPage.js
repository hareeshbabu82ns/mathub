import React from "react";
import { useLocation } from "react-router";
import { Grid, Stack, Typography } from "@mui/material";

import Panel from "../../components/Panel";
import moment from "moment";
import { remainingDurationFormat } from "../../utils/formatting";

const QASummaryPage = () => {

  const location = useLocation()
  const { questions, answers, testTimings } = location.state

  const testTimeDiff = remainingDurationFormat(moment(testTimings.endTime).diff(testTimings.startTime, 'seconds'))

  // const answers = new Array(10).fill({}).map(() => ({ value: Math.floor(Math.random() * 100) }))
  // const [questions, setQuestions] = useState(generate({
  //   maxDigits: 2,
  //   includingOperations: ARITHMETIC_OPERATIONS_ALL,
  // }))

  const correctAnswers = questions.filter((q, i) => q.result === Number(answers[i]?.value))


  return (
    <Stack spacing={2}>
      <Panel>
        <Stack direction="row" spacing={2}>
          <Stack sx={{ flexGrow: 1 }}>
            <div>Total Questions: {questions.length}</div>
            <div>Right Answers: {correctAnswers.length}</div>
            <div>Wrong Answers: {questions.length - correctAnswers.length}</div>
          </Stack>
          <Stack>
            <div>Completed in: {testTimeDiff}</div>
            {/* <pre>{JSON.stringify(testTimings, null, 2)}</pre> */}
          </Stack>
        </Stack>
      </Panel>

      <>
        <Grid container spacing={2} columns={{ xs: 2 }}>
          {questions.map((question, index) =>
            <Grid item key={index}>
              <QASummaryView
                {...{ index, question, answer: answers[index] }} />
            </Grid>
          )}
        </Grid>
      </>
      {/* <pre>{JSON.stringify(questions, null, 2)}</pre>
          <pre>{JSON.stringify(answers, null, 2)}</pre> */}
    </Stack>
  );
};

const QASummaryView = ({ index, question, answer }) => {
  // console.log(question, answer)
  const isAnswerCorrect = question.result === Number(answer?.value)
  return (
    <Panel>
      <Stack direction="row" spacing={2}>
        <Typography fontSize={24}>Q: {index + 1}</Typography>

        <Stack sx={{ alignItems: 'flex-end' }}>
          <Stack direction="row" spacing={2}>
            <div>{' '}</div>
            <div><Typography fontSize={32}>{question.operand1}</Typography></div>
          </Stack>
          <Stack direction="row" spacing={2}>
            <div><Typography fontSize={32}>{question.operation}</Typography></div>
            <div><Typography fontSize={32}>{question.operand2}</Typography></div>
          </Stack>
          <Stack
            sx={{ pt: 1, mt: 2, borderTop: 1, borderColor: "grey.400" }}
            direction="row" spacing={2}
          >
            <Stack direction="row" spacing={2}>
              <div><Typography fontSize={28}>{isAnswerCorrect ? ' ' : `(${question.result})`}</Typography></div>
              <div><Typography fontSize={32} color={isAnswerCorrect ? 'success.400' : 'warning.400'} >{answer?.value}</Typography></div>
            </Stack>

          </Stack>
        </Stack>
      </Stack>
      {/* <pre>{JSON.stringify(question, null, 2)}</pre> */}
    </Panel>
  )
}


export default QASummaryPage