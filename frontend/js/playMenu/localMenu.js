class localMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="localMenuTitle" class="menusTitle">Local</h1>
            <button id="duelButton" class="hoverLambda buttonLambda">Duel</button>
            <button id="tournamentButton" class="hoverLambda buttonLambda">Tournament</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        this.querySelector('#duelButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#duelButton').addEventListener('click', () => {
            playAudio('clickIn');
            duelMenu.show();
        });

        this.querySelector('#tournamentButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#tournamentButton').addEventListener('click', () => {
            playAudio('clickIn');
            tournamentMenu.show();
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            playMenu.show();
        });
    }

    static show() {
        const localMenu = document.getElementById('dynamicContent');
        localMenu.innerHTML = '';
        const localMenuComponent = document.createElement('local-menu');
        localMenu.appendChild(localMenuComponent);
    }
}

customElements.define('local-menu', localMenu);