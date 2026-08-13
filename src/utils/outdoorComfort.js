const clamp = value => Math.max(0, Math.min(100, Math.round(value)))

export const comfortScore = (weather, alertStore) => {
  if (!weather) return 0
  const temperature = Number(weather.temp) || 0
  const humidity = Number(weather.humidity) || 0
  const rainChance = Number(weather.rainChance) || 0
  const wind = Number(weather.wind) || 0
  let penalty = 0

  if (temperature >= alertStore.heatThreshold) penalty += 24 + (temperature - alertStore.heatThreshold) * 5
  else if (temperature <= alertStore.coldThreshold) penalty += 24 + (alertStore.coldThreshold - temperature) * 5
  else {
    const preferred = (alertStore.coldThreshold + alertStore.heatThreshold) / 2
    penalty += Math.abs(temperature - preferred) * 1.2
  }
  if (humidity > 70) penalty += (humidity - 70) * .45
  if (humidity < 30) penalty += (30 - humidity) * .3
  penalty += rainChance * .34
  if (wind > 4) penalty += (wind - 4) * 3.5
  penalty += (weather.warnings?.length || 0) * 30

  return clamp(100 - penalty)
}

export const comfortLabel = score => {
  if (score >= 85) return '매우 쾌적'
  if (score >= 70) return '쾌적'
  if (score >= 50) return '보통'
  if (score >= 30) return '외출 주의'
  return '외출 비추천'
}

export const comfortClass = score => score >= 70 ? 'comfortable' : score >= 50 ? 'moderate' : 'uncomfortable'

export const analyzeOutdoorSlots = (city, slots, alertStore) => {
  const warnings = city?.warnings ?? []
  const evaluated = (slots ?? []).map(slot => {
    const score = comfortScore({ ...slot, warnings }, alertStore)
    return { ...slot, score, label:comfortLabel(score) }
  })
  const ranked = [...evaluated].sort((a, b) => b.score - a.score)
  return {
    slots:evaluated,
    recommendations:ranked.slice(0, 3),
    best:ranked[0] ?? null,
    suitableCount:evaluated.filter(item => item.score >= 70).length,
    maxRain:evaluated.length ? Math.max(...evaluated.map(item => item.rainChance)) : 0,
    score:ranked.length ? Math.round(ranked.reduce((sum, item) => sum + item.score, 0) / ranked.length) : 0,
    warningCount:warnings.length,
  }
}
