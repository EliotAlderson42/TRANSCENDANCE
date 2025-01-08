class languageMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="languageMenuTitle" class="menusTitle">Language</h1>
            <button id="englishButton" class="hoverLambda buttonLambda">EN</button>
            <button id="frenchButton" class="hoverLambda buttonLambda">FR</button>
            <button id="spanishButton" class="hoverLambda buttonLambda">ES</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        this.querySelector('#englishButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#englishButton').addEventListener('click', () => {
            playAudio('clickIn');
            //language = 'english';
        });

        this.querySelector('#frenchButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#frenchButton').addEventListener('click', () => {
            playAudio('clickIn');
            //language = 'french';
        });

        this.querySelector('#spanishButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#spanishButton').addEventListener('click', () => {
            playAudio('clickIn');
            //language = 'spanish';
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            settingsMenu.show();
        });
}


    static show() {
        const languageMenu = document.getElementById('dynamicContent');
        languageMenu.innerHTML = '';
        const languageMenuComponent = document.createElement('language-menu');
        languageMenu.appendChild(languageMenuComponent);
    }
}

customElements.define('language-menu', languageMenu);