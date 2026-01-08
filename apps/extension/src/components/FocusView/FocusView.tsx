import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { getRandomQuote, type Quote } from '@/data/quotes'
import { FocusTopBar } from './FocusTopBar'
import { FocusClock } from './FocusClock'
import { FocusTaskList } from './FocusTaskList'
import { FocusQuote } from './FocusQuote'
import { FocusFloatButton } from './FocusFloatButton'

interface FocusViewProps {
  onSwitchView?: () => void
}

export function FocusView({ onSwitchView }: FocusViewProps) {
  const { theme } = useTheme()
  const [quote] = useState<Quote>(() => getRandomQuote())

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col relative overflow-hidden animate-fadeIn">
      {/* 背景纹理层 */}
      {theme.showTexture && (
        <div className="absolute inset-0 pointer-events-none opacity-40 paper-texture" />
      )}

      <FocusTopBar />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <FocusClock />
        <FocusTaskList />
      </div>

      <FocusQuote quote={quote} />
      <FocusFloatButton onSwitchView={onSwitchView} />
    </div>
  )
}
