// 앱 진입점
(function() {
    // 첫 클릭 시 AudioContext 활성화 + BGM 시작
    document.addEventListener('click', function() {
        Sound.unlock();
        Sound.startBGM();
    }, { once: true });
    // 상태
    var currentOperation = null;
    var currentLevel = null;
    var problems = [];
    var answers = [];
    var currentIndex = 0;

    var OP_NAMES = {
        add: '더하기',
        sub: '빼기',
        mul: '곱하기',
        div: '나누기'
    };

    var OP_SYMBOL_TO_KOREAN = {
        '+': '더하기',
        '−': '빼기',
        '×': '곱하기',
        '÷': '나누기'
    };

    // TTS: 문제를 한국어로 읽어주기
    var koVoice = null;
    function findKoreanVoice() {
        var voices = speechSynthesis.getVoices();
        for (var i = 0; i < voices.length; i++) {
            if (voices[i].lang.indexOf('ko') === 0) {
                koVoice = voices[i];
                return;
            }
        }
    }
    if (typeof speechSynthesis !== 'undefined') {
        findKoreanVoice();
        speechSynthesis.addEventListener('voiceschanged', findKoreanVoice);
    }

    function speakQuestion(a, op, b) {
        if (typeof speechSynthesis === 'undefined') return;
        if (Sound.isTtsMuted()) return;
        speechSynthesis.cancel();
        var opKor = OP_SYMBOL_TO_KOREAN[op] || op;
        var lastDigit = Math.abs(b) % 10;
        var particle = (lastDigit === 2 || lastDigit === 4 || lastDigit === 5 || lastDigit === 9) ? '는?' : '은?';
        var text = a + ' ' + opKor + ' ' + b + ' ' + particle;
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ko-KR';
        if (koVoice) {
            utter.voice = koVoice;
        }
        utter.rate = 0.72;
        speechSynthesis.speak(utter);
    }

    function speakText(text) {
        if (typeof speechSynthesis === 'undefined') return;
        if (Sound.isTtsMuted()) return;
        speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ko-KR';
        if (koVoice) {
            utter.voice = koVoice;
        }
        utter.rate = 0.72;
        speechSynthesis.speak(utter);
    }

    var LEVEL_DESCRIPTIONS = {
        add: [
            '한자리 + 한자리',
            '두자리 + 한자리 (올림 없음)',
            '한자리 + 두자리 (올림 없음)',
            '두자리 + 한자리 (올림 있음)',
            '한자리 + 두자리 (올림 있음)',
            '두자리 + 두자리 (올림 없음)',
            '두자리 + 두자리 (일의자리 올림)',
            '두자리 + 두자리 (올림, 합≤99)',
            '두자리 + 두자리 (합>100)',
            '세자리 + 두자리'
        ],
        sub: [
            '한자리 범위 빼기',
            '두자리 − 한자리 (받아내림 없음)',
            '두자리 − 한자리 (받아내림 없음)',
            '두자리 − 한자리 (받아내림 있음)',
            '두자리 − 한자리 (받아내림 있음)',
            '두자리 − 두자리 (받아내림 없음)',
            '두자리 − 두자리 (일의자리 받아내림)',
            '두자리 − 두자리 (받아내림 있음)',
            '세자리 − 두자리 (100 부근)',
            '세자리 − 두자리'
        ],
        mul: [
            '한자리 × 한자리',
            '두자리 × 한자리 (쉬움)',
            '두자리 × 한자리 (쉬움)',
            '두자리 × 한자리 (보통)',
            '두자리 × 한자리 (어려움)',
            '두자리 × 두자리 (쉬움)',
            '두자리 × 두자리 (보통)',
            '두자리 × 두자리 (어려움)',
            '두자리 × 두자리 (매우 어려움)',
            '세자리 × 한자리'
        ],
        div: [
            '한자리 나누기',
            '간단한 나누기 (쉬움)',
            '간단한 나누기 (쉬움)',
            '나누기 (보통)',
            '나누기 (어려움)',
            '큰 수 나누기 (쉬움)',
            '큰 수 나누기 (보통)',
            '큰 수 나누기 (어려움)',
            '큰 수 나누기 (매우 어려움)',
            '세자리 ÷ 한자리'
        ]
    };

    // 화면 전환
    function showScreen(screenId) {
        var screens = document.querySelectorAll('.screen');
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }
        document.getElementById(screenId).classList.add('active');
    }

    // 홈 화면: 연산 선택 버튼
    var opButtons = document.querySelectorAll('.btn-op');
    for (var i = 0; i < opButtons.length; i++) {
        opButtons[i].addEventListener('click', function() {
            Sound.click();
            currentOperation = this.getAttribute('data-op');
            showLevelScreen();
        });
    }

    // 점수 이력 버튼
    document.getElementById('btn-show-history').addEventListener('click', function() {
        showHistoryScreen();
    });

    // 난이도 선택 화면
    function showLevelScreen() {
        var title = document.getElementById('level-title');
        title.textContent = OP_NAMES[currentOperation] + ' - 난이도 선택';

        var container = document.getElementById('level-buttons');
        container.innerHTML = '';

        var descriptions = LEVEL_DESCRIPTIONS[currentOperation];
        for (var lv = 1; lv <= 10; lv++) {
            var btn = document.createElement('button');
            btn.className = 'btn-level';
            btn.innerHTML = '레벨 ' + lv + '<span class="level-desc">' + descriptions[lv - 1] + '</span>';
            btn.setAttribute('data-level', lv);
            btn.addEventListener('click', function() {
                Sound.click();
                currentLevel = parseInt(this.getAttribute('data-level'));
                startQuiz();
            });
            container.appendChild(btn);
        }

        showScreen('screen-level');
    }

    // 뒤로가기 (난이도 → 홈)
    document.getElementById('btn-level-back').addEventListener('click', function() {
        showScreen('screen-home');
    });

    // 퀴즈 시작
    function startQuiz() {
        problems = generateProblems(currentOperation, currentLevel);
        answers = new Array(20);
        for (var i = 0; i < 20; i++) {
            answers[i] = '';
        }
        currentIndex = 0;
        showQuizQuestion();
        showScreen('screen-quiz');
        Sound.startBGM();
    }

    // 문제 표시
    function showQuizQuestion() {
        var p = problems[currentIndex];
        document.getElementById('quiz-progress').textContent = (currentIndex + 1) + ' / 20';
        document.getElementById('quiz-question').innerHTML =
            '<span class="q-num">' + p.a + '</span>' +
            ' <span class="q-op">' + p.op + '</span> ' +
            '<span class="q-num">' + p.b + '</span>' +
            ' <span class="q-op">=</span> ' +
            '<span class="q-op">?</span>';

        speakQuestion(p.a, p.op, p.b);

        var input = document.getElementById('quiz-answer');
        input.value = answers[currentIndex];
        input.focus();

        // 이전 버튼 상태
        document.getElementById('btn-prev').disabled = (currentIndex === 0);

        // 마지막 문제면 "완료"로 표시
        var btnNext = document.getElementById('btn-next');
        btnNext.textContent = (currentIndex === 19) ? '완료' : '다음';
    }

    // 현재 답 저장
    function saveCurrentAnswer() {
        answers[currentIndex] = document.getElementById('quiz-answer').value;
    }

    // 이전 버튼
    document.getElementById('btn-prev').addEventListener('click', function() {
        if (currentIndex > 0) {
            saveCurrentAnswer();
            currentIndex--;
            showQuizQuestion();
        }
    });

    // 다음/완료 버튼
    document.getElementById('btn-next').addEventListener('click', async function() {
        saveCurrentAnswer();
        // 답을 입력했으면 정답/오답 효과음
        var userAns = answers[currentIndex].trim();
        if (userAns !== '') {
            if (parseInt(userAns) === problems[currentIndex].answer) {
                await Sound.correct(); // 효과음 완료 대기
            } else {
                await Sound.wrong(); // 효과음 완료 대기
            }
        }
        // 효과음 완료 후 문제 전환
        if (currentIndex < 19) {
            currentIndex++;
            showQuizQuestion(); // 문제 전환 후 TTS 자동 재생
        } else {
            finishQuiz();
        }
    });

    // Enter 키로 다음 문제
    document.getElementById('quiz-answer').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('btn-next').click();
        }
    });

    // 모바일 가상 키보드 대응: 입력 필드 포커스 시 문제 영역 스크롤
    document.getElementById('quiz-answer').addEventListener('focus', function() {
        var question = document.getElementById('quiz-question');
        setTimeout(function() {
            question.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });

    // 퀴즈 → 홈
    document.getElementById('btn-quiz-home').addEventListener('click', function() {
        Sound.click();
        showScreen('screen-home');
    });

    // 채점
    function finishQuiz() {
        var correct = 0;
        for (var i = 0; i < 20; i++) {
            var userAnswer = answers[i].trim();
            if (userAnswer !== '' && parseInt(userAnswer) === problems[i].answer) {
                correct++;
            }
        }

        // 결과 표시
        document.getElementById('result-score').textContent = correct + ' / 20';

        // 풀이 목록 표시
        var reviewContainer = document.getElementById('result-review');
        reviewContainer.innerHTML = '';
        for (var i = 0; i < 20; i++) {
            var p = problems[i];
            var userAns = answers[i].trim();
            var isCorrect = (userAns !== '' && parseInt(userAns) === p.answer);
            var div = document.createElement('div');
            div.className = 'review-item' + (isCorrect ? '' : ' wrong');

            var userDisplay = (userAns === '') ? '미답' : userAns;
            var answerClass = isCorrect ? 'correct' : 'incorrect';

            div.innerHTML =
                '<span class="rv-num">' + (i + 1) + '</span>' +
                '<span class="rv-problem">' + p.a + ' ' + p.op + ' ' + p.b + ' = ' + p.answer + '</span>' +
                '<span class="rv-answer ' + answerClass + '">' + userDisplay + '</span>';

            reviewContainer.appendChild(div);
        }

        // 점수 저장
        saveScore(currentOperation, currentLevel, correct, 20);

        Sound.fanfare();
        showScreen('screen-result');
    }

    // 결과 → 홈
    document.getElementById('btn-result-home').addEventListener('click', function() {
        showScreen('screen-home');
    });

    // 점수 이력 화면
    function showHistoryScreen() {
        var scores = getScores();
        var container = document.getElementById('history-list');
        container.innerHTML = '';

        if (scores.length === 0) {
            container.innerHTML = '<div class="history-empty">아직 기록이 없습니다</div>';
        } else {
            // 최신순 표시
            for (var i = scores.length - 1; i >= 0; i--) {
                var s = scores[i];
                var div = document.createElement('div');
                div.className = 'history-item';

                var dateStr = new Date(s.date).toLocaleDateString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                });

                div.innerHTML =
                    '<span class="hi-op">' + (OP_NAMES[s.operation] || s.operation) + '</span>' +
                    '<span class="hi-level">Lv.' + s.level + '</span>' +
                    '<span class="hi-score">' + s.score + '/' + s.total + '</span>' +
                    '<span class="hi-date">' + dateStr + '</span>';

                container.appendChild(div);
            }
        }

        showScreen('screen-history');
    }

    // 이력 → 홈
    document.getElementById('btn-history-home').addEventListener('click', function() {
        showScreen('screen-home');
    });

    // 효과음/BGM 버튼
    var btnMute = document.getElementById('btn-mute');
    btnMute.addEventListener('click', function() {
        var isMuted = Sound.toggleMute();
        this.textContent = isMuted ? '🔇' : '🔊';
        this.title = isMuted ? '효과음 켜기' : '효과음 끄기';
        this.classList.toggle('off', isMuted);
    });
    var initialMuted = Sound.isMuted();
    btnMute.textContent = initialMuted ? '🔇' : '🔊';
    btnMute.title = initialMuted ? '효과음 켜기' : '효과음 끄기';
    btnMute.classList.toggle('off', initialMuted);

    // TTS 음성 버튼
    var btnTts = document.getElementById('btn-tts');
    btnTts.addEventListener('click', function() {
        var isMuted = Sound.toggleTtsMute();
        this.textContent = isMuted ? '🗣️' : '🗣️';
        this.title = isMuted ? '음성 켜기' : '음성 끄기';
        this.classList.toggle('off', isMuted);
    });
    var initialTtsMuted = Sound.isTtsMuted();
    btnTts.title = initialTtsMuted ? '음성 켜기' : '음성 끄기';
    btnTts.classList.toggle('off', initialTtsMuted);

    // === 계산기 ===
    var calcDisplay = '0';
    var calcFirstOperand = null;
    var calcOperator = null;
    var calcWaitingForSecond = false;
    var calcJustCalculated = false;

    // 계산기 버튼 클릭 → 화면 전환
    document.getElementById('btn-show-calculator').addEventListener('click', function() {
        Sound.click();
        calcReset();
        showScreen('screen-calculator');
    });

    // 계산기 홈으로
    document.getElementById('btn-calc-home').addEventListener('click', function() {
        Sound.click();
        showScreen('screen-home');
    });

    function calcReset() {
        calcDisplay = '0';
        calcFirstOperand = null;
        calcOperator = null;
        calcWaitingForSecond = false;
        calcJustCalculated = false;
        calcUpdateDisplay();
        // 연산자 버튼 active 해제
        var opBtns = document.querySelectorAll('.calc-op');
        for (var i = 0; i < opBtns.length; i++) {
            opBtns[i].classList.remove('active');
        }
    }

    function calcUpdateDisplay() {
        var valueEl = document.getElementById('calc-value');
        var exprEl = document.getElementById('calc-expression');
        var remEl = document.getElementById('calc-remainder');

        valueEl.textContent = calcDisplay;
        valueEl.classList.remove('error');
        remEl.textContent = '';

        // 에러 메시지 스타일
        if (calcDisplay === '0으로 나눌 수 없어요' || calcDisplay === '너무 커요!' || calcDisplay === '0보다 작아요!') {
            valueEl.classList.add('error');
        }

        // 식 표시
        if (calcFirstOperand !== null && calcOperator !== null) {
            if (calcJustCalculated) {
                exprEl.textContent = calcFirstOperand + ' ' + calcOperator + ' ' + calcDisplay + ' =';
            } else {
                exprEl.textContent = calcFirstOperand + ' ' + calcOperator;
            }
        } else {
            exprEl.textContent = '';
        }
    }

    // 계산기 버튼 이벤트
    var calcBtns = document.querySelectorAll('.calc-btn');
    for (var i = 0; i < calcBtns.length; i++) {
        calcBtns[i].addEventListener('click', function() {
            var val = this.getAttribute('data-val');
            Sound.click();

            if (val >= '0' && val <= '9') {
                calcInputNumber(val);
            } else if (val === '+' || val === '−' || val === '×' || val === '÷') {
                calcInputOperator(val);
            } else if (val === '=') {
                calcCalculate();
            } else if (val === 'C') {
                calcReset();
            }
        });
    }

    function calcInputNumber(num) {
        // 에러 상태면 리셋
        if (calcDisplay === '0으로 나눌 수 없어요' || calcDisplay === '너무 커요!' || calcDisplay === '0보다 작아요!') {
            calcReset();
        }

        // 결과 표시 후 새 숫자 입력 시 전체 리셋
        if (calcJustCalculated) {
            calcReset();
        }

        if (calcWaitingForSecond) {
            calcDisplay = num;
            calcWaitingForSecond = false;
        } else {
            if (calcDisplay === '0') {
                calcDisplay = num;
            } else if (calcDisplay.length < 7) {
                calcDisplay = calcDisplay + num;
            }
        }
        calcUpdateDisplay();
    }

    function calcInputOperator(op) {
        // 에러 상태면 무시
        if (calcDisplay === '0으로 나눌 수 없어요' || calcDisplay === '너무 커요!' || calcDisplay === '0보다 작아요!') {
            return;
        }

        // 결과 후 연산자 → 결과를 첫 번째 피연산자로
        if (calcJustCalculated) {
            calcFirstOperand = parseInt(calcDisplay);
            calcOperator = op;
            calcWaitingForSecond = true;
            calcJustCalculated = false;
            calcHighlightOp(op);
            calcUpdateDisplay();
            return;
        }

        var inputValue = parseInt(calcDisplay);

        if (calcFirstOperand === null) {
            calcFirstOperand = inputValue;
        } else if (!calcWaitingForSecond) {
            // 이미 연산자가 있고 두 번째 수 입력 후 새 연산자 → 먼저 계산
            // 여기서는 단순히 연산자 교체만
        }

        calcOperator = op;
        calcWaitingForSecond = true;
        calcHighlightOp(op);
        calcUpdateDisplay();
    }

    function calcHighlightOp(op) {
        var opBtns = document.querySelectorAll('.calc-op');
        for (var i = 0; i < opBtns.length; i++) {
            if (opBtns[i].getAttribute('data-val') === op) {
                opBtns[i].classList.add('active');
            } else {
                opBtns[i].classList.remove('active');
            }
        }
    }

    function calcCalculate() {
        if (calcFirstOperand === null || calcOperator === null) return;
        // 에러 상태면 무시
        if (calcDisplay === '0으로 나눌 수 없어요' || calcDisplay === '너무 커요!' || calcDisplay === '0보다 작아요!') {
            return;
        }

        var second = parseInt(calcDisplay);
        var result;
        var remainder = null;
        var exprFirst = calcFirstOperand;

        if (calcOperator === '+') {
            result = calcFirstOperand + second;
        } else if (calcOperator === '−') {
            result = calcFirstOperand - second;
        } else if (calcOperator === '×') {
            result = calcFirstOperand * second;
        } else if (calcOperator === '÷') {
            if (second === 0) {
                calcDisplay = '0으로 나눌 수 없어요';
                calcJustCalculated = true;
                calcUpdateDisplay();
                speakText('0으로 나눌 수 없어요');
                Sound.correct();
                // 연산자 active 해제
                var opBtns = document.querySelectorAll('.calc-op');
                for (var j = 0; j < opBtns.length; j++) {
                    opBtns[j].classList.remove('active');
                }
                return;
            }
            result = Math.floor(calcFirstOperand / second);
            var mod = calcFirstOperand % second;
            if (mod !== 0) {
                remainder = mod;
            }
        }

        // 범위 체크
        if (result > 9999999) {
            calcDisplay = '너무 커요!';
            calcJustCalculated = true;
            calcUpdateDisplay();
            document.getElementById('calc-expression').textContent = exprFirst + ' ' + calcOperator + ' ' + second + ' =';
            speakText('너무 커요!');
            Sound.correct();
            var opBtns2 = document.querySelectorAll('.calc-op');
            for (var k = 0; k < opBtns2.length; k++) {
                opBtns2[k].classList.remove('active');
            }
            return;
        }

        if (result < 0) {
            calcDisplay = '0보다 작아요!';
            calcJustCalculated = true;
            calcUpdateDisplay();
            document.getElementById('calc-expression').textContent = exprFirst + ' ' + calcOperator + ' ' + second + ' =';
            speakText('0보다 작아요!');
            Sound.correct();
            var opBtns3 = document.querySelectorAll('.calc-op');
            for (var m = 0; m < opBtns3.length; m++) {
                opBtns3[m].classList.remove('active');
            }
            return;
        }

        calcDisplay = String(result);
        calcJustCalculated = true;

        // 식 표시 업데이트
        document.getElementById('calc-expression').textContent = exprFirst + ' ' + calcOperator + ' ' + second + ' =';
        document.getElementById('calc-value').textContent = calcDisplay;
        document.getElementById('calc-value').classList.remove('error');

        // 나머지 표시
        if (remainder !== null) {
            document.getElementById('calc-remainder').textContent = '나머지 ' + remainder;
        } else {
            document.getElementById('calc-remainder').textContent = '';
        }

        // 연산자 active 해제
        var opBtns4 = document.querySelectorAll('.calc-op');
        for (var n = 0; n < opBtns4.length; n++) {
            opBtns4[n].classList.remove('active');
        }

        // 결과 읽기
        var ttsText = String(result);
        if (remainder !== null) {
            ttsText = result + ', 나머지 ' + remainder;
        }
        speakText(ttsText);

        Sound.correct();
    }

    // 초기 화면
    showScreen('screen-home');
})();
