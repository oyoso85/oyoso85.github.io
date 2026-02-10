// 앱 진입점
(function() {
    // 첫 클릭 시 AudioContext 활성화
    document.addEventListener('click', function() { Sound.unlock(); }, { once: true });
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
    function speakQuestion(a, op, b) {
        if (typeof speechSynthesis === 'undefined') return;
        if (Sound.isMuted()) return;
        speechSynthesis.cancel();
        var opKor = OP_SYMBOL_TO_KOREAN[op] || op;
        var text = a + ' ' + opKor + ' ' + b + ' 은?';
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ko-KR';
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
    document.getElementById('btn-next').addEventListener('click', function() {
        saveCurrentAnswer();
        // 답을 입력했으면 정답/오답 효과음
        var userAns = answers[currentIndex].trim();
        if (userAns !== '') {
            if (parseInt(userAns) === problems[currentIndex].answer) {
                Sound.correct();
            } else {
                Sound.wrong();
            }
        }
        if (currentIndex < 19) {
            currentIndex++;
            showQuizQuestion();
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
        Sound.stopBGM();
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

        Sound.stopBGM();
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

    // 음소거 버튼
    document.getElementById('btn-mute').addEventListener('click', function() {
        var isMuted = Sound.toggleMute();
        this.textContent = isMuted ? '🔇' : '🔊';
        this.title = isMuted ? '소리 켜기' : '소리 끄기';
    });

    // 초기 화면
    showScreen('screen-home');
})();
