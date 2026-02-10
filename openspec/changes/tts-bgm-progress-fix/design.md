## Context

Number Block은 아동용 수학 퀴즈 웹앱이다. 최근 Web Speech API 기반 TTS 기능이 추가되었으나, 읽기 속도가 빠르고 BGM과 음량이 같아 문제 내용이 잘 전달되지 않는다. 진행률 표시도 본문 영역에 있어 모바일에서 가상 키보드 사용 시 가려질 수 있다.

## Goals / Non-Goals

**Goals:**
- TTS 읽기 속도를 0.8 정도로 낮춰 아동이 이해하기 쉽게 조정
- BGM 멜로디/베이스 음량을 현재의 절반 이하로 낮춰 TTS 명확성 확보
- 진행률 표시(quiz-header)를 화면 상단에 position: fixed로 고정

**Non-Goals:**
- TTS 음성 종류 선택 UI
- BGM 음량 조절 슬라이더
- 진행률 바(progress bar) 형태 변경

## Decisions

### 1. TTS 읽기 속도
- **선택**: SpeechSynthesisUtterance.rate = 0.8
- **대안**: rate = 0.6 → 너무 느려서 부자연스러움
- **이유**: 0.8은 아동이 따라가기 쉬우면서도 자연스러운 속도

### 2. BGM 음량 조정
- **선택**: 멜로디 volume 0.06→0.02, 베이스 volume 0.08→0.03
- **대안**: TTS 재생 중 BGM 일시 중지 → 끊김이 부자연스러움
- **이유**: 음량만 낮추면 BGM 분위기를 유지하면서 TTS가 명확히 들림

### 3. 진행률 상단 고정
- **선택**: quiz-header를 position: fixed, top: 16px, left: 16px으로 고정
- **대안**: sticky → 부모 컨테이너 스크롤에 의존하여 불안정
- **이유**: 음소거 버튼(fixed, top-right)과 대칭으로 왼쪽 상단에 고정

## Risks / Trade-offs

- [fixed 진행률과 본문 겹침] → body에 padding-top을 추가하거나 quiz 화면에 상단 여백 부여
- [TTS rate 값이 기기마다 체감 다를 수 있음] → 0.8은 대부분의 기기에서 적절한 범위
