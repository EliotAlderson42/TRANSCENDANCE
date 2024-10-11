function historyMenu() {
    const historyMenu = document.getElementById('dynamicContent');
    configureContainer(historyMenu);

    const title = document.createElement('div');
    title.id = 'historyMenuTitle';
    title.textContent = 'History';
    title.classList.add('menusTitle');

    const backButton = document.createElement('button');
    backButton.id = 'historyBackButton';
    backButton.textContent = 'Back';
    backButton.classList.add('hoverLambda');
    backButton.classList.add('backButtons');
    backButton.addEventListener('click', () => {
        playAudio('clickOut');
        accountMenu();
    });
    backButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    historyMenu.appendChild(title);
    historyMenu.appendChild(backButton);
}