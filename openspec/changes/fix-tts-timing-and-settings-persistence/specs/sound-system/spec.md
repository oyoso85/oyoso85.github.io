## ADDED Requirements

### Requirement: 효과음 재생 완료 알림
시스템은 효과음 재생이 완료되었음을 호출자에게 알릴 수 있는 메커니즘을 제공해야 한다(SHALL). 이를 통해 효과음 재생 후 순차적으로 다른 오디오(TTS 등)를 재생할 수 있어야 한다(SHALL).

#### Scenario: 정답 효과음 완료 후 콜백
- **WHEN** 정답 효과음 재생이 시작될 때
- **THEN** 효과음이 완료되면 호출자가 감지할 수 있는 방법(Promise resolve, callback 등)을 제공한다

#### Scenario: 오답 효과음 완료 후 콜백
- **WHEN** 오답 효과음 재생이 시작될 때
- **THEN** 효과음이 완료되면 호출자가 감지할 수 있는 방법을 제공한다
