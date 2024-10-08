function gameMenu() {
    const gameMenu = newWindowGrid();
    gameMenu.classList.add('gameMenu-container');
    updateMenuDimensions();

    const title = document.createElement('div');
    title.id = 'gameMenuTitle';
    title.textContent = 'Game';
    title.classList.add('gameMenu-title');

    const backButton = document.createElement('button');
    backButton.id = 'gameBackButton';
    backButton.textContent = 'Back';
    backButton.classList.add('hoverLambda');
    backButton.classList.add('gameMenu-backButton');
    backButton.addEventListener('click', () => {
        playAudio('clickOut');
        document.body.removeChild(gameMenu);
    });
    backButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    gameMenu.appendChild(title);
    gameMenu.appendChild(backButton);
}