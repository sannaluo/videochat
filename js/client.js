'use strict';

const socket = io.connect('https://10.114.34.13:3000');

const constraints = {audio: true, video: true};

const servers = {
    'iceServers': [
        {'urls': 'stun:stun.services.mozilla.com'},
        {'urls': 'stun:stun.l.google.com:19302'},
        {
            'urls': 'turn:numb.viagenie.ca',
            'credential': 'password',
            'username': 'email',
        }],
};

const caller = new RTCPeerConnection();

navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
   // const video = document.querySelector('video');
    //video.srcObject = mediaStream;

    console.log(mediaStream);
    console.log(caller);

   // caller.addStream(mediaStream);
}).catch(err => {
    console.log(err.name + ': ' + err.message);
});

caller.onaddstream = (evt) => {
    console.log('onaddstream called');
   // document.querySelector('#remoteVideo').srcObject = evt.stream;
  //  console.log(document.querySelector('#remoteVideo').srcObject);
    console.log(evt);
};


//const callBtn = document.getElementById('callBtn');

/*
callBtn.addEventListener('click', () => {
    // console.log('click');

    caller.createOffer().then((val) => {
        caller.setLocalDescription(new RTCSessionDescription(val));

        const jsonval = JSON.stringify(val);
        //console.log(jsonval);
       // socket.emit('call', jsonval); //hello: jsonval});


    }).catch((e)=>{
        console.log('error ', e);
    });
});
*/
/*
socket.on('call', (value)  => {
    const v = new RTCSessionDescription(JSON.parse(value));
    //console.log(v);
    caller.setRemoteDescription(v);
    socket.emit('answer',{ answer: 'call answered' });
    //console.log(value);
});

socket.on('answer', (value)  => {
    console.log(value);
});
*/



caller.onicecandidate = evt => {
    if (!evt.candidate) return;
    console.log('onicecandidate called');
    onIceCandidate(evt);
};

//Send the ICE Candidate to the remote peer
const onIceCandidate = (evt) => {
    socket.emit('candidate', JSON.stringify({'candidate': evt.candidate}));
};

socket.on('candidate', (value) => {
    console.log(value);
    caller.addIceCandidate(new RTCIceCandidate(JSON.parse(value).candidate));
});


const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const chatText = document.getElementById('chatText');
const chatForm = document.getElementById('chatForm');
const chatbox = document.getElementById("chatbox");

let sent = false;


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


const user = capitalizeFirstLetter(getName(50, nameArray, usedArray2));
const color = getName(16, colourArray, usedArray);

/**
 * add list item in chatbox
 * @param typed
 */
const addChat = (typed) => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const typer = user + ': ';
    const text = document.createTextNode(typed);
    const text2 = document.createTextNode(typer);

    const span = document.createElement('span');
    span.style.color = color;
    span.appendChild(text2);
    p.appendChild(span);

    p.appendChild(text);
    li.appendChild(p);
    chatMessages.appendChild(li);

    chatText.value = '';
};




/**
 * Scroll chat to bottom if user sends chat or user is at the bottom of chat
 */
setInterval(function() {
    // allow 1px inaccuracy by adding 1
    const isScrolledToBottom = chatbox.scrollHeight - chatbox.clientHeight <= chatbox.scrollTop + 1;

    // scroll to bottom if isScrolledToBottom is true
    if (isScrolledToBottom || sent) {
        chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
        sent = false;
    }
}, 500);



chatSend.addEventListener('click', () => {
    if(chatText.value !== '') {
        sent = true;
        //addChat(chatText.value);
        socket.emit('chatSend', chatText.value); //JSON parse?
    }
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(chatText.value !== '') {
        sent = true;
        //addChat(chatText.value);
        socket.emit('chatSend', chatText.value); //JSON parse?
    }
});


socket.on('chatReceive',(chat) => {
    addChat(chat); // JSON parse ??
});

const users = document.getElementById('userCounter');
let usersCount = 1;

socket.on('userAdd', () => {
    usersCount += 1;

    users.innerHTML = 'People: ' + usersCount.toString();
});