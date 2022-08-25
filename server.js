const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//pasta estatica
app.use(express.static(path.join(__dirname,'.')))

const nomeCrow = 'Crow';


//quando conecta
io.on('connection', socket => {
    socket.on('joinRoom',({username, room}) => {

        const user = userJoin(socket.id,username,room);


        socket.join(user.room);


         // boas vindas ao user
    socket.emit('message', formatMessage(nomeCrow,'Bem vindo ao Crow'));

    //avisa quando alguem entra na sala
    socket.broadcast.to(user.room).emit('message',formatMessage(nomeCrow,`${user.username} entrou no chat`));

    //Informação dos user

    io.to(user.room).emit('roomUsers',{

        room: user.room,
        users: getRoomUsers(user.room)

    });


    });
    
   
    //quando disconecta
    socket.on('disconnect',()=>{

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(nomeCrow,`${user.username} saiu do chat`));
            io.to(user.room).emit('roomUsers',{

                room: user.room,
                users: getRoomUsers(user.room)
        
            });
        }


    });

    //Procura mensagens 
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`servidor on na porta ${PORT}`));