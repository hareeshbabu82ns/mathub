import { Stack, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TestTimeBarChart = ({ data, width = 150, height = 100, title }) => {
  return (
    <Stack sx={{ width, height, alignItems: 'center', p: 1, border: 1, borderRadius: 1 }}>
      <Typography>{title}</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="time" />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
};

export default TestTimeBarChart;
