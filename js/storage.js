// 점수 저장/조회/관리 모듈
var STORAGE_KEY = 'numberblock_scores';
var MAX_SCORES = 20;

function getScores() {
    try {
        var data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveScore(operation, level, score, total) {
    var scores = getScores();
    scores.push({
        operation: operation,
        level: level,
        score: score,
        total: total,
        date: new Date().toISOString()
    });
    // 최대 20개 유지 (FIFO)
    while (scores.length > MAX_SCORES) {
        scores.shift();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

// 사운드 설정 저장
var SOUND_SETTING_KEY = 'numberblock_soundEnabled';
var TTS_SETTING_KEY = 'numberblock_ttsEnabled';

function saveSoundSetting(enabled) {
    try {
        localStorage.setItem(SOUND_SETTING_KEY, JSON.stringify(enabled));
    } catch (e) {
        console.warn('localStorage 저장 실패:', e);
    }
}

function getSoundSetting() {
    try {
        var data = localStorage.getItem(SOUND_SETTING_KEY);
        return data !== null ? JSON.parse(data) : true;
    } catch (e) {
        console.warn('localStorage 읽기 실패:', e);
        return true;
    }
}

function saveTtsSetting(enabled) {
    try {
        localStorage.setItem(TTS_SETTING_KEY, JSON.stringify(enabled));
    } catch (e) {
        console.warn('localStorage 저장 실패:', e);
    }
}

function getTtsSetting() {
    try {
        var data = localStorage.getItem(TTS_SETTING_KEY);
        return data !== null ? JSON.parse(data) : true;
    } catch (e) {
        console.warn('localStorage 읽기 실패:', e);
        return true;
    }
}
