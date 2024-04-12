import { IAbacusTestSummary } from '@/lib/abacus_types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import colors from 'tailwindcss/colors'

interface AvgAnswersProps {
  data: IAbacusTestSummary[]
}

const AvgAnswers = ({ data = [] }: AvgAnswersProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="dateShort" padding={{ left: 15, right: 30 }} />
        <YAxis name="" padding={{ top: 30, bottom: 15 }} />
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
  )
}

export default AvgAnswers
