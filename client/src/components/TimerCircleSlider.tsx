import useCountDownTimer from '@/hooks/CountDownTimer'

const TimerCircleSlider = ({ totalTime }: { totalTime: number }) => {
  const [timeLeft] = useCountDownTimer(totalTime)

  const radius = 40
  const circumference = 2 * Math.PI * radius
  // const [strokeDashoffset, setStrokeDashoffset] = useState(
  //   (1 - timeLeft / totalTime) * circumference,
  // )

  const strokeDashoffset = (1 - timeLeft / totalTime) * circumference
  // useEffect(() => {
  //   setStrokeDashoffset((1 - timeLeft / totalTime) * circumference)
  // }, [timeLeft, totalTime])

  return (
    <div className="text-primary">
      <svg
        className="h-24 w-24"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          // className="text-primary"
          fill="currentColor"
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
        >
          {`${Math.ceil(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}s`}
        </text>
        <circle
          // className="text-primary"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
        />
        <circle
          className="text-muted"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={-strokeDashoffset}
        />
      </svg>
    </div>
  )
}

export default TimerCircleSlider
