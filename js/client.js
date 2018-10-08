'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;

var pcConfig = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }]
};

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

var room = 'foo';
// Could prompt for room name:
// room = prompt('Enter room name:');

var socket = io.connect();

if (room !== '') {
    socket.emit('create or join', room);
    console.log('Attempted to create or  join room', room);
}

socket.on('created', function(room) {
    console.log('Created room ' + room);
    isInitiator = true;
});

socket.on('full', function(room) {
    console.log('Room ' + room + ' is full');
});

socket.on('join', function (room){
    console.log('Another peer made a request to join room ' + room);
    console.log('This peer is the initiator of room ' + room + '!');
    isChannelReady = true;
});

socket.on('joined', function(room) {
    console.log('joined: ' + room);
    isChannelReady = true;
});

socket.on('log', function(array) {
    console.log.apply(console, array);
});

function sendMessage(message) {
    console.log('Client sending message: ', message);
    socket.emit('message', message);
}

// This client receives a message
socket.on('message', function(message) {
    console.log('Client received message:', message);
    if (message === 'got user media') {
        maybeStart();
    } else if (message.type === 'offer') {
        if (!isInitiator && !isStarted) {
            maybeStart();
        }
        pc.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
    } else if (message.type === 'answer' && isStarted) {
        pc.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === 'candidate' && isStarted) {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        pc.addIceCandidate(candidate);
    } else if (message === 'bye' && isStarted) {
        handleRemoteHangup();
    }
});

var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');

$('#addVideo').click( function () {
    const addedVideo = '<div class="cell test align-self-stretch"><video id="localVideo" class="me" autoplay playsinline></video></div>';

    $('#addVideoContainer').before(addedVideo).remove();
    localVideo = document.querySelector('#localVideo');

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    }).then(gotStream).catch(function(e) {
            alert('getUserMedia() error: ' + e.name);
        });
    arrangeGrid();
});

function gotStream(stream) {
    console.log('Adding local stream.');
    localStream = stream;
    localVideo.srcObject = stream;
    sendMessage('got user media');
    if (isInitiator) {
        maybeStart();
    }
}

var constraints = {
    video: true
};

console.log('Getting user media with constraints', constraints);

if (location.hostname !== 'localhost') {
    requestTurn(
        'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
    );
}

function maybeStart() {
    console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
    if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
        console.log('>>>>>> creating peer connection');
        createPeerConnection();
        pc.addStream(localStream);
        isStarted = true;
        console.log('isInitiator', isInitiator);
        if (isInitiator) {
            doCall();
        }
    }
}

window.onbeforeunload = function() {
    sendMessage('bye');
};

function createPeerConnection() {
    try {
        pc = new RTCPeerConnection(null);
        pc.onicecandidate = handleIceCandidate;
        pc.onaddstream = handleRemoteStreamAdded;
        pc.onremovestream = handleRemoteStreamRemoved;
        console.log('Created RTCPeerConnnection');
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
}

function handleIceCandidate(event) {
    console.log('icecandidate event: ', event);
    if (event.candidate) {
        sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        console.log('End of candidates.');
    }
}

function handleCreateOfferError(event) {
    console.log('createOffer() error: ', event);
}

function doCall() {
    console.log('Sending offer to peer');
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

function doAnswer() {
    console.log('Sending answer to peer.');
    pc.createAnswer().then(
        setLocalAndSendMessage,
        onCreateSessionDescriptionError
    );
}

function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    sendMessage(sessionDescription);
}

function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
}

function requestTurn(turnURL) {
    var turnExists = false;
    for (var i in pcConfig.iceServers) {
        if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
            turnExists = true;
            turnReady = true;
            break;
        }
    }
    if (!turnExists) {
        console.log('Getting TURN server from ', turnURL);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var turnServer = JSON.parse(xhr.responseText);
                console.log('Got TURN server: ', turnServer);
                pcConfig.iceServers.push({
                    'urls': 'turn:' + turnServer.username + '@' + turnServer.turn,
                    'credential': turnServer.password
                });
                turnReady = true;
            }
        };
        xhr.open('GET', turnURL, true);
        xhr.send();
    }
}

function handleRemoteStreamAdded(event) {
    const addedVideo = '<div class="cell test align-self-stretch"><video id="remoteVideo" autoplay playsinline></video></div>';
    $('#callers').append(addedVideo);
    remoteVideo = document.querySelector('#remoteVideo');
    console.log('Remote stream added. append');
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
    arrangeGrid();
}

function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
}

function hangup() {
    console.log('Hanging up.');
    stop();
    sendMessage('bye');
}

function handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
    isInitiator = false;
}

function stop() {
    isStarted = false;
    pc.close();
    pc = null;
}

const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const chatText = document.getElementById('chatText');
const chatForm = document.getElementById('chatForm');
const chatbox = document.getElementById("chatbox");
let sent = false;

/**
 * add list item in chatbox
 * @param typed
 * @param user
 * @param color
 */
const addChat = (typed, user, color) => {
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
    const isScrolledToBottom = chatbox.scrollHeight - chatbox.clientHeight <= chatbox.scrollTop + 60;

    if (isScrolledToBottom || sent) {
        chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
        sent = false;
    }
}, 500);

chatSend.addEventListener('click', () => {
    if(chatText.value !== '') {
        sent = true;
        socket.emit('chatSend', chatText.value);
    }
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(chatText.value !== '') {
        sent = true;
        socket.emit('chatSend', chatText.value);
    }
});

socket.on('chatReceive',(chat) => {
    addChat(chat.chat, chat.user, chat.color);
});

const users = document.getElementById('userCounter');

socket.on('userAdd', (usersCount) => {
    users.innerHTML = '<img id="personicon" src="media/personicon.png">' + usersCount.toString();
});