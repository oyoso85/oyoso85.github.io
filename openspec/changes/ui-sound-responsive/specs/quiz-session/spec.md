## MODIFIED Requirements

### Requirement: 문제 표시
시스템은 한 화면에 하나의 문제만 표시해야 한다(SHALL). 문제는 "A ○ B = ?" 형태로 표시하고, 사용자가 답을 입력할 수 있는 입력 필드를 제공해야 한다(SHALL). 숫자와 연산 기호는 다른 색상으로 구분하여 표시해야 한다(SHALL).

#### Scenario: 문제 화면 구성
- **WHEN** 퀴즈 화면에 진입할 때
- **THEN** 첫 번째 문제가 "A ○ B = ?" 형태로 표시되고 답 입력 필드가 활성화된다

#### Scenario: 숫자와 연산 기호 색상 구분
- **WHEN** 문제가 표시될 때
- **THEN** 숫자는 어두운 색(#2d3436), 연산 기호(+, −, ×, ÷, =, ?)는 하늘색(#5BC5F2)으로 표시된다

## ADDED Requirements

### Requirement: Enter 키 지원
시스템은 답 입력 후 Enter 키를 누르면 다음 문제로 이동해야 한다(SHALL).

#### Scenario: Enter 키로 다음 문제 이동
- **WHEN** 사용자가 답 입력 필드에서 Enter 키를 누를 때
- **THEN** 다음 버튼을 클릭한 것과 동일하게 동작한다

### Requirement: 퀴즈 중 홈 이동
시스템은 퀴즈 진행 중 홈으로 바로 이동할 수 있는 버튼을 제공해야 한다(SHALL).

#### Scenario: 퀴즈 화면에서 홈으로 이동
- **WHEN** 사용자가 퀴즈 화면에서 홈으로 버튼을 클릭할 때
- **THEN** BGM이 중지되고 홈 화면으로 이동한다
