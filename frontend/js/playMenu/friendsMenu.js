class friendsMenu extends HTMLElement {
    constructor() {
        super();
        this.statusUpdateCallback = this.updateFriendStatus.bind(this);
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
                <h1 id="friendMenuTitle" class="menusTitle">Friends</h1>
                
                <!-- Barre de recherche -->
                <div class="search-section">
                    <input type="text" id="searchInput" class="inputLambda" 
                           placeholder="Search users...">
                    <div id="searchResults" class="search-results"></div>
                </div>

                <!-- Liste des amis -->
                <div class="friends-section">
                    <h2>My Friends</h2>
                    <div id="friendsList" class="friends-list"></div>
                </div>

                <!-- Demandes d'amis en attente -->
                <div class="friend-requests-section">
                    <h2>Friend Requests</h2>
                    <div id="friendRequestsList" class="friend-requests-list"></div>
                </div>

                <button id="friendsBackButton" class="hoverLambda backButtons">Back</button>
            </div>
        `;

        const user = localStorage.getItem('user');
        if (!user) {
            mainMenu.show();
            return;
        }
    
        this.loadFriends();
        this.loadFriendRequests();
        this.setupEventListeners();
    
        // Utiliser uniquement userStatusManager
        if (window.userStatusManager) {
            window.userStatusManager.addStatusListener(this.statusUpdateCallback);
            window.userStatusManager.connect(); // S'assurer que le WebSocket est connecté
        }
    
        // Polling pour les demandes d'amis
        setInterval(() => {
            this.loadFriendRequests();
        }, 5000);
    
        // Définir les fonctions globales
        window.sendFriendRequest = this.sendFriendRequest.bind(this);
        window.handleFriendRequest = this.handleFriendRequest.bind(this);
        window.inviteToPlay = this.inviteToPlay.bind(this);
    }
    
    disconnectedCallback() {
        // Nettoyer uniquement l'écouteur de userStatusManager
        if (window.userStatusManager) {
            window.userStatusManager.removeStatusListener(this.statusUpdateCallback);
        }
    }
        
    updateFriendStatus(userId, isOnline) {
        const friendItem = this.querySelector(`[data-user-id="${userId}"]`);
        if (friendItem) {
            const statusElement = friendItem.querySelector('.friend-status');
            if (statusElement) {
                statusElement.className = `friend-status ${isOnline ? 'online' : 'offline'}`;
                statusElement.textContent = isOnline ? 'Online' : 'Offline';
            }
        }
    }
    
    async loadFriends() {
        try {
            const response = await handleApiRequest('http://localhost:8000/auth/friends/');
            const friendsData = await response.json();  // Renommé pour éviter le conflit
            console.log("Received friends data:", friendsData);
            
            const friendsList = this.querySelector('#friendsList');
            friendsList.innerHTML = friendsData.length ? friendsData.map(friend => `
                <div class="friend-item" data-user-id="${friend.id}">
                    <img src="${friend.avatar_url || 'image/image.jpg'}" 
                         alt="avatar" class="friend-avatar"
                         width="40" height="40">
                    <span class="friend-name">${friend.display_name || friend.username}</span>
                    <span class="friend-status ${friend.is_online ? 'online' : 'offline'}">
                        ${friend.is_online ? 'Online' : 'Offline'}
                    </span>
                    <button class="invite-button hoverLambda" 
                            onclick="inviteToPlay('${friend.id}')">
                        Invite to play
                    </button>
                </div>
            `).join('') : '<p>No friends yet</p>';
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }


    async loadFriendRequests() {
        const user = localStorage.getItem('user');
        if (!user) {
            return;  // Ne pas charger si non connecté
        }

        try {
            const response = await handleApiRequest('http://localhost:8000/auth/friend-requests/');
            const requests = await response.json();
            
            const requestsList = this.querySelector('#friendRequestsList');
            requestsList.innerHTML = requests.length ? requests.map(request => `
                <div class="friend-request-item" data-user-id="${request.sender_info.id}">
                    <img src="${request.sender_info.avatar_url || 'image/image.jpg'}" 
                        alt="avatar" class="friend-avatar"
                        width="40" height="40">
                    <span class="friend-name">
                        ${request.sender_info.display_name || request.sender_info.username}
                    </span>
                    <button class="accept-button hoverLambda" 
                            onclick="handleFriendRequest(${request.id}, 'accept')">
                        Accept
                    </button>
                    <button class="reject-button hoverLambda" 
                            onclick="handleFriendRequest(${request.id}, 'reject')">
                        Reject
                    </button>
                </div>
            `).join('') : '<p>No pending friend requests</p>';
        } catch (error) {
            console.error('Error loading friend requests:', error);
        }
    }


    setupEventListeners() {
        // Recherche d'utilisateurs
        let searchTimeout;
        const searchInput = this.querySelector('#searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(async () => {
                    const query = e.target.value;
                    if (query.length < 3) {
                        this.querySelector('#searchResults').innerHTML = '';
                        return;
                    }

                    try {
                        const response = await handleApiRequest(
                            `http://localhost:8000/auth/search-users/?query=${encodeURIComponent(query)}`);
                        const users = await response.json();
                        
                        const searchResults = this.querySelector('#searchResults');
                        searchResults.innerHTML = users.map(user => `
                            <div class="search-result-item">
                                <img src="${user.avatar_url || 'image/image.jpg'}" 
                                     alt="avatar" class="user-avatar"
                                     width="30" height="30">
                                <span class="user-name">${user.display_name || user.username}</span>
                                <button class="add-friend-button hoverLambda" 
                                        onclick="sendFriendRequest(${user.id})">
                                    Add Friend
                                </button>
                            </div>
                        `).join('') || '<p>No users found</p>';
                    } catch (error) {
                        console.error('Error searching users:', error);
                    }
                }, 300);
            });
        }

        
        // Bouton retour
        const backButton = this.querySelector('#friendsBackButton');
        if (backButton) {
            backButton.addEventListener('mouseover', () => hoverSound.play());
            backButton.addEventListener('click', () => {
                playAudio('clickOut');
                playMenu.show();
            });
        }
    }

    async sendFriendRequest(userId) {
        try {
            const csrfToken = await this.getCsrfToken();
            const response = await handleApiRequest('http://localhost:8000/auth/send-friend-request/', {
                method: 'POST',
                body: JSON.stringify({ receiver_id: userId })
            });

            if (!response.ok) throw new Error('Failed to send friend request');
            alert('Friend request sent!');
            this.querySelector('#searchResults').innerHTML = '';
            this.querySelector('#searchInput').value = '';
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request');
        }
    }

    async handleFriendRequest(requestId, action) {
        try {
            const csrfToken = await this.getCsrfToken();
            const response = await handleApiRequest('http://localhost:8000/auth/handle-friend-request/', {
                method: 'POST',
                body: JSON.stringify({
                    friendship_id: requestId,
                    action: action
                })
            });

            if (!response.ok) throw new Error('Failed to handle friend request');
            
            // Recharger les listes
            this.loadFriends();
            this.loadFriendRequests();
        } catch (error) {
            console.error('Error handling friend request:', error);
            alert('Failed to handle friend request');
        }
    }

    inviteToPlay(friendId) {
        // À implémenter avec la logique du jeu
        alert('Invitation feature coming soon!');
    }

    static show() {
        const friendsMenu = document.getElementById('dynamicContent');
        friendsMenu.innerHTML = '';
        const friendsMenuComponent = document.createElement('friends-menu');
        friendsMenu.appendChild(friendsMenuComponent);
    }
}

customElements.define('friends-menu', friendsMenu);