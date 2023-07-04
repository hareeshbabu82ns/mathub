import React, { useEffect, useState } from "react";
import { Box, Button, Grid, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import SettingsIcon from '@mui/icons-material/Settings';

import Panel from "./Panel";
import { FormInputText } from "./FormInput/FormInputText";
import { Link } from "react-router-dom";
import useCountDownTimer from "../hooks/CountDownTimer";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { remainingDurationFormat } from "../utils/formatting";


const QAView = ({ timeLimit, testDone,
  question, answer,
  currentPosition, totalQuestions,
  onSubmit, onNext, onSummary }) => {

  const [done, setDone] = useState(false)
  useEffect(() => {
    if (timeLimit === 0) return null
    const timer = setTimeout(() => {
      setDone(true)
    }, timeLimit * 1000)
    return () => clearTimeout(timer)
  }, [timeLimit])

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SummaryView {...{
          done: testDone || done, timeLimit,
          currentPosition, totalQuestions
        }} />
      </Grid>
      <Grid item xs={12}>
        <QuestionView {...{ done: testDone || done, question }} />
      </Grid>
      <Grid item xs={12}>
        <AnswerView {...{ done: testDone || done, answer, onNext, onSubmit, onSummary }} />
      </Grid>
    </Grid>
  )
}
const SummaryView = ({ timeLimit, done, currentPosition, totalQuestions }) => {
  const [timeLeft] = useCountDownTimer(timeLimit)

  return (
    <Box sx={{ border: 1, borderRadius: 1, borderColor: "grey.900" }}>
      <Paper sx={{ p: 1, }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 8 }}>
            Question {currentPosition} of {totalQuestions}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ width: '100px' }}>
              {(timeLimit > 0 && !done) &&
                <LinearProgressWithLabel color="warning"
                  valueLimit={timeLimit}
                  valueLeft={timeLeft}
                  formatter={remainingDurationFormat}
                />
              }
            </Box>
            <Tooltip title="Test Settings">
              <IconButton size="small" color="primary"
                component={Link} to=".."
              ><SettingsIcon /></IconButton></Tooltip>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

const QuestionView = ({ done, question }) => {
  return (
    <Panel>
      <Stack direction="row" spacing={2}>
        <Typography fontSize={24}>Q: </Typography>

        <Stack sx={{ alignItems: 'flex-end' }}>
          <Stack direction="row" spacing={2}>
            <div>{' '}</div>
            <div><Typography fontSize={32}>{question.operand1}</Typography></div>
          </Stack>
          <Stack direction="row" spacing={2}>
            <div><Typography fontSize={32}>{question.operation}</Typography></div>
            <div><Typography fontSize={32}>{question.operand2}</Typography></div>
          </Stack>
        </Stack>
      </Stack>
      {/* <pre>{JSON.stringify(question, null, 2)}</pre> */}
    </Panel>
  )
}
const AnswerView = ({ done, answer, onSubmit, onNext, onSummary }) => {

  const methods = useForm({ defaultValues: { value: '' } });
  const { handleSubmit, reset, control, watch, getValues } = methods;

  const onNextClicked = async (data) => {
    await onSubmit(data)
    onNext()
  }
  const onSummaryClicked = async (data) => {
    await onSubmit(data)
    onSummary()
  }

  const actionsRight = (
    <Stack direction="row" spacing={2} >
      {/* <Button onClick={handleSubmit(onSubmit)} variant={"contained"} disabled={done}>
        Submit
      </Button> */}
      {onNext && <Button onClick={handleSubmit(onNextClicked)} variant={"contained"} >
        Next
      </Button>}
      {!onNext && <Button onClick={handleSubmit(onSummaryClicked)} variant={"outlined"} >
        Summary
      </Button>}
    </Stack>
  )

  return (
    <Panel actionsRight={actionsRight}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputText name="value" label="Answer"
          type="number"
          control={control} disabled={done} />
      </form>
    </Panel>
  )
}

export default QAView