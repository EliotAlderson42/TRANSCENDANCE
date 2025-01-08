class signUpMenu extends HTMLElement {
    constructor() {
        super();
    }

    async getCsrfToken() {
        try {
            const response = await fetch('https://localhost:8000/auth/csrf/', { 
                credentials: 'include'
            });
            const data = await response.json();
            return data.csrfToken;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
            return null;
        }
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="dynamicContent">
            <h1 id="signUpMenuTitle" class="menusTitle">Sign Up</h1>
            <form id="signUpForm">
                <input id="usernameInput" class="inputLambda" type="text" placeholder="Username" required>
                <input id="passwordInput" class="inputLambda" type="password" placeholder="Password" required>
                <input id="secondPasswordInput" class="inputLambda" type="password" placeholder="Confirm password" required>
                <button type="submit" id="signUpButton" style="margin-top: 1vh;" class="hoverLambda">Sign Up</button>
            </form>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        const form = this.querySelector('#signUpForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = this.querySelector('#usernameInput').value;
            const password = this.querySelector('#passwordInput').value;
            const confirmPassword = this.querySelector('#secondPasswordInput').value;
        
            if (password !== confirmPassword) {
                alert("Les mots de passe ne correspondent pas");
                return;
            }
        
            try {
                const response = await window.register(username, password);
                const user = await window.userStatusManager.updateUser();
                if (user) {
                    document.dispatchEvent(new CustomEvent('userLoggedIn', { 
                        detail: user 
                    }));
                    window.userStatusManager.connect();
                    mainMenu.show();
                } else {
                    throw new Error('Failed to get user data after registration');
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert('Registration failed: ' + error.message);
            }
        });    
    
        this.setupEventListeners();
    }

    setupEventListeners() {
        const signUpButton = this.querySelector('#signUpButton');
        const backButton = this.querySelector('#backButton');

        if (signUpButton) {
            signUpButton.addEventListener('mouseover', () => hoverSound.play());
        }

        if (backButton) {
            backButton.addEventListener('mouseover', () => hoverSound.play());
            backButton.addEventListener('click', () => {
                playAudio('clickOut');
                authenticationMenu.show();
            });
        }
    }

    static show() {
        const dynamicContent = document.getElementById('dynamicContent');
        if (dynamicContent) {
            dynamicContent.innerHTML = '';
            const signUpMenuComponent = document.createElement('sign-up-menu');
            dynamicContent.appendChild(signUpMenuComponent);
        }
    }
}

customElements.define('sign-up-menu', signUpMenu);