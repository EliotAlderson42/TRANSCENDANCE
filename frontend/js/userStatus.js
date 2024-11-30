class UserStatusManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.statusListeners = new Set();
    }

    addStatusListener(callback) {
        this.statusListeners.add(callback);
    }

    removeStatusListener(callback) {
        this.statusListeners.delete(callback);
    }

    notifyStatusChange(userId, isOnline) {
        this.statusListeners.forEach(callback => callback(userId, isOnline));
    }

    connect() {
        if (!localStorage.getItem('user')) return;

        try {
            this.socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/user_status/`);
            console.log('Attempting to connect WebSocket');  // Debug log

            this.socket.onopen = () => {
                console.log('WebSocket connected');
                this.connected = true;
                this.reconnectAttempts = 0;
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'status_update') {
                    this.notifyStatusChange(data.user_id, data.is_online);
                }
            };

            this.socket.onclose = () => {
                this.connected = false;
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    setTimeout(() => this.connect(), 5000);
                }
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.connected = false;
        }
    }

    handleOnlineUsers(users) {
        this.onlineUsers = new Map(users.map(user => [user.id, user]));
        this.notifyStatusChange();
    }
    
    getOnlineStatus(userId) {
        const user = this.onlineUsers.get(userId);
        if (!user) return { isOnline: false };
        return {
            isOnline: user.is_online,
            isRecentlyOnline: user.is_recently_online,
            lastSeen: user.last_seen
        };
    }
    
    async refreshOnlineUsers() {
        try {
            const response = await fetch('http://localhost:8000/auth/online-users/', {
                credentials: 'include'
            });
            const users = await response.json();
            this.handleOnlineUsers(users);
        } catch (error) {
            console.error('Error fetching online users:', error);
        }
    }
}

// Créer une instance globale
window.userStatusManager = new UserStatusManager();

// Connecter au WebSocket quand l'utilisateur se connecte
document.addEventListener('userLoggedIn', () => {
    window.userStatusManager.connect();
});

// Déconnecter du WebSocket quand l'utilisateur se déconnecte
document.addEventListener('userLoggedOut', () => {
    window.userStatusManager.disconnect();
});