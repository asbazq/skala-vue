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

<img width="691" height="681" alt="스크린샷 2026-08-12 오후 1 35 20" src="https://github.com/user-attachments/assets/163cb245-9369-4285-befe-05fbf4190382" />


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

<img width="354" height="594" alt="스크린샷 2026-08-12 오후 3 45 42" src="https://github.com/user-attachments/assets/b4fd7d7b-2038-41f5-9329-7b925799156b" />

<img width="354" height="392" alt="스크린샷 2026-08-12 오후 3 46 03" src="https://github.com/user-attachments/assets/37e2a994-af70-4b66-ad83-8b8e1c8e8ce5" />

<img width="358" height="245" alt="스크린샷 2026-08-12 오후 3 45 50" src="https://github.com/user-attachments/assets/cc26ed44-faff-4787-87b6-c6ea19f23b71" />

<img width="361" height="246" alt="스크린샷 2026-08-12 오후 3 45 59" src="https://github.com/user-attachments/assets/6193afc7-682a-4bca-8c7d-893cf503e139" />

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

<img width="365" height="702" alt="스크린샷 2026-08-12 오후 6 55 56" src="https://github.com/user-attachments/assets/e7ec2998-5ee3-4ba7-bb07-16bf20a9fa49" />

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


### 추가 Store: weatherAlertStore

파일: `src/stores/weatherAlertStore.js`

사용자가 폭염·한파 기준 기온과 경고 활성화 여부를 설정하고, 메인 날씨 카드와 도시 상세 화면에서 동일한 기준으로 위험 상태를 표시하는 Store입니다.

경고 기준을 각 컴포넌트에서 개별적으로 관리하면 화면마다 다른 위험 판정이 표시될 수 있습니다. 이 설정은 여러 View에서 공통으로 사용되고 route가 바뀌어도 유지되어야 하므로 Pinia Store로 분리했습니다.

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

---

## 나갈까? 프로젝트 소개

**나갈까?**는 날씨를 단순히 확인하는 데서 끝나지 않고, 약속 장소와 외출 시간을 결정할 수 있도록 돕는 개인 맞춤형 날씨 서비스입니다.

### 타깃 사용자

- 친구, 연인, 가족과 약속을 잡기 전에 어느 날짜와 시간대가 좋을지 고민하는 사람
- 나들이나 여행을 계획하면서 어느 지역의 날씨가 더 쾌적한지 비교하고 싶은 사람
- 너무 덥거나 추운 날에는 외출을 피하고 싶은 사람
- 비, 강풍, 태풍과 기상 특보를 함께 확인한 뒤 안전하게 일정을 정하고 싶은 사람
- 여러 지역의 날씨를 각각 검색하지 않고 한 화면에서 비교하고 싶은 사람

사용자는 자신이 나가기 싫은 기온의 상한과 하한을 직접 설정할 수 있습니다. 서비스는 현재 날씨와 앞으로의 예보, 강수확률, 풍속, 기상 특보를 함께 보여 주어 “오늘 약속을 잡아도 괜찮을까?”, “어느 지역으로 놀러 가는 것이 좋을까?”를 판단할 수 있게 합니다.

## 주요 기능

### 1. 대한민국 17개 시·도 날씨 확인

<img width="685" height="840" alt="스크린샷 2026-08-13 오후 4 15 40" src="https://github.com/user-attachments/assets/7a01bd7c-26ca-4cbb-b690-745ba8c4d72f" />

- 특별시, 광역시, 특별자치시·도와 각 도의 대표 지역 날씨 제공
- 현재 기온, 체감온도, 최고·최저기온, 습도, 풍속, 기압과 강수량 표시
- 지역 검색과 즐겨찾기 필터 지원
- 지역 카드를 클릭하면 해당 지역 상세 화면으로 이동

### 2. 개인 외출 기온 기준 설정

<img width="672" height="769" alt="스크린샷 2026-08-13 오후 4 16 22" src="https://github.com/user-attachments/assets/ff962fe4-c3ed-498b-945a-6036dbf505f7" />

- 사용자가 “이 온도 이하면 나가기 싫어요”, “이 온도 이상이면 나가기 싫어요” 기준 설정
- 기준보다 더운 지역은 붉은 계열, 추운 지역은 파란 계열로 구분
- 현재 날씨 카드, 시간대별 예보, 일별 예보와 지도에 같은 기준 적용
- 설정한 기준은 브라우저에 저장되어 화면 이동이나 새로고침 후에도 유지

### 3. 24시간 및 일별 날씨 예보

<img width="896" height="730" alt="스크린샷 2026-08-13 오후 4 20 52" src="https://github.com/user-attachments/assets/f01b6a6e-1196-4479-9128-06e7a9ae39ef" />

- 현재부터 약 24시간 동안의 날씨를 8개 시간대로 제공
- 기온, 날씨 상태, 습도와 강수확률 표시
- 현재 시간과 개인 외출 기준을 벗어나는 시간대 강조
- 상세 화면에서 24시간 기온 변화를 그래프로 시각화
- 앞으로의 일별 예보에서 최고·최저기온 확인

### 4. 내 외출 기준 지도

<img width="883" height="516" alt="스크린샷 2026-08-13 오후 4 18 29" src="https://github.com/user-attachments/assets/e7034f20-183d-497e-9102-9fc98996957c" />

- Leaflet과 OpenStreetMap을 이용한 대한민국 날씨 지도
- 광역자치단체 행정구역 외곽선을 실제 지역 형태로 표시
- 지역에 마우스를 올리면 해당 행정구역의 외곽선 강조
- 지역 버튼을 선택하면 지도와 위치 마커가 해당 지역으로 이동
- 각 지역의 외출 적합 여부를 개인 기온 기준에 맞춰 색상으로 구분

### 5. 기상청 예·특보 확인

- 기상청 API허브에서 현재 발효 중인 특보 정보 제공
- 특보 종류, 수준, 대상 지역과 발효 시각 표시
- 해제된 특보와 중복 항목을 정리하고 시·군·구 특보를 광역자치단체에 연결
- 특보가 발효된 지역을 지도에서 주황색 점선으로 강조
- 지역 카드, 현재 날씨, 상세 화면과 도시 비교 결과에 특보 반영
- 반복 요청을 줄이기 위해 예·특보 데이터를 1시간 동안 캐싱

### 6. 최근 태풍 경로 확인

<img width="881" height="524" alt="스크린샷 2026-08-13 오후 4 19 13" src="https://github.com/user-attachments/assets/9c18c23a-1588-4b5b-bd2c-350fb25d0b18" />

- 기상청에서 제공하는 최근 태풍 5개의 이동 경로 표시
- 현재 태풍이 없으면 가장 최근 태풍의 정보와 최종 관측일 제공
- 실제 이동 경로, 예측 경로, 강풍반경과 제공되는 예상 범위 표시
- 태풍 버튼을 선택하면 여러 경로 중 원하는 태풍 하나만 확인 가능
- 진행 중인 태풍은 30분, 종료된 과거 태풍은 6시간 동안 캐싱

### 7. 어디로 나갈까? 도시 비교

<img width="891" height="781" alt="스크린샷 2026-08-13 오후 4 19 52" src="https://github.com/user-attachments/assets/d60a0112-7228-4d29-b45a-6d18081bf1e3" />

- 서로 다른 두 지역과 예보 날짜를 선택해 외출 조건 비교
- 개인 기온 기준, 습도, 강수확률, 풍속과 발효 특보를 종합한 100점 만점의 외출 쾌적도 제공
- 선택한 날짜의 평균 쾌적도와 외출하기 좋은 시간대 수 표시
- 도시별 추천 시간 TOP 3와 각 시간의 점수, 기온, 강수확률 제공
- 기온, 체감온도, 습도, 풍속, 강수량과 기압 비교
- 두 도시 중 더 쾌적한 지역, 가장 좋은 시간과 추천 이유를 문장으로 안내
- WeatherCard와 지도에도 동일한 쾌적도 점수를 표시해 화면마다 판단 기준 통일

### 8. 지역 상세 날씨

<img width="451" height="604" alt="스크린샷 2026-08-13 오후 4 17 27" src="https://github.com/user-attachments/assets/352ab105-dee4-4a56-9540-02692892e035" />


- 선택한 지역의 현재 관측값과 개인 외출 기준 상태 표시
- 현재 발효 중인 지역 예·특보 확인
- 24시간 기온 그래프와 시간대별 예보 제공
- 일별 최고·최저기온과 날씨 상태 확인

### 사용 데이터

- 현재 날씨 및 예보: OpenWeather API
- 예·특보 및 태풍: 기상청 API허브
- 지도 타일: OpenStreetMap
- 행정구역 외곽선: TopoJSON 기반 대한민국 광역자치단체 지도 데이터

외출 추천은 사용자가 설정한 기준과 공개 기상자료를 바탕으로 제공하는 참고 정보입니다. 태풍이나 위험 기상 상황에서는 기상청의 공식 발표와 안전 안내를 우선해야 합니다.

## 주요 기술 구현 설명

### 1. Vite 서버 미들웨어를 이용한 API 프록시

파일: `vite.config.js`

OpenWeather와 기상청 인증키를 Vue 컴포넌트에 직접 작성하면 빌드된 JavaScript를 통해 키가 노출됩니다. 이를 피하기 위해 브라우저는 `/api`로 요청하고, Vite 서버 미들웨어가 환경변수의 인증키를 추가해 외부 API를 호출합니다.

```js
if (requestUrl.pathname === '/weather' || requestUrl.pathname === '/forecast') {
  const endpoint = requestUrl.pathname === '/weather' ? 'weather' : 'forecast'
  upstream = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`)

  for (const [key, value] of requestUrl.searchParams) {
    upstream.searchParams.set(key, value)
  }

  upstream.searchParams.set('appid', env.OPENWEATHER_API_KEY)
  upstream.searchParams.set('units', 'metric')
  upstream.searchParams.set('lang', 'kr')
}
```

- 클라이언트는 위도와 경도만 전달합니다.
- API 키, 섭씨 단위와 한국어 설정은 서버에서 추가합니다.
- 날씨, 예보, 예·특보와 태풍 요청을 같은 `/api` 경로로 관리합니다.

기상청 예·특보 응답은 EUC-KR이므로 서버에서 UTF-8로 변환한 뒤 브라우저에 전달합니다.

```js
if (requestUrl.pathname === '/warnings') {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end(new TextDecoder('euc-kr').decode(responseBuffer))
}
```

### 2. async/await와 Promise.all을 이용한 OpenWeather 병렬 요청

파일: `src/services/weatherApi.js`

이 프로젝트의 비동기 코드 작성 방식은 Promise의 `.then()`을 계속 연결하는 체이닝 방식이 아니라 `async/await` 방식입니다. 현재 날씨와 예보는 서로 의존하지 않으므로 두 요청을 동시에 실행하기 위한 조합 도구로 `Promise.all()`을 함께 사용합니다.

```js
export const fetchCityWeather = async city => {
  const query = `lat=${city.coord[0]}&lon=${city.coord[1]}`

  const [current, forecast] = await Promise.all([
    requestJson(`/api/weather?${query}`),
    requestJson(`/api/forecast?${query}`),
  ])

  return {
    ...city,
    temp: round(current.main.temp),
    feels: round(current.main.feels_like),
    humidity: current.main.humidity,
    wind: current.wind.speed,
    hourly,
    weekly: dailyForecast(forecast.list),
  }
}
```

#### Promise 체이닝 방식을 사용하지 않은 이유

`async/await` 이전에는 비동기 결과를 다음과 같이 `.then()`으로 연결하는 방식이 주로 사용되었습니다.

```js
requestJson('/api/weather')
  .then(current => {
    return requestJson('/api/forecast')
      .then(forecast => {
        return { current, forecast }
      })
  })
  .catch(error => {
    console.error(error)
  })
```

이 방식도 정상적인 Promise 코드이지만 작업 단계가 많아질수록 다음 문제가 생길 수 있습니다.

- `.then()` 내부에 다시 `.then()`이 들어가 코드의 중첩이 깊어질 수 있습니다.
- 성공 흐름과 오류 처리 흐름을 한눈에 읽기 어렵습니다.
- 일반적인 동기 코드와 실행 순서가 다르게 보여 유지보수가 어려워질 수 있습니다.
- 위 예시는 현재 날씨 요청이 끝난 뒤 예보 요청을 시작하므로 서로 독립적인 요청을 불필요하게 순차 실행합니다.

따라서 이 프로젝트에서는 함수에 `async`를 선언하고 Promise의 완료 결과를 `await`로 받습니다. 비동기 로직을 위에서 아래로 읽을 수 있고 `try/catch`로 오류를 처리할 수 있기 때문입니다.

```js
const loadWeather = async () => {
  try {
    const weather = await fetchCityWeather(city)
    return weather
  } catch (error) {
    console.error(error)
    throw error
  }
}
```

#### async/await를 쓰면서 Promise.all을 사용한 이유

`async/await`는 Promise를 없앤 별개의 비동기 기술이 아니라 Promise를 더 읽기 쉽게 사용하는 문법입니다. `async` 함수는 항상 Promise를 반환하고, `await`는 Promise가 처리될 때까지 해당 함수의 실행을 기다립니다.

아래처럼 `await`를 각각 작성하면 코드는 읽기 쉽지만 요청이 순차적으로 실행됩니다.

```js
const current = await requestJson('/api/weather')
const forecast = await requestJson('/api/forecast')
```

실행 순서는 다음과 같습니다.

```text
현재 날씨 요청 시작 → 완료 → 예보 요청 시작 → 완료
```

현재 날씨와 예보는 서로의 결과가 필요하지 않으므로 순차 실행할 이유가 없습니다. `Promise.all()`에 두 Promise를 전달하고 그 결과를 한 번만 `await`하면 두 요청을 병렬로 시작할 수 있습니다.

```js
const [current, forecast] = await Promise.all([
  requestJson('/api/weather'),
  requestJson('/api/forecast'),
])
```

```text
현재 날씨 요청 시작 ─┐
                     ├→ 두 요청 완료 → await 다음 코드 실행
예보 요청 시작 ──────┘
```

즉, 이 코드에서 역할은 다음과 같이 구분됩니다.

| 코드 | 역할 |
| --- | --- |
| `async` | 함수를 비동기 함수로 선언하고 Promise를 반환하도록 함 |
| `await` | Promise가 완료된 결과를 읽기 쉬운 형태로 받음 |
| `Promise.all()` | 서로 독립적인 여러 Promise를 동시에 실행하고 결과를 하나로 모음 |

`Promise.all()`을 사용했다는 이유만으로 예전의 Promise 체이닝 방식을 사용한 것은 아닙니다. 현재 구현은 **async/await를 기본 작성 방식으로 사용하면서 병렬 처리가 필요한 부분에만 Promise.all을 조합한 방식**입니다.

`fetchCityWeather()` 안에서 일반 객체를 반환하더라도 함수에 `async`가 선언되어 있으므로 호출자에게는 해당 객체를 결과로 갖는 Promise가 반환됩니다.

```js
return weatherData

// async 함수 내부에서는 개념적으로 다음과 같은 결과가 됩니다.
return Promise.resolve(weatherData)
```

API 원본 구조를 컴포넌트에서 직접 사용하지 않고 `temp`, `hourly`, `weekly`처럼 화면에 필요한 형태로 변환합니다. API 구조가 바뀌더라도 Service만 수정하면 View와 컴포넌트의 변경 범위를 줄일 수 있습니다.

17개 지역 역시 병렬로 요청합니다.

```js
export const fetchAllCityWeather = cities => {
  return Promise.all(cities.map(fetchCityWeather))
}
```

`fetchAllCityWeather()`는 Promise를 직접 반환하지만 `.then()` 체이닝을 사용하지 않습니다. 중간에 처리할 로직이 없기 때문에 17개 지역 요청을 모은 Promise를 호출자에게 그대로 전달하고, 실제 호출 위치에서 `await fetchAllCityWeather()`로 결과를 받습니다. 이 함수에 불필요하게 `async`와 `await`를 한 번 더 작성해도 동작은 같지만 코드만 늘어나므로 직접 반환했습니다.

### 3. 도시별 현지 시간 계산

OpenWeather가 제공하는 UTC timestamp와 지역 timezone 값을 조합하여 각 예보의 요일과 시간을 계산합니다.

```js
const localParts = timestamp => {
  const date = new Date((timestamp + timezone) * 1000)
  const day = new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(date)
  const time = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(date)

  return { day, time }
}
```

브라우저가 실행되는 위치의 시간대에 의존하지 않으므로 사용자가 어느 지역에서 접속하더라도 대상 도시 기준 시간이 표시됩니다.

### 4. 기상청 예·특보 파싱과 지역 연결

파일: `src/services/weatherApi.js`

기상청 예·특보 API는 쉼표로 구분된 텍스트를 반환합니다. 데이터 행만 선택한 뒤 특보 종류, 수준, 명령과 발효 시각을 객체로 변환합니다.

```js
const parsed = text
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => /^L\d+,/.test(line))
  .map(line => line.split(',').map(value => value.trim()))
  .filter(columns => columns.length >= 9 && !columns[8].includes('해제'))
  .map(columns => ({
    id: `${columns[2]}-${columns[6]}-${columns[7]}`,
    region: columns[3],
    type: columns[6],
    level: columns[7],
    command: columns[8],
  }))
```

일부 특보는 상위 지역명이 `경기도`가 아니라 `여주시`처럼 시·군·구로 내려옵니다. 지역명만 비교하면 누락될 수 있으므로 기상청 특보구역 코드의 접두사를 함께 사용합니다.

```js
const warningRegionPrefixes = {
  L101: 'gyeonggi',
  L102: 'gangwon',
  L103: 'chungnam',
  L105: 'jeonnam',
  L106: 'jeonbuk',
  L107: 'gyeongbuk',
  L108: 'gyeongnam',
  L113: 'gwangju',
  L114: 'daegu',
  L115: 'busan',
}
```

### 5. localStorage를 이용한 기상청 데이터 캐싱

태풍과 특보는 날씨 화면을 이동할 때마다 다시 받을 필요가 없으므로 응답과 확인 시각을 `localStorage`에 저장합니다.

```js
const WARNING_CACHE_TTL = 60 * 60 * 1000

export const fetchKmaWarnings = async () => {
  const cached = readWarningCache()

  if (cached?.data && Date.now() - cached.checkedAt < WARNING_CACHE_TTL) {
    return cached.data
  }

  try {
    const response = await fetch('/api/warnings')
    const data = parseWarnings(await response.text())
    writeWarningCache(data)
    return data
  } catch (error) {
    if (cached?.data) return cached.data
    throw error
  }
}
```

- 예·특보 캐시는 1시간 동안 사용합니다.
- 진행 중인 태풍은 30분, 과거 태풍은 6시간 동안 사용합니다.
- API 갱신에 실패하면 빈 화면 대신 마지막으로 저장된 자료를 반환합니다.
- 최근 태풍 목록에 변경이 없으면 저장된 상세자료를 재사용합니다.

### 6. Pinia를 이용한 개인 외출 기준 관리

파일: `src/stores/weatherAlertStore.js`

여러 컴포넌트에서 동일한 기준을 사용하도록 외출 기온 기준과 활성화 상태를 Pinia Store로 분리했습니다.

```js
export const useWeatherAlertStore = defineStore('personalOutdoorTemperature', () => {
  const heatThreshold = ref(28)
  const coldThreshold = ref(5)
  const alertsEnabled = ref(true)

  const getRiskLevel = celsius => {
    if (!alertsEnabled.value) return 'normal'
    if (celsius >= heatThreshold.value) return 'above-limit'
    if (celsius <= coldThreshold.value) return 'below-limit'
    return 'normal'
  }

  return { heatThreshold, coldThreshold, alertsEnabled, getRiskLevel }
})
```

`WeatherCard`, `ForecastPanels`, `WeatherMap`, `WeatherDetailView`, `CityCompareView`가 같은 `getRiskLevel()`을 사용합니다. 따라서 한 곳에서 기준을 변경하면 카드, 예보, 지도와 비교 결과가 Vue 반응성에 의해 함께 갱신됩니다.

### 7. TopoJSON 행정구역을 Leaflet 지도에 표시

파일: `src/components/weather/WeatherMap.vue`

TopoJSON 파일을 GeoJSON으로 변환하고 각 행정구역에 해당 지역의 날씨 객체를 연결합니다.

```js
const provinceGeoJson = computed(() => {
  const object = provinceTopology.objects[Object.keys(provinceTopology.objects)[0]]
  const geoJson = feature(provinceTopology, object)

  return {
    ...geoJson,
    features: geoJson.features.map(boundary => ({
      ...boundary,
      properties: {
        ...boundary.properties,
        weather: props.cities.find(city => city.local === boundary.properties.name),
      },
    })),
  }
})
```

외출 기준과 특보 상태에 따라 행정구역의 테두리와 채우기 스타일을 동적으로 계산합니다.

```js
const provinceStyle = boundary => {
  const city = boundary.properties.weather
  const level = alertStore.getRiskLevel(city.temp)
  const hasWarning = Boolean(city.warnings?.length)

  return {
    color: hasWarning ? '#f6b94d' : level === 'above-limit' ? '#ff8b91' : '#8bc5ff',
    dashArray: hasWarning ? '7 5' : null,
    fillColor: outdoorColor(city),
  }
}
```

Leaflet의 `mouseover`, `mouseout` 이벤트로 마우스가 올라간 지역만 외곽선을 굵게 표시하고, 팝업에는 날씨·외출 기준·특보 정보를 함께 제공합니다.

### 8. 태풍 경로와 영향 범위 시각화

기상청 태풍 자료의 위도·경도를 Leaflet의 선과 원으로 표현합니다.

```vue
<LPolyline
  v-if="typhoonStore.showPastTrack"
  :lat-lngs="storm.pastTrack.map(point => point.coord)"
  :color="storm.color"
  :weight="3"
/>

<LCircle
  v-if="typhoonStore.showForecastRange && storm.current.windRadiusKm"
  :lat-lng="storm.current.coord"
  :radius="storm.current.windRadiusKm * 1000"
  :color="storm.color"
/>
```

- `LPolyline`: 관측된 이동 경로와 예측 경로를 연결합니다.
- `LCircle`: 기상청이 제공한 km 단위 반경을 m 단위로 변환해 표시합니다.
- `selectedStormId`: 선택한 태풍 ID를 저장하고 `computed`로 한 태풍만 필터링합니다.

```js
const visibleTyphoons = computed(() => {
  return selectedStormId.value
    ? typhoons.value.filter(storm => storm.id === selectedStormId.value)
    : typhoons.value
})
```

### 9. SVG를 이용한 24시간 날씨 그래프

파일: `src/components/weather/HourlyWeatherChart.vue`

별도의 차트 라이브러리 없이 SVG 좌표를 계산해 기온 선 그래프와 강수확률 막대를 그립니다.

```js
const x = index => {
  return padding.left
    + index * ((width - padding.left - padding.right) / Math.max(1, props.hourly.length - 1))
}

const y = value => {
  return padding.top
    + (maxTemp.value - value)
    * ((height - padding.top - padding.bottom) / Math.max(1, maxTemp.value - minTemp.value))
}

const linePath = computed(() => {
  return props.hourly
    .map((item, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(item.temp)}`)
    .join(' ')
})
```

외출 상한과 하한도 같은 Y축 계산 함수를 사용해 점선으로 표시합니다. 그래프가 좁아지는 화면에서는 SVG의 최소 너비를 유지하고 컨테이너만 가로 스크롤되도록 처리했습니다.

### 10. 개인 외출 기준을 반영한 쾌적도 점수

파일: `src/utils/outdoorComfort.js`

쾌적도는 개인 외출 기온 기준만 숫자로 바꾼 값이 아니라 기온, 습도, 강수확률, 풍속과 발효 특보를 함께 평가한 종합 점수입니다. 100점에서 각 불편 요소의 감점을 빼고 결과를 0~100 사이로 제한합니다.

```js
export const comfortScore = (weather, alertStore) => {
  const temperature = Number(weather.temp) || 0
  const humidity = Number(weather.humidity) || 0
  const rainChance = Number(weather.rainChance) || 0
  const wind = Number(weather.wind) || 0
  let penalty = 0

  if (temperature >= alertStore.heatThreshold) {
    penalty += 24 + (temperature - alertStore.heatThreshold) * 5
  } else if (temperature <= alertStore.coldThreshold) {
    penalty += 24 + (alertStore.coldThreshold - temperature) * 5
  } else {
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
```

#### 점수 반영 기준

| 조건 | 계산 방식 |
| --- | --- |
| 개인 상한 이상 | 기본 24점 감점 후 초과 1℃당 5점 추가 감점 |
| 개인 하한 이하 | 기본 24점 감점 후 미달 1℃당 5점 추가 감점 |
| 개인 기준 범위 안 | 상·하한의 중간 기온에서 멀어질수록 1℃당 1.2점 감점 |
| 습도 70% 초과 | 초과 1%p당 0.45점 감점 |
| 습도 30% 미만 | 미달 1%p당 0.3점 감점 |
| 강수확률 | 1%p당 0.34점 감점 |
| 풍속 4m/s 초과 | 초과 1m/s당 3.5점 감점 |
| 발효 예·특보 | 1건당 30점 감점 |

점수는 다음 다섯 단계로 변환하여 숫자의 의미를 함께 전달합니다.

```js
export const comfortLabel = score => {
  if (score >= 85) return '매우 쾌적'
  if (score >= 70) return '쾌적'
  if (score >= 50) return '보통'
  if (score >= 30) return '외출 주의'
  return '외출 비추천'
}
```

| 점수 | 상태 |
| ---: | --- |
| 85~100점 | 매우 쾌적 |
| 70~84점 | 쾌적 |
| 50~69점 | 보통 |
| 30~49점 | 외출 주의 |
| 0~29점 | 외출 비추천 |

이 점수는 의학적·공식 기상지수가 아니라 사용자의 약속 장소와 시간을 비교하기 위해 프로젝트 내부에서 정의한 참고 지표입니다.

### 11. 날짜별 약속 장소와 시간 추천

파일: `src/views/CityCompareView.vue`, `src/utils/outdoorComfort.js`

OpenWeather의 전체 예보 시간대에 날짜, 시간, 기온, 습도, 강수확률과 풍속을 저장합니다. 두 도시가 공통으로 제공하는 날짜만 버튼으로 표시하고, 사용자가 선택한 날짜의 시간대만 분석합니다.

```js
const analyzeOutdoor = city => city
  ? analyzeOutdoorSlots(
      city,
      city.forecastSlots.filter(item => item.date === selectedDate.value),
      alertStore,
    )
  : null
```

각 시간대에 같은 쾌적도 계산식을 적용한 뒤 점수가 높은 순서로 정렬합니다.

```js
export const analyzeOutdoorSlots = (city, slots, alertStore) => {
  const evaluated = slots.map(slot => {
    const score = comfortScore({ ...slot, warnings: city.warnings }, alertStore)
    return { ...slot, score, label: comfortLabel(score) }
  })
  const ranked = [...evaluated].sort((a, b) => b.score - a.score)

  return {
    recommendations: ranked.slice(0, 3),
    best: ranked[0] ?? null,
    suitableCount: evaluated.filter(item => item.score >= 70).length,
    score: Math.round(
      ranked.reduce((sum, item) => sum + item.score, 0) / ranked.length,
    ),
  }
}
```

- `recommendations`: 선택 날짜에서 점수가 높은 추천 시간 TOP 3입니다.
- `best`: 결과 요약 문장에 사용할 가장 좋은 시간입니다.
- `suitableCount`: 쾌적도 70점 이상인 시간대의 개수입니다.
- `score`: 선택 날짜에 포함된 모든 시간대 쾌적도의 평균입니다.
- 두 도시의 평균 점수를 비교하여 약속 장소를 추천하고, 최적 시간·기온·강수확률·특보 유무를 문장으로 안내합니다.

WeatherCard는 현재 관측값의 점수를 막대로 표시하고, Leaflet 지도는 툴팁과 팝업에 같은 점수를 표시합니다. 점수 계산을 별도의 Utility로 분리했기 때문에 카드, 지도와 비교 화면이 서로 다른 공식을 사용하는 문제를 방지합니다.

### 12. Vue Router를 이용한 화면 분리

파일: `src/router/index.js`

도시 ID를 URL 파라미터로 전달해 상세 화면과 비교 화면을 직접 열거나 공유할 수 있도록 구성했습니다.

```js
{
  path: '/weather/:cityId',
  name: 'weather-detail',
  component: () => import('../views/WeatherDetailView.vue'),
  props: true,
},
{
  path: '/compare/:firstCityId/:secondCityId',
  name: 'city-compare',
  component: () => import('../views/CityCompareView.vue'),
  props: true,
}
```

View는 동적 `import()`로 지연 로딩합니다. 해당 화면에 접속할 때 필요한 JavaScript만 불러오므로 초기 번들 범위를 줄일 수 있습니다. 정의되지 않은 주소는 catch-all route를 통해 서비스 디자인이 적용된 404 화면으로 이동합니다.

### 13. 반응형 UI와 접근성

- CSS Grid와 미디어 쿼리로 데스크톱, 태블릿과 모바일 레이아웃 제공
- 17개 지역 버튼은 마지막 지역이 혼자 고립되지 않도록 화면별로 6열, 5열, 3열, 1열 적용
- 지역 카드는 클릭뿐 아니라 키보드 Enter 입력으로 상세 화면 이동
- 아이콘만 있는 즐겨찾기 버튼에 동적 `aria-label` 제공
- 지도 팝업, SVG 그래프와 특보 영역에 의미를 설명하는 접근성 속성 적용
- `prefers-reduced-motion` 환경에서는 404 레이더 애니메이션 정지

## Vercel 배포

로컬 개발에서는 `vite.config.js`의 미들웨어가 외부 날씨 API를 프록시합니다. 프로덕션 Vercel 배포에서는 해당 개발 미들웨어가 실행되지 않으므로 `api/proxy.js`의 Vercel Function이 같은 역할을 담당합니다.

```text
브라우저 /api/proxy 요청
→ Vercel Function 실행
→ process.env에서 API 인증키 확인
→ OpenWeather 또는 기상청 요청
→ 브라우저에 응답 반환
```

Vercel 프로젝트의 `Settings → Environment Variables`에 다음 환경변수를 등록해야 합니다.

```env
OPENWEATHER_API_KEY=OpenWeather_API_키
KMA_API_KEY=기상청_API허브_인증키
```

- Production 배포에는 두 변수를 Production 환경에 등록합니다.
- Preview 배포에서도 확인하려면 Preview 환경에도 등록합니다.
- 환경변수를 추가하거나 수정한 뒤에는 기존 배포가 아니라 새로 재배포해야 합니다.
- 변수 이름은 대소문자를 포함해 코드와 정확히 같아야 합니다.
- `VITE_` 접두사를 붙이면 클라이언트 번들에 노출될 수 있으므로 비밀키에는 사용하지 않습니다.

`vercel.json`은 Vue Router의 상세·비교 URL을 새로고침해도 `index.html`을 제공하도록 SPA fallback을 설정합니다. `/api/proxy`는 `api/proxy.js` Vercel Function으로 처리됩니다.

배포 후 다음 주소로 함수 연결 상태를 확인할 수 있습니다.

```text
https://배포주소.vercel.app/api/proxy?route=weather&lat=37.5665&lon=126.978
```

정상이라면 서울 날씨 JSON이 반환됩니다. 오류가 반환되면 Vercel의 Functions 로그에서 환경변수 누락, 외부 API 인증 오류 또는 기상청 API 승인 상태를 확인합니다.
