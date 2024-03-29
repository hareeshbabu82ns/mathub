import React, { useState } from 'react';
import { useQuery, gql, NetworkStatus } from '@apollo/client';

import Panel from 'components/Panel';
import { CircularProgress, IconButton, List, ListItem, Stack, Typography } from '@mui/material';
import moment from 'moment';
import RefreshIcon from '@mui/icons-material/Refresh';
import { summary, collectiveSummary } from 'utils/abacus_utils';
import TestTimeBarChart from 'components/TestTimeBarChart';

const FETCT_TEST_SUMMARY = gql`
  query FetchTestSummary($from: DateTime!) {
    tests(where: { type: ABACUS, createdAt_gte: $from }, orderBy: { createdAt: DESC }) {
      id
      createdAt
      updatedAt
      type
      questions
      answers
    }
  }
`;

const sinceTenDays = moment().subtract(300, 'days').toISOString();

const AbacusTestSummary = () => {
  const variables = { from: sinceTenDays };
  const { loading, data, refetch, networkStatus } = useQuery(FETCT_TEST_SUMMARY, {
    variables,
  });
  const [refetching, setRefetching] = useState(false);

  if (loading)
    return (
      <Panel>
        <CircularProgress />
      </Panel>
    );

  const { timeSeries } = collectiveSummary(data?.tests);

  const listItem = (data) => {
    const d = {
      ...data,
      startAt: moment(data.createdAt).format('MMM DD yy hh:mm a'),
      endAt: moment(data.updatedAt).format('hh:mm a'),
    };

    const s = summary(d);

    const qaSummaryLine = ({ correctAnswers, totalQuestions, wrongAnswers }) => (
      <Typography as="span" fontSize={20}>
        {' '}
        {correctAnswers} / {totalQuestions}{' '}
        <Typography as="span" sx={{ color: 'warning.500' }}>
          {wrongAnswers}
        </Typography>
      </Typography>
    );

    return (
      <ListItem key={d.id} sx={{ border: 1, borderRadius: 1, borderColor: 'grey.300', mb: 1 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Stack sx={{ flexGrow: 1 }}>
            <Typography variant="h5">
              ( {s.testTimeDiff} ) {qaSummaryLine({ ...s })}
            </Typography>
            <Typography variant="subtitle2">{d.startAt}</Typography>
          </Stack>
          {/* <ArithmeticTestStackedBarChart data={chartData} /> */}
        </Stack>
      </ListItem>
    );
  };

  const toolbarActions = (
    <React.Fragment>
      <IconButton
        disabled={loading || networkStatus === NetworkStatus.refetch || refetching}
        onClick={async () => {
          setRefetching(true);
          await refetch();
          setRefetching(false);
        }}
      >
        <RefreshIcon />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Panel title="Abacus Tests" toolbarActions={toolbarActions}>
      {/* {JSON.stringify(data, null, 2)} */}

      <Stack spacing={2}>
        <TestTimeBarChart
          data={timeSeries}
          title="Time took for Test"
          height={300}
          width={'100%'}
        />
        <List>{data?.tests?.map(listItem)}</List>
      </Stack>
    </Panel>
  );
};

export default AbacusTestSummary;
