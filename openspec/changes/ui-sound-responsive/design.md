## Context

Number Block은 아동용 사칙연산 학습 웹앱이다. 현재 핵심 퀴즈 기능(문제 생성, 풀이, 채점, 이력)은 완성되었으나, 사운드/폰트/반응형/풀이 목록 등 UX 개선이 필요하다. 순수 HTML/CSS/JS로 구현되어 있으며 빌드 도구 없이 동작한다.

## Goals / Non-Goals

**Goals:**
- Web Audio API로 8비트 사운드 효과와 BGM을 구현하여 아이들의 몰입감 향상
- 음소거 토글로 소리 제어 가능
- 둥글둥글한 폰트(Jua)로 아동 친화적 UI 제공
- 태블릿/모바일에서 깨지지 않는 반응형 레이아웃
- 모바일 가상 키보드가 문제를 가리지 않도록 자동 스크롤
- 결과 화면에서 전체 풀이를 한눈에 확인

**Non-Goals:**
- 오디오 파일 로딩 (모든 사운드는 Web Audio API로 프로그래밍 생성)
- PWA 오프라인 지원
- 사운드 설정 영구 저장 (새로고침 시 초기화)

## Decisions

### 1. 사운드 구현 방식: Web Audio API (OscillatorNode)
- **선택**: 외부 오디오 파일 없이 Web Audio API로 8비트풍 사운드 합성
- **대안**: MP3/WAV 파일 → 로딩 시간, 파일 관리 부담
- **이유**: 파일 의존성 없이 경량 구현, 8비트 느낌에 적합, 브라우저 호환성 우수

### 2. 폰트: Google Fonts 'Jua'
- **선택**: Google Fonts CDN에서 Jua 폰트 로드
- **대안**: Noto Sans KR(너무 딱딱), 직접 호스팅(관리 부담)
- **이유**: 둥글둥글한 형태로 아동 친화적, CDN으로 빠른 로딩, 한글 지원

### 3. 반응형 브레이크포인트
- **태블릿**: 768px — 문제 폰트 9rem → 7rem
- **모바일**: 500px — 문제 폰트 5rem, 버튼/입력 축소, 풀이 그리드 1열

### 4. 풀이 목록 레이아웃
- **선택**: CSS Grid 2열 (모바일 1열)로 한 화면에 20문제 표시
- **대안**: 스크롤 리스트 → 전체를 한눈에 볼 수 없음
- **이유**: 스크롤 없이 결과를 즉시 파악 가능

## Risks / Trade-offs

- [Web Audio API 첫 클릭 필요] → 첫 번째 사용자 클릭에서 AudioContext unlock 처리
- [Google Fonts CDN 의존] → fallback 폰트 체인 설정 ('Jua', 'Segoe UI', 'Malgun Gothic', sans-serif)
- [가상 키보드 감지 어려움] → input focus 시 scrollIntoView로 문제 영역 보장
