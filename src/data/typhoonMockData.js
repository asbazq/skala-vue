export const typhoonData = {
  id: 'TY2026-09',
  name: 'Sample Typhoon',
  current: { coord: [25.8, 129.8], observedAt: '2026-08-13 12:00', windSpeed: 42, pressure: 970 },
  pastTrack: [
    { coord: [21.9, 126.1], time: '08-11 12:00', wind: 30, pressure: 985 },
    { coord: [23.2, 127.2], time: '08-12 00:00', wind: 34, pressure: 980 },
    { coord: [24.5, 128.5], time: '08-12 12:00', wind: 38, pressure: 975 },
    { coord: [25.8, 129.8], time: '08-13 12:00', wind: 42, pressure: 970 },
  ],
  agencyTracks: {
    KMA: [[25.8,129.8],[27.3,130.5],[29.2,131.1],[31.6,131.8],[34,132.3]],
    JMA: [[25.8,129.8],[27.5,130.1],[29.4,129.9],[31.5,130.2],[33.6,130.8]],
    JTWC: [[25.8,129.8],[27.1,131.1],[28.8,132.5],[30.8,134.1],[33.1,135.4]],
  },
  probabilityCone: [[25.65,129.55],[27.1,129.65],[28.8,129.35],[31.1,128.65],[34.1,128.5],[35.8,132.5],[34.6,135.8],[31.8,135.2],[29.2,133.4],[27.2,131.4]],
  forecastRanges: [
    { hour:12, coord:[27.3,130.5], radiusKm:55, forecastAt:'2026-08-14 00:00' },
    { hour:24, coord:[29.2,131.1], radiusKm:105, forecastAt:'2026-08-14 12:00' },
    { hour:48, coord:[31.6,131.8], radiusKm:165, forecastAt:'2026-08-15 12:00' },
    { hour:72, coord:[34,132.3], radiusKm:245, forecastAt:'2026-08-16 12:00' },
  ],
}
