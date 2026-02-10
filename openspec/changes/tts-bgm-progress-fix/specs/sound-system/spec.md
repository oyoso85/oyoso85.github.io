## MODIFIED Requirements

### Requirement: 배경 음악 (BGM)
시스템은 퀴즈 진행 중 8비트풍 배경 음악을 재생해야 한다(SHALL). BGM 음량은 TTS 문제 읽기보다 낮게 설정하여 TTS가 명확하게 들리도록 해야 한다(SHALL).

#### Scenario: 퀴즈 시작 시 BGM 재생
- **WHEN** 퀴즈 세션이 시작될 때
- **THEN** 배경 음악이 자동으로 재생된다

#### Scenario: 퀴즈 종료 시 BGM 중지
- **WHEN** 퀴즈가 완료되거나 사용자가 홈으로 돌아갈 때
- **THEN** 배경 음악이 중지된다

#### Scenario: BGM 음량이 TTS보다 낮음
- **WHEN** BGM과 TTS가 동시에 재생될 때
- **THEN** BGM 음량이 충분히 낮아 TTS 문제 읽기가 명확하게 들린다
