import React, { useState } from "react";
import { useQuery, gql, NetworkStatus } from "@apollo/client";

import Panel from "./Panel";
import { CircularProgress, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import moment from "moment";
import RefreshIcon from '@mui/icons-material/Refresh';
import { summary, collectiveSummary } from "../utils/arithmetic_utils";
import ArithmeticTestPieChart from "./ArithmeticTestPieChart";
import ArithmeticTestStackedBarChart from "./ArithmeticTestStackedBarChart";
import TestTimeBarChart from "./TestTimeBarChart";

const FETCT_TEST_SUMMARY = gql`
query FetchTestSummary($from: DateTime!) {
  tests(
    where: { type: ARITHMETIC, createdAt_gte: $from }
    orderBy: { createdAt: DESC }
  ) {
    id
    createdAt
    updatedAt
    type
    questions
    answers
  }
}
`

const sinceTenDays = moment().subtract(10, 'days').toISOString()

const ArithmeticTestSummary = () => {

  const variables = { from: sinceTenDays }
  const { loading, error, data, refetch, networkStatus } = useQuery(FETCT_TEST_SUMMARY, { variables })
  const [refetching, setRefetching] = useState(false)

  if (loading) return <Panel><CircularProgress /></Panel>

  const { timeSeries } = collectiveSummary(data?.tests)

  const listItem = (data) => {
    const d = {
      ...data,
      startAt: moment(data.createdAt).format('MMM DD yy hh:mm a'),
      endAt: moment(data.updatedAt).format('hh:mm a'),
    }

    const s = summary(d)

    const chartData = s.operations.map(o => {
      const d = s.operationWise[o]
      return {
        operation: d.operation,
        correct: d.correctAnswers,
        wrong: d.wrongAnswers,
        total: d.totalQuestions,
      }
    })

    const qaSummaryLine = ({ correctAnswers, totalQuestions, wrongAnswers }) => (
      <Typography as="span" fontSize={20}> {correctAnswers} / {totalQuestions}
        {' '} <Typography as="span" sx={{ color: 'warning.500' }}>{wrongAnswers}</Typography>
      </Typography>
    )
    const qaOperationWiseSummaryLine = ({ operation, correctAnswers, totalQuestions, wrongAnswers }) => (
      <><Typography as="span" fontSize={24}>{operation}</Typography>
        : {qaSummaryLine({ correctAnswers, totalQuestions, wrongAnswers })} {'; '}</>
    )

    return (
      <ListItem key={d.id} sx={{ border: 1, borderRadius: 1, borderColor: "grey.300", mb: 1 }} >
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Stack sx={{ flexGrow: 1 }}>
            <Typography>{d.startAt} ( {s.testTimeDiff} ) {qaSummaryLine({ ...s })}</Typography>
            <span>
              {/* <Typography as="span" fontSize={16} sx={{ color: 'grey.500' }}>{d.type}</Typography> */}
              {' '}{s.operations.map(operation => qaOperationWiseSummaryLine({ ...s.operationWise[operation] }))} </span>
          </Stack>
          <ArithmeticTestStackedBarChart data={chartData} />
        </Stack>
      </ListItem>
    )
  }

  const toolbarActions = (
    <React.Fragment>
      <IconButton disabled={loading || (networkStatus === NetworkStatus.refetch) || refetching}
        onClick={async () => { setRefetching(true); await refetch(); setRefetching(false); }}>
        <RefreshIcon />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Panel title='Arithmetic Tests'
      toolbarActions={toolbarActions}>
      {/* {JSON.stringify(data, null, 2)} */}

      <Stack spacing={2}>

        <Panel title='Charts'>

          <Stack>

            <TestTimeBarChart data={timeSeries} title="Time took for Test"
              height={200} width={300} />

          </Stack>

        </Panel>

        <Panel title='History'>
          <List>
            {data?.tests?.map(listItem)}
          </List>
        </Panel>

      </Stack>

    </Panel>
  )
}



export default ArithmeticTestSummary