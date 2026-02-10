## ADDED Requirements

### Requirement: 문제 TTS 읽기
시스템은 문제가 표시될 때 Web Speech API를 사용하여 문제를 한국어로 읽어주어야 한다(SHALL). 연산 기호는 한국어로 변환하여 읽어야 한다(SHALL).

#### Scenario: 문제 자동 읽기
- **WHEN** 새로운 문제가 화면에 표시될 때
- **THEN** "A [연산자 한국어] B 은?" 형식으로 TTS가 재생된다 (예: "3 더하기 5 은?")

#### Scenario: 연산자 한국어 변환
- **WHEN** TTS가 문제를 읽을 때
- **THEN** +는 "더하기", −는 "빼기", ×는 "곱하기", ÷는 "나누기"로 읽는다

#### Scenario: 음소거 시 TTS 비활성화
- **WHEN** 음소거 상태에서 문제가 표시될 때
- **THEN** TTS가 재생되지 않는다

#### Scenario: Web Speech API 미지원 시
- **WHEN** 브라우저가 Web Speech API를 지원하지 않을 때
- **THEN** TTS 없이 정상적으로 문제가 표시된다 (오류 발생 없음)
