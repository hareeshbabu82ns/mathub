import { RotateCcw as RefetchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  IAbacusCollectiveTestSummary,
  IAbacusTestData,
  IAbacusTestSummary,
} from '@/lib/abacus_types'
import { FETCT_TEST_SUMMARY } from '@/lib/gql_queries'
import { useQuery } from '@apollo/client'
import { subDays } from 'date-fns'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { collectiveSummary } from '@/lib/abacus_utils'
import { DatePickerWithRange } from '../Dashboard/DateRangePicker'
import { Link } from 'react-aria-components'

const AbacusTestListPage = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const [testSummary, setTestSummary] = useState<IAbacusCollectiveTestSummary>({
    timeSeries: [],
    dailySeries: [],
  } as IAbacusCollectiveTestSummary)

  const { loading, error, data, refetch } = useQuery<{
    tests: IAbacusTestData[]
  }>(FETCT_TEST_SUMMARY, {
    variables: { type: 'ABACUS', from: dateRange.from, to: dateRange.to },
  })

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
    <div className="mt-3 flex flex-1 flex-col rounded-sm border">
      <div className="flex flex-1 flex-col items-center justify-between gap-2 border-b-2 p-2 px-4 md:flex-row">
        <h1 className="text-lg font-extrabold">Abacus</h1>
        <div className="flex items-center gap-2">
          <DatePickerWithRange
            fromDate={dateRange.from}
            toDate={dateRange.to}
            onDateUpdate={(from, to) => {
              setDateRange({ from, to })
            }}
          />
          <Button
            variant="ghost"
            type="button"
            onClick={refetch}
            disabled={loading || !!error?.message}
          >
            <RefetchIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {data && <AbacusTestSummaryGrid summary={testSummary} />}
      </div>
    </div>
  )
}

export default AbacusTestListPage

const AbacusTestSummaryGrid = ({
  summary,
}: {
  summary: IAbacusCollectiveTestSummary
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
      {summary.timeSeries
        .sort((a, b) => (a.dateShort < b.dateShort ? 1 : -1))
        .map((item) => (
          <AbacusTestSummaryGridItem key={item.id} summary={item} />
        ))}
    </div>
  )
}

const AbacusTestSummaryGridItem = ({
  summary,
}: {
  summary: IAbacusTestSummary
}) => {
  return (
    <Link href={`/abacus/summary/${summary.id}`}>
      <div className="rounded-sm border p-2">
        <h1>{summary.dateShort}</h1>
        <div className="mt-2 grid grid-cols-2 items-center gap-1">
          <h4 className="text-sm font-light">Total Time: </h4>
          <h4 className="text-right text-lg font-bold text-primary">
            {`${Math.floor(summary.timeTaken / 60)}:${summary.timeTaken % 60}s`}
          </h4>
          <h4 className="text-sm font-light">Avg Per Q: </h4>
          <h4 className="text-right text-lg font-semibold text-primary">
            {`${Math.floor(summary.avgTimePerQuestion / 60)}:${summary.avgTimePerQuestion % 60}s`}
          </h4>
          <h4 className="text-sm font-light">Correct: </h4>
          <h4 className="text-right text-lg font-bold text-green-700">
            {summary.correctAnswers}
          </h4>
          <h4 className="text-sm font-light">Wrong: </h4>
          <h4 className="text-right text-lg font-bold text-amber-700">
            {summary.wrongAnswers}
          </h4>
          <h4 className="text-sm font-light">Skipped: </h4>
          <h4 className="text-right text-lg font-light ">{summary.skipped}</h4>
          <h4 className="text-sm font-light">Total: </h4>
          <h4 className="text-right text-lg font-bold ">
            {summary.totalQuestions}
          </h4>
        </div>

        {/* <pre>{JSON.stringify(summary, null, 2)}</pre> */}
      </div>
    </Link>
  )
}
