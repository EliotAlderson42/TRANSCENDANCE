class accountMenu extends HTMLElement {
    constructor() {
        super();
    }

    
    async connectedCallback() {
        const user = window.userStatusManager?.getUser();
        if (!user) {
            mainMenu.show();
            return;
        }

        this.innerHTML = `
        <div id="dynamicContent">
        <div class="scroll-container">
        <h1 id="accountMenuTitle" class="menusTitle" style="margin-top: 5vh;">Account settings</h1>
        <div class="avatar-section">
        <img src="${user && user.avatar_url ? user.avatar_url : 'image/image.jpg'}"
        width="140" height="140" 
        style="border: 3px solid white;" 
        class="accountMenu-image" 
        onerror="this.src='image/image.jpg'"
        alt="Profile avatar"
        />
        <input type="file" id="avatarInput" accept="image/*" style="display: none;">
        </div>
        <button id="uploadButton" class="hoverLambda accountMenu-uploadButton">upload</button>
        
        <div id="idText" class="accountMenu-text" style="margin-top: 2vh;">Id</div>
        <input id="idInput" class="accountMenu-input stealthButton" 
        style="background-color: darkGrey;" 
        value="${user ? user.username : ''}" readonly>
        <div id="idErrorMess" style="color: red; visibility: hidden;">42 IDs are not editable</div>
        
        <div id="passwordText" class="accountMenu-text">Password</div>
        <input id="passwordInput" type="password" class="accountMenu-input stealthButton" 
        style="background-color: darkGrey;" value="********" readonly>
        <div id="passwordErrorMess" style="color: red; visibility: hidden;">42 Passwords are not editable</div>
        
        <div id="pseudoText" class="accountMenu-text">Nickname</div>
        <input id="pseudoInput" class="accountMenu-input" 
        value="${user ? user.display_name : ''}" 
        placeholder="Enter your nickname">
        
        <div class="stats-section" style="color: white; margin-top: 2vh;">
        <h2>Statistics</h2>
        <p>Wins: ${user ? user.wins || 0 : 0}</p>
        <p>Losses: ${user ? user.losses || 0 : 0}</p>
        </div>
        
        <button id="saveButton" class="hoverLambda buttonLambda" style="margin-top: 2vh;">Save changes</button>
        <button id="accountBackButton" class="hoverLambda backButtons" style="margin-top: 3vh;">Back</button>
        </div>
        </div>
        `;
        
        this.setupEventListeners();
    }
    
    async setupEventListeners() {
        // Upload d'avatar
        const avatarInput = document.createElement('input');
        avatarInput.type = 'file';
        avatarInput.accept = 'image/*';
        avatarInput.style.display = 'none';
        document.body.appendChild(avatarInput);
        
        this.querySelector('#uploadButton').addEventListener('click', () => {
            playAudio('clickIn');
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', async (e) => {
            if (e.target.files[0]) {
                try {
                    const formData = new FormData();
                    formData.append('avatar', e.target.files[0]);
                    
                    const csrfToken = await this.getCsrfToken();
                    const response = await fetch('https://localhost:8000/auth/update_avatar/', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrfToken
                        },
                        credentials: 'include',
                        body: formData
                    });
        
                    if (!response.ok) throw new Error('Failed to update avatar');
        
                    // Attendre la mise à jour de l'utilisateur
                    const user = await window.userStatusManager.updateUser();
                    if (user) {
                        // Vérifier que l'élément existe avant de mettre à jour
                        const imgElement = this.querySelector('.accountMenu-image');
                        if (imgElement) {
                            imgElement.src = user.avatar_url || 'image/image.jpg';  // Ajouter une image par défaut
                        }
                    }
                } catch (error) {
                    console.error('Error updating avatar:', error);
                    alert('Failed to update avatar');
                }
            }
        });

        // Sauvegarde des modifications
        this.querySelector('#saveButton').addEventListener('click', async () => {
            const displayName = this.querySelector('#pseudoInput').value;
            try {
                const csrfToken = await this.getCsrfToken();
                const response = await fetch('https://localhost:8000/auth/update_profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        display_name: displayName
                    })
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.detail || 'Failed to update profile');
                }
                
                const user = await window.userStatusManager.updateUser();
                if (user) {
                    this.querySelector('#pseudoInput').value = user.display_name;
                }
                alert('Profile updated successfully');
                } catch (error) {
                console.error('Error updating profile:', error);
                alert(error.message);
            }
        });
        
        // Les autres event listeners
        const buttons = {
            '#idInput': () => {
                this.querySelector('#idErrorMess').style.visibility = 'visible';
                this.querySelector('#idErrorMess').style.opacity = '1';
            },
            '#passwordInput': () => {
                this.querySelector('#passwordErrorMess').style.visibility = 'visible';
                this.querySelector('#passwordErrorMess').style.opacity = '1';
            },
            '#accountBackButton': () => {
                playAudio('clickOut');
                settingsMenu.show();
            }
        };
        
        Object.entries(buttons).forEach(([selector, handler]) => {
            const element = this.querySelector(selector);
            if (element) {
                if (selector !== '#idInput' && selector !== '#passwordInput') {
                    element.addEventListener('mouseover', () => hoverSound.play());
                }
                element.addEventListener('click', handler);
            }
        });
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

    static async show() {
        const accountMenu = document.getElementById('dynamicContent');
        accountMenu.innerHTML = '';
        const accountMenuComponent = document.createElement('account-menu');
        accountMenu.appendChild(accountMenuComponent);
    }
}

customElements.define('account-menu', accountMenu);