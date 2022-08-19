const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

//pega a msg do server
socket.on('message', message=>{
    console.log(message)
    outputMessage(message);
    //scrolar
    chatMessages.scrollTop = chatMessages.scrollHeight;


})

//envio de msg

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //pega o texto da msg
    const msg = e.target.elements.msg.value;

    //manda a msg pro server
    socket.emit('chatMessage',msg);

    //limpa o input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();



});
//manda a msg pro DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>
    
    
    `;
    document.querySelector('.chat-messages').appendChild(div);


}

