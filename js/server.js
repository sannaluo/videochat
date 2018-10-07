

/*
const express = require('express');
const https = require('https');
const fs = require('fs');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

const app = express();
const server = https.createServer(options, app);
const io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000);

server.on('connection',(socket) => {
    console.log('new user connected');
    socket.emit('userAdd', '1');
});

io.on('connection', (socket) =>  {

//
//    socket.on('call', (json) =>  {
 //       console.log('Message: ' + JSON.stringify(json));
 //       socket.broadcast.emit('call', json);
//    });
//    socket.on('answer', (json) => {
//        console.log('Message: ' + JSON.stringify(json));
//        socket.broadcast.emit('answer', json);
//    });
//

    socket.on('candidate', (msg) => {
        console.log('candidate message recieved!');
        socket.broadcast.emit('candidate', msg);
    });


    socket.on('chatSend', (chat) => {
        console.log('chat received in client');
        socket.emit('chatReceive', chat); // ei broadcast
    });
});

*/