## Why

아동이 문제를 읽지 못하거나 익숙하지 않은 경우를 대비하여 TTS(Text-to-Speech)로 문제를 읽어주는 기능이 필요하다. 또한 퀴즈 진행률 표시 위치가 가운데에 있어 문제와 혼동될 수 있으므로 왼쪽 상단으로 이동한다. 배포 시 브라우저 캐시로 인해 변경 사항이 반영되지 않는 문제도 해결한다.

## What Changes

- 문제 표시 시 Web Speech API(SpeechSynthesis)를 사용하여 "1 더하기 1 은?" 형식으로 문제를 읽어주는 TTS 기능 추가
- 음소거 상태에서는 TTS도 비활성화
- 퀴즈 진행률("N / 20") 표시를 가운데 정렬에서 왼쪽 상단 정렬로 변경
- index.html의 JS/CSS 참조에 버전 쿼리스트링(?v=timestamp) 추가로 브라우저 캐시 문제 해결

## Capabilities

### New Capabilities
- `tts-reader`: 문제 TTS 읽기 기능 (Web Speech API 기반)

### Modified Capabilities
- `quiz-session`: 진행률 표시 위치를 왼쪽 상단으로 변경
- `responsive-layout`: 캐시 버스팅을 위한 리소스 버전 관리

## Impact

- **수정 파일**: index.html (스크립트/CSS 버전 쿼리스트링), css/style.css (진행률 위치), js/app.js (TTS 호출, 진행률 레이아웃)
- **외부 의존성**: Web Speech API (브라우저 내장, 별도 설치 불필요)
