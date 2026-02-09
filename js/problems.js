// 문제 생성 모듈
// generateProblems(operation, level) → [{a, b, op, answer}, ...]

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddition(level) {
    const problems = [];
    for (let i = 0; i < 20; i++) {
        let a, b;
        switch (level) {
            case 1: // 한자리 + 한자리
                a = randInt(1, 9);
                b = randInt(1, 9);
                break;
            case 2: // 두자리 + 한자리, 올림 없음
                a = randInt(10, 99);
                b = randInt(1, 9 - (a % 10));
                if (b < 1) b = 1;
                break;
            case 3: // 한자리 + 두자리, 올림 없음
                b = randInt(10, 99);
                a = randInt(1, 9 - (b % 10));
                if (a < 1) a = 1;
                break;
            case 4: // 두자리 + 한자리, 올림 있음
                a = randInt(10, 99);
                {
                    const onesA = a % 10;
                    if (onesA === 0) {
                        a += randInt(1, 9);
                    }
                    const minB = 10 - (a % 10);
                    b = randInt(Math.max(minB, 1), 9);
                }
                break;
            case 5: // 한자리 + 두자리, 올림 있음
                b = randInt(10, 99);
                {
                    const onesB = b % 10;
                    if (onesB === 0) {
                        b += randInt(1, 9);
                    }
                    const minA = 10 - (b % 10);
                    a = randInt(Math.max(minA, 1), 9);
                }
                break;
            case 6: // 두자리 + 두자리, 각 자리 올림 없음
                {
                    const tensA = randInt(1, 8);
                    const onesA = randInt(0, 8);
                    a = tensA * 10 + onesA;
                    const maxTensB = 9 - tensA;
                    const maxOnesB = 9 - onesA;
                    const tensB = randInt(1, maxTensB);
                    const onesB = randInt(0, maxOnesB);
                    b = tensB * 10 + onesB;
                }
                break;
            case 7: // 두자리 + 두자리, 일의 자리만 올림
                {
                    const tensA = randInt(1, 7);
                    const onesA = randInt(2, 9);
                    a = tensA * 10 + onesA;
                    const maxTensB = 9 - tensA - 1; // -1 for carry
                    const tensB = randInt(1, Math.max(maxTensB, 1));
                    const minOnesB = 10 - onesA;
                    const onesB = randInt(Math.max(minOnesB, 1), 9);
                    b = tensB * 10 + onesB;
                    // 십의 자리 합 + carry가 10을 넘지 않도록 확인
                    if (tensA + tensB + 1 > 9) {
                        b = (Math.max(9 - tensA - 1, 1)) * 10 + onesB;
                    }
                }
                break;
            case 8: // 두자리 + 두자리, 각 자리 올림, 합 ≤ 99
                {
                    a = randInt(10, 49);
                    const onesA = a % 10;
                    const tensA = Math.floor(a / 10);
                    // 일의 자리 합 ≥ 10
                    const minOnesB = onesA === 0 ? 1 : 10 - onesA;
                    const onesB = randInt(Math.max(minOnesB, 1), 9);
                    // 십의 자리 합 + carry ≥ 10이지만 합 ≤ 99
                    // tensA + tensB + 1 >= 10 → tensB >= 9 - tensA
                    // tensA + tensB + 1 <= 9 (to keep sum ≤ 99) → 모순
                    // 실제로 "각 자리가 10을 넘지만 총합 100 안 넘음"은
                    // 일의 자리 올림 + 십의 자리 합 ≤ 9 (총합 ≤ 99)
                    // 재해석: 일의자리 올림 있고, 십의자리+carry 합이 10 이상이면 100 넘음
                    // → 난이도 8은 일의 자리 올림 있고 합이 100 이하
                    const maxTensB = Math.floor((99 - a - onesB) / 10);
                    const tensB = randInt(1, Math.max(maxTensB, 1));
                    b = tensB * 10 + onesB;
                    if (a + b > 99) {
                        b = Math.max(b - 10, 10);
                    }
                }
                break;
            case 9: // 두자리 + 두자리, 합이 100~109
                {
                    a = randInt(50, 99);
                    const minB = 100 - a;
                    const maxB = Math.min(109 - a, 99);
                    b = randInt(Math.max(minB, 10), Math.max(maxB, 10));
                }
                break;
            case 10: // 세자리 + 두자리
                a = randInt(100, 999);
                b = randInt(10, 99);
                break;
        }
        problems.push({ a: a, b: b, op: '+', answer: a + b });
    }
    return problems;
}

function generateSubtraction(level) {
    // 더하기의 역연산: a + b = c → c - b = a 또는 c - a = b
    const addProblems = generateAddition(level);
    return addProblems.map(function(p) {
        var c = p.a + p.b;
        // 큰 수에서 작은 수를 뺌
        if (Math.random() < 0.5) {
            return { a: c, b: p.b, op: '−', answer: p.a };
        } else {
            return { a: c, b: p.a, op: '−', answer: p.b };
        }
    });
}

function generateMultiplication(level) {
    var problems = [];
    for (var i = 0; i < 20; i++) {
        var a, b;
        switch (level) {
            case 1: // 한자리 × 한자리
                a = randInt(2, 9);
                b = randInt(2, 9);
                break;
            case 2: // 두자리 × 한자리 (작은 결과)
                a = randInt(10, 19);
                b = randInt(2, 4);
                break;
            case 3: // 두자리 × 한자리 (작은 결과)
                a = randInt(10, 29);
                b = randInt(2, 3);
                break;
            case 4: // 두자리 × 한자리 (큰 결과)
                a = randInt(20, 49);
                b = randInt(3, 5);
                break;
            case 5: // 두자리 × 한자리 (큰 결과)
                a = randInt(30, 99);
                b = randInt(2, 5);
                break;
            case 6: // 두자리 × 두자리 (작은 결과)
                a = randInt(10, 19);
                b = randInt(10, 15);
                break;
            case 7: // 두자리 × 두자리 (중간 결과)
                a = randInt(10, 30);
                b = randInt(10, 20);
                break;
            case 8: // 두자리 × 두자리 (큰 결과)
                a = randInt(20, 50);
                b = randInt(15, 30);
                break;
            case 9: // 두자리 × 두자리 (큰 결과)
                a = randInt(30, 99);
                b = randInt(20, 50);
                break;
            case 10: // 세자리 × 한자리
                a = randInt(100, 999);
                b = randInt(2, 9);
                break;
        }
        problems.push({ a: a, b: b, op: '×', answer: a * b });
    }
    return problems;
}

function generateDivision(level) {
    // 곱하기의 역연산: a × b = c → c ÷ b = a 또는 c ÷ a = b
    var mulProblems = generateMultiplication(level);
    return mulProblems.map(function(p) {
        var c = p.a * p.b;
        if (Math.random() < 0.5) {
            return { a: c, b: p.b, op: '÷', answer: p.a };
        } else {
            return { a: c, b: p.a, op: '÷', answer: p.b };
        }
    });
}

function generateProblems(operation, level) {
    switch (operation) {
        case 'add': return generateAddition(level);
        case 'sub': return generateSubtraction(level);
        case 'mul': return generateMultiplication(level);
        case 'div': return generateDivision(level);
        default: return generateAddition(level);
    }
}
