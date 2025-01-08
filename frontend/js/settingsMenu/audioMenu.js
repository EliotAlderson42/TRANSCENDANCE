class audioMenu extends HTMLElement {
    constructor() {
        super();
    }

    // Ajouter des méthodes pour gérer le stockage
    saveAudioSettings(ambientVolume, soundVolume) {
        const settings = {
            ambient: ambientVolume,
            sound: soundVolume
        };
        localStorage.setItem('audioSettings', JSON.stringify(settings));
    }

    loadAudioSettings() {
        const settings = localStorage.getItem('audioSettings');
        if (settings) {
            return JSON.parse(settings);
        }
        return { ambient: 100, sound: 100 }; // Valeurs par défaut
    }

    applyAudioSettings(settings) {
        // Appliquer les volumes aux éléments audio
        document.getElementById('backgroundAudio').volume = settings.ambient / 100;
        document.getElementById('hoverSound').volume = settings.sound / 100;
        document.getElementById('clickIn').volume = settings.sound / 100;
        document.getElementById('clickOut').volume = settings.sound / 100;

        // Mettre à jour les sliders
        this.querySelector('#ambientSlider').value = settings.ambient;
        this.querySelector('#soundSlider').value = settings.sound;
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="audioMenuTitle" class="menusTitle">Audio</h1>
            <div id="ambientText" class="audioMenu-Text">Ambient volume</div>
            <input id="ambientSlider" class="audioMenu-VolumeSlider" type="range" min="0" max="100" value="100"></input>
            <div id="soundText" class="audioMenu-Text">Sound volume</div>
            <input id="soundSlider" class="audioMenu-VolumeSlider" type="range" min="0" max="100" value="100"></input>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        // Charger et appliquer les paramètres sauvegardés
        const savedSettings = this.loadAudioSettings();
        this.applyAudioSettings(savedSettings);

        // Event listeners avec sauvegarde
        this.querySelector('#ambientSlider').addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            document.getElementById('backgroundAudio').volume = volume;
            this.saveAudioSettings(e.target.value, this.querySelector('#soundSlider').value);
        });

        this.querySelector('#soundSlider').addEventListener('input', (e) => {
            playAudio('clickIn');
            const soundVolume = e.target.value / 100;
            document.getElementById('hoverSound').volume = soundVolume;
            document.getElementById('clickIn').volume = soundVolume;
            document.getElementById('clickOut').volume = soundVolume;
            this.saveAudioSettings(this.querySelector('#ambientSlider').value, e.target.value);
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            settingsMenu.show();
        });
    }

    static show() {
        const audioMenu = document.getElementById('dynamicContent');
        audioMenu.innerHTML = '';
        const audioMenuComponent = document.createElement('audio-menu');
        audioMenu.appendChild(audioMenuComponent);
    }
}

// Charger les paramètres au démarrage de l'application
document.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('audioSettings') || '{"ambient": 100, "sound": 100}');
    document.getElementById('backgroundAudio').volume = settings.ambient / 100;
    document.getElementById('hoverSound').volume = settings.sound / 100;
    document.getElementById('clickIn').volume = settings.sound / 100;
    document.getElementById('clickOut').volume = settings.sound / 100;
});

customElements.define('audio-menu', audioMenu);