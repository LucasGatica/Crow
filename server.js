const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//pasta estatica
app.use(express.static(path.join(__dirname,'.')))

const nomeCrow = 'Crow';
//quando conecta
io.on('connection', socket => {
    
    // boas vindas ao user
    socket.emit('message', formatMessage(nomeCrow,'welcome to crow'));

    //conecta
    socket.broadcast.emit('message',formatMessage(nomeCrow,'Um usuario entrou no chat'));

    //quando disconecta
    socket.on('disconnect',()=>{
        io.emit('message', formatMessage(nomeCrow,'Um usuario saiu do chat'));

    });

    //Procura mensagens 
    socket.on('chatMessage', msg =>{
        io.emit('message',formatMessage('USER', msg));


    })

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`servidor on na porta ${PORT}`));