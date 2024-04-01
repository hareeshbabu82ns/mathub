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

interface AvgQuestionsProps {
  data: IAbacusTestSummary[];
}

const AvgQuestions = ({ data = [] }: AvgQuestionsProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="dateShort" padding={{ left: 15, right: 30 }} />
        <YAxis name="" />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="avgWrongAnswers"
          name="Wrong Answers"
          stroke={colors.amber[800]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="avgCorrectAnswers"
          name="Correct Answers"
          stroke={colors.green[800]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="avgSkippedAnswers"
          name="Skipped Answers"
          stroke={colors.zinc[700]}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AvgQuestions;
