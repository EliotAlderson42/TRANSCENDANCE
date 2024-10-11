function statsMenu() {
    const statsMenu = document.getElementById('dynamicContent');
    configureContainer(statsMenu);

    const title = document.createElement('div');
    title.id = 'statsMenuTitle';
    title.textContent = 'Stats';
    title.classList.add('menusTitle');

    const backButton = document.createElement('button');
    backButton.id = 'statsBackButton';
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

    statsMenu.appendChild(title);
    statsMenu.appendChild(backButton);
}