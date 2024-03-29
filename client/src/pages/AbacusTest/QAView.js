import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import SettingsIcon from '@mui/icons-material/Settings';
import PlayIcon from '@mui/icons-material/PlayArrowOutlined';
import PauseIcon from '@mui/icons-material/PauseOutlined';

import Panel from 'components/Panel';
import { FormInputText } from 'components/FormInput/FormInputText';
import { Link } from 'react-router-dom';
import useCountDownTimer from 'hooks/CountDownTimer';
import LinearProgressWithLabel from 'components/LinearProgressWithLabel';
import { remainingDurationFormat } from 'utils/formatting';
import { SPEECH_SYNTHESIS_STATUS, SpeechSynthesisContext } from 'hooks/useSpeechSynthesis';

const QAView = ({
  timeLimit,
  testDone,
  question,
  answer,
  currentPosition,
  totalQuestions,
  onSubmit,
  onNext,
  onSummary,
}) => {
  const { speak, pause } = useContext(SpeechSynthesisContext);

  const [done, setDone] = useState(false);
  useEffect(() => {
    if (timeLimit === 0) return null;
    const timer = setTimeout(() => {
      pause();
      setDone(true);
    }, timeLimit * 1000);
    return () => clearTimeout(timer);
  }, [timeLimit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(question.question.join('. '));
    }, 500); // Wait for 5 seconds before starting

    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SummaryView
          {...{
            done: testDone || done,
            timeLimit,
            currentPosition,
            totalQuestions,
            onPlay: () => speak(question.question.join('. ')),
            onPause: pause,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <QuestionView {...{ done: testDone || done, question }} />
      </Grid>
      <Grid item xs={12}>
        <AnswerView {...{ done: testDone || done, answer, onNext, onSubmit, onSummary }} />
      </Grid>
    </Grid>
  );
};
const SummaryView = ({ timeLimit, done, currentPosition, totalQuestions, onPlay, onPause }) => {
  const [timeLeft] = useCountDownTimer(timeLimit);
  const { status } = useContext(SpeechSynthesisContext);

  return (
    <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.900' }}>
      <Paper sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 8 }}>
            Question {currentPosition} of {totalQuestions}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ width: '100px' }}>
              {timeLimit > 0 && !done && (
                <LinearProgressWithLabel
                  color="warning"
                  valueLimit={timeLimit}
                  valueLeft={timeLeft}
                  formatter={remainingDurationFormat}
                />
              )}
            </Box>
            <Tooltip title="Test Settings">
              <IconButton size="small" color="primary" component={Link} to="..">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            {status !== SPEECH_SYNTHESIS_STATUS.SPEAKING && (
              <IconButton size="small" color="primary" onClick={onPlay}>
                <PlayIcon />
              </IconButton>
            )}
            {status === SPEECH_SYNTHESIS_STATUS.SPEAKING && (
              <IconButton size="small" color="primary" onClick={onPause}>
                <PauseIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const QuestionView = ({ done, question }) => {
  return (
    <Panel>
      <Stack direction="row" spacing={2}>
        <Typography fontSize={24}>Q: </Typography>

        <Stack sx={{ alignItems: 'flex-end' }}>
          <Stack direction="column" spacing={1} textAlign={'right'}>
            {question.question.map((q, i) => (
              <Typography key={i} fontSize={32} width={50}>
                {q}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Stack>
      {/* <pre>{JSON.stringify(question, null, 2)}</pre> */}
    </Panel>
  );
};
const AnswerView = ({ done, answer, onSubmit, onNext, onSummary }) => {
  const methods = useForm({ defaultValues: { value: '' } });
  const { handleSubmit, control } = methods;

  const onNextClicked = async (data) => {
    await onSubmit(data);
    onNext();
  };
  const onSummaryClicked = async (data) => {
    await onSubmit(data);
    onSummary();
  };

  const actionsRight = (
    <Stack direction="row" spacing={2}>
      {onNext && (
        <Button onClick={handleSubmit(onNextClicked)} variant={'contained'}>
          Next
        </Button>
      )}
      {!onNext && (
        <Button onClick={handleSubmit(onSummaryClicked)} variant={'outlined'}>
          Summary
        </Button>
      )}
    </Stack>
  );

  return (
    <Panel actionsRight={actionsRight}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputText
          name="value"
          label="Answer"
          type="number"
          control={control}
          disabled={done}
        />
      </form>
    </Panel>
  );
};

export default QAView;
