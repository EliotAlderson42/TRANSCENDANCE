// Configuration de l'API
const API_URL = 'http://localhost:8000';

// Gestionnaire de login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        // Stocker les infos utilisateur
        localStorage.setItem('user', JSON.stringify(data));
        // Rediriger vers le menu principal
        mainMenu();

    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Gestionnaire d'inscription
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const confirmPassword = document.getElementById('secondPasswordInput').value;

    // Ajout des vérifications
    if (username.length < 3) {
        alert("Le nom d'utilisateur doit faire au moins 3 caractères");
        return;
    }

    if (password.length < 3) {
        alert("Le mot de passe doit faire au moins 3 caractères");
        return;
    }

    if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
    }

    const data = { username, password };
    console.log("Sending data:", data);

    try {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                username: username,
                password: password,
                display_name: username
            })
        });

        console.log("Response status:", response.status);
        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data));
        // Feedback visuel avant redirection
        alert("Compte créé avec succès !");
        mainMenu();
    } catch (error) {
        console.error("Error:", error);
        alert('Registration failed: ' + error.message);
    }
}

// Gestionnaire de déconnexion
async function handleLogout() {
    try {
        const csrfToken = await this.getCsrfToken();
        // Fermer la connexion WebSocket si elle existe
        if (window.userStatusSocket) {
            window.userStatusSocket.close();
        }

        const response = await fetch('http://localhost:8000/auth/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Logout failed');
        
        localStorage.removeItem('user');
        authenticationMenu.show();
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Failed to logout');
    }
}

// Vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Récupérer les informations de l'utilisateur
function getLoggedInUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function isAuthenticated() {
    return localStorage.getItem('user') !== null;
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Dans auth.js ou similaire
function checkAuthStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            if (userData.isLoggedIn) {
                document.dispatchEvent(new CustomEvent('userAuthenticated', { 
                    detail: userData 
                }));
                return true;
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            console.log('Raw user data:', user); // Pour debug
        }
    }
    return false;
}
function updateUIForLoggedInUser(userData) {
    // Cache les boutons login/signup
    const authButtons = document.querySelectorAll('.auth-buttons');
    authButtons.forEach(btn => btn.style.display = 'none');

    // Affiche le menu utilisateur
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.style.display = 'block';
        const userDisplayName = userMenu.querySelector('.user-display-name');
        if (userDisplayName) {
            userDisplayName.textContent = userData.display_name;
        }
    }
}

// Fonction pour faire des requêtes authentifiées
async function authenticatedFetch(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...(options.headers || {})
            },
            credentials: 'include'
        });

        if (response.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/'; // ou votre page de login
            throw new Error('Authentication failed');
        }

        return response;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

// Fonction pour obtenir les headers d'authentification
function getAuthHeaders() {
    const userData = localStorage.getItem('user');
    if (!userData) return {
        'Content-Type': 'application/json'
    };

    try {
        const user = JSON.parse(userData);
        // Pour l'auth 42
        if (user.token) {
            return {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()  // Ajout du CSRF token
            };
        }
        // Pour l'auth classique
        return {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()  // Ajout du CSRF token
        };
    } catch (error) {
        console.error('Error parsing user data:', error);
        return {
            'Content-Type': 'application/json'
        };
    }
}

// Fonction unique pour les requêtes protégées
async function protectedRequest(url, options = {}) {
    const headers = getAuthHeaders();
    console.log('Headers being sent:', headers);  // Debug

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            },
            credentials: 'include'
        });
        
        return response;
    } catch (error) {
        console.error('Protected request failed:', error);
        throw error;
    }
}

// Fonction pour gérer les réponses API
async function handleApiRequest(url, options = {}) {
    try {
        const response = await protectedRequest(url, options);
        
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('user');
            window.location.href = '/';
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Une erreur est survenue');
        }

        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Fonction pour obtenir le CSRF token
async function getCsrfToken() {
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

document.addEventListener('DOMContentLoaded', checkAuthStatus);