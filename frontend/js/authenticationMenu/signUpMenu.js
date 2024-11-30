class signUpMenu extends HTMLElement {
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
            <h1 id="signUpMenuTitle" class="menusTitle">Sign Up</h1>
            <form id="signUpForm">
                <input id="usernameInput" class="inputLambda" type="text" placeholder="Username" required>
                <input id="passwordInput" class="inputLambda" type="password" placeholder="Password" required>
                <input id="secondPasswordInput" class="inputLambda" type="password" placeholder="Confirm password" required>
                <button type="submit" id="signUpButton" style="margin-top: 1vh;" class="hoverLambda">Sign Up</button>
            </form>
            <button id="fortytwoButton" style="margin-top: 3vh;width: 10%; height: 10%;" class="hoverLambda buttonLambda">42 intra</button>
            <button id="backButton" class="hoverLambda backButtons">Back</button>
        </div>
        `;

        const form = this.querySelector('#signUpForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = this.querySelector('#usernameInput').value;
            const password = this.querySelector('#passwordInput').value;
            const confirmPassword = this.querySelector('#secondPasswordInput').value;

            console.log("Trying to register with:", { username });

            if (password !== confirmPassword) {
                alert("Les mots de passe ne correspondent pas");
                return;
            }

            try {
                // Récupérer le token CSRF
                const csrfToken = await this.getCsrfToken();
                if (!csrfToken) {
                    throw new Error('Could not get CSRF token');
                }

                console.log("Sending data:", {
                    username: username,
                    password: password,
                    display_name: username
                });

                const response = await fetch('http://localhost:8000/auth/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        display_name: username
                    })
                });

                const data = await response.json();
                console.log("Response:", data);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response:", errorText);            
                    throw new Error(data.detail || 'Registration failed');
                }

                document.dispatchEvent(new Event('userLoggedIn'));
                localStorage.setItem('user', JSON.stringify(data));
                connectWebSocket();
                mainMenu.show();
            } catch (error) {
                console.error("Registration error:", error);
                alert('Registration failed: ' + error.message);
            }
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        const signUpButton = this.querySelector('#signUpButton');
        const fortytwoButton = this.querySelector('#fortytwoButton');
        const backButton = this.querySelector('#backButton');

        if (signUpButton) {
            signUpButton.addEventListener('mouseover', () => hoverSound.play());
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
            const signUpMenuComponent = document.createElement('sign-up-menu');
            dynamicContent.appendChild(signUpMenuComponent);
        }
    }
}

customElements.define('sign-up-menu', signUpMenu);