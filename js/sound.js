// 8비트 사운드 엔진 (Web Audio API)
var Sound = (function() {
    var ctx = null;
    var muted = false;
    var ttsMuted = false;
    var bgmInterval = null;
    var bgmGain = null;
    var masterGain = null;

    // localStorage에서 초기 설정 읽기
    function initSettings() {
        if (typeof getSoundSetting === 'function') {
            muted = !getSoundSetting();
        }
        if (typeof getTtsSetting === 'function') {
            ttsMuted = !getTtsSetting();
        }
    }
    initSettings();

    function getCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.connect(ctx.destination);
            if (muted) {
                masterGain.gain.setValueAtTime(0, ctx.currentTime);
            }
        }
        return ctx;
    }

    function getMasterGain() {
        getCtx();
        return masterGain;
    }

    // 기본 8비트 음 재생
    function playTone(freq, duration, type, volume, startTime) {
        if (muted) return;
        var c = getCtx();
        var osc = c.createOscillator();
        var gain = c.createGain();

        osc.type = type || 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume || 0.15, startTime || c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, (startTime || c.currentTime) + duration);

        osc.connect(gain);
        gain.connect(getMasterGain());
        osc.start(startTime || c.currentTime);
        osc.stop((startTime || c.currentTime) + duration);
    }

    // 효과음: 정답
    function correct() {
        return new Promise(function(resolve) {
            if (muted) {
                resolve();
                return;
            }
            var c = getCtx();
            var t = c.currentTime;
            playTone(523.25, 0.1, 'square', 0.15, t);        // C5
            playTone(659.25, 0.1, 'square', 0.15, t + 0.1);  // E5
            playTone(783.99, 0.15, 'square', 0.15, t + 0.2);  // G5
            playTone(1046.50, 0.25, 'square', 0.12, t + 0.3); // C6

            // 효과음 재생 시간: 0.1 + 0.1 + 0.15 + 0.25 = 0.6초
            var duration = 600; // 밀리초
            var timeout = 3000; // 3초 timeout

            var completed = false;
            setTimeout(function() {
                if (!completed) {
                    completed = true;
                    resolve();
                }
            }, duration);

            // timeout 안전장치
            setTimeout(function() {
                if (!completed) {
                    completed = true;
                    resolve();
                }
            }, timeout);
        });
    }

    // 효과음: 오답
    function wrong() {
        return new Promise(function(resolve) {
            if (muted) {
                resolve();
                return;
            }
            var c = getCtx();
            var t = c.currentTime;
            playTone(311.13, 0.15, 'square', 0.12, t);        // Eb4
            playTone(233.08, 0.3, 'square', 0.12, t + 0.15);  // Bb3

            // 효과음 재생 시간: 0.15 + 0.3 = 0.45초
            var duration = 450; // 밀리초
            var timeout = 3000; // 3초 timeout

            var completed = false;
            setTimeout(function() {
                if (!completed) {
                    completed = true;
                    resolve();
                }
            }, duration);

            // timeout 안전장치
            setTimeout(function() {
                if (!completed) {
                    completed = true;
                    resolve();
                }
            }, timeout);
        });
    }

    // 효과음: 버튼 클릭
    function click() {
        if (muted) return;
        playTone(880, 0.05, 'square', 0.08);
    }

    // 효과음: 퀴즈 완료 팡파레
    function fanfare() {
        if (muted) return;
        var c = getCtx();
        var t = c.currentTime;
        var notes = [523.25, 523.25, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.50];
        var durs  = [0.12,   0.12,   0.12,   0.15,   0.12,   0.12,   0.15,   0.4];
        var offset = 0;
        for (var i = 0; i < notes.length; i++) {
            playTone(notes[i], durs[i], 'square', 0.13, t + offset);
            offset += durs[i] + 0.02;
        }
    }

    // BGM: 간단한 8비트 루프 멜로디
    var bgmPlaying = false;

    function startBGM() {
        if (bgmPlaying) return;
        bgmPlaying = true;

        // 밝고 경쾌한 멜로디 (C major)
        var melody = [
            // 음표: [주파수, 길이(beat)]
            [523.25, 1], [587.33, 1], [659.25, 1], [523.25, 1],
            [659.25, 1], [698.46, 1], [783.99, 2],
            [783.99, 0.5], [698.46, 0.5], [659.25, 0.5], [587.33, 0.5],
            [523.25, 1], [392.00, 1], [523.25, 2],
            [392.00, 1], [440.00, 1], [523.25, 1], [392.00, 1],
            [349.23, 1], [329.63, 1], [293.66, 2],
            [392.00, 1], [440.00, 1], [493.88, 1], [440.00, 1],
            [523.25, 1], [587.33, 1], [523.25, 2]
        ];

        // 베이스 라인
        var bass = [
            [130.81, 2], [130.81, 2], [174.61, 2], [196.00, 2],
            [174.61, 2], [130.81, 2], [130.81, 2], [196.00, 2],
            [130.81, 2], [130.81, 2], [174.61, 2], [196.00, 2],
            [174.61, 2], [196.00, 2], [261.63, 2], [130.81, 2]
        ];

        var bpm = 140;
        var beatLen = 60 / bpm;
        var loopLen = 0;
        for (var i = 0; i < melody.length; i++) loopLen += melody[i][1];
        var loopDuration = loopLen * beatLen;

        function scheduleLoop() {
            if (!bgmPlaying || muted) return;
            var c = getCtx();
            var t = c.currentTime + 0.05;

            // 멜로디
            var offset = 0;
            for (var i = 0; i < melody.length; i++) {
                var freq = melody[i][0];
                var dur = melody[i][1] * beatLen;
                playTone(freq, dur * 0.85, 'square', 0.02, t + offset);
                offset += dur;
            }

            // 베이스
            offset = 0;
            for (var i = 0; i < bass.length; i++) {
                var freq = bass[i][0];
                var dur = bass[i][1] * beatLen;
                playTone(freq, dur * 0.7, 'triangle', 0.03, t + offset);
                offset += dur;
            }
        }

        scheduleLoop();
        bgmInterval = setInterval(function() {
            if (!bgmPlaying) {
                clearInterval(bgmInterval);
                return;
            }
            scheduleLoop();
        }, loopDuration * 1000);
    }

    function stopBGM() {
        bgmPlaying = false;
        if (bgmInterval) {
            clearInterval(bgmInterval);
            bgmInterval = null;
        }
    }

    // 음소거 토글
    function toggleMute() {
        muted = !muted;
        if (masterGain) {
            masterGain.gain.setValueAtTime(muted ? 0 : 1, ctx.currentTime);
        }
        if (muted) {
            stopBGM();
        }
        // localStorage에 저장
        if (typeof saveSoundSetting === 'function') {
            saveSoundSetting(!muted); // muted의 반대값 저장 (enabled 상태)
        }
        return muted;
    }

    function isMuted() {
        return muted;
    }

    // TTS 음소거 토글
    function toggleTtsMute() {
        ttsMuted = !ttsMuted;
        if (ttsMuted && typeof speechSynthesis !== 'undefined') {
            speechSynthesis.cancel();
        }
        if (typeof saveTtsSetting === 'function') {
            saveTtsSetting(!ttsMuted);
        }
        return ttsMuted;
    }

    function isTtsMuted() {
        return ttsMuted;
    }

    // AudioContext 활성화 (사용자 인터랙션 필요)
    function unlock() {
        var c = getCtx();
        if (c.state === 'suspended') {
            c.resume();
        }
    }

    return {
        correct: correct,
        wrong: wrong,
        click: click,
        fanfare: fanfare,
        startBGM: startBGM,
        stopBGM: stopBGM,
        toggleMute: toggleMute,
        isMuted: isMuted,
        toggleTtsMute: toggleTtsMute,
        isTtsMuted: isTtsMuted,
        unlock: unlock
    };
})();
