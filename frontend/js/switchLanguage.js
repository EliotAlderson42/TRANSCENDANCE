import i18next from './i18n';

function switchLanguage(language) {
    i18next.changeLanguage(language, () => {
        const elements = {
            playButton: 'playButton',
            settingsButton: 'settingsButton',
            LanguageButton: 'LanguageButton',
            audioButton: 'audioButton',
            settingsBackButton: 'settingsBackButton',
            LanguageBackButton: 'LanguageBackButton',
            audioBackButton: 'audioBackButton',
            settingsMenuTitle: 'settingsMenuTitle',
            LanguageMenuTitle: 'LanguageMenuTitle',
            audioMenuTitle: 'audioMenuTitle',
            languageButton: 'language',
            pongButton: 'pongButton'
        };

        for (const [key, id] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = i18next.t(key);
            }
        }
    });
}

export default switchLanguage;