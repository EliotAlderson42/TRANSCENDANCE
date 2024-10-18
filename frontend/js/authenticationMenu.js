class authenticationMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="authenticationMenuTitle" class="menusTitle">Authentication</h1>
            <button id="signInButton" class="hoverLambda buttonLambda">Log In</button>
            <button id="signUpButton" class="hoverLambda buttonLambda">Sign Up</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;
        
        this.querySelector('#signInButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#signInButton').addEventListener('click', () => {
            playAudio('clickIn');
            logInMenu.show();
        });

        this.querySelector('#signUpButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#signUpButton').addEventListener('click', () => {
            playAudio('clickIn');
            signUpMenu.show();
        });

        this.querySelector('#backButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#backButton').addEventListener('click', () => {
            playAudio('clickOut');
            mainMenu();
        });
    }

    static show() {
        const authenticationMenu = document.getElementById('dynamicContent');
        authenticationMenu.innerHTML = '';
        const authenticationMenuComponent = document.createElement('authentication-menu');
        authenticationMenu.appendChild(authenticationMenuComponent);
    }
}

customElements.define('authentication-menu', authenticationMenu);