function settingsMenu() {
const settingsMenu = document.getElementById('dynamicContent');
configureContainer(settingsMenu);
settingsMenu.classList.add('settingsMenu-container');
// const authenticationButton = document.createElement('button');
updateMenuDimensions();

const title = document.createElement('div');
title.id = 'settingsMenuTitle';
title.textContent = 'Settings';
title.classList.add('menusTitle');

const gameButton = document.createElement('button');
gameButton.id = 'gameButton';
gameButton.textContent = 'Game';
gameButton.classList.add('hoverLambda');
gameButton.classList.add('buttonLambda');
gameButton.addEventListener('mouseover', () => {
    hoverSound.play();
});
gameButton.addEventListener('click', function() {
    playAudio('clickIn');
    gameMenu();
});

const accountButton = document.createElement('button');
accountButton.id = 'accountButton';
accountButton.textContent = 'Account';
accountButton.classList.add('hoverLambda');
accountButton.classList.add('buttonLambda');
accountButton.addEventListener('mouseover', () => {
    hoverSound.play();
});
accountButton.addEventListener('click', function() {
    playAudio('clickIn');
    accountMenu();
});

const displayButton = document.createElement('button');
displayButton.id = 'displayButton';
displayButton.textContent = 'Display';
displayButton.classList.add('hoverLambda');
displayButton.classList.add('buttonLambda');
displayButton.addEventListener('mouseover', () => {
    hoverSound.play();
});
displayButton.addEventListener('click', function() {
    playAudio('clickIn');
    displayMenu();
});


const audioButton = document.createElement('button');
audioButton.id = 'audioButton';
audioButton.textContent = 'Audio';
audioButton.classList.add('hoverLambda');
audioButton.classList.add('buttonLambda');
audioButton.addEventListener('mouseover', () => {
    hoverSound.play();
});
audioButton.addEventListener('click', function() {
    playAudio('clickIn');
    audioMenu();
});

const backButton = document.createElement('button');
backButton.id = 'settingsBackButton';
backButton.textContent = 'Back';
backButton.classList.add('hoverLambda');
backButton.classList.add('backButtons');
backButton.addEventListener('mouseover', () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
});
backButton.addEventListener('click', function() {
    playAudio('clickOut');
    // document.body.removeChild(settingsMenu);
    mainMenu();
});
settingsMenu.appendChild(title);

settingsMenu.appendChild(accountButton);
settingsMenu.appendChild(gameButton);
settingsMenu.appendChild(displayButton);
settingsMenu.appendChild(audioButton);
settingsMenu.appendChild(backButton);
}
