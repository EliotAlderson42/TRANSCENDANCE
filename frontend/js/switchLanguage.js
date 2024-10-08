function switchLanguage(language){

    const playButton = document.getElementById('playButton');
    const settingsButton = document.getElementById('settingsButton');
    const displayButton = document.getElementById('displayButton');
    const audioButton = document.getElementById('audioButton');
    const settingsBackButton = document.getElementById('settingsBackButton');
    const displayBackButton = document.getElementById('displayBackButton');
    const audioBackButton = document.getElementById('audioBackButton');
    const settingsMenuTitle = document.getElementById('settingsMenuTitle');
    const displayMenuTitle = document.getElementById('displayMenuTitle');
    const audioMenuTitle = document.getElementById('audioMenuTitle');
    const languageButton = document.getElementById('language');
    const pongButton = document.getElementById('pongButton');
    const frenchButton = document.getElementById('frenchButton');
    const languageText = document.getElementById('languageText');
    const textSize = document.getElementById('textSize');
    const textToSpeech = document.getElementById('textToSpeech');
    const highContrast = document.getElementById('highContrast');

    if (language === 'en'){
        playButton.textContent = 'Play';
        settingsButton.textContent = 'Settings';
        displayButton.textContent = 'Display';
        audioButton.textContent = 'Audio';
        settingsBackButton.textContent = 'Back';
        displayBackButton.textContent = 'Back';
        pongButton.textContent = 'Pong';
        // audioBackButton.textContent = 'Back';
        settingsMenuTitle.textContent = 'Settings';
        displayMenuTitle.textContent = 'Display';
        languageText.textContent = 'Language';
        languageText.style.transform = 'translateX(-5px)';
        textSize.textContent = 'Text Size';
        textToSpeech.textContent = 'Text To Speech';
        highContrast.textContent = 'High Contrast';

    } else if (language === 'fr'){
        playButton.textContent = 'Jouer';
        settingsButton.textContent = 'Paramètres';
        displayButton.textContent = 'Affichage';
        audioButton.textContent = 'Audio';
        settingsBackButton.textContent = 'Retour';
        displayBackButton.textContent = 'Retour';
        pongButton.textContent = 'Pongue';
        // audioBackButton.textContent = 'Retour';
        settingsMenuTitle.textContent = 'Paramètres';
        displayMenuTitle.textContent = 'Affichage';
        languageText.textContent = 'Langue';
        languageText.style.transform = 'translateX(35px)';
        textSize.textContent = 'Taille du texte';
        textToSpeech.textContent = 'Système texte-parole';
        highContrast.textContent = 'Contraste élevé';
        highContrast.style.transform = 'translateX(20px)';
    }
}
