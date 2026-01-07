import { ThemeContext } from '@/contexts/ThemeContext'
import { createContextHook } from './createContextHook'

export const useTheme = createContextHook(ThemeContext, 'ThemeProvider')
