import { Buffer } from 'node:buffer'

const allowedRoutes = new Set(['weather', 'forecast', 'warnings', 'typhoon-list', 'typhoon-detail', 'typhoon'])
const kstYear = () => new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCFullYear()

const buildUpstream = requestUrl => {
  const route = requestUrl.searchParams.get('route')
  if (!allowedRoutes.has(route)) return null

  if (route === 'weather' || route === 'forecast') {
    if (!process.env.OPENWEATHER_API_KEY) throw new Error('OPENWEATHER_API_KEY 환경변수가 없습니다.')
    const upstream = new URL(`https://api.openweathermap.org/data/2.5/${route}`)
    for (const [key, value] of requestUrl.searchParams) {
      if (key !== 'route') upstream.searchParams.set(key, value)
    }
    upstream.searchParams.set('appid', process.env.OPENWEATHER_API_KEY)
    upstream.searchParams.set('units', 'metric')
    upstream.searchParams.set('lang', 'kr')
    return { route, upstream }
  }

  if (!process.env.KMA_API_KEY) throw new Error('KMA_API_KEY 환경변수가 없습니다.')
  const endpoints = {
    warnings:'wrn_now_data.php', 'typhoon-list':'typ_lst.php',
    'typhoon-detail':'typ_data.php', typhoon:'typ_now.php',
  }
  const upstream = new URL(`https://apihub.kma.go.kr/api/typ01/url/${endpoints[route]}`)

  if (route === 'warnings') {
    upstream.searchParams.set('fe', 'f')
    upstream.searchParams.set('tm', requestUrl.searchParams.get('tm') || '')
    upstream.searchParams.set('disp', '1')
    upstream.searchParams.set('help', '0')
  } else if (route === 'typhoon-list') {
    upstream.searchParams.set('YY', requestUrl.searchParams.get('year') || String(kstYear()))
    upstream.searchParams.set('disp', '1')
  } else if (route === 'typhoon-detail') {
    upstream.searchParams.set('YY', requestUrl.searchParams.get('year') || String(kstYear()))
    upstream.searchParams.set('typ', requestUrl.searchParams.get('typ') || '')
    upstream.searchParams.set('mode', '1')
    upstream.searchParams.set('disp', '1')
  } else {
    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace(/[-:T]/g, '').slice(0, 12)
    upstream.searchParams.set('tm', kstNow)
    upstream.searchParams.set('mode', '1')
    upstream.searchParams.set('disp', '1')
    upstream.searchParams.set('help', '1')
  }
  upstream.searchParams.set('authKey', process.env.KMA_API_KEY)
  return { route, upstream }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ message:'GET 요청만 지원합니다.' })
  }

  try {
    const requestUrl = new URL(request.url, `https://${request.headers.host || 'localhost'}`)
    const target = buildUpstream(requestUrl)
    if (!target) return response.status(400).json({ message:'지원하지 않는 API route입니다.' })

    const apiResponse = await fetch(target.upstream)
    const responseBuffer = Buffer.from(await apiResponse.arrayBuffer())
    response.status(apiResponse.status)
    response.setHeader('Cache-Control', 'no-store')

    if (target.route === 'warnings') {
      response.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return response.send(new TextDecoder('euc-kr').decode(responseBuffer))
    }

    response.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'text/plain; charset=utf-8')
    return response.send(responseBuffer)
  } catch (error) {
    console.error('API proxy error:', error.message)
    return response.status(502).json({ message:error.message })
  }
}
