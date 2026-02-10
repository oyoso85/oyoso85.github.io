## Why

아동용 수학 게임의 몰입감과 사용성을 높이기 위해 8비트 사운드 효과/BGM, 둥글둥글한 아동 친화 폰트, 반응형 레이아웃, 결과 풀이 목록 기능을 추가한다. 모바일 기기에서 가상 키보드가 문제 영역을 가리는 UX 문제도 해결한다.

## What Changes

- Web Audio API 기반 8비트 사운드 시스템 추가 (버튼 클릭, 정답/오답 효과음, 퀴즈 BGM, 완료 팡파레)
- 음소거 토글 버튼 추가
- Google Fonts 'Jua' 폰트 적용 (둥글둥글한 한글 폰트)
- 숫자와 연산 기호 색상 구분 (숫자: 다크, 연산자: 하늘색)
- 태블릿(768px)/모바일(500px) 반응형 브레이크포인트 추가
- 모바일 가상 키보드 표시 시 문제 영역 자동 스크롤
- 결과 화면에 전체 20문제 풀이 목록 표시 (문제, 정답, 사용자 답, 정오답 구분)
- 퀴즈 화면에서 홈으로 바로 이동하는 버튼 추가
- Enter 키로 다음 문제 이동 지원

## Capabilities

### New Capabilities
- `sound-system`: 8비트 사운드 효과와 BGM, 음소거 기능
- `responsive-layout`: 태블릿/모바일 반응형 레이아웃, 가상 키보드 대응

### Modified Capabilities
- `quiz-session`: 숫자/연산자 색상 구분 표시, Enter 키 지원, 퀴즈 중 홈 버튼 추가
- `scoring`: 결과 화면에 전체 풀이 목록(문제/정답/사용자답) 표시

## Impact

- **새 파일**: js/sound.js (사운드 모듈)
- **수정 파일**: index.html (폰트, 음소거 버튼, 홈 버튼), css/style.css (폰트, 반응형, 색상), js/app.js (사운드 연동, 색상 구분, Enter 키, 풀이 목록)
- **외부 의존성**: Google Fonts (Jua), Web Audio API (브라우저 내장)
