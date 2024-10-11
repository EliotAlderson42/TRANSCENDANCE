function gameMenu() {
    const gameMenu = document.getElementById('dynamicContent');
    configureContainer(gameMenu);

    const title = document.createElement('div');
    title.id = 'gameMenuTitle';
    title.textContent = 'Game';
    title.classList.add('menusTitle');

    const backButton = document.createElement('button');
    backButton.id = 'gameBackButton';
    backButton.textContent = 'Back';
    backButton.classList.add('hoverLambda');
    backButton.classList.add('backButtons');
    backButton.addEventListener('click', () => {
        playAudio('clickOut');
        settingsMenu();
    });
    backButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    gameMenu.appendChild(title);
    gameMenu.appendChild(backButton);
}