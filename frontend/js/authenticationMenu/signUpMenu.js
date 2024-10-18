class signUpMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
        <h1 id="signUpMenuTitle" class="menusTitle">Sign Up</h1>
        <input id="usernameInput" class="inputLambda" type="text" placeholder="Username">
        <input id="passwordInput" class="inputLambda" type="password" placeholder="Password">
        <input id="secondPasswordInput" class="inputLambda" type="password" placeholder="Confirm password">
        <button id="signUpButton" style="margin-top: 1vh;"class="hoverLambda">Sign Up</button>
        <button id="fortytwoButton" style="margin-top: 3vh;width: 10%; height: 10%;"class="hoverLambda buttonLambda">42 intra</button>
        <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        this.querySelector('#signUpButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#signUpButton').addEventListener('click', () => {
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
        const signUpMenu = document.getElementById('dynamicContent');
        signUpMenu.innerHTML = '';
        const signUpMenuComponent = document.createElement('sign-up-menu');
        signUpMenu.appendChild(signUpMenuComponent);
    }
}

customElements.define('sign-up-menu', signUpMenu);