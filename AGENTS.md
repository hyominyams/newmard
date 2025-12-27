# AGENTS.md (Repo-wide)

이 문서는 Newmard 레포에서 작업하는 에이전트/개발자를 위한 작업 가이드입니다. 하위 디렉터리에 더 구체적인 `AGENTS.md`가 있으면 그 지침이 우선합니다.

## 1) 프로젝트 개요
- 제품: **Newmard** — 디지털 노마드를 위한 도시 탐색(대륙 필터) 랜딩/탐색 페이지
- 현재 형태: **단일 페이지**(Hero → 필터/그리드 → Footer)
- 구현된 주요 UX
  - Hero(풀스크린) + 월드맵 스타일 SVG 배경 + CTA 스크롤
  - 대륙 필터 버튼(모바일 가로 스크롤, 데스크톱 중앙 정렬)
  - 도시 카드 그리드(반응형) + 스켈레톤 로딩 + 호버 확대
  - 카드 클릭 시 상세 Dialog(모달)
  - Footer(크레딧/링크 placeholder)

## 2) 기술 스택
- React 18 + Next.js + TailwindCSS
- ESM 프로젝트 (`package.json`의 `"type": "module"`)

## 3) 로컬 실행/빌드
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`

## 4) 폴더/파일 구조 (핵심)
- 앱 엔트리: `src/app/layout.tsx`, `src/app/page.jsx`
- 페이지 루트(상태/조합): `src/App.jsx`
- 컴포넌트:
  - `src/components/Hero.jsx`, `src/components/WorldMap.jsx`
  - `src/components/ContinentFilters.jsx`
  - `src/components/CityGrid.jsx`, `src/components/CityCard.jsx`
  - `src/components/CityDialog.jsx`
  - `src/components/Footer.jsx`
- 데이터(도시 20개): `src/data/cities.js`
- 포맷/플레이스홀더 이미지 로직: `src/lib/cityFormat.js`
- (레거시) 정적 프로토타입: `static/` (참고용)

## 5) 도시 데이터 & 이미지
### 도시 데이터
- 소스 오브 트루스: `src/data/cities.js`
- 각 도시 객체의 `image` 필드가 카드에 표시되는 이미지의 1차 소스입니다.

### 로컬 이미지 사용 규칙 (Next.js)
- 정적 파일은 `public/` 아래에 두고 **절대경로**로 참조합니다.
  - 예) 파일: `public/images/city/bangkok.jpg`
  - 예) 코드: `image: "/images/city/bangkok.jpg"` (⚠ `./public/...` 금지)
- 도시 이미지/출처 메타:
  - 이미지 폴더: `public/images/city/`
  - 출처 기록: `public/images/city/unsplash-attribution.json`

### 이미지 자동 다운로드 스크립트(옵션)
- 명령: `npm run download:city-images -- --write-cities-data`
- 스크립트: `scripts/download-city-images.mjs`
- 소스 매핑: `scripts/city-image-sources.json`
- 환경변수(선택): `.env`에 `UNSPLASH_ACCESS_KEY` (Secret Key는 커밋 금지)

## 6) 작업 원칙 (코드 스타일/품질)
- 작은 단위의 변경을 선호하고, 요청 없이 불필요한 리네임/대규모 리팩토링은 피합니다.
- Tailwind 유틸리티 클래스로 스타일링(새 CSS 파일 추가는 최소화).
- 접근성 유지:
  - 버튼/다이얼로그/툴바 등 ARIA와 키보드 동작 유지
  - `prefers-reduced-motion` 사용자를 고려(과한 애니메이션 금지)
- 데이터/자산 경로가 Next.js 규칙(`public/` → `/...`)을 따르는지 항상 확인합니다.

## 7) 검증(최소)
- 변경 후 최소 `npm run build`로 컴파일/번들 에러 확인
- 이미지 변경 시 실제 경로(`/images/...`) 로드 확인
