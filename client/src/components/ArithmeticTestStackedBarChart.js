
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ArithmeticTestStackedBarChart = ({ data }) => {

  return (
    <div style={{ width: 150, height: 100 }} >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
        >
          <XAxis dataKey="operation" />
          <Tooltip />
          <Bar dataKey="correct" stackId="a" fill="#8884d8" />
          <Bar dataKey="wrong" stackId="a" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ArithmeticTestStackedBarChart