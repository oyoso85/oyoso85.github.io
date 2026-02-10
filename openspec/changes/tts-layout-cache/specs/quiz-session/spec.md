## MODIFIED Requirements

### Requirement: 진행 상황 표시
시스템은 현재 몇 번째 문제를 풀고 있는지 표시해야 한다(SHALL). 형식: "N / 20". 진행률은 화면 왼쪽 상단에 표시해야 한다(SHALL).

#### Scenario: 진행률 표시
- **WHEN** 사용자가 K번째 문제를 보고 있을 때
- **THEN** 화면 왼쪽 상단에 "K / 20" 형태로 진행 상황이 표시된다
