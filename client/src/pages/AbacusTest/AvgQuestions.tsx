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

interface AvgQuestionsProps {
  data: IAbacusTestSummary[]
}

const AvgQuestions = ({ data = [] }: AvgQuestionsProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data.map((d) => ({
          dateShort: d.dateShort,
          targegetQs: 100,
          currentQs: Math.round((d.totalQuestions / d.timeTaken) * 8 * 60),
        }))}
      >
        <XAxis dataKey="dateShort" padding={{ left: 15, right: 30 }} />
        <YAxis name="Total Questions" padding={{ top: 30, bottom: 15 }} />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="targegetQs"
          name="Target Questions"
          stroke={colors.green[800]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="currentQs"
          name="Current Questions"
          stroke={colors.amber[800]}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default AvgQuestions
