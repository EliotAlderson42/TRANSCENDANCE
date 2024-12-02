class mainMenu extends HTMLElement {
    constructor() {
        super();
        this.checkAuthFragment();
    }

    checkAuthFragment() {
        if (window.location.hash.startsWith('#auth=')) {
            try {
                // Décoder en base64
                const encoded = window.location.hash.substring(6);
                const decoded = atob(encoded);
                console.log("Decoded data:", decoded);  // Debug
                
                const authData = JSON.parse(decoded);
                if (authData.isLoggedIn) {
                    localStorage.setItem('user', JSON.stringify(authData));
                    window.location.hash = '';
                    document.dispatchEvent(new CustomEvent('userLoggedIn', { 
                        detail: authData 
                    }));
                    mainMenu.show();
                }
            } catch (error) {
                console.error('Error parsing auth data:', error);
                console.log('Raw hash value:', window.location.hash);
            }
        }
    }

    connectedCallback() {
        const user = localStorage.getItem('user');
        this.innerHTML = `
            <div id="dynamicContent">
                <button id="pongButton" class="stealthButton FadeIn" 
                        style="font-size: 12em; color: white; margin-bottom: 0.1em;">
                    PONG
                </button>
                <button id="playButton" class="buttonLambda hoverLambda">Play</button>
                <button id="settingsButton" class="buttonLambda hoverLambda">Settings</button>
                ${user ? `<button id="logoutButton" class="buttonLambda hoverLambda">Logout</button>` 
                      : `<button id="authenticateButton" class="buttonLambda hoverLambda">Authenticate</button>`}
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const playButton = this.querySelector('#playButton');
        if (playButton) {
            playButton.addEventListener('mouseover', () => hoverSound.play());
            playButton.addEventListener('click', () => {
                playAudio('clickIn');
                playMenu.show();
            });
        }   

        const settingsButton = this.querySelector('#settingsButton');
        if (settingsButton) {
            settingsButton.addEventListener('mouseover', () => hoverSound.play());
            settingsButton.addEventListener('click', () => {
                playAudio('clickIn');
                settingsMenu.show();
            });
        }

        const authenticateButton = this.querySelector('#authenticateButton');
        if (authenticateButton) {
            authenticateButton.addEventListener('mouseover', () => hoverSound.play());
            authenticateButton.addEventListener('click', () => {
                playAudio('clickIn');
                authenticationMenu.show();
            });
        }

        const logoutButton = this.querySelector('#logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('mouseover', () => hoverSound.play());
            logoutButton.addEventListener('click', async () => {
                playAudio('clickIn');
                try {
                    const response = await handleApiRequest('http://localhost:8000/auth/logout/', {
                        method: 'POST'
                    });
                    
                    if (response) {
                        document.dispatchEvent(new Event('userLoggedOut'));
                        localStorage.removeItem('user');
                        authenticationMenu.show();
                    }
                } catch (error) {
                    console.error('Error during logout:', error);
                    alert('Failed to logout');
                }
            });
        }
    }

    static show() {
        const mainMenuContainer = document.getElementById('dynamicContent');
        if (mainMenuContainer) {
            mainMenuContainer.innerHTML = '';
            const mainMenuComponent = document.createElement('main-menu');
            mainMenuContainer.appendChild(mainMenuComponent);
        } else {
            console.error('dynamicContent element not found');
        }
    }
}

// Pour la page d'accueil avec le gros bouton PONG
class initialPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="dynamicContent">
                <button id="initialPongButton" class="hoverLambda" 
                        style="font-size: 18em; width: 100%; height: 100%;">
                    PONG
                </button>
            </div>
        `;

        const button = this.querySelector('#initialPongButton');
        button.addEventListener('click', () => {
            playAudio('pongAudio');
            playAudio('backgroundAudio');
            document.body.classList.add('animationActive');
            setTimeout(() => {
                button.classList.add('fadeOut');
            }, 1000);
            setTimeout(() => {
                mainMenu.show();
            }, 30);
        });
    }

    static show() {
        const container = document.getElementById('dynamicContent');
        container.innerHTML = '';
        const initialPageComponent = document.createElement('initial-page');
        container.appendChild(initialPageComponent);
    }
}

window.updateFriendStatus = (userId, isOnline) => {
    const friendElement = document.querySelector(`[data-user-id="${userId}"]`);
    if (friendElement) {
        const statusElement = friendElement.querySelector('.friend-status');
        if (statusElement) {
            statusElement.textContent = isOnline ? 'Online' : 'Offline';
            statusElement.className = `friend-status ${isOnline ? 'online' : 'offline'}`;
        }
    }
};

customElements.define('main-menu', mainMenu);
customElements.define('initial-page', initialPage);

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initialPage.show();
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash.startsWith('#auth=')) {
        const mainMenuComponent = document.createElement('main-menu');
        document.getElementById('dynamicContent').appendChild(mainMenuComponent);
    } else {
        initialPage.show();
    }
});