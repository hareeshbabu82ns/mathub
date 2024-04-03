import TimerCircleSlider from '@/components/TimerCircleSlider'
import WithLoaderErrorOverlay from '@/components/WithLoaderErrorOverlay'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  IAbacusQuestionData,
  IAbacusSettingsData,
  INIT_ABACUS_SETTINGS,
} from '@/lib/abacus_types'
import { FETCH_TEST_SETTINGS, ADD_TEST } from '@/lib/gql_queries'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  ArrowBigLeftDash as PreviousIcon,
  ArrowBigRightDash as NextIcon,
} from 'lucide-react'
import { generateAbacusQuestions } from '@/lib/abacus_utils'
import useCountDownTimer from '@/hooks/CountDownTimer'
import { useNavigate } from 'react-router-dom'

const AbacusTestPage = () => {
  const navigate = useNavigate()

  const {
    loading: settingsLoading,
    error: settingsError,
    data: settingsData,
  } = useQuery(FETCH_TEST_SETTINGS, {
    variables: { type: 'ABACUS' },
  })

  const [createTest, { loading: createTestLoading, error: createTestError }] =
    useMutation(ADD_TEST)

  const [startTime] = useState(new Date())

  const handleSubmitTest = async (
    testData: IAbacusQuestionData[],
    answers: string[],
  ) => {
    const endTime = new Date()
    const variables = {
      type: 'ABACUS',
      createdAt: startTime.toISOString(),
      updatedAt: endTime.toISOString(),
      questions: testData,
      answers: answers.map((value) => ({ value })),
    }
    // const type :'ABACUS'
    // const test :{ type, createdAt, updatedAt, questions, answers }
    const data = await createTest({ variables })
    // console.log(data)
    navigate(`/abacus/summary/${data.data.createTest.id}`)
  }

  return (
    <WithLoaderErrorOverlay
      loading={settingsLoading || createTestLoading}
      error={settingsError || createTestError}
    >
      <AbacusTestView
        settings={{
          ...INIT_ABACUS_SETTINGS,
          ...settingsData?.testsettings[0]?.settings,
        }}
        onSubmitTest={handleSubmitTest}
      />
    </WithLoaderErrorOverlay>
  )
}

export default AbacusTestPage

const AbacusTestView = ({
  settings,
  onSubmitTest,
}: {
  settings: IAbacusSettingsData
  onSubmitTest: (testData: IAbacusQuestionData[], answers: string[]) => void
}) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(
    Array(settings.totalQuestions).fill(''),
  )

  const [testData] = useState(generateAbacusQuestions(settings))

  const handleSubmit = () => {
    onSubmitTest(testData, answers)
  }

  return (
    <div className="grid w-full items-start overflow-auto rounded-sm border">
      <div className="border-b">
        <div className="flex items-center justify-between p-2 px-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-extrabold">Abacus Test</h1>
            <h4 className="text-sm font-light">
              {questionIndex + 1} of {settings.totalQuestions}
            </h4>
          </div>
          <div className="flex items-center">
            <TimerCircleSlider totalTime={settings.timeLimit * 60} />
          </div>
        </div>
        <Progress
          className="h-1 rounded-none"
          value={((questionIndex + 1) / settings.totalQuestions) * 100}
        />
      </div>
      <QAView
        key={`qaview-${questionIndex}`}
        question={testData[questionIndex].question}
        choices={testData[questionIndex].choices}
        // answer={testData[questionIndex].answer}
        selectedAnswer={answers[questionIndex]}
        timeLimit={settings.timeLimitPerQuestion}
        onSelected={(choice) => {
          const newAnswers = [...answers]
          newAnswers[questionIndex] = choice.toString()
          setAnswers(newAnswers)
        }}
      />
      <div className="flex items-center justify-between border-t p-4">
        <div>
          <Button
            variant={'outline'}
            disabled={questionIndex === 0}
            onClick={() => setQuestionIndex(questionIndex - 1)}
          >
            <PreviousIcon className="h-8 w-8" />
          </Button>
        </div>
        <div>
          {questionIndex === settings.totalQuestions - 1 && (
            <Button variant={'outline'} onClick={handleSubmit}>
              Subbmit
            </Button>
          )}
        </div>
        <div>
          <Button
            variant={'outline'}
            disabled={questionIndex === settings.totalQuestions - 1}
            onClick={() => setQuestionIndex(questionIndex + 1)}
          >
            <NextIcon className="h-8 w-8" />
          </Button>
        </div>
      </div>
      <pre className="border-t p-4">{JSON.stringify(settings, null, 2)}</pre>
    </div>
  )
}

const QAView = ({
  question,
  choices,
  // answer,
  selectedAnswer,
  timeLimit,
  onSelected,
}: {
  question: number[]
  choices: number[]
  // answer?: number | undefined
  timeLimit?: number
  selectedAnswer?: string | undefined
  onSelected: (choice: number) => void
}) => {
  const [timeLeft] = useCountDownTimer(timeLimit || 0)
  return (
    <div className="flex w-full flex-col">
      <div className="m-auto p-4">
        <div className="flex flex-col items-end gap-6 tracking-[1rem]">
          {question.map((n, i) => (
            <div key={i} className="font-mono text-4xl">
              {n}
            </div>
          ))}
        </div>
      </div>
      <Progress
        className="h-1 rounded-none"
        value={(timeLeft / (timeLimit || 0)) * 100}
      />
      <ToggleGroup
        className="m-auto grid grid-cols-4 gap-4 p-4"
        type="single"
        value={selectedAnswer ? `${selectedAnswer}` : ''}
        onValueChange={(v) => onSelected(parseInt(v, 10))}
        disabled={!!timeLimit && timeLeft <= 0}
      >
        {choices.map((c, i) => (
          <ToggleGroupItem
            key={i}
            className="col-span-2 h-28 w-28 border text-2xl md:col-span-1"
            value={`${c}`}
          >
            {c}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
