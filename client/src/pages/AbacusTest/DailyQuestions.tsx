import { IAbacusDailyTestSummary } from '@/lib/abacus_types'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts'
import colors from 'tailwindcss/colors'

interface DailyQuestionsProps {
  data: IAbacusDailyTestSummary[]
}

const DailyQuestions = ({ data = [] }: DailyQuestionsProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <XAxis dataKey="dateShort" padding={{ left: 15, right: 30 }} />
        <YAxis name="" />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="totalTests"
          name="Total Tests"
          stroke={colors.green[800]}
          strokeWidth={2}
        />

        <Bar
          type="monotone"
          dataKey="correctAnswers"
          name="Correct Answers"
          fill={colors.green[800]}
          strokeWidth={2}
          stackId="questions"
        />
        <Bar
          type="monotone"
          dataKey="skipped"
          name="Skipped Answers"
          fill={colors.zinc[700]}
          strokeWidth={2}
          stackId="questions"
        />
        <Bar
          type="monotone"
          dataKey="wrongAnswers"
          name="Wrong Answers"
          fill={colors.red[700]}
          strokeWidth={2}
          stackId="questions"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default DailyQuestions
