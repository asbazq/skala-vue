const weatherIcons = {
  Thunderstorm: '⛈️', Drizzle: '🌦️', Rain: '🌧️', Snow: '🌨️',
  Atmosphere: '🌫️', Clear: '☀️', Clouds: '☁️',
}

const iconFor = weather => weatherIcons[weather?.main] ?? '🌤️'
const round = value => Math.round(Number(value) || 0)
const requestJson = async url => {
  const response = await fetch(url)
  const data = await response.json()
  if (!response.ok || String(data.cod ?? '').startsWith('4')) throw new Error(data.message || 'API 요청에 실패했습니다.')
  return data
}

const dailyForecast = list => {
  const groups = new Map()
  for (const item of list) {
    const date = item.dt_txt.slice(0, 10)
    const group = groups.get(date) ?? []
    group.push(item)
    groups.set(date, group)
  }
  return [...groups.entries()].slice(0, 6).map(([date, items]) => {
    const representative = items.find(item => item.dt_txt.includes('12:00:00')) ?? items[0]
    return {
      day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${date}T12:00:00`)).toUpperCase(),
      icon: iconFor(representative.weather[0]),
      high: round(Math.max(...items.map(item => item.main.temp_max))),
      low: round(Math.min(...items.map(item => item.main.temp_min))),
    }
  })
}

export const fetchCityWeather = async city => {
  const query = `lat=${city.coord[0]}&lon=${city.coord[1]}`
  const [current, forecast] = await Promise.all([
    requestJson(`/api/weather?${query}`),
    requestJson(`/api/forecast?${query}`),
  ])
  const timezone = forecast.city?.timezone ?? current.timezone ?? 0
  const localParts = timestamp => {
    const date = new Date((timestamp + timezone) * 1000)
    const dateKey = date.toISOString().slice(0, 10)
    const day = new Intl.DateTimeFormat('ko-KR', { weekday:'short', timeZone:'UTC' }).format(date)
    const time = new Intl.DateTimeFormat('ko-KR', { hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'UTC' }).format(date)
    const dateLabel = new Intl.DateTimeFormat('ko-KR', { month:'short', day:'numeric', weekday:'short', timeZone:'UTC' }).format(date)
    return { date:dateKey, dateLabel, day, time }
  }
  const observed = localParts(current.dt)
  const hourly = [{
    time: `현재 ${observed.time}`, date:observed.date, dateLabel:observed.dateLabel, day: observed.day,
    icon: iconFor(current.weather[0]), temp: round(current.main.temp),
    status: current.weather[0]?.description, humidity: current.main.humidity,
    rainChance: current.rain ? 100 : 0, wind:current.wind.speed,
  }, ...forecast.list.slice(0, 7).map(item => {
    const local = localParts(item.dt)
    return {
    time: local.time, date:local.date, dateLabel:local.dateLabel, day:local.day,
    icon: iconFor(item.weather[0]),
    temp: round(item.main.temp),
    status: item.weather[0]?.description, humidity: item.main.humidity,
    rainChance: Math.round((item.pop ?? 0) * 100), wind:item.wind.speed,
  }
  })]
  const forecastSlots = forecast.list.map(item => {
    const local = localParts(item.dt)
    return {
      ...local, icon:iconFor(item.weather[0]), temp:round(item.main.temp),
      feels:round(item.main.feels_like), status:item.weather[0]?.description,
      humidity:item.main.humidity, rainChance:Math.round((item.pop ?? 0) * 100), wind:item.wind.speed,
    }
  })
  return {
    ...city,
    temp: round(current.main.temp), feels: round(current.main.feels_like),
    high: round(current.main.temp_max), low: round(current.main.temp_min),
    status: current.weather[0]?.description ?? current.weather[0]?.main,
    icon: iconFor(current.weather[0]), humidity: current.main.humidity,
    wind: current.wind.speed, pressure: current.main.pressure,
    rain: current.rain?.['1h'] ?? current.rain?.['3h'] ?? 0,
    hourly, forecastSlots, weekly: dailyForecast(forecast.list),
  }
}

export const fetchAllCityWeather = cities => Promise.all(cities.map(fetchCityWeather))

const WARNING_CACHE_KEY = 'weather-track:kma-warnings:v1'
const WARNING_CACHE_TTL = 60 * 60 * 1000
const warningRegionAliases = {
  seoul:['서울특별시','서울시'], busan:['부산광역시','부산시'], daegu:['대구광역시','대구시'],
  incheon:['인천광역시','인천시'], gwangju:['광주광역시','광주시'], daejeon:['대전광역시','대전시'],
  ulsan:['울산광역시','울산시'], sejong:['세종특별자치시','세종시'], gyeonggi:['경기도'],
  gangwon:['강원특별자치도','강원도'], chungbuk:['충청북도','충북'], chungnam:['충청남도','충남'],
  jeonbuk:['전북특별자치도','전라북도','전북'], jeonnam:['전라남도','전남'],
  gyeongbuk:['경상북도','경북'], gyeongnam:['경상남도','경남'], jeju:['제주특별자치도','제주도'],
}
const warningIcon = name => {
  const icons = [['태풍','🌀'],['호우','🌧️'],['강풍','🌬️'],['풍랑','🌊'],['대설','🌨️'],['한파','🥶'],['폭염','🥵'],['건조','🔥'],['황사','😷'],['해일','🌊'],['안개','🌫️']]
  return icons.find(([keyword]) => name.includes(keyword))?.[1] ?? '⚠️'
}
const warningRegionPrefixes = {
  L101:'gyeonggi', L102:'gangwon', L103:'chungnam', L104:'chungbuk', L105:'jeonnam',
  L106:'jeonbuk', L107:'gyeongbuk', L108:'gyeongnam', L109:'jeju', L113:'gwangju',
  L114:'daegu', L115:'busan',
}
const regionIdsForWarning = (upperCode, regionCode, upperRegion, region) => {
  const match = source => Object.entries(warningRegionAliases)
    .filter(([, aliases]) => aliases.some(alias => source.replace(/\s/g, '').includes(alias.replace(/\s/g, ''))))
    .map(([id]) => id)
  const namedMatch = match(upperRegion)
  if (namedMatch.length) return namedMatch
  const codeMatch = warningRegionPrefixes[String(regionCode || upperCode).slice(0, 4)]
  return codeMatch ? [codeMatch] : match(region)
}
const formatWarningDate = value => {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length < 10) return value || '-'
  return `${digits.slice(0,4)}.${digits.slice(4,6)}.${digits.slice(6,8)} ${digits.slice(8,10)}:${digits.slice(10,12) || '00'}`
}
const parseWarnings = text => {
  let errorPayload
  try { errorPayload = JSON.parse(text) } catch { errorPayload = null }
  if (errorPayload?.result?.status) throw new Error(errorPayload.result.message || '기상청 예·특보 요청에 실패했습니다.')
  const parsed = text.split(/\r?\n/).map(line => line.trim())
    .filter(line => /^L\d+,/.test(line))
    .map(line => line.split(',').map(value => value.trim()))
    .filter(columns => columns.length >= 9 && !columns[8].includes('해제'))
    .map(columns => ({
      id:`${columns[2]}-${columns[6]}-${columns[7]}`, upperRegion:columns[1], region:columns[3],
      issuedAt:formatWarningDate(columns[4]), effectiveAt:formatWarningDate(columns[5]),
      type:columns[6], level:columns[7], command:columns[8], icon:warningIcon(columns[6]),
      regionIds:regionIdsForWarning(columns[0], columns[2], columns[1], columns[3]),
    }))
  return [...new Map(parsed.map(item => [item.id, item])).values()]
}
const readWarningCache = () => {
  try { return JSON.parse(localStorage.getItem(WARNING_CACHE_KEY)) } catch { return null }
}
const writeWarningCache = data => {
  try { localStorage.setItem(WARNING_CACHE_KEY, JSON.stringify({ checkedAt:Date.now(), data })) } catch { /* 캐시 없이 계속 사용 */ }
}
export const fetchKmaWarnings = async () => {
  const cached = readWarningCache()
  if (cached?.data && Date.now() - cached.checkedAt < WARNING_CACHE_TTL) return cached.data
  try {
    const response = await fetch('/api/warnings')
    const text = await response.text()
    if (!response.ok) throw new Error(`기상청 예·특보 요청에 실패했습니다. (${response.status})`)
    const data = parseWarnings(text)
    writeWarningCache(data)
    return data
  } catch (error) {
    if (cached?.data) {
      console.warn(`${error.message} 저장된 예·특보 정보를 사용합니다.`)
      return cached.data
    }
    throw error
  }
}

const parseTyphoon = (text, metadata) => {
  let errorPayload
  try { errorPayload = JSON.parse(text) } catch { errorPayload = null }
  if (errorPayload?.result?.status) throw new Error(errorPayload.result.message || '기상청 태풍 API 요청에 실패했습니다.')

  const rows = text.split(/\r?\n/)
    .map(line => line.trim()).filter(line => /^[01][,\s]\d{4}[,\s]/.test(line))
    .map(line => line.split(line.includes(',') ? ',' : /\s+/).map(value => String(value).trim()))
    .filter(columns => columns.length >= 16 && Number.isFinite(Number(columns[7])) && Number.isFinite(Number(columns[8])))
  if (!rows.length) return null

  const points = rows.map(columns => ({
    typ: columns[2], sequence: Number(columns[3]), hour: Number(columns[4]),
    analyzedAt: columns[5], time: columns[6] || columns[5],
    coord: [Number(columns[7]), Number(columns[8])], direction: columns[9], speed: Number(columns[10]),
    pressure: Number(columns[11]), wind: Number(columns[12]),
    windRadiusKm: Math.max(0, Number(columns[13]) || 0), radiusKm: Math.max(0, Number(columns[15]) || 0),
  }))
  const latestPoint = [...points].sort((a, b) => b.analyzedAt.localeCompare(a.analyzedAt))[0]
  const selectedPoints = points.filter(point => point.typ === latestPoint.typ)
  const analyses = selectedPoints.filter(point => point.hour <= 0)
  const latestSequence = Math.max(...selectedPoints.map(point => point.sequence))
  const forecasts = selectedPoints.filter(point => point.hour > 0 && point.sequence === latestSequence)
  const current = analyses.at(-1) ?? points[0]
  return {
    id: `KMA-${current.typ}`, name: `제${Number(current.typ)}호 태풍${metadata.englishName ? ` ${metadata.englishName}` : ''}`,
    current: { coord: current.coord, observedAt: current.time, windSpeed: current.wind, pressure: current.pressure, windRadiusKm: current.windRadiusKm },
    pastTrack: analyses.map(point => ({ coord: point.coord, time: point.time, wind: point.wind, pressure: point.pressure })),
    agencyTracks: { KMA: [current, ...forecasts].map(point => point.coord), JMA: [], JTWC: [] },
    probabilityCone: [],
    forecastRanges: forecasts.map(point => ({ hour: point.hour, coord: point.coord, radiusKm: point.radiusKm, forecastAt: point.time })),
    movement: metadata.isArchive
      ? `최근 태풍 · 최종 관측 ${formatKmaDate(metadata.endedAt || current.time)}`
      : `${current.direction || '-'} ${current.speed || 0} km/h 이동 중 · ${formatKmaDate(current.time)}`,
    isArchive: metadata.isArchive,
  }
}

const TYPHOON_CACHE_KEY = 'weather-track:kma-typhoons:v2'
const ACTIVE_CACHE_TTL = 30 * 60 * 1000
const ARCHIVE_CACHE_TTL = 6 * 60 * 60 * 1000
const readTyphoonCache = () => {
  try { return JSON.parse(localStorage.getItem(TYPHOON_CACHE_KEY)) } catch { return null }
}
const writeTyphoonCache = value => {
  try { localStorage.setItem(TYPHOON_CACHE_KEY, JSON.stringify(value)) } catch { /* 캐시 사용이 불가능하면 API 데이터만 사용 */ }
}

export const fetchKmaTyphoons = async (count = 5) => {
  const cached = readTyphoonCache()
  const cacheTtl = cached?.data?.some(storm => !storm.isArchive) ? ACTIVE_CACHE_TTL : ARCHIVE_CACHE_TTL
  if (cached?.data?.length && Date.now() - cached.checkedAt < cacheTtl) return cached.data

  try {
    const year = new Date().getFullYear()
    const listResponse = await fetch(`/api/typhoon-list?year=${year}`)
    const listText = await listResponse.text()
    let errorPayload
    try { errorPayload = JSON.parse(listText) } catch { errorPayload = null }
    if (!listResponse.ok || errorPayload?.result?.status) {
      throw new Error(errorPayload?.result?.message || `기상청 태풍 목록 요청에 실패했습니다. (${listResponse.status})`)
    }

    const storms = listText.split(/\r?\n/)
      .map(line => line.trim()).filter(line => /^\d{4},/.test(line))
      .map(line => line.split(','))
      .slice(-count)
      .reverse()
    if (!storms.length) throw new Error('기상청 태풍 목록이 비어 있습니다.')

    const signature = storms.map(columns => [columns[0], columns[1], columns[2], columns[5], columns[7]].join(':')).join('|')
    const hasActiveTyphoon = storms.some(columns => columns[2] === '1')
    if (cached?.data?.length && cached.signature === signature && !hasActiveTyphoon) {
      writeTyphoonCache({ ...cached, checkedAt:Date.now() })
      return cached.data
    }

    const cachedById = new Map((cached?.data ?? []).map(storm => [storm.id, storm]))
    const results = await Promise.allSettled(storms.map(async columns => {
      const response = await fetch(`/api/typhoon-detail?year=${columns[0]}&typ=${columns[1]}`)
      const detailText = await response.text()
      let detailError
      try { detailError = JSON.parse(detailText) } catch { detailError = null }
      if (!response.ok || detailError?.result?.status) throw new Error(detailError?.result?.message || `제${columns[1]}호 태풍 요청에 실패했습니다.`)
      return parseTyphoon(detailText, {
        englishName:columns[7], endedAt:columns[5], isArchive:columns[2] !== '1',
      })
    }))
    const data = results.map((result, index) => result.status === 'fulfilled'
      ? result.value
      : cachedById.get(`KMA-${storms[index][1]}`)).filter(Boolean)
    if (!data.length) throw new Error('기상청 태풍 상세정보를 불러오지 못했습니다.')
    writeTyphoonCache({ signature, checkedAt:Date.now(), data })
    return data
  } catch (error) {
    if (cached?.data?.length) {
      console.warn(`${error.message} 저장된 태풍 정보를 사용합니다.`)
      return cached.data
    }
    throw error
  }
}

const formatKmaDate = value => {
  if (!/^\d{12}$/.test(value || '')) return value || '-'
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)} ${value.slice(8, 10)}:${value.slice(10, 12)} UTC`
}
