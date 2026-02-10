## Context

현재 시스템은 사용자가 정답/오답을 입력하고 "다음" 버튼을 누를 때 효과음과 TTS 문제 읽기가 동시에 실행되어 겹친다. 또한 TTS 속도가 너무 빨라서 사용자가 문제를 이해하기 어렵고, 페이지를 새로고침하면 사운드 on/off 설정이 초기화된다.

Web Audio API로 효과음을 재생하고, Web Speech API (speechSynthesis)로 TTS를 구현하며, 음소거 상태는 메모리에만 존재한다.

## Goals / Non-Goals

**Goals:**
- 효과음 재생 완료 후 다음 문제로 전환하고, 전환 후 TTS로 문제를 읽도록 순서 제어
- TTS 읽기 속도를 10% 감소시켜 이해도 향상
- 사운드 on/off 설정을 localStorage에 저장하여 새로고침 후에도 유지

**Non-Goals:**
- TTS 음성 종류 변경 (브라우저 기본 음성 사용)
- 효과음 볼륨 조절 기능 (기존 볼륨 유지)
- 다른 설정(난이도, 연산 등)의 영속성 (사운드 설정만)

## Decisions

### 1. 효과음 완료 대기 방식
**Decision**: 효과음 재생 함수가 Promise를 반환하도록 수정하고, await으로 완료 대기 후 다음 문제 전환

**Alternatives**:
- setTimeout으로 고정 시간 대기 → 효과음 길이가 변경되면 타이밍이 맞지 않음
- 효과음 재생 없이 바로 전환 → 사용자 피드백 부족

**Rationale**: Promise 기반 패턴은 정확한 완료 시점을 보장하며, async/await로 가독성 높은 순차 로직 작성 가능

### 2. TTS 속도 조정
**Decision**: speechSynthesis utterance의 `rate` 속성을 기본값 1.0에서 0.9로 설정 (10% 감소)

**Alternatives**:
- pitch나 volume 조정 → 속도 문제 해결 안 됨
- 외부 TTS API 사용 → 네트워크 의존성 증가, 비용 발생

**Rationale**: Web Speech API의 rate 속성은 표준이며, 클라이언트 사이드에서 즉시 적용 가능

### 3. 설정 영속성 저장소
**Decision**: localStorage를 사용하여 `soundEnabled` 키에 boolean 값 저장

**Alternatives**:
- sessionStorage → 탭 닫으면 사라짐
- IndexedDB → 단순 boolean 저장에 과도한 복잡도
- 쿠키 → 서버 전송 불필요, 용량 제한 엄격

**Rationale**: localStorage는 간단한 key-value 저장에 최적이며, 브라우저 표준으로 호환성 우수

### 4. 설정 복원 시점
**Decision**: 앱 초기화 시 localStorage에서 읽어 전역 상태(또는 컴포넌트 상태)에 설정

**Rationale**: 초기화 시점에 복원하면 이후 모든 컴포넌트에서 일관된 설정 사용 가능

## Risks / Trade-offs

**[Risk]** 브라우저가 localStorage를 지원하지 않는 경우
→ **Mitigation**: try-catch로 감싸고, 실패 시 메모리 상태만 사용 (기존 동작 유지)

**[Risk]** 사용자가 localStorage를 비활성화한 경우
→ **Mitigation**: 동일하게 메모리 상태로 폴백

**[Risk]** 효과음 재생이 실패하거나 무한 대기
→ **Mitigation**: Promise에 timeout 설정 (예: 3초) 또는 효과음 재생 실패 시 바로 resolve

**[Trade-off]** TTS 속도를 느리게 하면 퀴즈 완료 시간 증가
→ **Acceptance**: 사용자 이해도 향상이 우선순위 더 높음

**[Trade-off]** localStorage는 브라우저별로 독립적
→ **Acceptance**: 사용자는 일반적으로 하나의 브라우저를 주로 사용
