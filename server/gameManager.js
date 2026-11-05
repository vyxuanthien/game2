// Mảng hạn ngạch số người đi tiếp qua 8 câu hỏi (50 -> 40 -> 30 -> 20 -> 10 -> 6 -> 3 -> 1)
const SURVIVAL_QUOTAS = [50, 40, 30, 20, 10, 6, 3, 1];

const gameState = {
    status: 'WAITING', // 'WAITING', 'PLAYING', 'ROUND_ENDED', 'FINISHED'
    currentQuestionIndex: 0,
    questionStartTime: null,
    players: new Map(),         // socket.id -> { name, status: 'ACTIVE' | 'SPECTATOR' }
    currentRoundAnswers: new Map() // socket.id -> { answer, timestamp }
};

module.exports = {
    SURVIVAL_QUOTAS,
    gameState
};