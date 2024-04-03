import { useState, useEffect, createContext } from 'react';

export const SPEECH_SYNTHESIS_STATUS = {
  PAUSED: 'paused',
  SPEAKING: 'speaking',
  STOPPED: 'stopped',
};

function useSpeechSynthesis() {
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance|null>(null);
  const [status, setStatus] = useState(SPEECH_SYNTHESIS_STATUS.STOPPED);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.onstart = () => setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
      utterance.onend = () => setStatus(SPEECH_SYNTHESIS_STATUS.STOPPED);
      utterance.onpause = () => setStatus(SPEECH_SYNTHESIS_STATUS.PAUSED);
      utterance.onresume = () => setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
      utterance.rate = 0.6;
      setUtterance(utterance);
    } else {
      console.warn('Speech synthesis is not supported in this browser.');
    }
  }, []);

  const speak = (text:string) => {
    if (utterance) {
      window.speechSynthesis.cancel();
      utterance.text = text;
      window.speechSynthesis.speak(utterance);
      setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
    }
  };

  const pause = () => {
    if (utterance) {
      window.speechSynthesis.pause();
      setStatus(SPEECH_SYNTHESIS_STATUS.PAUSED);
    }
  };

  const resume = () => {
    if (utterance) {
      window.speechSynthesis.resume();
      setStatus(SPEECH_SYNTHESIS_STATUS.SPEAKING);
    }
  };

  const setRate = (rate:number) => {
    if (utterance) {
      utterance.rate = rate;
    }
  };

  return { speak, pause, resume, status, setRate };
}

export default useSpeechSynthesis;

export const SpeechSynthesisContext = createContext();

export function SpeechSynthesisProvider({ children }) {
  const speechSynthesis = useSpeechSynthesis();

  return (
    <SpeechSynthesisContext.Provider value={speechSynthesis}>
      {children}
    </SpeechSynthesisContext.Provider>
  );
}
