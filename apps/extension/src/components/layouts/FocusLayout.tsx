import { FocusView } from '@/components/FocusView'
import { Onboarding } from '@/components/Onboarding'

interface FocusLayoutProps {
  onSwitchView?: () => void
}

export function FocusLayout({ onSwitchView }: FocusLayoutProps) {
  return (
    <>
      <Onboarding />
      <FocusView onSwitchView={onSwitchView} />
    </>
  )
}
