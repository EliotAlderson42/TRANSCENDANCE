class accountMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="dynamicContent">
                <h1 id="accountMenuTitle" class="menusTitle" style="margin-top: 5vh;">Account settings</h1>
                <button id="upButton" class="hoverLambda accountMenu-upButton"></button>
                <img src="image/image.jpg" width="140" height="140" style="border: 3px solid white;" class="accountMenu-image">
                <button id="downButton" class="hoverLambda accountMenu-downButton"></button>
                <button id="uploadButton" class="hoverLambda accountMenu-uploadButton">upload</button>
                <div id="idText" class="accountMenu-text" style="margin-top: 2vh;">Id</div>
                <input id="idInput" class="accountMenu-input stealthButton" style="background-color: darkGrey;" readonly>
                <div id="idErrorMess" style="color: red; visibility: hidden;">42 IDs are not editable</div>
                <div id="passwordText" class="accountMenu-text">Password</div>
                <input id="passwordInput" class="accountMenu-input stealthButton" style="background-color: darkGrey;" readonly>
                <div id="passwordErrorMess" style="color: red; visibility: hidden;">42 Passwords are not editable</div>
                <div id="pseudoText" class="accountMenu-text">Nickname</div>
                <input id="pseudoInput" class="accountMenu-input">
                <button id="accountBackButton" class="hoverLambda backButtons">Back</button>
            </div>
        `;

        this.querySelector('#upButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#upButton').addEventListener('click', () => {
            playAudio('clickIn');
            this.querySelector('img').src = 'image/image5.jpg';
        });

        this.querySelector('#downButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#downButton').addEventListener('click', () => {
            playAudio('clickIn');
            this.querySelector('img').src = 'image/image4.jpg';
        });

        this.querySelector('#uploadButton').addEventListener('mouseover', () => hoverSound.play());
        this.querySelector('#uploadButton').addEventListener('click', () => playAudio('clickIn'));

        this.querySelector('#idInput').addEventListener('click', () => {
            const idErrorMess = this.querySelector('#idErrorMess');
            idErrorMess.style.visibility = 'visible';
            idErrorMess.style.opacity = '1';
        });

        this.querySelector('#passwordInput').addEventListener('click', () => {
            const passwordErrorMess = this.querySelector('#passwordErrorMess');
            passwordErrorMess.style.visibility = 'visible';
            passwordErrorMess.style.opacity = '1';
        });

        this.querySelector('#accountBackButton').addEventListener('click', () => {
            playAudio('clickOut');
            settingsMenu.show();
        });
        this.querySelector('#accountBackButton').addEventListener('mouseover', () => hoverSound.play());
        
    }

    static show() {
        const accountMenu = document.getElementById('dynamicContent');
        accountMenu.innerHTML = '';
        const accountMenuComponent = document.createElement('account-menu');
        accountMenu.appendChild(accountMenuComponent);
    }
}

customElements.define('account-menu', accountMenu);