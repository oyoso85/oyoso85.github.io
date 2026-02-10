## ADDED Requirements

### Requirement: 8비트 사운드 효과
시스템은 Web Audio API를 사용하여 다음 상황에서 8비트풍 효과음을 재생해야 한다(SHALL).

#### Scenario: 버튼 클릭 효과음
- **WHEN** 사용자가 연산 선택, 난이도 선택, 홈으로 버튼을 클릭할 때
- **THEN** 짧은 클릭 효과음이 재생된다

#### Scenario: 정답 효과음
- **WHEN** 사용자가 답을 입력하고 다음 버튼을 누를 때 정답인 경우
- **THEN** 정답 효과음이 재생된다

#### Scenario: 오답 효과음
- **WHEN** 사용자가 답을 입력하고 다음 버튼을 누를 때 오답인 경우
- **THEN** 오답 효과음이 재생된다

#### Scenario: 퀴즈 완료 팡파레
- **WHEN** 20문제를 모두 풀고 채점이 완료될 때
- **THEN** 완료 팡파레 효과음이 재생된다

### Requirement: 배경 음악 (BGM)
시스템은 퀴즈 진행 중 8비트풍 배경 음악을 재생해야 한다(SHALL).

#### Scenario: 퀴즈 시작 시 BGM 재생
- **WHEN** 퀴즈 세션이 시작될 때
- **THEN** 배경 음악이 자동으로 재생된다

#### Scenario: 퀴즈 종료 시 BGM 중지
- **WHEN** 퀴즈가 완료되거나 사용자가 홈으로 돌아갈 때
- **THEN** 배경 음악이 중지된다

### Requirement: 음소거 토글
시스템은 모든 사운드를 음소거/해제할 수 있는 버튼을 제공해야 한다(SHALL). 음소거 버튼은 모든 화면에서 접근 가능해야 한다(SHALL).

#### Scenario: 음소거 활성화
- **WHEN** 사용자가 음소거 버튼을 클릭할 때 (소리 켜진 상태)
- **THEN** 모든 효과음과 BGM이 음소거되고 버튼 아이콘이 🔇로 변경된다

#### Scenario: 음소거 해제
- **WHEN** 사용자가 음소거 버튼을 클릭할 때 (음소거 상태)
- **THEN** 사운드가 다시 활성화되고 버튼 아이콘이 🔊로 변경된다

### Requirement: AudioContext 자동 활성화
시스템은 사용자의 첫 번째 클릭 시 AudioContext를 자동으로 활성화해야 한다(SHALL). 브라우저의 자동재생 정책을 준수해야 한다(MUST).

#### Scenario: 첫 클릭 시 AudioContext 활성화
- **WHEN** 사용자가 페이지에서 처음으로 클릭할 때
- **THEN** AudioContext가 resume되어 이후 사운드 재생이 가능해진다
