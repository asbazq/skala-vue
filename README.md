# SKALA Vue 날씨 과제

## 과제 1: WeatherMockup 카드 호버링

파일: `src/components/exercise/WeatherMockup.vue`

마우스를 올린 날씨 카드를 강조하는 기능입니다.
호버 효과를 사용하면 사용자가 현재 보고 있는 카드를 쉽게 구분하고, 선택 대상을 명확하게 확인할 수 있습니다. 또한 학습한 `v-bind`와 `mouseenter`, `mouseleave` 이벤트를 활용하기에 적합하다고 생각하여 이 기능을 선택했습니다.

![WeatherMockup 카드 호버링](<스크린샷 2026-08-11 오후 4.19.01.png>)

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

![WeatherComposition 즐겨찾기](<스크린샷 2026-08-11 오후 5.43.47.png>)

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
