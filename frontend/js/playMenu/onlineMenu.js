class onlineMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="onlineMenuTitle" class="menusTitle">Online</h1>
            <button id="roomsButton" class="hoverLambda buttonLambda">Rooms</button>
            <button id="hostDuelButton" class="hoverLambda buttonLambda">Host Duel</button>
            <button id="hostTournamentButton" class="hoverLambda buttonLambda">Host Tournament</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        this.querySelector('#roomsButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#roomsButton').addEventListener('click', () => {
            playAudio('clickIn');
            roomsMenu.show();
        });

        this.querySelector('#hostDuelButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#hostDuelButton').addEventListener('click', () => {
            playAudio('clickIn');
            hostDuelMenu.show();
        });

        this.querySelector('#hostTournamentButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#hostTournamentButton').addEventListener('click', () => {
            playAudio('clickIn');
            hostTournamentMenu.show();
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            playMenu.show();
        });
    }

    static show() {
        const onlineMenu = document.getElementById('dynamicContent');
        onlineMenu.innerHTML = '';
        const onlineMenuComponent = document.createElement('online-menu');
        onlineMenu.appendChild(onlineMenuComponent);
    }
}

customElements.define('online-menu', onlineMenu);