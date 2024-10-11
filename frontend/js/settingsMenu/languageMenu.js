
function languageMenu(){
    const languageMenu = document.getElementById('dynamicContent');
    configureContainer(languageMenu);

    const title = document.createElement('div');
    title.id = 'languageMenuTitle';
    title.textContent = 'Language';
    title.classList.add('menusTitle');

    
    const englishButton = document.createElement('button');
    englishButton.id = 'englishButton';
    englishButton.textContent = 'EN';
    englishButton.classList.add('hoverLambda');
    englishButton.classList.add('buttonLambda');
    englishButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    englishButton.addEventListener('click', () => {
        playAudio('clickIn');
        switchLanguage('en');
    });
    
    const frenchButton = document.createElement('button');
    frenchButton.id = 'frenchButton';
    frenchButton.textContent = 'FR';
    frenchButton.classList.add('hoverLambda');
    frenchButton.classList.add('buttonLambda');
    frenchButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    frenchButton.addEventListener('click', () => {
        playAudio('clickIn');
        switchLanguage('fr');
    });

    const spanishButton = document.createElement('button');
    spanishButton.id = 'spanishButton';
    spanishButton.textContent = 'ES';
    spanishButton.classList.add('hoverLambda');
    spanishButton.classList.add('buttonLambda');
    spanishButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    spanishButton.addEventListener('click', () => {
        playAudio('clickIn');
        switchLanguage('es');
    });

    const backButton = document.createElement('button');
    backButton.id = 'languageBackButton';
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

    languageMenu.appendChild(title);
    languageMenu.appendChild(englishButton);
    languageMenu.appendChild(frenchButton);
    languageMenu.appendChild(spanishButton);
    languageMenu.appendChild(backButton);
}
