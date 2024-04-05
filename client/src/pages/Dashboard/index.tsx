import WithLoaderErrorOverlay from '@/components/WithLoaderErrorOverlay'
import { collectiveSummary } from '@/lib/abacus_utils'
import { FETCT_TEST_SUMMARY } from '@/lib/gql_queries'
import { useQuery } from '@apollo/client'
import { subDays } from 'date-fns'
import { useEffect, useState } from 'react'
import AvgTimes from '../AbacusTest/AvgTimes'
import AvgQuestions from '../AbacusTest/AvgQuestions'
import DailyQuestions from '../AbacusTest/DailyQuestions'
import { DatePickerWithRange } from './DateRangePicker'
import { DateRange } from 'react-day-picker'
import {
  IAbacusCollectiveTestSummary,
  IAbacusTestData,
} from '@/lib/abacus_types'

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const { loading, error, data, refetch } = useQuery<{
    tests: IAbacusTestData[]
  }>(FETCT_TEST_SUMMARY, {
    variables: { type: 'ABACUS', from: dateRange.from, to: dateRange.to },
  })

  const [testSummary, setTestSummary] = useState<IAbacusCollectiveTestSummary>({
    timeSeries: [],
    dailySeries: [],
  } as IAbacusCollectiveTestSummary)

  useEffect(() => {
    if (data?.tests) {
      setTestSummary(collectiveSummary(data.tests))
    }
  }, [data])

  useEffect(() => {
    const variables = { from: dateRange.from, to: dateRange.to }
    refetch(variables)
  }, [refetch, dateRange])

  return (
    <WithLoaderErrorOverlay loading={loading} error={error}>
      <div className="flex-1 space-y-4 ">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange
              fromDate={dateRange.from}
              toDate={dateRange.to}
              onDateUpdate={(from, to) => {
                setDateRange({ from, to })
              }}
            />
            {/* <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Download
            </button> */}
          </div>
        </div>
        <div className="mt-2 space-y-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">
                  Average Time Per Question
                </h3>
              </div>
              <div className="h-96 w-full">
                <AvgTimes data={testSummary.timeSeries} />
              </div>
            </div>
            <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">
                  Average Answers
                </h3>
              </div>
              <div className="h-96 w-full">
                <AvgQuestions data={testSummary.timeSeries} />
              </div>
            </div>
            <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">
                  Daily Stats
                </h3>
              </div>
              <div className="h-96 w-full">
                <DailyQuestions data={testSummary.dailySeries} />
              </div>
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(testSummary, null, 2)}</pre> */}
      </div>
    </WithLoaderErrorOverlay>
  )
}

export default DashboardPage
