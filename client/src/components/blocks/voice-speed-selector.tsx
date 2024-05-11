import { useLocalStorage } from 'usehooks-ts'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export const VOICE_SPEED_KEY = 'voiceSpeed'
export const VOICE_SPEED_DEFAULT = '1'
// eslint-disable-next-line react-refresh/only-export-components
export const VOICE_SPEEDS = [
  '.25',
  '.5',
  '.75',
  '1',
  '1.25',
  '1.5',
  '1.75',
  '2',
]

export default function VoiceSpeedSelector() {
  const [voiceSpeed, setVoiceSpeeds] = useLocalStorage(
    VOICE_SPEED_KEY,
    VOICE_SPEED_DEFAULT,
  )

  return (
    <Select value={voiceSpeed} onValueChange={setVoiceSpeeds}>
      <SelectTrigger>
        <SelectValue placeholder="Voice Speed..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {VOICE_SPEEDS.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
