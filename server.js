'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new(nodeStatic.Server)();

var app = http.createServer(function(req, res) {
    fileServer.serve(req, res);
}).listen(8080);

let usersCount = 1;
let users = {};

// randomize user name and colour that are different from what is already in use
/**
 * colours used in chat member names
 * @type {string[]}
 */
const colourArray = ['rgb(0,176,240)','rgb(255,63,168)', 'rgb(254,221,26)', 'rgb(134,53,243)', 'rgb(14,226,216)', 'rgb(134,102,88)',
    'rgb(75,200,46)', 'rgb(240,166,0)', 'rgb(128,128,128)', 'rgb(52,90,254)', 'rgb(217,23,23)', 'rgb(219,154,230)', 'rgb(200,234,30)',
    'rgb(0,176,117)', 'rgb(229,109,109)', 'rgb(71,117,37)'];

/**
 * names used in chat member names
 * @type {string[]}
 */
const nameArray = ['car', 'face wash', 'air freshener', 'blouse', 'purse', 'rug', 'shoes', 'headphones', 'wallet', 'tweezers',
    'charger', 'glasses', 'eraser', 'beef', 'house', 'lace', 'cinder block', 'sticky note', 'couch', 'clay pot', 'grid paper',
    'water bottle', 'keyboard', 'thermometer', 'conditioner', 'table', 'fridge', 'toothbrush', 'knife', 'fork', 'camera',
    'glow stick', 'keys', 'drill press', 'credit card', 'playing card', 'shovel', 'milk', 'bow', 'hair brush', 'ring', 'soap', 'nail file',
    'tree', 'tv', 'video games', 'zipper', 'toilet', 'bookmark', 'shawl'];

let usedArray = [];
let usedArray2 = [];

/**
 * Get a random item from list
 * @returns {number}
 */
const getRandom = (amount, array, used) => {
    let ran = Math.floor(Math.random() * amount);

    if(used.length === array.length) {
        used = [];
    }

    if(used.includes(ran)) {
        return getRandom(amount, array, used);
    } else {
        used[used.length] =  ran;
        return ran;
    }
};

/**
 * Get random colour from list that doesn't exist yet. If all colours are used, use all colours again.
 * @returns {string}
 */
const getName = (amount, array, used) => {
    const ran = getRandom(amount, array, used);
    const col = array[ran];

    if(!col) {
        console.log('er');
    }
    return col;
};

/**
 *
 * @param string
 * @returns {string}
 */
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var io = socketIO.listen(app);
io.sockets.on('connection', function(socket) {
    // convenience function to log server messages on the client
    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }

    socket.on('message', function(message) {
        log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit('message', message);
    });

    socket.on('create or join', function(room) {
        log('Received request to create or join room ' + room);

        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (numClients === 0) {
            // reset counters
            usersCount = 1;
            usedArray = [];
            usedArray2 = [];

            socket.join(room);
            log('Client ID ' + socket.id + ' created room ' + room);
            socket.emit('created', room, socket.id);
        } else{
            log('Client ID ' + socket.id + ' joined room ' + room);
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            usersCount = numClients+1; // += 1
            console.log(usersCount);
            io.emit('userAdd', usersCount);
            io.sockets.in(room).emit('ready');
        }

        // create new user name and colour
        const id = socket.id;

        if(users.hasOwnProperty(id)) {
          //  console.log(users);
        }
        else {
            const user = capitalizeFirstLetter(getName(50, nameArray, usedArray2));
            const color = getName(16, colourArray, usedArray);
            users[id] = {name: user, color:color};
        }
    });

    socket.on('ipaddr', function() {
        var ifaces = os.networkInterfaces();

        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

    socket.on('bye', function(){
        console.log('received bye');
    });

    socket.on('chatSend', (chat) => {
        const user = users[socket.id].name;
        const color = users[socket.id].color;
        const info = {chat: chat, user: user, color: color};
        console.log('chat received in client ', info);
        io.emit('chatReceive', info); // ei broadcast
    });

    socket.on('disconnect', () => {
        usersCount -= 1; // += 1
        console.log(usersCount);
        io.emit('userAdd', usersCount);
    });
});