class friendsMenu extends HTMLElement {
    constructor() {
        super();
        this.statusUpdateCallback = this.updateFriendStatus.bind(this);
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

        try {
            const user = window.userStatusManager?.getUser();
            if (!user) {
                mainMenu.show();
                return;
            }
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

            await this.loadFriends();
            this.loadFriendRequests();
            this.setupEventListeners();
        
            // Utiliser uniquement userStatusManager
            if (window.userStatusManager) {
                window.userStatusManager.addStatusListener(this.statusUpdateCallback);
                window.userStatusManager.connect(); // S'assurer que le WebSocket est connecté
            }
        
            // Polling pour les demandes d'amis
            this.friendRequestInterval = setInterval(() => {
                this.loadFriendRequests();
            }, 5000);
        }  
        catch (error) {
            console.error('Error in friendsMenu:', error);
            mainMenu.show();
        }
    
        // Définir les fonctions globales
        window.sendFriendRequest = this.sendFriendRequest.bind(this);
        window.handleFriendRequest = this.handleFriendRequest.bind(this);
        window.inviteToPlay = this.inviteToPlay.bind(this);
    }
    
    disconnectedCallback() {
        if (window.userStatusManager) {
            window.userStatusManager.removeStatusListener(this.statusUpdateCallback);
        }
        if (this.friendRequestInterval) {
            clearInterval(this.friendRequestInterval);
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
            if (!window.userStatusManager.isAuthenticated()) return;

            const response = await handleApiRequest('https://localhost:8000/auth/friends/');
            const friendsData = await response.json();  // Renommé pour éviter le conflit
            
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
            `).join('') : '<p style="color: green;">No friends yet ;(</p>';
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }

    async sendFriendRequest(userId) {
        if (!userId) {
            console.error('No user ID provided');
            return;
        }
    
        try {
            const response = await handleApiRequest(
                'https://localhost:8000/auth/send-friend-request/',
                {
                    method: 'POST',
                    body: JSON.stringify({ receiver_id: userId })
                }
            );
    
            if (response.ok) {
                alert('Friend request sent!');
                this.querySelector('#searchResults').innerHTML = '';
                this.querySelector('#searchInput').value = '';
            } else {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request: ' + error.message);
        }
    }

    async loadFriendRequests() {
        if (!window.userStatusManager?.isAuthenticated()) {
            return;
        }

        try {
            const response = await handleApiRequest('https://localhost:8000/auth/friend-requests/');
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
            `).join('') : '<p style="color: green;">No pending friend requests</p>';
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
                            `https://localhost:8000/auth/search-users/?query=${encodeURIComponent(query)}`);
                        const users = await response.json();
                        await this.searchUsers(query);  // Utiliser la méthode searchUsers existante
                    } catch (error) {
                        console.error('Error searching users:', error);
                    }
                }, 300);
            });
        }
        const searchResults = this.querySelector('#searchResults');
        if (searchResults) {
            searchResults.addEventListener('click', (e) => {
                const button = e.target.closest('.add-friend-button');
                if (button) {
                    e.preventDefault();
                    e.stopPropagation();
                    const userId = button.dataset.userId;
                    this.sendFriendRequest(userId);
                }
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

    async searchUsers(query) {
        if (!query || query.length < 2) {
            document.querySelector('#searchResults').innerHTML = '';
            return;
        }
    
        try {
            // Nettoyer la requête
            const sanitizedQuery = DOMPurify.sanitize(query).trim();
            
            const response = await protectedRequest(
                `https://localhost:8000/auth/search-users/?query=${encodeURIComponent(sanitizedQuery)}`
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const results = await response.json();
            const searchResults = document.querySelector('#searchResults');
            
            if (results.length === 0) {
                searchResults.innerHTML = '<p class="no-results">Aucun utilisateur trouvé</p>';
                return;
            }
    
            searchResults.innerHTML = results.map(user => `
                <div class="search-result-item" data-user-id="${DOMPurify.sanitize(String(user.id))}">
                    <img src="${DOMPurify.sanitize(user.avatar_url || 'image/image.jpg')}" 
                         alt="avatar" class="user-avatar"
                         width="30" height="30">
                    <span class="user-name">${DOMPurify.sanitize(user.display_name || user.username)}</span>
                    <button type="button" class="add-friend-button hoverLambda" 
                            data-user-id="${DOMPurify.sanitize(String(user.id))}">
                        Add Friend
                    </button>
                </div>
            `).join('');
    
        } catch (error) {
            console.error('Search failed:', error);
            document.querySelector('#searchResults').innerHTML = 
                '<p class="error">Une erreur est survenue lors de la recherche</p>';
        }
    }
    
    async sendFriendRequest(userId) {
        try {
            // Debug - voir ce qui est envoyé
            const response = await handleApiRequest(
                'https://localhost:8000/auth/send-friend-request/',
                {
                    method: 'POST',
                    body: JSON.stringify({ 
                        receiver_id: userId 
                    })
                }
            );
    
            if (response.ok) {
                alert('Friend request sent!');
                this.querySelector('#searchResults').innerHTML = '';
                this.querySelector('#searchInput').value = '';
            } else {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request: ' + error.message);
        }
    }

    
    async handleFriendRequest(requestId, action) {
        try {
            const csrfToken = await this.getCsrfToken();
            const response = await handleApiRequest('https://localhost:8000/auth/handle-friend-request/', {
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