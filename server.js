const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Phục vụ các file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Đọc danh sách câu hỏi Vật lí nhiệt từ file JSON
const questionsFilePath = path.join(__dirname, 'server', 'config', 'questions.json');
let questionsList = [];
try {
    const rawData = fs.readFileSync(questionsFilePath, 'utf8');
    questionsList = JSON.parse(rawData);
} catch (error) {
    console.error("Không thể đọc file câu hỏi:", error);
}

// Khởi tạo logic Socket.IO cho game
const registerGameSockets = require('./server/sockets/gameSocket');
registerGameSockets(io, questionsList);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});