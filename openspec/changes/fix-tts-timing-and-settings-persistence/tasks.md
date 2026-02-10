## 1. Settings Persistence (localStorage)

- [x] 1.1 localStorage에 `soundEnabled` 키로 사운드 설정을 저장하는 함수 작성
- [x] 1.2 앱 초기화 시 localStorage에서 사운드 설정을 읽어오는 함수 작성 (없으면 true 기본값)
- [x] 1.3 localStorage 접근 실패 시 try-catch로 처리하고 콘솔 경고 출력
- [x] 1.4 음소거 토글 버튼 클릭 시 localStorage 저장 로직 통합

## 2. Sound System - Effect Completion Notification

- [x] 2.1 정답 효과음 재생 함수가 Promise를 반환하도록 수정
- [x] 2.2 오답 효과음 재생 함수가 Promise를 반환하도록 수정
- [x] 2.3 효과음 재생 완료 시점에 Promise를 resolve하도록 구현
- [x] 2.4 효과음 재생 실패 또는 timeout(3초) 시에도 resolve하여 무한 대기 방지

## 3. Quiz Session - TTS and Sequential Audio

- [x] 3.1 TTS 문제 읽기 함수 작성 (speechSynthesis 사용, rate=0.9)
- [x] 3.2 문제 텍스트를 TTS 음성으로 변환하는 포맷 로직 작성 (예: "3 + 5 = ?" → "3 더하기 5는?")
- [x] 3.3 음소거 상태에서는 TTS를 재생하지 않도록 조건 추가
- [x] 3.4 "다음" 버튼 클릭 핸들러에서 효과음 재생 완료를 await으로 대기
- [x] 3.5 효과음 완료 후 문제 전환 로직 실행
- [x] 3.6 문제 전환 후 TTS로 새 문제 읽기 실행
- [x] 3.7 "이전" 버튼 클릭 시에도 문제 전환 후 TTS 읽기 실행

## 4. Testing and Validation

- [ ] 4.1 효과음과 TTS가 순차적으로 재생되는지 수동 테스트 (답 입력 후 다음 버튼 클릭)
- [ ] 4.2 TTS 속도가 10% 느려졌는지 확인 (기존 대비 비교)
- [ ] 4.3 음소거 토글 후 localStorage에 저장되는지 개발자 도구로 확인
- [ ] 4.4 페이지 새로고침 후 음소거 설정이 복원되는지 확인
- [ ] 4.5 localStorage 실패 상황(시크릿 모드 등)에서도 메모리 상태로 정상 동작하는지 확인
