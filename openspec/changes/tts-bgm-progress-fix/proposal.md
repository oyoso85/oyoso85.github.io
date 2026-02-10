## Why

TTS로 문제를 읽어줄 때 은/는 조사가 구별되지 않고, 읽기 속도가 빨라 아동이 이해하기 어렵다. BGM과 TTS 음량이 동일하여 문제 읽기가 잘 들리지 않는다. 또한 진행률 표시(1/20)가 퀴즈 본문 영역에 있어 스크롤 시 가려질 수 있다.

## What Changes

- TTS 읽기 속도를 느리게 조정 (SpeechSynthesisUtterance.rate 설정)
- 숫자 끝 받침에 따라 '은?'/'는?' 조사 자동 구별 (이미 구현됨, 스펙 반영)
- BGM 음량을 현재 대비 낮춰 TTS가 명확하게 들리도록 변경
- 진행률 표시(quiz-header)를 화면 상단에 고정(fixed) 배치

## Capabilities

### New Capabilities

(없음)

### Modified Capabilities

- `sound-system`: BGM 음량을 낮추어 TTS와의 음량 균형 조정
- `quiz-session`: TTS 읽기 속도 조절, 은/는 조사 구별 스펙 반영, 진행률 표시 상단 고정

## Impact

- `js/app.js`: speakQuestion 함수 rate 속성 추가
- `js/sound.js`: BGM 멜로디/베이스 음량(volume) 값 하향 조정
- `css/style.css`: quiz-header를 position: fixed로 변경하고 상단 고정 스타일 적용
