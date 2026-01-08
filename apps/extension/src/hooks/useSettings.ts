import { SettingsContext } from '@/contexts/SettingsContext'
import { createContextHook } from './createContextHook'

export const useSettings = createContextHook(
  SettingsContext,
  'SettingsProvider'
)
