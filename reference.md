# Vue 기반 기상 정보 및 태풍 경로 시각화 웹 서비스 기획안

## 1. 프로젝트 개요

### 프로젝트명
**Weather Track** *(가칭)*

### 프로젝트 소개
일반적인 날씨 웹은 현재 기온과 주간 예보를 보여주는 데 그치는 경우가 많다.

본 프로젝트는 기본적인 일기예보 기능에 **지도 기반 기상 정보와 태풍 이동 경로 시각화 기능**을 추가한 웹 서비스를 구현한다.

특히 태풍 발생 시 하나의 예상 경로만 보여주는 것이 아니라, 가능한 범위에서 **한국·일본·미국 등 여러 기상기관이 발표한 예상 경로를 하나의 지도에서 비교**할 수 있도록 구성한다.

### 개발 목표

- Vue 기본 문법 및 컴포넌트 구조 학습
- 외부 Weather API 활용
- 비동기 API 통신 경험
- 지도 라이브러리를 활용한 데이터 시각화
- 날씨 데이터를 직관적으로 전달하는 UI/UX 구현
- 기존 단순 날씨 앱과 차별화된 기능 구현

---

# 2. 핵심 기능

## 2.1 현재 날씨

사용자가 검색한 지역의 현재 기상 정보를 제공한다.

### 제공 정보

- 현재 기온
- 체감 온도
- 최고 / 최저 기온
- 날씨 상태
- 습도
- 풍속
- 기압
- 강수량
- 날씨 아이콘

예시:

```text
SEOUL

28°
Partly Cloudy

Feels like 30°

Humidity     68%
Wind         3.2m/s
Pressure     1007hPa
```

---

## 2.2 지역 검색

도시명을 입력하여 원하는 지역의 날씨를 조회할 수 있다.

```text
┌──────────────────────────────┐
│ 🔍  Search city...           │
└──────────────────────────────┘
```

검색 결과에 따라 현재 날씨와 예보 데이터를 갱신한다.

---

## 2.3 시간별 날씨

현재 시간을 기준으로 시간대별 기온과 날씨를 표시한다.

```text
Today

NOW    15:00   18:00   21:00   00:00
 ☀       ☀       🌤      🌙      🌙
28°     30°      27°     25°     24°
```

단순 텍스트 나열보다는 카드 또는 가로 스크롤 UI를 사용한다.

---

## 2.4 주간 날씨

향후 며칠간의 날씨를 한눈에 확인할 수 있도록 제공한다.

```text
MON     ☀️      31° / 24°
TUE     🌧      28° / 23°
WED     🌤      30° / 24°
THU     ☀️      32° / 25°
FRI     🌧      27° / 23°
```

---

# 3. 핵심 차별화 기능 — 태풍 경로 지도

## 3.1 태풍 위치 표시

태풍이 발생한 경우 지도에서 현재 위치를 확인할 수 있도록 한다.

지도 라이브러리는 **Leaflet**을 활용한다.

```text
             Korea
               │

             ● 예상
            /
          ●
         /
       ●
      /
    🌀
현재 태풍 위치
```

각 지점은 다음과 같은 정보를 가진다.

```javascript
{
  latitude: 24.5,
  longitude: 132.1,
  time: "2026-08-13 12:00",
  windSpeed: 42,
  pressure: 970
}
```

지점을 클릭하면 해당 시점의 태풍 정보를 표시한다.

---

## 3.2 태풍 이동 경로

과거 위치와 현재 위치를 연결하여 실제 이동 경로를 지도에 표시한다.

```text
● ─── ● ─── ● ─── 🌀
과거                 현재
```

Leaflet의 Polyline 기능을 활용한다.

---

## 3.3 기관별 예상 경로 비교

본 프로젝트의 주요 차별화 기능이다.

가능한 데이터 범위 내에서 여러 기상기관의 태풍 예상 경로를 동시에 표시한다.

예:

- KMA — 한국 기상청
- JMA — 일본 기상청
- JTWC — 미국 합동태풍경보센터

```text
                 ● KMA
               /
              /
        🌀 ─────── ● JMA
              \
               \
                 ● JTWC
```

사용자는 원하는 기관의 경로만 선택해서 볼 수 있다.

```text
Forecast Models

☑ KMA
☑ JMA
☑ JTWC
```

각 기관의 선 종류나 색상을 다르게 표현하여 경로를 쉽게 구분하도록 한다.

---

# 4. 지도 기능

지도는 전체 서비스의 보조 기능이 아니라 **주요 시각화 영역**으로 구성한다.

### 지도에서 제공할 정보

- 현재 선택 지역
- 태풍 현재 위치
- 태풍 과거 이동 경로
- 태풍 예상 이동 경로
- 기관별 예상 경로
- 위치별 태풍 정보 Popup

태풍이 존재하지 않을 때는 일반적인 기상 지도로 활용한다.

---

# 5. 화면 구성

## 메인 화면

Desktop 환경에서는 날씨 정보와 지도를 동시에 확인할 수 있도록 Dashboard 형태로 구성한다.

```text
┌───────────────────────────────────────────────────────────┐
│ WEATHER TRACK                         Seoul        Search │
├──────────────────────┬────────────────────────────────────┤
│                      │                                    │
│ SEOUL                │                                    │
│                      │             WEATHER MAP            │
│ 28°                  │                                    │
│ Partly Cloudy        │                  ●                 │
│                      │                ╱                   │
│ Feels like 30°       │              ●                     │
│                      │             ╱                      │
│ Humidity       68%   │           🌀                       │
│ Wind         3.2m/s  │                                    │
│ Pressure    1007hPa  │      KMA   JMA   JTWC              │
│                      │                                    │
├──────────────────────┴────────────────────────────────────┤
│ TODAY                                                     │
│                                                           │
│ NOW       15:00      18:00      21:00      00:00          │
│ ☀          ☀          🌤          🌙          🌙           │
│ 28°        30°        27°        25°        24°           │
├───────────────────────────────────────────────────────────┤
│ WEEKLY FORECAST                                           │
│                                                           │
│ MON       TUE       WED       THU       FRI       SAT     │
│ ☀         🌧         🌤         ☀         🌧         ☀      │
│ 31/24     28/23     30/24     32/25     27/23     30/24   │
└───────────────────────────────────────────────────────────┘
```

---

# 6. 컴포넌트 구성

Vue의 컴포넌트 구조를 활용하여 화면을 기능별로 분리한다.

```text
App.vue
│
├── Header.vue
│
├── SearchBar.vue
│
├── CurrentWeather.vue
│
├── WeatherDetails.vue
│
├── HourlyForecast.vue
│
├── WeeklyForecast.vue
│
└── WeatherMap.vue
      │
      ├── TyphoonMarker.vue
      ├── TyphoonPath.vue
      └── ForecastPath.vue
```

초기 구현에서는 지나치게 세분화하지 않고 필요한 경우에만 컴포넌트를 추가한다.

---

# 7. 기술 스택

## Frontend

- Vue 3
- JavaScript
- HTML
- CSS
- Vite

Vue에서는 다음 기능을 중심으로 활용한다.

- `ref`
- `computed`
- `v-if`
- `v-for`
- `v-bind`
- `v-model`
- `props`
- `emit`
- `onMounted`
- Composition API

## API 통신

- Fetch API 또는 Axios

## 지도

- Leaflet
- Vue Leaflet
- OpenStreetMap

## 날씨 데이터

날씨 API를 통해 다음 데이터를 조회한다.

```text
현재 날씨
↓
시간별 예보
↓
주간 예보
```

태풍 데이터는 일반 날씨 API와 분리하여 사용할 수 있는 공개 데이터/API를 조사한 후 결정한다.

---

# 8. 데이터 흐름

```text
사용자
  │
  │ 도시 검색
  ▼
Vue
  │
  ├──────────────→ Weather API
  │                     │
  │                     ▼
  │              현재 / 시간별 / 주간
  │
  │
  └──────────────→ Typhoon Data
                        │
                        ▼
                 태풍 위치 / 예상경로
                        │
                        ▼
                     Leaflet
```

---

# 9. 구현 우선순위

프로젝트 범위를 고려하여 기능을 단계적으로 구현한다.

### 1단계 — 기본 날씨

- Vue 프로젝트 구성
- UI Layout
- 도시 검색
- 현재 날씨
- 시간별 날씨
- 주간 날씨

### 2단계 — 지도

- Leaflet 지도 출력
- 검색한 도시 위치 표시
- 지도 이동

### 3단계 — 태풍

- 태풍 위치 표시
- 태풍 이동 경로
- 태풍 예상 경로

### 4단계 — 기관별 태풍 예측

데이터 확보가 가능한 경우 추가한다.

- KMA
- JMA
- JTWC
- 기관별 경로 ON/OFF
- 예상 경로 비교

---

# 10. MVP 범위

과제에서 반드시 완성할 범위와 추가 기능을 구분한다.

### 필수 구현

- 지역 검색
- 현재 날씨
- 시간별 예보
- 주간 예보
- 반응형 Dashboard UI
- 지도 표시

### 목표 구현

- 현재 태풍 표시
- 태풍 이동 경로
- 예상 이동 경로

### 추가 구현

- KMA / JMA / JTWC 예상 경로 비교
- 기관별 경로 ON/OFF
- 태풍 상세 정보 Popup

태풍 데이터를 확보하지 못하더라도 기본 날씨 서비스가 정상적으로 동작하도록 기능 간 의존성을 낮춘다.

---

# 11. 제외 기능

프로젝트 규모를 고려하여 다음 기능은 초기 개발 범위에서 제외한다.

- 열돔 지도
- 기온 이상 Heatmap
- 기상 레이더
- 위성 영상
- 태풍 경로 AI 예측
- 기상 데이터 자체 분석
- 백엔드 서버 구축
- 사용자 회원가입/로그인

특히 열돔 시각화는 단순 API 호출만으로 구현하기 어렵고 공간 데이터 처리와 기상 데이터 분석이 필요하므로 이번 Vue 프로젝트에서는 제외한다.

---

# 12. 프로젝트 핵심

이 프로젝트의 목표는 기능을 많이 넣는 것이 아니다.

**일반적인 날씨 웹에 지도 기반 태풍 경로 비교라는 하나의 명확한 특징을 추가하는 것**을 목표로 한다.

```text
일반 Weather App

        +

Vue + Leaflet

        +

태풍 이동 경로

        +

기관별 예상 경로 비교

        ↓

Weather Track
```

이를 통해 Vue의 API 통신, 상태 관리, 컴포넌트 구조를 학습하면서 동시에 시각적으로도 기존의 단순한 일기예보 과제와 차별화된 결과물을 구현한다.

---

# 과제 6: Weather Dashboard 디자인 개선 및 태풍 경로 시각화

기존 과제 1~5에서 구현한 기능과 Vue 학습 요소를 유지한 상태에서 최종 날씨 대시보드의 UI를 개선하고, Leaflet 기반의 태풍 경로 시각화 기능을 추가한다.

이번 단계에서는 기존 프로젝트를 새로 만드는 것이 아니라 현재 구현되어 있는 다음 기능을 그대로 유지하면서 확장한다.

- 도시 검색
- 지역별 날씨 카드
- 카드 Hover
- 폭염 / 한파 조건부 렌더링
- 즐겨찾기
- 즐겨찾기 필터
- `computed`
- `watch`
- `watchEffect`
- Props / Emits
- Slot
- Vue Router
- 도시 상세 페이지
- 도시 비교 페이지
- Pinia Store
- 섭씨 / 화씨 전환
- 폭염 / 한파 사용자 설정

최종적으로 일반적인 Vue 입문용 날씨 카드 형태가 아니라 **Weather Dashboard + 태풍 관측 지도** 형태의 화면을 구성한다.

---

## 1. 최종 프로젝트 방향

최종 서비스는 크게 두 영역으로 구성한다.

```text
Weather Dashboard
│
├─ 일반 날씨
│  ├─ 현재 날씨
│  ├─ 시간별 예보
│  ├─ 주간 예보
│  ├─ 습도
│  ├─ 풍속
│  ├─ 기압
│  ├─ 도시 검색
│  ├─ 즐겨찾기
│  └─ 폭염 / 한파 경고
│
└─ Typhoon Map
   ├─ 태풍 현재 위치
   ├─ 실제 이동 경로
   ├─ KMA 예상 경로
   ├─ JMA 예상 경로
   ├─ JTWC 예상 경로
   └─ 시간별 예상 범위
```

날씨 기능과 태풍 기능은 서로 독립적으로 구성한다.

태풍 데이터가 없거나 태풍 Layer가 비활성화되어도 기존 날씨 기능은 정상적으로 동작해야 한다.

---

# 2. 디자인 방향

기존 실습용 카드 UI를 그대로 확대하는 방식은 사용하지 않는다.

최종 화면은 **현대적인 기상 관측 Dashboard** 형태로 변경한다.

디자인은 다음 원칙을 따른다.

- 전체 화면 기반 Dashboard Layout
- 불필요하게 많은 테두리 사용 금지
- 카드 사이 여백을 충분히 사용
- 주요 정보와 보조 정보의 크기를 명확하게 구분
- 지도 영역을 메인 콘텐츠 중 하나로 사용
- 기상 정보는 카드 형태로 그룹화
- 밝은 색상 사용을 최소화하고 상태 정보에만 강조색 사용
- Desktop 화면에서 날씨 정보와 지도를 동시에 확인할 수 있도록 구성
- Mobile에서는 세로 방향으로 자연스럽게 배치
- 과도한 Gradient, Emoji 중심 디자인은 사용하지 않는다.

예상 Desktop Layout:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ WEATHER                                      Seoul      ℃ / ℉     │
│                                                      Search        │
├──────────────────────┬──────────────────────────────────────────────┤
│                      │                                              │
│ SEOUL                │                                              │
│                      │                 WEATHER MAP                  │
│ 28°                  │                                              │
│ Partly Cloudy        │                       ● 72H                   │
│                      │                    ╱                         │
│ Feels like 30°       │                 ● 48H                        │
│                      │               ╱                              │
│ Humidity       68%   │            ● 24H                             │
│ Wind         3.2m/s  │          ╱                                   │
│ Pressure    1007hPa  │       ● 12H                                  │
│                      │      ╱                                       │
│                      │    🌀 Current                                │
│                      │                                              │
│                      │  KMA   JMA   JTWC   예상 범위                │
├──────────────────────┴──────────────────────────────────────────────┤
│ HOURLY FORECAST                                                     │
│                                                                     │
│ NOW       15:00       18:00       21:00       00:00                 │
│ 28°       30°         27°         25°         24°                   │
├─────────────────────────────────────────────────────────────────────┤
│ WEEKLY FORECAST                                                     │
│                                                                     │
│ MON       TUE       WED       THU       FRI       SAT               │
│ 31/24     28/23     30/24     32/25     27/23     30/24             │
└─────────────────────────────────────────────────────────────────────┘
```

기존 `WeatherCard.vue`는 삭제하지 않는다.

기존 WeatherCard는 검색 결과 또는 도시 목록에서 계속 활용하고, 메인 Dashboard를 위한 컴포넌트를 추가한다.

---

# 3. 태풍 지도

## 지도 라이브러리

태풍 시각화에는 Leaflet을 사용한다.

권장 구성:

```text
Vue 3
+
Leaflet
+
vue-leaflet
+
OpenStreetMap
```

태풍 기능의 목표는 복잡한 기상 분석 시스템을 만드는 것이 아니라 Vue에서 **배열 데이터 → 지도 Marker / Polyline / Circle 렌더링** 과정을 학습하는 것이다.

따라서 초기 구현에서는 실제 API 대신 Mock Data를 사용할 수 있다.

---

# 4. 태풍 현재 위치

현재 태풍 위치를 지도에 Marker로 표시한다.

예시 Mock Data:

```js
const typhoon = {
  id: 'TY2026-01',
  name: 'Sample Typhoon',
  latitude: 21.2,
  longitude: 132.4,
  windSpeed: 42,
  pressure: 970,
  observedAt: '2026-08-13 03:00',
}
```

지도에서는 다음과 같이 표시한다.

```text
               예상 진행 방향
                    ↑

                    ●
                   /
                  ●
                 /
                ●
               /
              🌀
            현재 위치
```

현재 위치 Marker를 클릭하면 다음 정보를 Popup으로 제공한다.

- 태풍 이름
- 관측 시각
- 중심 위치
- 중심기압
- 최대 풍속

---

# 5. 실제 이동 경로

태풍이 지금까지 이동한 위치를 Polyline으로 연결한다.

예시:

```js
const pastTrack = [
  {
    time: '08-12 12:00',
    lat: 18.2,
    lng: 135.1,
  },
  {
    time: '08-12 18:00',
    lat: 19.1,
    lng: 134.3,
  },
  {
    time: '08-13 00:00',
    lat: 20.3,
    lng: 133.2,
  },
  {
    time: '08-13 03:00',
    lat: 21.2,
    lng: 132.4,
  },
]
```

```text
과거                               현재

● ───── ● ───── ● ───── 🌀
```

각 관측 지점을 클릭하면 해당 시점의 정보를 확인할 수 있도록 한다.

---

# 6. 기관별 태풍 예상 경로

하나의 태풍에 대해 다음 기관의 예상 경로를 동시에 표시할 수 있도록 한다.

- KMA
- JMA
- JTWC

예시 Mock Data:

```js
const forecastTracks = {
  KMA: [
    { hour: 12, lat: 22.3, lng: 131.6 },
    { hour: 24, lat: 24.1, lng: 130.5 },
    { hour: 48, lat: 27.2, lng: 129.4 },
    { hour: 72, lat: 30.5, lng: 129.1 },
  ],

  JMA: [
    { hour: 12, lat: 22.5, lng: 131.4 },
    { hour: 24, lat: 24.5, lng: 130.2 },
    { hour: 48, lat: 27.8, lng: 129.8 },
    { hour: 72, lat: 31.2, lng: 130.0 },
  ],

  JTWC: [
    { hour: 12, lat: 22.1, lng: 131.8 },
    { hour: 24, lat: 23.8, lng: 130.8 },
    { hour: 48, lat: 26.7, lng: 128.9 },
    { hour: 72, lat: 30.0, lng: 128.2 },
  ],
}
```

지도에서는 기관마다 별도의 Polyline으로 표시한다.

```text
                       ● KMA
                     /
                   ●

            ● JMA
          /
        ●

      🌀
        \
          ●
            \
              ● JTWC
```

기관별 예상 경로는 동시에 표시할 수 있어야 한다.

---

# 7. 태풍 예상 범위

기관별 예상 중심 경로 외에 **시간이 멀어질수록 넓어지는 태풍 예상 범위**를 표시한다.

현재 위치를 기준으로 다음 예측 시점을 사용한다.

- 12시간
- 24시간
- 48시간
- 72시간

예측 시간이 멀어질수록 불확실성이 증가하므로 원의 반경도 점차 넓어진다.

예:

```text
                     ┌─────────────┐
                     │    72H      │
                     │             │
                ┌────┼───────┐     │
                │    48H     │     │
                │            │     │
             ┌──┼──────┐     │     │
             │  24H    │     │     │
             │         │     │     │
           ┌─┼────┐    │     │     │
           │ 12H  │    │     │     │
           │      │    │     │     │
           └──────┘    │     │     │
             🌀        │     │     │
                       │     │     │
                       └─────┘     │
                                   │
                     └─────────────┘
```

실제 지도에서는 각 예상 위치를 중심으로 Leaflet의 `Circle`을 사용한다.

---

# 8. 12 / 24 / 48 / 72시간별 예상 반경

예상 범위는 Mock Data에서 반경 값을 가진다.

```js
const forecastRanges = [
  {
    hour: 12,
    lat: 22.3,
    lng: 131.6,
    radiusKm: 80,
  },
  {
    hour: 24,
    lat: 24.1,
    lng: 130.5,
    radiusKm: 130,
  },
  {
    hour: 48,
    lat: 27.2,
    lng: 129.4,
    radiusKm: 220,
  },
  {
    hour: 72,
    lat: 30.5,
    lng: 129.1,
    radiusKm: 320,
  },
]
```

반경은 다음 관계를 가진다.

```text
현재
 🌀

12시간
  ○

24시간
   ◯

48시간
     ◯

72시간
        ⭕
```

시간이 증가할수록 예상 범위가 넓어지도록 한다.

예상 범위는 **노란색 계열의 반투명 영역**으로 표현하여 태풍 경로선과 구분한다.

단, 디자인 구현 시 색상 값 자체는 컴포넌트 곳곳에 직접 작성하지 않고 CSS 변수 또는 공통 스타일에서 관리한다.

---

# 9. 예상 범위 클릭

각 예상 범위를 클릭할 수 있도록 한다.

사용자가 원형 예상 범위를 클릭하면 Popup을 표시한다.

예:

```text
72시간 예상 범위

예측 시각
2026-08-16 03:00

예상 반경
320 km
```

표시 정보:

- 예측 기준 시간
- 실제 예측 시각
- 예상 중심 위치
- 예상 반경

Mock Data 예시:

```js
{
  hour: 72,
  forecastAt: '2026-08-16 03:00',
  lat: 30.5,
  lng: 129.1,
  radiusKm: 320,
}
```

---

# 10. 예상 범위 Layer ON / OFF

태풍 예상 범위는 항상 표시하지 않고 사용자가 켜거나 끌 수 있도록 한다.

지도 상단 또는 하단에 Layer Control을 만든다.

```text
태풍 Layer

[✓] 실제 이동 경로

[✓] KMA
[✓] JMA
[✓] JTWC

[✓] 예상 범위
```

또는 버튼 형태로 구현할 수 있다.

```text
KMA     JMA     JTWC     예상 범위
 ON      ON      ON         ON
```

`예상 범위` 버튼을 클릭하면 12 / 24 / 48 / 72시간 Circle Layer 전체를 ON/OFF한다.

Vue 반응형 변수 예:

```js
const showForecastRange = ref(true)
```

Template에서는 `v-if` 또는 Layer에 전달하는 Props를 이용해 표시 여부를 제어한다.

---

# 11. KMA / JMA / JTWC와 예상 범위 동시 표시

예상 범위는 기관별 예상 경로를 대체하는 기능이 아니다.

다음 데이터는 동시에 지도에 표시할 수 있어야 한다.

```text
실제 이동 경로
       +
KMA 예상 경로
       +
JMA 예상 경로
       +
JTWC 예상 경로
       +
12 / 24 / 48 / 72시간 예상 범위
```

예:

```text
                         ◯ 72H

                    ● KMA
                   /
             ◯ 48H
                ● JMA
               /
          ◯ 24H
             ● JTWC
            /
       ◯ 12H

          🌀
```

이를 통해 예상 중심 경로와 해당 예측의 불확실성 범위를 동시에 확인할 수 있도록 한다.

---

# 12. 태풍 Layer 상태 관리

태풍 Layer 표시 여부는 여러 자식 컴포넌트에서 사용되므로 별도의 Pinia Store를 사용할 수 있다.

권장 파일:

```text
src/stores/typhoonStore.js
```

예:

```js
const showPastTrack = ref(true)
const showKma = ref(true)
const showJma = ref(true)
const showJtwc = ref(true)
const showForecastRange = ref(true)
```

Action 예:

```js
function toggleForecastRange() {
  showForecastRange.value = !showForecastRange.value
}
```

추가 Getter 예:

```js
const visibleAgencyCount = computed(() => {
  return [showKma.value, showJma.value, showJtwc.value]
    .filter(Boolean)
    .length
})
```

이를 통해 과제 5에서 학습한 Pinia의

```text
State
Getter
Action
```

구조를 태풍 기능에도 활용한다.

---

# 13. 태풍 컴포넌트 구조

기존 컴포넌트 구조를 유지하면서 다음 컴포넌트를 추가한다.

```text
src/
├─ components/
│  │
│  ├─ exercise/
│  │  ├─ BaseDashboardCard.vue
│  │  ├─ SearchBar.vue
│  │  ├─ FavoriteFilter.vue
│  │  ├─ WeatherCard.vue
│  │  ├─ UnitToggler.vue
│  │  └─ WeatherAlertSettings.vue
│  │
│  ├─ weather/
│  │  ├─ CurrentWeatherPanel.vue
│  │  ├─ WeatherMetrics.vue
│  │  ├─ HourlyForecast.vue
│  │  └─ WeeklyForecast.vue
│  │
│  └─ typhoon/
│     ├─ TyphoonMap.vue
│     ├─ TyphoonCurrentMarker.vue
│     ├─ TyphoonPastTrack.vue
│     ├─ TyphoonForecastTrack.vue
│     ├─ ForecastRangeLayer.vue
│     └─ TyphoonLayerControl.vue
│
├─ stores/
│  ├─ configStore.js
│  ├─ weatherAlertStore.js
│  └─ typhoonStore.js
│
├─ composables/
│  └─ useTemperature.js
│
└─ views/
   ├─ WeatherHomeView.vue
   ├─ WeatherDetailView.vue
   ├─ WeatherAboutView.vue
   ├─ WeatherGuideView.vue
   ├─ CityCompareView.vue
   └─ NotFoundView.vue
```

컴포넌트를 지나치게 세분화하지 않는다.

Leaflet 관련 코드가 복잡해질 경우에만 Marker, Path, Range Layer를 별도 컴포넌트로 분리한다.

---

# 14. Props / Emits 활용

태풍 기능에서도 과제 3에서 학습한 Props / Emits 구조를 사용한다.

예:

```vue
<TyphoonLayerControl
  :show-kma="showKma"
  :show-jma="showJma"
  :show-jtwc="showJtwc"
  :show-forecast-range="showForecastRange"
  @toggle-kma="toggleKma"
  @toggle-jma="toggleJma"
  @toggle-jtwc="toggleJtwc"
  @toggle-range="toggleForecastRange"
/>
```

지도 데이터는 부모 또는 Store에서 관리하고 지도 컴포넌트는 데이터를 전달받아 시각화하는 역할을 담당한다.

---

# 15. v-for 활용

12 / 24 / 48 / 72시간 예상 범위를 각각 하드코딩하지 않는다.

배열 데이터를 `v-for`로 반복하여 표시한다.

개념적으로 다음과 같은 구조를 사용한다.

```vue
<template
  v-for="range in forecastRanges"
  :key="range.hour"
>
  <!-- Leaflet Circle -->
</template>
```

동일하게 KMA / JMA / JTWC 경로 데이터도 가능한 한 배열 기반으로 관리한다.

---

# 16. v-if 활용

Layer ON/OFF에는 조건부 렌더링을 활용한다.

예:

```vue
<ForecastRangeLayer
  v-if="typhoonStore.showForecastRange"
  :ranges="forecastRanges"
/>
```

KMA, JMA, JTWC도 각각 Store 상태에 따라 표시한다.

따라서 과제 1에서 학습한 `v-if`를 실제 기능에서도 활용한다.

---

# 17. Computed 활용

태풍 기능에서도 최소 하나 이상의 `computed`를 추가한다.

예:

```js
const activeForecastTracks = computed(() => {
  return agencyTracks.filter((track) => {
    return typhoonStore.isAgencyVisible(track.agency)
  })
})
```

또는 현재 활성화된 Layer 개수를 계산할 수 있다.

```js
const activeLayerCount = computed(() => {
  return [
    typhoonStore.showKma,
    typhoonStore.showJma,
    typhoonStore.showJtwc,
    typhoonStore.showForecastRange,
  ].filter(Boolean).length
})
```

---

# 18. Watch / WatchEffect 활용

기존 과제에서 작성한 `watch`, `watchEffect`는 제거하지 않는다.

태풍 지도에서도 필요한 경우 사용할 수 있다.

예:

선택 태풍이 변경되면 지도 중심을 변경한다.

```js
watch(selectedTyphoonId, () => {
  // 선택된 태풍 위치로 지도 이동
})
```

또는 활성화된 Layer 상태를 디버깅할 수 있다.

```js
watchEffect(() => {
  console.log('Forecast range:', typhoonStore.showForecastRange)
})
```

실제 기능에 불필요한 Watch를 억지로 추가하지 않는다.

---

# 19. Router 확장

기존 Router 구조는 그대로 유지한다.

현재 구조:

```text
/
│
├─ /weather/:cityId
├─ /compare/:firstCityId/:secondCityId
├─ /about
├─ /guide
└─ Catch-All
```

필요한 경우 태풍 상세 화면을 추가할 수 있다.

```js
{
  path: '/typhoon/:typhoonId',
  name: 'typhoon-detail',
  component: () => import('../views/TyphoonDetailView.vue'),
  props: true,
}
```

하지만 과제 규모가 커질 경우 태풍 지도는 `WeatherHomeView.vue` 내부에 포함하고 별도 Route는 구현하지 않아도 된다.

Router를 추가하기 위해 기존 기능을 삭제하지 않는다.

---

# 20. Mock Data 우선 구현

태풍 기능은 먼저 Mock Data로 완성한다.

초기 목표:

```text
Mock Data
   ↓
Vue State
   ↓
Leaflet
   ↓
Marker
Polyline
Circle
Popup
```

그 이후 시간이 남는 경우 실제 공개 기상 데이터와 연결한다.

실제 API 연결 때문에 Vue 과제 핵심 기능의 완성이 늦어지지 않도록 한다.

---

# 21. 태풍 Mock Data 구조

태풍 관련 Mock Data는 하나의 파일에 분리한다.

권장:

```text
src/data/typhoonMockData.js
```

예:

```js
export const typhoonData = {
  id: 'TY2026-01',

  name: 'Sample Typhoon',

  current: {
    lat: 21.2,
    lng: 132.4,
    observedAt: '2026-08-13 03:00',
    windSpeed: 42,
    pressure: 970,
  },

  pastTrack: [],

  agencyTracks: {
    KMA: [],
    JMA: [],
    JTWC: [],
  },

  forecastRanges: [],
}
```

데이터와 UI 코드를 분리한다.

---

# 22. 기존 Weather Store와 태풍 Store 역할 구분

Store의 책임을 명확하게 구분한다.

```text
configStore
→ 섭씨 / 화씨

weatherAlertStore
→ 폭염 / 한파 사용자 설정

typhoonStore
→ 태풍 지도 Layer 상태
```

날씨 API 데이터 전체를 무조건 Store에 넣지 않는다.

현재 과제에서는 여러 Route에서 공유할 필요가 있는 상태만 Store로 관리한다.

---

# 23. 최종 데이터 흐름

```text
사용자
 │
 ├──────────────── 도시 검색
 │                     │
 │                     ▼
 │               WeatherHomeView
 │                     │
 │                     ▼
 │              Weather Components
 │
 │
 ├──────────────── 단위 변경
 │                     │
 │                     ▼
 │                 configStore
 │
 │
 ├──────────────── 경고 설정
 │                     │
 │                     ▼
 │              weatherAlertStore
 │
 │
 └──────────────── 태풍 Layer 선택
                       │
                       ▼
                   typhoonStore
                       │
                       ▼
                   TyphoonMap
                 ┌─────┼─────┐
                 ▼     ▼     ▼
               KMA    JMA   JTWC
                        │
                        ▼
               Forecast Range
             12 / 24 / 48 / 72H
```

---

# 24. 기존 과제 요구사항 보존

최종 UI를 개선하면서 과제에서 요구한 Vue 기능이 사라지지 않도록 한다.

## Weather Mockup

반드시 유지:

- `v-for`
- `:key`
- `v-if`
- `v-bind`
- `v-model` 또는 `:value + @input`
- 이벤트 수식어
- 카드 선택 이벤트
- 상세보기 이벤트
- 사용자 추가 반응형 상태

## Weather Composition

반드시 유지:

- `ref`
- `computed`
- `watch`
- `watchEffect`
- 검색 필터
- 검색 결과 조건부 표시
- 사용자 추가 State
- 사용자 추가 Computed
- 사용자 추가 Watcher

현재 구현된 즐겨찾기 기능을 그대로 사용할 수 있다.

## Weather Component

반드시 유지:

- `WeatherParent`
- `BaseDashboardCard`
- `SearchBar`
- `WeatherCard`
- Props
- Emits
- Slot
- `<style scoped>`

추가 컴포넌트 작성 요구사항은 태풍 관련 컴포넌트로 충족할 수 있다.

## Weather Router

반드시 유지:

- Vue Router
- `RouterLink`
- `RouterView`
- Dynamic Route
- `router.push()`
- Lazy Loading
- Catch-All Route
- 상세 View
- 추가 사용자 View

현재 구현된 `CityCompareView`를 유지한다.

## Weather Store

반드시 유지:

- Pinia
- State
- Getter
- Action
- 섭씨 / 화씨 전환
- 메인 화면 단위 적용
- 상세 화면 단위 적용
- 사용자 추가 Store 또는 기존 Store 확장

현재 구현된 `weatherAlertStore`를 유지한다.

태풍 기능 추가를 위해 `typhoonStore`를 추가할 수 있다.

---

# 25. 구현 우선순위

전체 기능을 한 번에 구현하지 않는다.

## 1단계

기존 과제 1~5 기능을 정상 동작 상태로 유지한다.

## 2단계

최종 Dashboard Layout을 적용한다.

```text
Header
Current Weather
Weather Metrics
Hourly Forecast
Weekly Forecast
Map
```

## 3단계

Leaflet 지도 출력

- OpenStreetMap
- 기본 지도 이동 / Zoom

## 4단계

태풍 현재 위치 + 실제 이동 경로

```text
Marker
+
Polyline
```

## 5단계

KMA / JMA / JTWC 예상 경로

```text
Polyline × 3
```

## 6단계

12 / 24 / 48 / 72시간 예상 범위

```text
Circle × 4
```

## 7단계

Layer ON/OFF

```text
KMA
JMA
JTWC
예상 범위
```

## 8단계

예상 범위 Popup

```text
시간
예측 시각
반경
```

## 9단계

반응형 디자인과 UI 마무리

---

# 26. MVP 완료 기준

다음 조건을 만족하면 최종 기능이 완료된 것으로 본다.

### 기존 날씨 기능

- 도시 검색 가능
- 검색 필터 정상 작동
- 도시 카드 출력
- 카드 Hover
- 즐겨찾기
- 즐겨찾기 필터
- 상세 페이지 이동
- 도시 비교
- 섭씨 / 화씨 변환
- 폭염 / 한파 설정

### 태풍 기능

- 지도 정상 출력
- 현재 태풍 위치 표시
- 과거 이동 경로 표시
- KMA 예상 경로 표시
- JMA 예상 경로 표시
- JTWC 예상 경로 표시
- 12시간 예상 범위 표시
- 24시간 예상 범위 표시
- 48시간 예상 범위 표시
- 72시간 예상 범위 표시
- 시간이 멀어질수록 예상 범위가 넓게 표시
- 예상 범위 클릭 가능
- 클릭 시 예측 시각 표시
- 클릭 시 반경 표시
- 예상 범위 Layer ON/OFF 가능
- KMA / JMA / JTWC와 예상 범위 동시 표시 가능

---

# 27. 최종 프로젝트 핵심

이번 프로젝트의 목적은 복잡한 기상 시스템을 구현하는 것이 아니다.

과제에서 학습한 Vue 기능을 유지하면서 실제 서비스 형태에 가까운 UI와 데이터 시각화를 추가하는 것이 목적이다.

```text
Vue 기본 문법
        +
Composition API
        +
Component
        +
Router
        +
Pinia
        +
Weather Dashboard
        +
Leaflet
        +
태풍 경로 시각화

        ↓

최종 Weather Dashboard
```

특히 태풍 기능의 핵심은 다음과 같다.

```text
              72H
            ┌───────┐
            │   ●   │
            │       │
        48H └───────┘
       ┌──────┐
       │  ●   │
       │      │
   24H └──────┘
   ┌─────┐
   │ ●   │
12H└─────┘
  ◯
  ●
  │
  🌀 Current

──── KMA
- -  JMA
···· JTWC

노란색 영역 = 예상 범위
```

**현재 위치 → 기관별 예상 중심 경로 → 시간이 지날수록 확대되는 예상 범위**를 한 지도에서 동시에 확인할 수 있도록 구현한다.
