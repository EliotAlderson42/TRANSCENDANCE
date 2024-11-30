class playMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="playMenuTitle" class="menusTitle">Play</h1>
            <button id="localButton" class="hoverLambda buttonLambda">Local</button>
            <button id="onlineButton" class="hoverLambda buttonLambda">Online</button>
            <button id="friendsButton" class="hoverLambda buttonLambda">Friends</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        this.querySelector('#localButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#localButton').addEventListener('click', () => {
            playAudio('clickIn');
            localMenu.show();
        });

        this.querySelector('#onlineButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#onlineButton').addEventListener('click', () => {
            playAudio('clickIn');
            onlineMenu.show();
        });

        this.querySelector('#friendsButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#friendsButton').addEventListener('click', () => {
            playAudio('clickIn');
            friendsMenu.show();
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            mainMenu.show();
        });
    }

    static show() {
        const playMenu = document.getElementById('dynamicContent');
        playMenu.innerHTML = '';
        const playMenuComponent = document.createElement('play-menu');
        playMenu.appendChild(playMenuComponent);
    }
}

customElements.define('play-menu', playMenu);