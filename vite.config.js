import { fileURLToPath, URL } from 'node:url'
import { Buffer } from 'node:buffer'
import process from 'node:process'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
const apiMiddleware = (mode) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    name: 'weather-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api', createApiHandler(env))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', createApiHandler(env))
    },
  }
}

const createApiHandler = (env) => async (request, response, next) => {
  try {
    const requestUrl = new URL(request.url, 'http://localhost')
    const apiPath = requestUrl.pathname === '/proxy'
      ? `/${requestUrl.searchParams.get('route') || ''}`
      : requestUrl.pathname
    let upstream

    if (apiPath === '/weather' || apiPath === '/forecast') {
      const endpoint = apiPath === '/weather' ? 'weather' : 'forecast'
      upstream = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`)
      for (const [key, value] of requestUrl.searchParams) {
        if (key !== 'route') upstream.searchParams.set(key, value)
      }
      upstream.searchParams.set('appid', env.OPENWEATHER_API_KEY)
      upstream.searchParams.set('units', 'metric')
      upstream.searchParams.set('lang', 'kr')
    } else if (apiPath === '/typhoon-list') {
      upstream = new URL('https://apihub.kma.go.kr/api/typ01/url/typ_lst.php')
      upstream.searchParams.set('YY', requestUrl.searchParams.get('year') || String(new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCFullYear()))
      upstream.searchParams.set('disp', '1')
      upstream.searchParams.set('authKey', env.KMA_API_KEY)
    } else if (apiPath === '/typhoon-detail') {
      upstream = new URL('https://apihub.kma.go.kr/api/typ01/url/typ_data.php')
      upstream.searchParams.set('YY', requestUrl.searchParams.get('year'))
      upstream.searchParams.set('typ', requestUrl.searchParams.get('typ'))
      upstream.searchParams.set('mode', '1')
      upstream.searchParams.set('disp', '1')
      upstream.searchParams.set('authKey', env.KMA_API_KEY)
    } else if (apiPath === '/typhoon') {
      upstream = new URL('https://apihub.kma.go.kr/api/typ01/url/typ_now.php')
      const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace(/[-:T]/g, '').slice(0, 12)
      upstream.searchParams.set('tm', kstNow)
      upstream.searchParams.set('mode', '1')
      upstream.searchParams.set('disp', '1')
      upstream.searchParams.set('help', '1')
      upstream.searchParams.set('authKey', env.KMA_API_KEY)
    } else if (apiPath === '/warnings') {
      upstream = new URL('https://apihub.kma.go.kr/api/typ01/url/wrn_now_data.php')
      upstream.searchParams.set('fe', 'f')
      upstream.searchParams.set('tm', requestUrl.searchParams.get('tm') || '')
      upstream.searchParams.set('disp', '1')
      upstream.searchParams.set('help', '0')
      upstream.searchParams.set('authKey', env.KMA_API_KEY)
    } else {
      next()
      return
    }

    let apiResponse = await fetch(upstream)
    let responseBuffer = Buffer.from(await apiResponse.arrayBuffer())

    if (apiPath === '/typhoon' && !/^[01],\d{4},/m.test(responseBuffer.toString('latin1'))) {
      const year = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCFullYear()
      const listUrl = new URL('https://apihub.kma.go.kr/api/typ01/url/typ_lst.php')
      listUrl.searchParams.set('YY', String(year))
      listUrl.searchParams.set('disp', '1')
      listUrl.searchParams.set('authKey', env.KMA_API_KEY)
      const listResponse = await fetch(listUrl)
      const listText = new TextDecoder('euc-kr').decode(await listResponse.arrayBuffer())
      const latest = listText.split(/\r?\n/).filter(line => /^\d{4},/.test(line.trim())).at(-1)?.split(',')

      if (latest) {
        const detailUrl = new URL('https://apihub.kma.go.kr/api/typ01/url/typ_data.php')
        detailUrl.searchParams.set('YY', latest[0])
        detailUrl.searchParams.set('typ', latest[1])
        detailUrl.searchParams.set('mode', '1')
        detailUrl.searchParams.set('disp', '1')
        detailUrl.searchParams.set('authKey', env.KMA_API_KEY)
        apiResponse = await fetch(detailUrl)
        responseBuffer = Buffer.from(await apiResponse.arrayBuffer())
        response.setHeader('X-Typhoon-Archive', 'true')
        response.setHeader('X-Typhoon-Start', latest[4])
        response.setHeader('X-Typhoon-End', latest[5])
        response.setHeader('X-Typhoon-Name', latest[7] || '')
      }
    }
    response.statusCode = apiResponse.status
    if (apiPath === '/warnings') {
      response.setHeader('Content-Type', 'text/plain; charset=utf-8')
      response.end(new TextDecoder('euc-kr').decode(responseBuffer))
    } else {
      response.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'text/plain; charset=utf-8')
      response.end(responseBuffer)
    }
  } catch (error) {
    response.statusCode = 502
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify({ message: error.message }))
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [vue(), vueDevTools(), apiMiddleware(mode)],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 🟢 [커스텀 추가 1] 로컬 개발 서버(Dev Server) 속성 제어
  server: {
    port: 3000, // 개발 서버의 네트워크 포트를 3000번으로 고정 명세
    open: true, // 프로세스 기동(npm run dev) 시 기본 웹 브라우저를 자동 실행
  },
  // 🟢 [커스텀 추가 2] 컴파일 완료된 산출물(Production Build) 사양 제어
  build: {
    outDir: 'dist', // 최종 정적 리소스(HTML, JS, CSS)가 저장될 출력 디렉토리명 지정
  },
}))
