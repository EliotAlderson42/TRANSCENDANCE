
function displayMenu(){
    const displayMenu = newWindowGrid();
    displayMenu.classList.add('displayMenu-container');

    updateMenuDimensions();
    const title = document.createElement('div');
    title.id = 'displayMenuTitle';
    title.textContent = 'Display';
    title.classList.add('displayMenu-title');

    const backButton = document.createElement('button');
    backButton.id = 'displayBackButton';
    backButton.textContent = 'Back';
    backButton.classList.add('hoverLambda');
    backButton.classList.add('displayMenu-backButton');
    backButton.addEventListener('click', () => {
        playAudio('clickOut');
        document.body.removeChild(displayMenu);
    });
    backButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    const textToSpeechButton = document.createElement('button');
    textToSpeechButton.id = 'textToSpeechButton';
    textToSpeechButton.textContent = '';
    textToSpeechButton.style.backgroundColor = 'white';
    textToSpeechButton.classList.add('hoverLambda');
    textToSpeechButton.classList.add('displayMenu-textToSpeechButton');
    textToSpeechButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    textToSpeechButton.addEventListener('click', () => {
        playAudio('clickIn');
        textToSpeechButton.style.backgroundColor = textToSpeechButton.style.backgroundColor === 'white' ? textToSpeechButton.style.backgroundColor = 'green' : textToSpeechButton.style.backgroundColor = 'white';
        toggleTextToSpeech();
    });

    const textToSpeech = document.createElement('div');
    textToSpeech.id = 'textToSpeech';
    textToSpeech.textContent = 'Text To Speech';
    textToSpeech.classList.add('displayMenu-textToSpeechText');


    const highContrastButton = document.createElement('button');
    highContrastButton.id = 'highContrastButton';
    highContrastButton.textContent = '';
    highContrastButton.style.backgroundColor = 'white';
    highContrastButton.classList.add('hoverLambda');
    highContrastButton.classList.add('displayMenu-highContrastButton');
    highContrastButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    highContrastButton.addEventListener('click', () => {
        playAudio('clickIn');
        highContrastButton.style.backgroundColor = highContrastButton.style.backgroundColor === 'white' ? highContrastButton.style.backgroundColor = 'green' : highContrastButton.style.backgroundColor = 'white';
        toggleHighContrast();
    });

    const highContrast = document.createElement('div');
    highContrast.id = 'highContrast';
    highContrast.textContent = 'High Contrast';
    highContrast.classList.add('displayMenu-highContrastText');


    const smallTextButton = document.createElement('button');
    smallTextButton.id = 'smallTextButton';
    smallTextButton.textContent = 'S';
    smallTextButton.classList.add('hoverLambda');
    smallTextButton.classList.add('displayMenu-smallTextButton');
    smallTextButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    smallTextButton.addEventListener('click', () => {
        playAudio('clickIn');
        textSize('small');
    });

    const mediumTextButton = document.createElement('button');
    mediumTextButton.id = 'mediumTextButton';
    mediumTextButton.textContent = 'M';
    mediumTextButton.classList.add('hoverLambda');
    mediumTextButton.classList.add('displayMenu-mediumTextButton');
    mediumTextButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    mediumTextButton.addEventListener('click', () => {
        playAudio('clickIn');
        textSize('medium');
    });

    const largeTextButton = document.createElement('button');
    largeTextButton.id = 'largeTextButton';
    largeTextButton.textContent = 'L';
    largeTextButton.classList.add('hoverLambda');
    largeTextButton.classList.add('displayMenu-largeTextButton');
    largeTextButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    largeTextButton.addEventListener('click', () => {
        playAudio('clickIn');
        textSize('large');
    });

    const textSize = document.createElement('div');
    textSize.id = 'textSize';
    textSize.textContent = 'Text Size';
    textSize.classList.add('displayMenu-textSize');

    const englishButton = document.createElement('button');
    englishButton.id = 'englishButton';
    englishButton.textContent = 'EN';
    englishButton.classList.add('hoverLambda');
    englishButton.classList.add('displayMenu-englishButton');
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
    frenchButton.classList.add('displayMenu-frenchButton');
    frenchButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    frenchButton.addEventListener('click', () => {
        playAudio('clickIn');
        switchLanguage('fr');
    });

    const language = document.createElement('div');
    language.id = 'languageText';
    language.textContent = 'Language';
    language.classList.add('displayMenu-language');

    displayMenu.appendChild(language);
    displayMenu.appendChild(englishButton);
    displayMenu.appendChild(frenchButton);
    displayMenu.appendChild(textToSpeech);
    displayMenu.appendChild(highContrast);
    displayMenu.appendChild(textSize);
    displayMenu.appendChild(textToSpeechButton);
    displayMenu.appendChild(highContrastButton);
    displayMenu.appendChild(smallTextButton);
    displayMenu.appendChild(mediumTextButton);
    displayMenu.appendChild(largeTextButton);
    displayMenu.appendChild(backButton);
    displayMenu.appendChild(title);
    displayMenu.appendChild(displayMenuTitle);
}
