import React from 'react';
import { useLocation } from 'react-router';
import { Grid, Stack, Typography } from '@mui/material';

import Panel from 'components/Panel';
import moment from 'moment';
import { remainingDurationFormat } from 'utils/formatting';

const QASummaryPage = () => {
  const location = useLocation();
  const { questions, answers, testTimings } = location.state;

  const testTimeDiff = remainingDurationFormat(
    moment(testTimings.endTime).diff(testTimings.startTime, 'seconds'),
  );

  const correctAnswers = questions.filter((q, i) => q.answer === Number(answers[i]?.value));

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
          {questions.map((question, index) => (
            <Grid item key={index}>
              <QASummaryView {...{ index, question, answer: answers[index] }} />
            </Grid>
          ))}
        </Grid>
      </>
      {/* <pre>{JSON.stringify(questions, null, 2)}</pre>
          <pre>{JSON.stringify(answers, null, 2)}</pre> */}
    </Stack>
  );
};

const QASummaryView = ({ index, question, answer }) => {
  // console.log(question, answer)
  const isAnswerCorrect = answer?.value === '' ? false : question.answer === Number(answer?.value);
  const maxLenQuestion = question.question.reduce(
    (acc, q) => (q.toString().length > acc ? q.toString().length : acc),
    0,
  );
  const spacer = '-'.repeat(maxLenQuestion);

  return (
    <Panel>
      <Stack direction="row" spacing={2}>
        <Typography fontSize={24}>Q: {index + 1}</Typography>

        <Stack sx={{ alignItems: 'flex-end' }}>
          <Stack direction="column" spacing={1} textAlign={'right'}>
            {question.question.map((q, i) => (
              <Typography key={i} fontSize={32} width={50}>
                {q}
              </Typography>
            ))}
          </Stack>
          <Stack
            sx={{ pt: 1, mt: 2, borderTop: 1, borderColor: 'grey.400', flexGrow: 1 }}
            direction="row"
            spacing={2}
          >
            <Stack direction="row" spacing={2}>
              <div>
                <Typography fontSize={28}>
                  <span style={{ fontSize: '.8rem', paddingRight: '10px' }}>
                    {isAnswerCorrect ? '✅' : '❌'}
                  </span>
                  {isAnswerCorrect ? ' ' : `(${question.answer})`}
                </Typography>
              </div>
              <div>
                <Typography fontSize={32} color={isAnswerCorrect ? 'success.400' : 'warning.400'}>
                  {answer?.value === '' ? spacer : answer?.value}
                </Typography>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {/* <pre>{JSON.stringify(question, null, 2)}</pre> */}
    </Panel>
  );
};

export default QASummaryPage;
