class settingsMenu extends HTMLElement {
    constructor() {
        super();
    }

     async connectedCallback() {
        const user = window.userStatusManager?.getUser();
        if (!user) {
            mainMenu.show();
            return;
        }
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="settingsMenuTitle" class="menusTitle">Settings</h1>
            ${user ? `<button id="accountButton" class="hoverLambda buttonLambda">Account</button>` : ''}
            <button id="languageButton" class="hoverLambda buttonLambda">Language</button>
            <button id="audioButton" class="hoverLambda buttonLambda">Audio</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        // Setup des event listeners seulement si le bouton existe (utilisateur connecté)
        const accountButton = this.querySelector('#accountButton');
        if (accountButton) {
            accountButton.addEventListener('mouseover', () => hoverSound.play());
            accountButton.addEventListener('click', () => {
                playAudio('clickIn');
                accountMenu.show();
            });
        }
        
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

    static async show() {
        const settingsMenu = document.getElementById('dynamicContent');
        settingsMenu.innerHTML = '';
        const settingsMenuComponent = document.createElement('settings-menu');
        settingsMenu.appendChild(settingsMenuComponent);
    }
}

customElements.define('settings-menu', settingsMenu);