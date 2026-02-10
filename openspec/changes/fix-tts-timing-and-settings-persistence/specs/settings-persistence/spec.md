# settings-persistence

## Purpose
사용자의 사운드 설정(음소거/해제 상태)을 브라우저 localStorage에 저장하고 복원하여, 페이지 새로고침 후에도 설정이 유지되도록 한다.

## Requirements

### Requirement: 사운드 설정 저장
시스템은 사용자가 음소거/해제를 토글할 때마다 해당 설정을 localStorage에 저장해야 한다(SHALL). 저장 키는 `soundEnabled`를 사용해야 한다(SHALL).

#### Scenario: 음소거 활성화 시 저장
- **WHEN** 사용자가 음소거 버튼을 클릭하여 소리를 끌 때
- **THEN** localStorage에 `soundEnabled: false`가 저장된다

#### Scenario: 음소거 해제 시 저장
- **WHEN** 사용자가 음소거 버튼을 클릭하여 소리를 켤 때
- **THEN** localStorage에 `soundEnabled: true`가 저장된다

### Requirement: 설정 복원
시스템은 앱 초기화 시 localStorage에서 사운드 설정을 읽어 복원해야 한다(SHALL). localStorage에 설정이 없으면 기본값으로 소리 켜짐 상태를 사용해야 한다(SHALL).

#### Scenario: 이전 설정이 있는 경우 복원
- **WHEN** 페이지가 로드될 때 localStorage에 `soundEnabled` 값이 존재할 때
- **THEN** 해당 값을 읽어 사운드 on/off 상태를 복원한다

#### Scenario: 최초 방문 시 기본값 사용
- **WHEN** 페이지가 로드될 때 localStorage에 `soundEnabled` 값이 없을 때
- **THEN** 소리 켜짐 상태(true)를 기본값으로 사용한다

### Requirement: localStorage 실패 처리
시스템은 localStorage 접근이 실패하는 경우에도 메모리 상태로 정상 동작해야 한다(SHALL). localStorage 읽기/쓰기 오류 시 콘솔 경고를 출력하고 계속 진행해야 한다(SHALL).

#### Scenario: localStorage 쓰기 실패
- **WHEN** 사용자가 설정을 변경했으나 localStorage 저장에 실패할 때
- **THEN** 콘솔에 경고를 출력하고 메모리 상태는 정상적으로 업데이트된다

#### Scenario: localStorage 읽기 실패
- **WHEN** 페이지 로드 시 localStorage 읽기에 실패할 때
- **THEN** 콘솔에 경고를 출력하고 기본값(true)으로 설정된다
