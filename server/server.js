const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { config } =  require('dotenv');
const path = require("path");

const playersController = require('./src/controllers.js');

app.use(express.static(path.join(__dirname + "/public")))


config();
const PORT = process.env.PORT || 8080;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let clientNum = 0;

io.on('connection', (socket) => {
    socket.on('newPlayer', data => {
        const msg = playersController.addNewPlayer(data);
        if (!msg.status) {
            // username taken - notify player
            io.to(data.socketId).emit('notifyPlayer', { msg });
        } else {
            //username doesn't exist - may connect
            clientNum++;
            // send a player to a room where only two players can be
            let roomNo = Math.round(clientNum / 2);
            socket.join(roomNo);
            // add the roomNo to players array
            playersController.addUserRoom(data.username, roomNo);
            let turn = 0;
            // first player in a room
            clientNum % 2 === 1 ? turn = 1 : turn = 2;
            // notify a player that he is connected successfully, his roomNo, and his turn
            io.to(data.socketId).emit('notifyPlayer', { msg, roomNo, turn });
        }
    });
    // when second player comes to a room, notify the first one that the game starts
    socket.on('startNewGame', ({ roomNo, username }) => {
        socket.to(roomNo).emit('startNewGame', { startNewGame: true });
        //and send info about the second player the room
        socket.to(roomNo).emit('opponentInfo', username);
    });
    // player (first one) sends his roomNo and username to the opponent (second player)
    socket.on('userInfo', ({ username, roomNo }) => {
        roomNo && socket.to(roomNo).emit('opponentInfo', username);
    });
    // player sends image + info about it, send it to the other player in the room
    socket.on('image', ({ dataURL, roomNo, selectedWord }) => {
        socket.to(roomNo).emit('guessTheWord', { dataURL, selectedWord });
    });
    // update opponents score
    socket.on('updateScore', ({ score, roomNo }) => {
        socket.to(roomNo).emit('opponentScore', score);
    })
    // leaveGame button was clicked - delete the other player from the room
    socket.on('leaveGame', ({ username, roomNo }) => {
        socket.to(roomNo).emit('leavingPlayer', username);
        playersController.deletePlayer(socket.id);
        playersController.cleanTheRoom(roomNo);
    });
    // notify other player when leaving the room
    socket.on('disconnecting', () => {
        // socket.rooms is a Set which contains at least the socket ID
        let rooms = Array.from(socket.rooms);
        const leavingPlayer = playersController.getDisconnectingPlayer(socket.id);
        if (leavingPlayer && rooms.length > 1) {
            // send the the of the user who is leaving
            io.to(rooms[1]).emit('leavingPlayer', leavingPlayer.username);
            // clean the room - the game must restart
            playersController.cleanTheRoom(rooms[1]);
        }
    });
    socket.on('disconnect', () => {
        playersController.deletePlayer(socket.id);
    });
});

server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
