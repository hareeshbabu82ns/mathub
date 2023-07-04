import { useState, useEffect } from 'react';

export default function useCountDownTimer(timeLimit) {
  const [timeLeft, setTimeLeft] = useState(timeLimit)

  useEffect(() => {
    // console.log('timer effect')
    if (timeLimit === 0) return null
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 0) {
          clearInterval(timer)
          return 0
        }
        return prevTimeLeft - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  })

  return [timeLeft]
}