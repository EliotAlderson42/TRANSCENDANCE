class audioMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="audioMenuTitle" class="menusTitle">Audio</h1>
            <div id="ambientText" class="audioMenu-Text">Ambient volume</div>
            <input id="ambientSlider" class="audioMenu-VolumeSlider" type="range"></input>
            <div id="soundText" class="audioMenu-Text">Sound volume</div>
            <input id="soundSlider" class="audioMenu-VolumeSlider" type="range"></input>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        this.querySelector('#ambientSlider').addEventListener('input', () => {
                const volume = ambientSlider.value / 100;
                document.getElementById('backgroundAudio').volume = volume;
            });

        this.querySelector('#soundSlider').addEventListener('input', () => {
            playAudio('clickIn');
            const soundVolume = this.querySelector('#soundSlider').value / 100;
            document.getElementById('hoverSound').volume = soundVolume;
            document.getElementById('clickIn').volume = soundVolume;
            document.getElementById('clickOut').volume = soundVolume;
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

customElements.define('audio-menu', audioMenu);