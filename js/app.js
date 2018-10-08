$(document).foundation()
// const remoteVideo = document.getElementById('remoteVideo');

const callersContainer = document.querySelector('#callers');
const addCallerBtn = document.querySelector('#addVideo');



const arrangeGrid = () => {

    console.log(document.querySelectorAll('#callers .cell'));


    if (document.querySelectorAll('#callers .cell').length < 3) {
        callersContainer.className = 'grid-x grid-padding-x grid-padding-y small-up-1 align-center-middle fullHeight';

        for (let i of document.querySelectorAll('#callers .cell')) {
            i.style.height = '50%';
        }


    } else if (document.querySelectorAll('#callers .cell').length < 5) {
        callersContainer.className = 'grid-x grid-padding-x grid-padding-y small-up-2 align-center-middle fullHeight';

        for (let i of document.querySelectorAll('#callers .cell')) {
            i.style.height = '50%';
        }


    } else if (document.querySelectorAll('#callers .cell').length < 9) {
        callersContainer.className = 'grid-x grid-padding-x grid-padding-y small-up-4 align-center-middle fullHeight';

        for (let i of document.querySelectorAll('#callers .cell')) {
            i.style.height = '50%';
        }


    } else if (document.querySelectorAll('#callers .cell').length < 13) {
        callersContainer.className = 'grid-x grid-padding-x grid-padding-y small-up-4 align-center-middle fullHeight';


        for (let i of document.querySelectorAll('#callers .cell')) {
            i.style.height = '33.3%';
        }
    } else {
        $('#addVideoContainer').remove();

        for (let i of document.querySelectorAll('#callers .cell')) {
            i.style.height = '33.3%';
        }

    }

};

arrangeGrid();


/* Sannan alue! */

/*
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
/*
const colourArray = ['rgb(0,176,240)','rgb(255,63,168)', 'rgb(254,221,26)', 'rgb(134,53,243)', 'rgb(14,226,216)', 'rgb(134,102,88)',
    'rgb(75,200,46)', 'rgb(240,166,0)', 'rgb(128,128,128)', 'rgb(52,90,254)', 'rgb(217,23,23)', 'rgb(219,154,230)', 'rgb(200,234,30)',
    'rgb(0,176,117)', 'rgb(229,109,109)', 'rgb(71,117,37)'];

*/
/**
 * names used in chat member names
 * @type {string[]}
 */
/*
const nameArray = ['car', 'face wash', 'air freshener', 'blouse', 'purse', 'rug', 'shoes', 'headphones', 'wallet', 'tweezers',
    'charger', 'glasses', 'eraser', 'beef', 'house', 'lace', 'cinder block', 'sticky note', 'couch', 'clay pot', 'grid paper',
    'water bottle', 'keyboard', 'thermometer', 'conditioner', 'table', 'fridge', 'toothbrush', 'knife', 'fork', 'camera',
    'glow stick', 'keys', 'drill press', 'credit card', 'playing card', 'shovel', 'milk', 'bow', 'hair brush', 'ring', 'soap', 'nail file',
    'tree', 'tv', 'video games', 'zipper', 'toilet', 'bookmark', 'shawl'];

let usedArray = [];
let usedArray2 = [];
*/

/**
 * Get a random item from list
 * @returns {number}
 */
/*
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
*/

/**
 * Get random colour from list that doesn't exist yet. If all colours are used, use all colours again.
 * @returns {string}
 */
/*
const getName = (amount, array, used) => {
    const ran = getRandom(amount, array, used);
    const col = array[ran];

    if(!col) {
        console.log('er');
    }
    return col;
};
*/

/**
 *
 * @param string
 * @returns {string}
 */
/*
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
*/

/**
 * Test for colours and names
 */
/*
window.onload = () => {
    for (let i = 0; i < 20; i++) {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const name = capitalizeFirstLetter(getName(50, nameArray, usedArray2));
        const typer = name + ': ';
        const text2 = document.createTextNode(typer);
        const span = document.createElement('span');
        span.style.color = getName(16, colourArray, usedArray);
        span.appendChild(text2);
        p.appendChild(span);
        li.appendChild(p);
        chatMessages.appendChild(li);
    }
};


const user = capitalizeFirstLetter(getName(50, nameArray, usedArray2));
const color = getName(16, colourArray, usedArray);
*/

/**
 * add list item in chatbox
 * @param typed
 */
/*
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

chatSend.addEventListener('click', () => {
    if(chatText.value !== '') {
        sent = true;
        addChat(chatText.value);
    }
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(chatText.value !== '') {
        sent = true;
        addChat(chatText.value);
    }
});
*/

/**
 * Scroll chat to bottom if user sends chat or user is at the bottom of chat
 */
/*
setInterval(function() {
    // allow 1px inaccuracy by adding 1
    const isScrolledToBottom = chatbox.scrollHeight - chatbox.clientHeight <= chatbox.scrollTop + 1;
    //  console.log(isScrolledToBottom);
    // scroll to bottom if isScrolledToBottom is true
    if (isScrolledToBottom || sent) {
        chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
        sent = false;
    }
}, 500);

*/