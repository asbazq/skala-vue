# SKALA Vue 날씨 과제

## 과제 1: WeatherMockup 카드 호버링

파일: `src/components/exercise/WeatherMockup.vue`

마우스를 올린 날씨 카드를 강조하는 기능입니다.
호버 효과를 사용하면 사용자가 현재 보고 있는 카드를 쉽게 구분하고, 선택 대상을 명확하게 확인할 수 있습니다. 또한 학습한 `v-bind`와 `mouseenter`, `mouseleave` 이벤트를 활용하기에 적합하다고 생각하여 이 기능을 선택했습니다.

<img width="518" height="691" alt="스크린샷 2026-08-11 오후 4 19 01" src="https://github.com/user-attachments/assets/59fc69cb-f8ce-4ee8-8fcd-36337f6da8b9" />


### 반응형 상태

```js
const hoverCity = ref(null)
```

현재 마우스가 올라간 카드의 도시 ID를 저장합니다. 마우스가 어떤 카드에도 올라가 있지 않으면 `null`입니다.

### 마우스 이벤트와 클래스 바인딩

```vue
<article
  :class="{ 'is-hovered': hoverCity === item.id }"
  @mouseenter="hoverCity = item.id"
  @mouseleave="hoverCity = null"
>
```

- `mouseenter`: 현재 카드의 ID를 `hoverCity`에 저장합니다.
- `mouseleave`: `hoverCity`를 `null`로 초기화합니다.
- `:class`: 현재 카드 ID와 `hoverCity`가 같으면 `is-hovered` 클래스를 추가합니다.

```css
.weather-card.is-hovered {
  border-color: #3498db;
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.2);
  transform: translateY(-3px);
}
```

## 과제 2: WeatherComposition 즐겨찾기

파일: `src/components/exercise/WeatherComposition.vue`

도시를 즐겨찾기에 추가하거나 해제하고, 즐겨찾기된 도시를 목록 상단에 배치하는 기능입니다.
사용자가 자주 확인하는 지역을 빠르게 찾을 수 있어 편의성이 높아집니다. 또한 반응형 상태 변수, `computed`, `watch`, `v-for`, 배열 정렬, 스프레드 문법 등 학습한 내용을 함께 활용할 수 있다고 생각하여 이 기능을 선택했습니다.

<img width="520" height="717" alt="스크린샷 2026-08-11 오후 5 43 47" src="https://github.com/user-attachments/assets/a83bed51-6153-4581-8372-b9f0493ae17c" />


### 반응형 상태 변수

```js
const favoriteCityIds = ref([])
```

즐겨찾기로 선택한 도시의 ID를 배열에 저장합니다.

### Computed

```js
const favoriteCount = computed(() => favoriteCityIds.value.length)
```

즐겨찾기 배열이 변경되면 즐겨찾기 개수를 자동으로 다시 계산합니다.

```js
const sortedWeatherList = computed(() => {
  return [...filteredWeatherList.value].sort((a, b) => {
    const aCity = favoriteCityIds.value.includes(a.id)
    const bCity = favoriteCityIds.value.includes(b.id)

    return Number(bCity) - Number(aCity)
  })
})
```

검색 결과를 복사한 다음 즐겨찾기된 도시가 먼저 나오도록 정렬합니다. 원본 날씨 배열의 순서는 변경하지 않습니다.

```vue
<div
  v-for="item in sortedWeatherList"
  :key="item.id"
  class="weather-card"
  @click="selectCity(item.name)"
>
```

- `sortedWeatherList`를 반복하여 즐겨찾기된 도시를 먼저 출력합니다.
- `:key="item.id"`를 사용하므로 카드 순서가 바뀌어도 Vue가 각 도시를 정확하게 구분합니다.
- 카드를 클릭하면 `selectCity()`에 해당 도시 이름을 전달합니다.

### Watcher

```js
watch(favoriteCityIds, () => {
  selectedCityInfo.value = `즐겨찾기 도시가 ${favoriteCount.value}개 있습니다.`
})
```

즐겨찾기 목록이 변경될 때마다 상태바에 현재 즐겨찾기 개수를 표시합니다.

### 즐겨찾기 추가 및 해제

```js
const toggleFavorite = (cityId) => {
  if (favoriteCityIds.value.includes(cityId)) {
    favoriteCityIds.value = favoriteCityIds.value.filter((id) => id !== cityId)
    return
  }

  favoriteCityIds.value = [...favoriteCityIds.value, cityId]
}
```

- `includes(cityId)`로 해당 도시가 즐겨찾기에 포함되어 있는지 확인합니다.
- 이미 포함되어 있다면 `filter()`로 해당 도시 ID를 제거합니다.
- 포함되어 있지 않다면 스프레드 문법으로 기존 배열을 복사하고 새로운 도시 ID를 추가합니다.

### 즐겨찾기 버튼

```vue
<button
  type="button"
  class="btn-favorite"
  :class="{ active: favoriteCityIds.includes(item.id) }"
  @click.stop="toggleFavorite(item.id)"
>
  {{ favoriteCityIds.includes(item.id) ? '★' : '☆' }}
</button>
```

- `:class`는 도시가 즐겨찾기에 포함되어 있으면 `active` 클래스를 추가합니다.
- `@click.stop`은 버튼의 클릭 이벤트가 부모 날씨 카드로 전달되는 것을 막습니다.
- 삼항 연산자를 사용하여 즐겨찾기 상태이면 `★`, 아니면 `☆`를 표시합니다.

### 즐겨찾기 동작 흐름

```text
별 버튼 클릭
→ toggleFavorite()에 도시 ID 전달
→ 즐겨찾기 배열에 ID가 있으면 제거하고, 없으면 추가
→ favoriteCount와 sortedWeatherList 자동 재계산
→ 별 모양과 카드 순서 변경
→ watch가 상태바 문구 갱신
```

## 과제 3: FavoriteFilter 컴포넌트 추가

파일: `src/components/exercise/FavoriteFilter.vue`

전체 도시와 즐겨찾기 도시를 선택해서 볼 수 있는 필터 기능입니다.
과제 2에서는 즐겨찾기한 도시를 목록 상단에 배치했지만, 도시가 많아지면 즐겨찾기하지 않은 도시도 함께 표시되어 원하는 도시를 빠르게 확인하기 어렵습니다. 즐겨찾기 도시만 모아서 볼 수 있도록 하여 자주 확인하는 도시에 더 빠르게 접근할 수 있도록 했습니다.

또한 필터 UI를 `WeatherParent.vue`에 직접 작성하면 부모 컴포넌트가 데이터 관리와 필터 표시를 모두 담당하게 됩니다. 필터 UI를 `FavoriteFilter.vue`로 분리하여 각 컴포넌트의 역할을 명확하게 구분하고, Props와 Emits를 이용한 부모·자식 통신을 적용했습니다.

### Props와 Emits

```vue
<FavoriteFilter
  :favorite-count="favoriteCount"
  :show-favorites-only="showFavoritesOnly"
  @update-filter="(value) => (showFavoritesOnly = value)"
/>
```

- `favorite-count`: 부모의 즐겨찾기 개수를 자식에게 전달합니다.
- `show-favorites-only`: 현재 선택된 필터 상태를 자식에게 전달합니다.
- `update-filter`: 사용자가 선택한 필터 값을 부모에게 전달합니다.

### Computed 필터링

```js
const sortedWeatherList = computed(() => {
  const visibleList = showFavoritesOnly.value
    ? filteredWeatherList.value.filter((item) => favoriteCityIds.value.includes(item.id))
    : filteredWeatherList.value

  return [...visibleList].sort((a, b) => {
    const aFavorite = favoriteCityIds.value.includes(a.id)
    const bFavorite = favoriteCityIds.value.includes(b.id)
    return Number(bFavorite) - Number(aFavorite)
  })
})
```

검색어 필터를 먼저 적용하고 `showFavoritesOnly`가 `true`이면 즐겨찾기한 도시만 남깁니다. 그 후 원본 배열이 변경되지 않도록 스프레드 문법으로 복사하여 정렬합니다.

### 필터 동작 흐름

```text
필터 버튼 클릭
→ FavoriteFilter가 update-filter 이벤트 발생
→ WeatherParent가 showFavoritesOnly 상태 변경
→ sortedWeatherList 자동 재계산
→ 전체 도시 또는 즐겨찾기 도시만 표시
```

## 과제 4: Weather Router

과제 3의 검색, 호버링, 즐겨찾기, 즐겨찾기 필터 기능을 `WeatherHomeView.vue`에 적용하고 Vue Router를 이용해 페이지 단위로 확장했습니다.

모든 화면을 하나의 컴포넌트에 표시하면 날씨 목록, 도시 상세, 서비스 안내의 역할이 섞입니다. URL에 따라 View를 분리하여 사용자가 특정 도시의 상세 페이지를 직접 열거나 공유할 수 있도록 하고, 각 페이지의 역할을 명확하게 구분했습니다.

### 프로젝트 구조

```text
src/
├─ App.vue
├─ router/
│  └─ index.js
├─ components/exercise/
│  ├─ BaseDashboardCard.vue
│  ├─ SearchBar.vue
│  ├─ FavoriteFilter.vue
│  └─ WeatherCard.vue
└─ views/
   ├─ WeatherHomeView.vue
   ├─ WeatherDetailView.vue
   ├─ WeatherAboutView.vue
   ├─ WeatherGuideView.vue
   ├─ CityCompareView.vue
   └─ NotFoundView.vue
```

### Router 설정

`WeatherHomeView` 이외의 View는 함수 형태로 import하여 해당 경로에 접근할 때만 로드되도록 지연 로딩을 적용했습니다. 첫 화면에 필요하지 않은 코드를 분리하여 초기 로드 범위를 줄이기 위해 선택했습니다.

```js
{
  path: '/weather/:cityId',
  name: 'weather-detail',
  component: () => import('../views/WeatherDetailView.vue'),
  props: true,
},
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
}
```

- `/weather/:cityId`: URL의 `cityId`를 상세 View의 Props로 전달합니다.
- `/:pathMatch(.*)*`: 정의되지 않은 모든 경로를 `NotFoundView`로 전달합니다.

### Programmatic Navigation

```js
const showDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
```

과제 3의 상세보기는 `window.alert()`로 간단한 정보만 보여줬습니다. 과제 4에서는 도시 ID를 포함한 URL로 이동하여 독립된 상세 화면에서 기온, 습도, 풍속을 함께 확인할 수 있도록 변경했습니다.

### 동적 상세 페이지

`WeatherDetailView.vue`는 `cityId`를 Props로 전달받고 Mock Data에서 해당 도시를 선택합니다. 같은 View를 재사용하면서 URL의 도시 ID에 따라 다른 정보를 표시하기 위해 동적 경로를 사용했습니다. Mock Data에 없는 도시 ID에 접근하면 안내 문구와 대시보드 복귀 링크를 표시합니다.

### Router 동작 흐름

```text
날씨 카드의 상세보기 클릭
→ WeatherCard가 click-detail 이벤트 발생
→ WeatherHomeView가 router.push('/weather/' + cityId) 실행
→ Router가 /weather/:cityId 동적 경로 매칭
→ WeatherDetailView 지연 로딩
→ cityId에 해당하는 Mock Data 표시
```

### 추가 View: CityCompareView

파일: `src/views/CityCompareView.vue`

두 도시의 기온, 습도, 풍속을 한 화면에서 비교하는 페이지입니다.
기존 날씨 대시보드에서는 여러 도시의 기본 날씨를 목록으로 확인할 수 있지만, 두 도시의 수치 차이를 확인하려면 각 정보를 번갈아 비교해야 합니다. 여행지나 외출 지역을 결정할 때 두 도시의 날씨 차이를 빠르게 확인할 수 있도록 도시 비교 화면을 추가했습니다.

비교 기능은 전체 도시를 탐색하는 메인 화면과 역할이 다르므로 별도 View로 분리했습니다. 또한 비교하는 두 도시의 ID를 URL에 포함하여 새로고침 후에도 선택이 유지되고, 비교 결과를 URL로 공유할 수 있도록 했습니다.

### 동적 비교 경로

```js
{
  path: '/compare/:firstCityId/:secondCityId',
  name: 'city-compare',
  component: () => import('../views/CityCompareView.vue'),
  props: true,
}
```

예시 URL인 `/compare/city_01/city_03`은 서울과 부산을 비교합니다. Router의 `props: true`를 사용하여 두 도시 ID를 View의 Props로 전달했습니다.

### Computed 비교

```js
const temperatureMessage = computed(() => {
  const difference = firstCity.value.temp - secondCity.value.temp

  if (difference === 0) return '두 도시의 기온이 같습니다.'

  const warmerCity = difference > 0 ? firstCity.value.name : secondCity.value.name
  return `${warmerCity}이 ${Math.abs(difference)}°C 더 높습니다.`
})
```

URL의 Props가 변경되면 선택된 도시 객체와 기온·습도 차이를 `computed`가 자동으로 다시 계산합니다. 차이의 절대값은 `Math.abs()`로 계산하고 더 높은 도시를 문장으로 안내합니다.

### 도시 선택과 URL 변경

```js
const changeCity = (position, cityId) => {
  const firstId = position === 'first' ? cityId : props.firstCityId
  const secondId = position === 'second' ? cityId : props.secondCityId
  router.push(`/compare/${firstId}/${secondId}`)
}
```

- 두 `select`에서 비교할 도시를 선택합니다.
- 이미 반대편에서 선택한 도시는 `disabled`로 처리해 같은 도시를 비교하지 않도록 했습니다.
- 선택이 바뀐 때 `router.push()`로 동적 URL을 변경합니다.
- 각 도시의 상세보기 링크는 기존 `/weather/:cityId` 경로를 재사용합니다.

### 도시 비교 동작 흐름

```text
내비게이션에서 도시 비교 선택
→ /compare/city_01/city_03 경로로 이동
→ Router가 firstCityId와 secondCityId를 Props로 전달
→ computed가 두 도시 객체와 기온·습도 차이 계산
→ 도시 선택 변경 시 router.push()로 URL 갱신
→ 비교 결과 자동 재계산
```

## 과제 5: Weather Store

과제 4의 라우터 구조와 날씨 기능을 유지하면서 Pinia Store로 온도 단위와 즐겨찾기 상태를 공유하도록 확장했습니다.

단위 설정을 각 View에서 개별적으로 관리하면 메인 목록은 화씨이고 상세 페이지는 섭씨인 상태가 발생할 수 있습니다. 사용자가 선택한 단위를 모든 라울트에 동일하게 적용하기 위해 `configStore`로 분리했습니다.

### configStore

파일: `src/stores/configStore.js`

```js
export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
```

- state `unit`: 현재 선택한 `celsius` 또는 `fahrenheit`를 저장합니다.
- getter `unitSymbol`: 현재 단위에 맞는 `℃` 또는 `℉`를 반환합니다.
- action `toggleUnit`: 섭씨와 화씨 설정을 전환합니다.

### UnitToggler

파일: `src/components/exercise/UnitToggler.vue`

`UnitToggler`를 `App.vue`의 Navigation Bar 오른쪽에 배치했습니다. 라울트가 바뀌어도 Navigation Bar는 유지되므로 어떤 화면에서든 단위를 바로 변경할 수 있습니다. 버튼을 누르면 `configStore.toggleUnit()`을 실행하고 Store를 참조하는 모든 화면이 즉시 갱신됩니다.

### 온도 변환 Composable

파일: `src/composables/useTemperature.js`

```js
export const useTemperature = (celsiusSource) => {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    const celsius = Number(toValue(celsiusSource))
    return configStore.unit === 'fahrenheit'
      ? Math.round((celsius * 9) / 5 + 32)
      : celsius
  })

  const formattedTemp = computed(() => `${displayTemp.value}${configStore.unitSymbol}`)
  return { displayTemp, formattedTemp }
}
```

`WeatherCard`와 `WeatherDetailView`에서 같은 섭씨·화씨 변환 공식을 중복하지 않도록 Composable로 분리했습니다. 기본 Mock Data는 섭씨로 유지하고 화면에 표시할 때만 Store 설정에 따라 변환하므로 원본 데이터가 변경되지 않습니다.

### 단위 설정 적용 범위

- `WeatherCard.vue`: 메인 대시보드의 도시별 기온
- `WeatherDetailView.vue`: 도시 상세 기상관측 기온
- `CityCompareView.vue`: 두 도시의 기온과 기온 차이

### 추가 Store: favoriteStore

파일: `src/stores/favoriteStore.js`

과제 3에서 즐겨찾기 배열을 `WeatherParent` 내부에서 관리했지만, Router를 적용한 후에는 View가 제거되고 다시 생성될 때 즐겨찾기 상태가 초기화될 수 있습니다. 즐겨찾기를 Pinia Store로 옮겨 다른 페이지를 방문한 후 돌아와도 선택 상태가 유지되도록 했습니다.

```js
export const useFavoriteStore = defineStore('favorite', () => {
  const cityIds = ref([])
  const count = computed(() => cityIds.value.length)
  const hasFavorite = (cityId) => cityIds.value.includes(cityId)

  const toggleFavorite = (cityId) => {
    cityIds.value = hasFavorite(cityId)
      ? cityIds.value.filter((id) => id !== cityId)
      : [...cityIds.value, cityId]
  }

  return { cityIds, count, hasFavorite, toggleFavorite }
})
```

- state `cityIds`: 즐겨찾기한 도시 ID 목록을 저장합니다.
- getter `count`: 즐겨찾기 도시 개수를 자동 계산합니다.
- action `toggleFavorite`: 도시 ID를 즐겨찾기에 추가하거나 제거합니다.
- `hasFavorite`: 특정 도시의 즐겨찾기 여부를 확인합니다.

### Store 동작 흐름

```text
단위변경 버튼 클릭
→ UnitToggler가 configStore.toggleUnit() 실행
→ configStore.unit과 unitSymbol 변경
→ useTemperature의 computed 재계산
→ 메인·상세·비교 화면의 온도 단위 동시 변경

즐겨찾기 버튼 클릭
→ favoriteStore.toggleFavorite(cityId) 실행
→ cityIds와 count 변경
→ 카드의 별 모양·정렬·즐겨찾기 필터 자동 갱신
```

### 추가 Store: weatherAlertStore

파일: `src/stores/weatherAlertStore.js`

사용자가 폭염·한파 기준 기온과 경고 활성화 여부를 설정하고, 메인 날씨 카드와 도시 상세 화면에서 동일한 기준으로 위험 상태를 표시하는 Store입니다.

경고 기준을 각 컴포넌트에서 개별적으로 관리하면 화면마다 다른 위험 판정이 표시될 수 있습니다. 이 설정은 여러 View에서 공통으로 사용되고 라울트가 바뀌어도 유지되어야 하므로 Pinia Store로 분리했습니다.

현재 날씨는 Mock Data이지만 이후 Axios로 실제 기상 API와 연결할 예정입니다. API에서 받은 기온 데이터와 사용자가 설정하는 경고 기준은 성격이 다르므로, Store에는 사용자 설정만 저장하고 날씨 데이터를 Store의 기준과 비교하도록 설계했습니다. 따라서 Mock Data가 API 응답으로 바뀌어도 경고 설정과 판정 로직을 그대로 재사용할 수 있습니다.

#### State, Getter, Action

```js
const heatThreshold = ref(28)
const coldThreshold = ref(5)
const alertsEnabled = ref(true)

const thresholdSummary = computed(() => {
  return `한파 ${coldThreshold.value}℃ 이하 / 폭염 ${heatThreshold.value}℃ 이상`
})

const getRiskLevel = (celsius) => {
  if (!alertsEnabled.value) return 'normal'
  if (celsius >= heatThreshold.value) return 'heat'
  if (celsius <= coldThreshold.value) return 'cold'
  return 'normal'
}
```

- state `heatThreshold`: 폭염 경고 기준을 섭씨로 저장합니다.
- state `coldThreshold`: 한파 경고 기준을 섭씨로 저장합니다.
- state `alertsEnabled`: 기온 경고 표시 여부를 저장합니다.
- getter `thresholdSummary`: 현재 경고 기준을 하나의 안내 문구로 반환합니다.
- action `setThresholds`: 한파 기준이 폭염 기준보다 낮은지 검증한 후 두 값을 함께 변경합니다.
- action `toggleAlerts`: 경고 활성화 여부를 전환합니다.
- `getRiskLevel`, `getRiskLabel`: 섭씨 원본 기온을 기준과 비교해 정상·폭염·한파 상태와 표시 문구를 반환합니다.

#### WeatherAlertSettings

파일: `src/components/exercise/WeatherAlertSettings.vue`

한파·폭염 기준을 입력하고 경고를 ON/OFF하는 설정 컴포넌트입니다. 두 기준이 잘못된 순서로 입력되면 Store에 반영하지 않고 안내 문구를 표시합니다.

경고 판정은 화면에 표시된 섭씨·화씨 값이 아니라 원본 섭씨 데이터로 수행합니다. 단위 설정이 변경되어도 경고 판정이 달라지지 않도록 하기 위해서입니다.

#### 폭염·한파 경고 동작 흐름

```text
사용자가 한파·폭염 기준 입력
→ WeatherAlertSettings가 weatherAlertStore.setThresholds() 실행
→ Store가 두 기준의 유효성 검사 후 state 변경
→ WeatherCard와 WeatherDetailView가 원본 섭씨 기온을 getRiskLevel()로 판정
→ 위험 도시에 폭염 또는 한파 경고 표시

알림 OFF 선택
→ weatherAlertStore.toggleAlerts() 실행
→ alertsEnabled가 false로 변경
→ 모든 날씨 화면의 경고 숨김
```
