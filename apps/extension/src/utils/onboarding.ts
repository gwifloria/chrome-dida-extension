const ONBOARDING_KEY = 'onboarding_completed'

/**
 * 检查是否需要显示引导
 */
export async function shouldShowOnboarding(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get(ONBOARDING_KEY, (result) => {
      resolve(!result[ONBOARDING_KEY])
    })
  })
}

/**
 * 标记引导已完成
 */
export function completeOnboarding(): void {
  chrome.storage.local.set({ [ONBOARDING_KEY]: true })
}

/**
 * 重置引导状态（用于测试）
 */
export function resetOnboarding(): void {
  chrome.storage.local.remove(ONBOARDING_KEY)
}
