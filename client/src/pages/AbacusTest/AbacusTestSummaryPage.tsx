import WithLoaderErrorOverlay from '@/components/WithLoaderErrorOverlay'
import { IAbacusTestData } from '@/lib/abacus_types'
import { abacusTestSummary } from '@/lib/abacus_utils'
import { FETCH_TEST_BY_ID } from '@/lib/gql_queries'
import { cn } from '@/lib/utils'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check as CorrectIcon, X as WrongIcon } from 'lucide-react'

const AbacusTestSummaryPage = () => {
  const { id } = useParams<{ id: string }>()

  const { loading, error, data } = useQuery<{ test: IAbacusTestData }>(
    FETCH_TEST_BY_ID,
    { variables: { id } },
  )

  return (
    <WithLoaderErrorOverlay loading={loading} error={error}>
      {data?.test ? (
        <AbacusTestSummaryView test={data?.test} />
      ) : (
        <div>Test not found</div>
      )}
    </WithLoaderErrorOverlay>
  )
}

export default AbacusTestSummaryPage

const AbacusTestSummaryView = ({ test }: { test: IAbacusTestData }) => {
  return (
    <div className="flex w-full flex-1 flex-col rounded-sm border">
      <TestSummaryHeader test={test} />
      <div>
        <h1 className="p-2 text-lg font-extrabold">Questions</h1>
        <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2 lg:grid-cols-3">
          {test.questions.map((q, i) => (
            <QAView
              key={i}
              index={i}
              question={q.question}
              answer={q.answer}
              selectedAnswer={test.answers[i].value}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const TestSummaryHeader = ({ test }: { test: IAbacusTestData }) => {
  const [testSummary] = useState(abacusTestSummary(test))
  return (
    <div className="flex items-center justify-between border-b-2 p-2 px-4">
      <div>
        <h1 className="text-lg font-extrabold">Test Summary</h1>
        <h4 className="text-sm font-light">Date: {testSummary.dateShort}</h4>
        <h4 className="text-sm font-light">
          Total Time:{' '}
          {`${Math.floor(testSummary.timeTaken / 60)}:${testSummary.timeTaken % 60}s`}
        </h4>
        <h4 className="text-sm font-light">
          Avg Per Q:{' '}
          {`${Math.floor(testSummary.avgTimePerQuestion / 60)}:${testSummary.avgTimePerQuestion % 60}s`}
        </h4>
      </div>
      <div className="grid grid-cols-2 items-center">
        <h4 className="text-sm font-light">Correct: </h4>
        <h4 className="text-right text-lg font-bold text-green-700">
          {testSummary.correctAnswers}
        </h4>
        <h4 className="text-sm font-light">Wrong: </h4>
        <h4 className="text-right text-lg font-bold text-amber-700">
          {testSummary.wrongAnswers}
        </h4>
        <h4 className="text-sm font-light">Skipped: </h4>
        <h4 className="text-right text-lg font-light ">
          {testSummary.skipped}
        </h4>
        <h4 className="text-sm font-light">Total: </h4>
        <h4 className="text-right text-lg font-bold ">
          {testSummary.totalQuestions}
        </h4>
      </div>
      {/* <pre>{JSON.stringify(testSummary, null, 2)}</pre> */}
    </div>
  )
}

const QAView = ({
  index,
  question,
  answer,
  selectedAnswer,
}: {
  index: number
  question: number[]
  answer: number
  selectedAnswer: string
}) => {
  const isCorrect =
    selectedAnswer && selectedAnswer.toString() === answer.toString()
  return (
    <div className="flex w-full flex-col rounded-sm border">
      <div className="flex w-full flex-row items-center justify-between border-b px-4 py-2">
        <h1 className="text-lg font-extrabold">{index + 1}</h1>
        {isCorrect ? (
          <CorrectIcon className="text-green-700" />
        ) : (
          <WrongIcon className="text-amber-700" />
        )}
      </div>
      <div className="m-auto p-4 py-6">
        <div className="flex flex-col items-end gap-6 tracking-[0.5rem]">
          {question.map((n, i) => (
            <div key={i} className="font-mono text-xl">
              {n}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center border-t p-4 py-6 font-mono tracking-[0.5rem]">
        <div>
          <h4 className="text-xl font-light ">({answer})</h4>
        </div>
        <div>
          <h4
            className={cn(
              'text-xl font-light',
              selectedAnswer === answer.toString()
                ? 'text-green-700'
                : 'text-amber-700',
            )}
          >
            {selectedAnswer && selectedAnswer.toString().trim().length
              ? selectedAnswer
              : '---'}
          </h4>
        </div>
      </div>
    </div>
  )
}
