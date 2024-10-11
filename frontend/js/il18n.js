// i18n.js
import i18next from 'i18next';

i18next.init({
    lng: 'en', // Langue par défaut
    resources: {
        en: {
            translation: {
                playButton: 'Play',
                settingsButton: 'Settings',
                LanguageButton: 'Language',
                settingsBackButton: 'Back',
                LanguageBackButton: 'Back',
                pongButton: 'Pong',
                audioButton: 'Audio',
                settingsMenuTitle: 'Settings',
                LanguageMenuTitle: 'Language',
                audioMenuTitle: 'Audio',
                languageButton: 'Language'
            }
        },
        fr: {
            translation: {
                playButton: 'Jouer',
                settingsButton: 'Paramètres',
                LanguageButton: 'Langue',
                settingsBackButton: 'Retour',
                LanguageBackButton: 'Retour',
                pongButton: 'Pongue',
                audioButton: 'Audio',
                settingsMenuTitle: 'Paramètres',
                LanguageMenuTitle: 'Langue',
                audioMenuTitle: 'Audio',
                languageButton: 'Langue'
            }
        }
    }
});

export default i18next;