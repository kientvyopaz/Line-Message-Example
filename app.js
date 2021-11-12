require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { middleware, Client } = require('@line/bot-sdk');
const io = new Server(server);

const config = {
    channelAccessToken: process.env.LINE_BOOT_TOKEN || null,
    channelSecret: process.env.LINE_BOOT_SECRET || null
}

io.on('connection', (socket) => {
    socket.on('replyMessage', ({ replyToken, message }) => {
        const client = new Client(config);
        client.replyMessage(replyToken, {
            type: 'text',
            text: message,
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/webhook', middleware(config), (req, res) => {
    const event = req.body.events[0];
    io.emit('getMessage', event);
})

server.listen(process.env.PORT, () => {
    console.log(`listening on *:${process.env.PORT}`);
});
