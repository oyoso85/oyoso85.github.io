# responsive-layout

## Purpose
아동 친화 폰트, 태블릿/모바일 반응형 레이아웃, 가상 키보드 대응을 정의한다.

## Requirements

### Requirement: 아동 친화 폰트
시스템은 둥글둥글한 형태의 한글 폰트(Google Fonts 'Jua')를 사용해야 한다(SHALL). 폰트 로딩 실패 시 fallback 폰트로 표시해야 한다(SHALL).

#### Scenario: Jua 폰트 적용
- **WHEN** 앱이 로드될 때
- **THEN** 모든 텍스트가 Jua 폰트로 표시된다

#### Scenario: 폰트 로딩 실패
- **WHEN** Google Fonts CDN에 접근할 수 없을 때
- **THEN** fallback 폰트(Segoe UI, Malgun Gothic, sans-serif)로 표시된다

### Requirement: 태블릿 반응형 (768px 이하)
시스템은 태블릿 크기 화면에서 레이아웃을 조정해야 한다(SHALL).

#### Scenario: 태블릿 화면 문제 표시
- **WHEN** 화면 너비가 768px 이하일 때
- **THEN** 문제 텍스트가 7rem으로 축소되고, 입력 필드가 180px로 조정된다

### Requirement: 모바일 반응형 (500px 이하)
시스템은 모바일 크기 화면에서 레이아웃을 조정해야 한다(SHALL).

#### Scenario: 모바일 화면 전체 레이아웃 조정
- **WHEN** 화면 너비가 500px 이하일 때
- **THEN** 문제 텍스트 5rem, 타이틀 1.8rem, 버튼 축소, 풀이 목록 1열 그리드로 표시된다

### Requirement: 가상 키보드 대응
시스템은 모바일에서 가상 키보드가 나타날 때 문제 영역이 가려지지 않도록 해야 한다(SHALL).

#### Scenario: 입력 필드 포커스 시 자동 스크롤
- **WHEN** 모바일에서 답 입력 필드에 포커스가 갈 때
- **THEN** 문제 영역이 화면에 보이도록 자동 스크롤된다
