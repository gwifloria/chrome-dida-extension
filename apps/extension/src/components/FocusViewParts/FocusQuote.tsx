import { useTheme } from '@/hooks/useTheme'
import type { Quote } from '@/data/quotes'

interface FocusQuoteProps {
  quote: Quote
}

export function FocusQuote({ quote }: FocusQuoteProps) {
  const { theme } = useTheme()

  return (
    <div className="text-center pb-8 px-6 relative z-10">
      <p
        className="text-lg text-[var(--text-primary)] italic opacity-70 max-w-3xl mx-auto"
        style={{
          fontFamily:
            theme.type === 'journal' ? 'var(--font-heading)' : 'inherit',
        }}
      >
        "{quote.text}"
      </p>
      <p className="text-xs text-[var(--text-secondary)] mt-2 tracking-widest uppercase font-bold opacity-40">
        {quote.author}
      </p>
    </div>
  )
}
