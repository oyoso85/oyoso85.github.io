## 1. TTS 개선

- [x] 1.1 app.js speakQuestion에 rate=0.8 설정 추가
- [x] 1.2 은/는 조사 구별 로직이 정상 동작하는지 확인 (이미 구현됨, 스펙만 추가)

## 2. BGM 음량 조정

- [x] 2.1 sound.js BGM 멜로디 volume을 0.06에서 0.02로 변경
- [x] 2.2 sound.js BGM 베이스 volume을 0.08에서 0.03으로 변경

## 3. 진행률 상단 고정

- [x] 3.1 css/style.css quiz-header를 position: fixed, top: 16px, left: 16px으로 변경
- [x] 3.2 quiz-header에 z-index, 배경색 등 고정 시 필요한 스타일 추가
- [x] 3.3 퀴즈 화면 본문에 상단 여백 추가하여 고정 헤더와 겹침 방지
