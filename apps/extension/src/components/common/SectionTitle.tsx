import { memo } from 'react'

interface SectionTitleProps {
  title: string
}

export const SectionTitle = memo(function SectionTitle({
  title,
}: SectionTitleProps) {
  return (
    <div className="px-3 py-2 text-[11px] font-medium text-[var(--text-secondary)] tracking-wide flex items-center gap-1">
      <span className="text-xs">›</span>
      {title}
    </div>
  )
})
