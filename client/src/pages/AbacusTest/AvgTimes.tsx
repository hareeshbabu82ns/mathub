import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import colors from "tailwindcss/colors";

import { IAbacusTestSummary } from "@/lib/abacus_utils";

interface AvgTimesProps {
  data: IAbacusTestSummary[];
}

const AvgTimes = ({ data = [] }: AvgTimesProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="dateShort" padding={{ left: 15, right: 30 }} />
        <YAxis name="Time (in Sec)" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="avgTimePerQuestion"
          name="Time Per Question"
          stroke={colors.amber[600]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="avgTargetTimePerQuestion"
          name="Target Time Per Question"
          stroke={colors.green[600]}
          strokeWidth={2}
        />

        {/* <Line
          type="monotone"
          dataKey="avgWrongAnswers"
          stroke={colors.amber[800]}
        />
        <Line type="monotone" dataKey="avgCorrectAnswers" stroke="#06b6d4" />
        <Line type="monotone" dataKey="avgSkippedAnswers" stroke="#82ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AvgTimes;
