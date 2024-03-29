import React from 'react';
import ArithmeticTestSummary from '../components/ArithmeticTestSummary';
import AbacusTestSummary from './AbacusTest/AbacusTestSummary';
import { Stack } from '@mui/material';

const HomePage = () => {
  return (
    <Stack gap={2}>
      <AbacusTestSummary />
      <ArithmeticTestSummary />
    </Stack>
  );
};

export default HomePage;
