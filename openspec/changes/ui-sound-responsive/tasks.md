## 1. 사운드 시스템

- [x] 1.1 js/sound.js 생성: Web Audio API 기반 Sound 모듈 (AudioContext, gain 노드)
- [x] 1.2 클릭 효과음 구현 (짧은 8비트 톤)
- [x] 1.3 정답/오답 효과음 구현 (상승/하강 톤)
- [x] 1.4 퀴즈 완료 팡파레 구현 (멜로디 시퀀스)
- [x] 1.5 BGM 구현 (루프 멜로디 + 베이스 라인)
- [x] 1.6 음소거 토글 기능 구현 (toggleMute, gain 제어)
- [x] 1.7 AudioContext 첫 클릭 시 unlock 처리

## 2. 음소거 UI

- [x] 2.1 index.html에 음소거 버튼 추가 (fixed, 우상단)
- [x] 2.2 css/style.css에 .btn-mute 스타일 추가
- [x] 2.3 app.js에 음소거 버튼 이벤트 연결 (🔊/🔇 토글)

## 3. 사운드 연동

- [x] 3.1 연산/난이도 선택 시 클릭 효과음 연결
- [x] 3.2 다음 버튼 클릭 시 정답/오답 효과음 연결
- [x] 3.3 퀴즈 시작 시 BGM 시작, 종료/홈 이동 시 BGM 중지
- [x] 3.4 채점 완료 시 팡파레 연결

## 4. 폰트 변경

- [x] 4.1 index.html에 Google Fonts 'Jua' preconnect 및 stylesheet 추가
- [x] 4.2 css/style.css body font-family를 'Jua' 우선으로 변경

## 5. 숫자/연산자 색상 구분

- [x] 5.1 app.js showQuizQuestion에서 innerHTML로 span 분리 (q-num, q-op)
- [x] 5.2 css/style.css에 .q-num, .q-op 색상 스타일 추가

## 6. 반응형 레이아웃

- [x] 6.1 css/style.css에 태블릿 미디어 쿼리 추가 (max-width: 768px)
- [x] 6.2 css/style.css에 모바일 미디어 쿼리 추가 (max-width: 500px)
- [x] 6.3 모바일 가상 키보드 대응: input focus 시 scrollIntoView 처리

## 7. 결과 풀이 목록

- [x] 7.1 app.js finishQuiz에서 20문제 풀이 목록 DOM 생성
- [x] 7.2 css/style.css에 .result-review 2열 그리드 스타일 추가
- [x] 7.3 정답/오답 시각 구분 스타일 (.review-item, .wrong, .correct, .incorrect)

## 8. 퀴즈 UX 개선

- [x] 8.1 index.html 퀴즈 화면에 홈으로 버튼 추가
- [x] 8.2 app.js에 Enter 키 이벤트 핸들러 추가
- [x] 8.3 app.js에 퀴즈 홈 버튼 이벤트 연결 (BGM 중지 포함)
