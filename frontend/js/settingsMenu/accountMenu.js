function accountMenu() {
    const accountMenu = document.getElementById('dynamicContent');
    configureContainer(accountMenu);    

    const title = document.createElement('div');
    title.id = 'accountMenuTitle';
    title.textContent = 'Account';
    title.classList.add('menusTitle');

    const manageButton = document.createElement('button');
    manageButton.id = 'manageButton';
    manageButton.classList.add('buttonLambda');
    manageButton.textContent = 'Account settings';
    manageButton.addEventListener('click', () => {
        playAudio('clickIn');
        accountSettingsMenu();
    });
    manageButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    const historyButton = document.createElement('button');
    historyButton.id = 'historyButton';
    historyButton.classList.add('buttonLambda');
    historyButton.textContent = 'History';
    historyButton.addEventListener('click', () => {
        playAudio('clickIn');
        historyMenu();
    });
    historyButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    const statsButton = document.createElement('button');
    statsButton.id = 'statsButton';
    statsButton.classList.add('buttonLambda')
    statsButton.textContent = 'Stats';
    statsButton.addEventListener('click', () => {
        playAudio('clickIn');
        statsMenu();
    });
    statsButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    const backButton = document.createElement('button');
    backButton.id = 'accountBackButton';
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

    accountMenu.appendChild(title);
    accountMenu.appendChild(manageButton);
    accountMenu.appendChild(historyButton);
    accountMenu.appendChild(statsButton);
    accountMenu.appendChild(backButton);
}