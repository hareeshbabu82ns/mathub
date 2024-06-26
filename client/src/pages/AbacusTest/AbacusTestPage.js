import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { generateAbacusQuestions } from 'utils/abacus_utils';
import { defaultSettings } from './SettingsPage';
import Panel from 'components/Panel';
import LinearProgressWithLabel from 'components/LinearProgressWithLabel';
import useCountDownTimer from 'hooks/CountDownTimer';
import { Box } from '@mui/material';
import moment from 'moment';
import { useMutation, gql } from '@apollo/client';

import { remainingDurationFormat } from 'utils/formatting';
import QAView from './QAView';

// mutation_root.insert_mathub_test(objects: [mathub_test_insert_input!]!)
const ADD_TEST = gql`
  mutation CreateTest(
    $type: TestType!
    $createdAt: DateTime!
    $updatedAt: DateTime!
    $questions: Json
    $answers: Json
  ) {
    createTest(
      data: {
        type: $type
        createdAt: $createdAt
        updatedAt: $updatedAt
        questions: $questions
        answers: $answers
      }
    ) {
      id
    }
  }
`;

const AbacusTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const qSettings = location.state?.qSettings || {
    ...defaultSettings,
  };

  const [createTest] = useMutation(ADD_TEST);

  const [startTime] = useState(moment.now().valueOf());

  const [timeLeft] = useCountDownTimer(qSettings.timeLimit * 60);

  const [answers, setAnswers] = useState([]);
  // const [questions, setQuestions] = useState(generate(qSettings));
  const [questions, setQuestions] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const q = generateAbacusQuestions(qSettings);
    setQuestions(q);
  }, [location]);

  const onAnswerSubmitted = ({ value }) => {
    const ans = answers[currentQuestion] || {};
    ans.value = value;
    answers[currentQuestion] = ans;
    setAnswers([...answers]);
  };

  const toNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const toSummaryPage = async () => {
    const endTime = moment.now().valueOf();
    const testTimings = { startTime, endTime };
    const variables = {
      type: 'ABACUS',
      createdAt: moment(startTime).toISOString(),
      updatedAt: moment(endTime).toISOString(),
      questions: questions,
      answers: answers,
    };
    await createTest({ variables });
    navigate('../summary', { state: { type: 'ABACUS', questions, answers, testTimings } });
  };

  const toolbarActions = (
    <React.Fragment>
      {qSettings.timeLimit > 0 && (
        <Box sx={{ width: '150px' }}>
          <LinearProgressWithLabel
            color="warning"
            valueLimit={qSettings.timeLimit}
            valueLeft={timeLeft}
            formatter={remainingDurationFormat}
          />
        </Box>
      )}
    </React.Fragment>
  );

  return (
    <Panel
      title={'Abacus Test'}
      toolbarActions={toolbarActions}
      loading={questions === null || !questions?.length}
    >
      {questions && (
        <QAView
          key={currentQuestion}
          type="ABACUS"
          testDone={qSettings.timeLimit > 0 && timeLeft <= 0}
          timeLimit={qSettings.timeLimitPerQuestion}
          question={questions[currentQuestion]}
          currentPosition={currentQuestion + 1}
          totalQuestions={questions.length}
          answer={answers.length > currentQuestion ? answers[currentQuestion] : {}}
          onSubmit={onAnswerSubmitted}
          onNext={questions.length <= currentQuestion + 1 ? null : toNextQuestion}
          onSummary={toSummaryPage}
        />
      )}

      {/* <pre>{JSON.stringify(questions, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(answers, null, 2)}</pre> */}
    </Panel>
  );
};

export default AbacusTestPage;
