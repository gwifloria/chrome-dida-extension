#!/usr/bin/env node
/**
 * 获取 Chrome Web Store API 的 Refresh Token
 * 使用方法: node scripts/get-refresh-token.mjs
 */
import { readFileSync } from 'fs'
import { createInterface } from 'readline'

// 读取 .env.cws
const envContent = readFileSync('.env.cws', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  if (key && !key.startsWith('#')) {
    env[key.trim()] = rest.join('=').trim()
  }
})

const CLIENT_ID = env.CWS_CLIENT_ID
const CLIENT_SECRET = env.CWS_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('错误: 请先在 .env.cws 中填写 CWS_CLIENT_ID 和 CWS_CLIENT_SECRET')
  process.exit(1)
}

const SCOPES = 'https://www.googleapis.com/auth/chromewebstore'
const REDIRECT_URI = 'http://localhost'

// 生成授权 URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/auth')
authUrl.searchParams.set('client_id', CLIENT_ID)
authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', SCOPES)
authUrl.searchParams.set('access_type', 'offline')

console.log('\n=== Chrome Web Store Refresh Token 获取工具 ===\n')
console.log('步骤 1: 在浏览器中打开以下链接并登录授权:\n')
console.log(authUrl.toString())
console.log('\n步骤 2: 授权后会跳转到一个无法访问的页面，这是正常的')
console.log('       复制地址栏中 code= 后面的值（到 & 之前）\n')

const rl = createInterface({ input: process.stdin, output: process.stdout })

rl.question('请粘贴 code 值: ', async (code) => {
  rl.close()

  if (!code) {
    console.error('错误: code 不能为空')
    process.exit(1)
  }

  console.log('\n正在获取 refresh token...')

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('错误:', data.error_description || data.error)
      process.exit(1)
    }

    if (data.refresh_token) {
      console.log('\n✅ 成功! 你的 Refresh Token:\n')
      console.log(data.refresh_token)
      console.log('\n请将此值填入 .env.cws 的 CWS_REFRESH_TOKEN 字段')
    } else {
      console.error('错误: 响应中没有 refresh_token')
      console.log('响应:', JSON.stringify(data, null, 2))
    }
  } catch (err) {
    console.error('请求失败:', err.message)
    process.exit(1)
  }
})
