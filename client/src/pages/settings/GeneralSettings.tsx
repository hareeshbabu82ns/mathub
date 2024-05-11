import VoiceSpeedSelector from '@/components/blocks/voice-speed-selector'
import AppearanceSettings from './AppearanceSettings'

const GeneralSettings = () => {
  return (
    <div className="grid gap-6">
      <div className="rounded-sm border p-4">
        <div>
          <h3 className="text-lg font-medium">Quick Settings</h3>
          <p className="text-sm text-muted-foreground">
            Various app settings for Content and UI.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <p>Voice Speed: </p>
          <VoiceSpeedSelector />
        </div>
      </div>
      <AppearanceSettings />
    </div>
  )
}

export default GeneralSettings
