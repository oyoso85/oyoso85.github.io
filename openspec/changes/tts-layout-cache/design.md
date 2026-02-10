## Context

Number Block은 아동용 수학 퀴즈 웹앱으로, 현재 문제를 시각적으로만 표시한다. 한글을 읽지 못하는 어린 아동도 사용할 수 있도록 TTS로 문제를 읽어주는 기능이 필요하다. 브라우저의 Web Speech API를 사용하면 외부 서비스 없이 구현 가능하다.

## Goals / Non-Goals

**Goals:**
- Web Speech API로 문제를 한국어로 읽어주기
- 연산 기호를 한국어로 변환 (+ → 더하기, − → 빼기, × → 곱하기, ÷ → 나누기)
- 음소거 시 TTS도 함께 비활성화
- 진행률 표시를 왼쪽 상단으로 이동
- JS/CSS 파일에 버전 쿼리스트링 추가

**Non-Goals:**
- 외부 TTS 서비스 연동 (Google Cloud TTS 등)
- TTS 음성 선택 UI
- 서비스 워커 기반 캐시 관리

## Decisions

### 1. TTS 엔진: Web Speech API (SpeechSynthesis)
- **선택**: 브라우저 내장 SpeechSynthesis API 사용
- **대안**: Google Cloud TTS API → 비용 발생, API 키 관리 필요
- **이유**: 무료, 한국어 지원, 별도 의존성 없음, 대부분의 모바일 브라우저 지원

### 2. TTS 텍스트 형식
- **형식**: "{a} {연산자 한국어} {b} 은?" (예: "1 더하기 1 은?")
- **언어**: ko-KR
- **타이밍**: 문제가 화면에 표시된 직후 자동 재생

### 3. 캐시 버스팅 방식
- **선택**: 쿼리스트링 방식 (?v=빌드시간)
- **대안**: 파일명 해싱 → 빌드 도구 필요
- **이유**: 빌드 도구 없이 간단하게 적용 가능

## Risks / Trade-offs

- [Web Speech API 미지원 브라우저] → TTS 기능을 조건부로 실행 (speechSynthesis 존재 여부 확인)
- [모바일에서 TTS 음성 품질 편차] → 브라우저 기본 한국어 음성 사용, 별도 제어 불필요
- [TTS와 BGM 동시 재생] → 둘 다 재생 가능 (별도 오디오 채널)
