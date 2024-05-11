import VoiceSpeedSelector from '@/components/blocks/voice-speed-selector'
import { ThemeModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CogIcon as SettingsIcon } from 'lucide-react'

export default function QuickSettingsTrigger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick Settings</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <p>Voice Speed: </p>
          <VoiceSpeedSelector />
          <p>App Theme: </p>
          <ThemeModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
