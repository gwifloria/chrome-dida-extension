// Background Service Worker
// 处理 OAuth 回调和 token 刷新

const CLIENT_ID = import.meta.env.VITE_DIDA_CLIENT_ID || ''
const CLIENT_SECRET = import.meta.env.VITE_DIDA_CLIENT_SECRET || ''
const TOKEN_URL = 'https://dida365.com/oauth/token'

chrome.runtime.onInstalled.addListener(() => {
  console.log('First Glance extension installed')
})

// 定时刷新 token（每 30 分钟检查一次）
chrome.alarms.create('refreshToken', { periodInMinutes: 30 })

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'refreshToken') {
    await refreshTokenIfNeeded()
  }
})

/**
 * 检查并刷新 token（直接在 background 中执行，不依赖 newtab）
 */
async function refreshTokenIfNeeded(): Promise<void> {
  try {
    const result = await chrome.storage.local.get('auth_token')
    const token = result.auth_token

    if (!token?.expires_at || !token?.refresh_token) {
      return
    }

    // 如果 token 将在 10 分钟内过期，尝试刷新
    const tenMinutes = 10 * 60 * 1000
    if (Date.now() <= token.expires_at - tenMinutes) {
      return
    }

    console.log('[Background] Token 即将过期，开始刷新')

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      }),
    })

    if (!response.ok) {
      console.error(`[Background] Token 刷新失败: ${response.status}`)
      // Token 无效，清除存储
      await chrome.storage.local.remove('auth_token')
      return
    }

    const newToken = await response.json()
    // 计算过期时间
    newToken.expires_at = Date.now() + newToken.expires_in * 1000
    await chrome.storage.local.set({ auth_token: newToken })
    console.log('[Background] Token 刷新成功')
  } catch (err) {
    console.error('[Background] Token 刷新异常:', err)
  }
}
