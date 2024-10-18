class logInMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="logInMenuTitle" class="menusTitle">Log in</h1>
            <input id="usernameInput" class="inputLambda" type="text" placeholder="Username">
            <input id="passwordInput" class="inputLambda" type="password" placeholder="Password">
            <button id="logInButton" style="margin-top: 1vh;"class="hoverLambda">Log In</button>
            <button id="fortytwoButton" style="margin-top: 3vh;width: 10%; height: 10%;"class="hoverLambda buttonLambda">42 intra</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        this.querySelector('#logInButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#logInButton').addEventListener('click', () => {
            playAudio('clickIn');
        });

        this.querySelector('#fortytwoButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#fortytwoButton').addEventListener('click', () => {
            playAudio('clickIn');
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            authenticationMenu.show();
        });
    }

    static show() {
        const logInMenu = document.getElementById('dynamicContent');
        logInMenu.innerHTML = '';
        const logInMenuComponent = document.createElement('log-in-menu');
        logInMenu.appendChild(logInMenuComponent);
    }
}

customElements.define('log-in-menu', logInMenu);