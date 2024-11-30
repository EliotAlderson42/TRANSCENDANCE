class settingsMenu extends HTMLElement{
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
        <div id = "dynamicContent">
        <h1 id="settingsMenuTitle" class="menusTitle">Settings</h1>
        <button id="accountButton" class="hoverLambda buttonLambda">Account</button>
        <button id="languageButton" class="hoverLambda buttonLambda">Language</button>
        <button id="audioButton" class="hoverLambda buttonLambda">Audio</button>
        <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;
        
        this.querySelector('#accountButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#accountButton').addEventListener('click', () => {
            playAudio('clickIn');
            accountMenu.show();
        });
        
        this.querySelector('#languageButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#languageButton').addEventListener('click', () => {
            playAudio('clickIn');
            languageMenu.show();
        });

        this.querySelector('#audioButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#audioButton').addEventListener('click', () => {
            playAudio('clickIn');
            audioMenu.show();
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            mainMenu.show();
        });
    }
    static show() {
        const settingsMenu = document.getElementById('dynamicContent');
        settingsMenu.innerHTML = '';
        const settingsMenuComponent = document.createElement('settings-menu');
        settingsMenu.appendChild(settingsMenuComponent);
    }
}

customElements.define('settings-menu', settingsMenu);