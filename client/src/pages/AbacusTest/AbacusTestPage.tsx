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
import { useEffect, useState } from 'react'
import {
  ArrowBigLeftDash as PreviousIcon,
  ArrowBigRightDash as NextIcon,
  PlayCircle as PlayIcon,
  StopCircle as StopIcon,
} from 'lucide-react'
import { generateAbacusQuestions } from '@/lib/abacus_utils'
import useCountDownTimer from '@/hooks/CountDownTimer'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { useNotifications } from '@/hooks/useNotifications'

const AbacusTestPage = () => {
  const navigate = useNavigate()
  const { notifyPush } = useNotifications()

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
    const data = await createTest({ variables })
    const testPath = `/abacus/summary/${data.data.createTest.id}`
    notifyPush('New Abacus Test Created', 'default', testPath)
    // console.log(data)
    navigate(testPath)
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
  const { speak, stop, status } = useSpeechSynthesis()

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(
    Array(settings.totalQuestions).fill(''),
  )

  const [testData] = useState(generateAbacusQuestions(settings))

  const handleSubmit = () => {
    onSubmitTest(testData, answers)
  }

  const playPauseButton =
    status !== 'speaking' ? (
      <Button
        size={'sm'}
        variant={'ghost'}
        onClick={() => speak(testData[questionIndex].question.join(', '))}
      >
        <PlayIcon />
      </Button>
    ) : (
      <Button size={'sm'} variant={'ghost'} onClick={() => stop()}>
        <StopIcon />
      </Button>
    )

  const titleInfoBar = (
    <>
      <div className="flex items-center justify-between p-2 px-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-extrabold">Abacus Test</h1>
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-light">
              {questionIndex + 1} of {settings.totalQuestions}
            </h4>
            {playPauseButton}
          </div>
        </div>
        <div className="flex items-center">
          <TimerCircleSlider totalTime={settings.timeLimit * 60} />
        </div>
      </div>
      <Progress
        className="h-1 rounded-none"
        value={((questionIndex + 1) / settings.totalQuestions) * 100}
      />
    </>
  )

  const actionButtons = (
    <div className="flex items-center justify-between border-t px-4 py-2 md:py-4">
      <div>
        <Button
          variant={'outline'}
          size={'sm'}
          disabled={questionIndex === 0}
          onClick={() => setQuestionIndex(questionIndex - 1)}
        >
          <PreviousIcon className="h-8 w-8" />
        </Button>
      </div>
      <div>
        {questionIndex === settings.totalQuestions - 1 && (
          <Button variant={'outline'} size={'sm'} onClick={handleSubmit}>
            Subbmit
          </Button>
        )}
      </div>
      <div>
        <Button
          variant={'outline'}
          size={'sm'}
          disabled={questionIndex === settings.totalQuestions - 1}
          onClick={() => setQuestionIndex(questionIndex + 1)}
        >
          <NextIcon className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )

  return (
    // <div className="grid h-full w-full items-start overflow-auto rounded-sm border">
    <div className="flex h-full flex-col rounded-sm border">
      {titleInfoBar}
      <QAView
        key={`qaview-${questionIndex}`}
        className="flex-grow"
        question={testData[questionIndex].question}
        choices={testData[questionIndex].choices}
        selectedAnswer={answers[questionIndex]}
        timeLimit={settings.timeLimitPerQuestion}
        onSelected={(choice) => {
          const newAnswers = [...answers]
          newAnswers[questionIndex] = choice.toString()
          setAnswers(newAnswers)
        }}
      />
      {actionButtons}
      {/* <pre className="border-t p-4">{JSON.stringify(settings, null, 2)}</pre> */}
    </div>
  )
}

const QAView = ({
  question,
  choices,
  selectedAnswer,
  timeLimit,
  onSelected,
  className,
}: {
  question: number[]
  choices: number[]
  timeLimit?: number
  selectedAnswer?: string | undefined
  onSelected: (choice: number) => void
  className?: string
}) => {
  const { speak } = useSpeechSynthesis()
  const [timeLeft] = useCountDownTimer(timeLimit || 0)

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(question.join('. '))
    }, 500) // Wait for 0.5 seconds before starting
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div className="m-auto flex-1 p-4">
        <div className="flex flex-col items-end gap-4 tracking-[0.7rem] md:gap-6 md:tracking-[1rem]">
          {question.map((n, i) => (
            <div key={i} className="font-mono text-3xl md:text-4xl">
              {n}
              {/* {question
                .reduce((acc, curr, j) => (j <= i ? acc + curr : acc), 0)
                .toString()
                .padStart(3, '0')
                .padStart(4, '-')} */}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t" />
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
            className="col-span-1 h-16 w-16 border text-xl md:h-28 md:w-28 md:text-2xl"
            value={`${c}`}
          >
            {c}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Progress
        className="h-0.5 rounded-none"
        value={100 - (timeLeft / (timeLimit || 0)) * 100}
      />
    </div>
  )
}
