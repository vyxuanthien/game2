const { SURVIVAL_QUOTAS, gameState } = require('../gameManager');

function processRoundEnd(io, questionsList) {
    gameState.status = 'ROUND_ENDED';
    
    const currentQ = questionsList[gameState.currentQuestionIndex];
    if (!currentQ) return;

    const correctAnswer = currentQ.correctAnswer;
    const targetQuota = SURVIVAL_QUOTAS[gameState.currentQuestionIndex];

    let activePlayers = [];

    // Phân loại và chấm điểm người chơi đang ACTIVE
    gameState.players.forEach((player, socketId) => {
        if (player.status === 'ACTIVE') {
            const submission = gameState.currentRoundAnswers.get(socketId);
            if (submission && submission.answer === correctAnswer) {
                const responseTime = submission.timestamp - gameState.questionStartTime;
                activePlayers.push({ socketId, responseTime });
            } else {
                player.status = 'SPECTATOR';
            }
        }
    });

    // Sắp xếp theo tốc độ mili-giây nhanh nhất
    activePlayers.sort((a, b) => a.responseTime - b.responseTime);

    // Lọc theo quota vòng này
    const survivors = activePlayers.slice(0, targetQuota);
    const eliminatedThisRound = activePlayers.slice(targetQuota);

    eliminatedThisRound.forEach(p => {
        const player = gameState.players.get(p.socketId);
        if (player) player.status = 'SPECTATOR';
    });

    const isLastQuestion = gameState.currentQuestionIndex === SURVIVAL_QUOTAS.length - 1;
    const champion = (isLastQuestion && survivors.length > 0) ? gameState.players.get(survivors[0].socketId).name : null;

    if (champion || (isLastQuestion && survivors.length === 0)) {
        gameState.status = 'FINISHED';
    }

    // Gửi kết quả tổng kết về Client
    io.emit('round-result', {
        questionIndex: gameState.currentQuestionIndex,
        correctAnswer: correctAnswer,
        survivorsCount: survivors.length,
        nextQuota: SURVIVAL_QUOTAS[gameState.currentQuestionIndex + 1] || 0,
        isFinished: gameState.status === 'FINISHED',
        champion: champion
    });

    // Gửi trạng thái cập nhật riêng cho từng người chơi
    gameState.players.forEach((player, socketId) => {
        io.to(socketId).emit('player-status-update', {
            status: player.status,
            message: player.status === 'ACTIVE' 
                ? 'Chúc mừng! Bạn đã lọt vào vòng trong.' 
                : 'Bạn đã dừng chân và chuyển sang Chế độ theo dõi (Spectator).'
        });
    });

    gameState.currentRoundAnswers.clear();
}

module.exports = function(io, questionsList) {
    io.on('connection', (socket) => {
        
        socket.on('join-game', (data) => {
            if (gameState.status !== 'WAITING') {
                socket.emit('error-message', 'Trò chơi đã bắt đầu, không thể tham gia lúc này.');
                return;
            }
            gameState.players.set(socket.id, {
                name: data.name,
                status: 'ACTIVE'
            });
            io.emit('update-player-count', gameState.players.size);
        });

        socket.on('submit-answer', (data) => {
            if (gameState.status !== 'PLAYING') return;
            
            const player = gameState.players.get(socket.id);
            if (!player || player.status !== 'ACTIVE') return; 
            if (gameState.currentRoundAnswers.has(socket.id)) return; // Chống gửi nhiều lần

            gameState.currentRoundAnswers.set(socket.id, {
                answer: data.answer,
                timestamp: Date.now() // Ghi nhận thời gian mili-giây chính xác
            });

            socket.emit('answer-acknowledged', { selected: data.answer });
        });

        socket.on('admin-next-question', () => {
            if (gameState.status === 'PLAYING') return;

            if (gameState.currentQuestionIndex >= questionsList.length) {
                io.emit('game-ended', { message: 'Trò chơi đã kết thúc hoàn toàn!' });
                return;
            }

            gameState.status = 'PLAYING';
            gameState.questionStartTime = Date.now();

            const currentQ = questionsList[gameState.currentQuestionIndex];

            io.emit('new-question', {
                questionIndex: gameState.currentQuestionIndex,
                totalQuestions: questionsList.length,
                questionText: currentQ.text,
                options: currentQ.options,
                duration: 30
            });

            // Tự động khóa vòng sau 30 giây
            setTimeout(() => {
                if (gameState.status === 'PLAYING') {
                    processRoundEnd(io, questionsList);
                    gameState.currentQuestionIndex++;
                }
            }, 30000);
        });

        socket.on('disconnect', () => {
            // Xử lý ngắt kết nối nếu cần
        });
    });
};