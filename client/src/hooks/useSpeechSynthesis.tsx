import React, { useState, useEffect, createContext, useContext } from 'react'

export type SpeechSynthesisStatus = 'paused' | 'speaking' | 'stopped'

type SpeechSynthesisState = {
  speak: (text: string) => void
  stop: () => void
  pause: () => void
  resume: () => void
  status: SpeechSynthesisStatus
  setRate: (rate: number) => void
}

const SpeechSynthesisProviderContext = createContext<
  SpeechSynthesisState | undefined
>(undefined)

export function SpeechSynthesisProvider({
  children,
  ...props
}: React.PropsWithChildren<object>) {
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null,
  )
  const [status, setStatus] = useState<SpeechSynthesisStatus>('stopped')

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance()
      utterance.onstart = () => setStatus('speaking')
      utterance.onend = () => setStatus('stopped')
      utterance.onpause = () => setStatus('paused')
      utterance.onresume = () => setStatus('speaking')
      utterance.rate = 0.6
      setUtterance(utterance)
      return () => window.speechSynthesis.cancel()
    } else {
      console.warn('Speech synthesis is not supported in this browser.')
    }
  }, [])

  const speak = (text: string) => {
    if (utterance) {
      window.speechSynthesis.cancel()
      utterance.text = text
      window.speechSynthesis.speak(utterance)
      setStatus('speaking')
    }
  }

  const stop = () => {
    if (utterance) {
      window.speechSynthesis.cancel()
      setStatus('stopped')
    }
  }

  const pause = () => {
    if (utterance) {
      window.speechSynthesis.pause()
      setStatus('paused')
    }
  }

  const resume = () => {
    if (utterance) {
      window.speechSynthesis.resume()
      setStatus('speaking')
    }
  }

  const setRate = (rate: number) => {
    if (utterance) {
      utterance.rate = rate
    }
  }

  const value = {
    speak,
    pause,
    stop,
    resume,
    status,
    setRate,
  }

  return (
    <SpeechSynthesisProviderContext.Provider {...props} value={value}>
      {children}
    </SpeechSynthesisProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSpeechSynthesis = () => {
  const context = useContext(SpeechSynthesisProviderContext)

  if (context === undefined)
    throw new Error(
      'useSpeechSynthesis must be used within a SpeechSynthesisProvider',
    )

  return context
}

// export const SPEECH_SYNTHESIS_STATUS = {
//   PAUSED: 'paused',
//   SPEAKING: 'speaking',
//   STOPPED: 'stopped',
// };

// function useSpeechSynthesis() {
//   const [utterance, setUtterance] = useState<SpeechSynthesisUtterance|null>(null);
//   const [status, setStatus] = useState(SPEECH_SYNTHESIS_STATUS.STOPPED);

//   useEffect(() => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance();
//       utterance.onstart = () => setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
//       utterance.onend = () => setStatus(SPEECH_SYNTHESIS_STATUS.STOPPED);
//       utterance.onpause = () => setStatus(SPEECH_SYNTHESIS_STATUS.PAUSED);
//       utterance.onresume = () => setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
//       utterance.rate = 0.6;
//       setUtterance(utterance);
//     } else {
//       console.warn('Speech synthesis is not supported in this browser.');
//     }
//   }, []);

//   const speak = (text:string) => {
//     if (utterance) {
//       window.speechSynthesis.cancel();
//       utterance.text = text;
//       window.speechSynthesis.speak(utterance);
//       setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
//     }
//   };

//   const pause = () => {
//     if (utterance) {
//       window.speechSynthesis.pause();
//       setStatus(SPEECH_SYNTHESIS_STATUS.PAUSED);
//     }
//   };

//   const resume = () => {
//     if (utterance) {
//       window.speechSynthesis.resume();
//       setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
//     }
//   };

//   const setRate = (rate:number) => {
//     if (utterance) {
//       utterance.rate = rate;
//     }
//   };

//   return { speak, pause, resume, status, setRate };
// }

// export default useSpeechSynthesis;

// export const SpeechSynthesisContext = createContext();

// export function SpeechSynthesisProvider({ children }: { children: React.ReactNode }) {
//   const speechSynthesis = useSpeechSynthesis();

//   return (
//     <SpeechSynthesisContext.Provider value={speechSynthesis}>
//       {children}
//     </SpeechSynthesisContext.Provider>
//   );
// }
