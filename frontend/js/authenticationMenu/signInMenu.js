class logInMenu extends HTMLElement {
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

    async connectedCallback() {
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
        
            try {
                const csrfToken = await this.getCsrfToken();
                const response = await fetch('https://localhost:8000/auth/login/', {
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
        
                if (!response.ok) {
                    throw new Error('Login failed');
                }
        
                // Obtenir les données utilisateur après le login
                const user = await window.userStatusManager.updateUser();
                if (user) {
                    document.dispatchEvent(new CustomEvent('userLoggedIn', { 
                        detail: user 
                    }));
                    window.userStatusManager.connect();
                    mainMenu.show();
                } else {
                    throw new Error('Failed to get user data after login');
                }
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
                    const response = await fetch('https://localhost:8000/auth/42/login/', {
                        credentials: 'include'
                    });
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

document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier d'abord le hash pour OAuth 42
    if (window.location.hash.startsWith('#auth=')) {
        try {
            const encoded = window.location.hash.substring(6);
            const decoded = atob(encoded);
            const authData = JSON.parse(decoded);
            
            if (authData.isLoggedIn) {
                // S'assurer que la session est bien établie
                const user = await window.userStatusManager.updateUser();
                if (!user) {
                    throw new Error('Failed to establish session');
                }
                
                // Déclencher l'événement avec les données complètes
                document.dispatchEvent(new CustomEvent('userLoggedIn', { 
                    detail: user
                }));
                
                // Connecter le WebSocket
                if (window.userStatusManager) {
                    window.userStatusManager.connect();
                }
                
                window.location.hash = '';
                user = await window.userStatusManager?.updateUser();
                mainMenu.show();
            }
        } catch (error) {
            console.error('Error handling OAuth callback:', error);
            // Rediriger vers la page de login en cas d'erreur
            authenticationMenu.show();
        }
    }
    
    // Vérifier si l'utilisateur est déjà connecté
    const user = window.userStatusManager?.getUser();
    if (user) {
        document.dispatchEvent(new CustomEvent('userAuthenticated', { 
            detail: user 
        }));
        mainMenu.show();
    }
});

customElements.define('log-in-menu', logInMenu);