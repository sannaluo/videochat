$(document).foundation();

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