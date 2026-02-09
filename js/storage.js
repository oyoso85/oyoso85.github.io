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
