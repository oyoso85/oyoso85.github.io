## Why

정답/오답 효과음과 TTS 문제 읽기가 동시에 재생되어 사용자가 문제를 제대로 듣지 못하는 문제가 발생한다. 또한 TTS 속도가 너무 빨라서 이해하기 어렵고, 페이지를 새로고침하면 사운드 설정이 초기화되어 사용자 경험이 일관되지 않다.

## What Changes

- 효과음 재생이 완료된 후 다음 문제로 넘어가며, 이동 후 TTS가 문제를 읽도록 타이밍 조정
- TTS 읽기 속도를 기존 대비 10% 감소(더 느리게)하여 이해도 향상
- 사운드 on/off 설정을 localStorage에 저장하여 페이지 새로고침 후에도 설정 유지

## Capabilities

### New Capabilities
- `settings-persistence`: 사용자의 사운드 설정(음소거/해제 상태)을 브라우저 localStorage에 저장하고 복원하는 기능

### Modified Capabilities
- `sound-system`: TTS 문제 읽기가 효과음 재생 완료 후 실행되도록 오디오 재생 순서 제어 요구사항 추가
- `quiz-session`: TTS 문제 읽기 속도 조정 및 효과음 완료 대기 후 문제 전환 요구사항 추가

## Impact

- **Affected Code**:
  - 퀴즈 화면 컴포넌트의 "다음" 버튼 클릭 핸들러
  - 사운드 시스템의 효과음 재생 및 TTS 재생 로직
  - 음소거 버튼 토글 로직
- **User Experience**: 효과음과 TTS가 겹치지 않아 문제를 명확하게 들을 수 있으며, 더 느린 속도로 이해도가 향상됨
- **Data Persistence**: localStorage 사용으로 브라우저별 설정 저장 (약 5-10바이트)
