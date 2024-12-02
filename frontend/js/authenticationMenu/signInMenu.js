class logInMenu extends HTMLElement {
    constructor() {
        super();
    }

    async getCsrfToken() {
        try {
            const response = await fetch('http://localhost:8000/auth/csrf/', { 
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
            <h1 id="logInMenuTitle" class="menusTitle">Log in</h1>
            <form id="loginForm">
                <input id="usernameInput" class="inputLambda" type="text" placeholder="Username" required>
                <input id="passwordInput" class="inputLambda" type="password" placeholder="Password" required>
                <button type="submit" id="logInButton" style="margin-top: 1vh;" class="hoverLambda">Log In</button>
            </form>
            <button id="fortytwoButton" style="margin-top: 3vh;width: 10%; height: 10%;" class="hoverLambda buttonLambda">42 intra</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        const form = this.querySelector('#loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = this.querySelector('#usernameInput').value;
            const password = this.querySelector('#passwordInput').value;

            console.log("Trying to login with:", { username });

            try {
                const csrfToken = await this.getCsrfToken();
                if (!csrfToken) {
                    throw new Error('Could not get CSRF token');
                }

                const response = await fetch('http://localhost:5500/auth/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });

                const data = await response.json();
                console.log("Response:", data);

                if (!response.ok) {
                    throw new Error(data.detail || 'Login failed');
                }

                // Stocker les données utilisateur
                localStorage.setItem('user', JSON.stringify(data));
                
                // Déclencher l'événement userLoggedIn pour le UserStatusManager
                document.dispatchEvent(new Event('userLoggedIn'));
                
                // Connexion au WebSocket via UserStatusManager
                if (window.userStatusManager) {
                    window.userStatusManager.connect();
                } else {
                    console.error('UserStatusManager not initialized');
                }

                mainMenu.show();
            } catch (error) {
                console.error("Login error:", error);
                alert('Login failed: ' + error.message);
            }
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        const logInButton = this.querySelector('#logInButton');
        const fortytwoButton = this.querySelector('#fortytwoButton');
        const backButton = this.querySelector('#backButton');

        if (logInButton) {
            logInButton.addEventListener('mouseover', () => hoverSound.play());
        }

        if (fortytwoButton) {
            fortytwoButton.addEventListener('mouseover', () => hoverSound.play());
            fortytwoButton.addEventListener('click', async () => {
                playAudio('clickIn');
                try {
                    const response = await fetch('http://localhost:8000/auth/42/login/');
                    const data = await response.json();
                    if (data.auth_url) {
                        window.location.href = data.auth_url;
                    } else {
                        throw new Error('No auth URL received');
                    }
                } catch (error) {
                    console.error('42 authentication error:', error);
                    alert('Failed to initiate 42 login');
                }
            });    
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
            const logInMenuComponent = document.createElement('log-in-menu');
            dynamicContent.appendChild(logInMenuComponent);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. D'abord vérifier le hash pour OAuth 42
    if (window.location.hash.startsWith('#auth=')) {
        try {
            const encoded = window.location.hash.substring(6);
            const decoded = atob(encoded);
            const userData = JSON.parse(decoded);
            
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.hash = '';
            window.userStatusManager.connect();
            document.dispatchEvent(new CustomEvent('userAuthenticated', { 
                detail: userData 
            }));
            mainMenu.show();
            return;
        } catch (error) {
            console.error('Error parsing auth data:', error);
        }
    }

    // 2. Ensuite vérifier le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const cleanedData = storedUser.trim();
            const userData = JSON.parse(cleanedData);
            
            document.dispatchEvent(new CustomEvent('userAuthenticated', { 
                detail: userData 
            }));
            mainMenu.show();
            return;
        } catch (error) {
            console.error('Error parsing stored user:', error);
        }
    }
    
    // 3. Ne pas vérifier les cookies ici, laissez le backend gérer ça
});

customElements.define('log-in-menu', logInMenu);