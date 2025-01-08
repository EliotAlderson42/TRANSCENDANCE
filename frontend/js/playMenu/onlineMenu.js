class onlineMenu extends HTMLElement {
    constructor() {
        super();
        this.isSearching = false;
        this.searchTimeout = null;
    }

    async connectedCallback() {
        const user = await window.userStatusManager?.getUser();
        if (!user) {
            mainMenu.show();
            return;
        }

        this.innerHTML = `
            <div id="dynamicContent">
                <h1 id="onlineMenuTitle" class="menusTitle">Online Mode</h1>
                <div id="queueStatus" style="display: none;" class="text-center my-4">
                    <p>Searching for opponent...</p>
                    <p>Time in queue: <span id="queueTimer">0:00</span></p>
                </div>
                <button id="findGameButton" class="hoverLambda buttonLambda">Find Game</button>
                <button id="backButton" class="hoverLambda backButtons">Back</button>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const findGameButton = this.querySelector('#findGameButton');
        if (findGameButton) {
            findGameButton.addEventListener('mouseover', () => hoverSound.play());
            findGameButton.addEventListener('click', () => {
                playAudio('clickIn');
                if (!this.isSearching) {
                    this.startSearching();
                } else {
                    this.stopSearching();
                }
            });
        }

        const backButton = this.querySelector('#backButton');
        if (backButton) {
            backButton.addEventListener('mouseover', () => hoverSound.play());
            backButton.addEventListener('click', () => {
                playAudio('clickOut');
                this.stopSearching();
                playMenu.show();
            });
        }
    }

    startSearching() {
        this.isSearching = true;
        const findGameButton = this.querySelector('#findGameButton');
        const queueStatus = this.querySelector('#queueStatus');
        
        if (findGameButton) {
            findGameButton.textContent = 'Cancel Search';
        }
        if (queueStatus) {
            queueStatus.style.display = 'block';
        }

        // Start the queue timer
        this.startTime = Date.now();
        this.updateQueueTimer();

        // Initialize WebSocket connection and send queue request
        this.initializeGameSocket();
    }

    stopSearching() {
        this.isSearching = false;
        const findGameButton = this.querySelector('#findGameButton');
        const queueStatus = this.querySelector('#queueStatus');
        
        if (findGameButton) {
            findGameButton.textContent = 'Find Game';
        }
        if (queueStatus) {
            queueStatus.style.display = 'none';
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }

        // Close WebSocket if open
        if (this.gameSocket && this.gameSocket.readyState === WebSocket.OPEN) {
            this.gameSocket.send(JSON.stringify({
                type: 'leave_queue'
            }));
        }
    }

    updateQueueTimer() {
        if (!this.isSearching) return;

        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        
        const timerElement = this.querySelector('#queueTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        this.searchTimeout = setTimeout(() => this.updateQueueTimer(), 1000);
    }

    initializeGameSocket() {
        if (this.gameSocket) {
            this.gameSocket.close();
        }

        this.gameSocket = new WebSocket('wss://localhost:8000/ws/pong/');
        
        this.gameSocket.onopen = () => {
            this.gameSocket.send(JSON.stringify({
                type: 'join_queue'
            }));
        };

        // Dans onlineMenu.js
        this.gameSocket.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'game_found' && data.game_id) {
                    this.stopSearching();
                    // Stocker les informations de la partie
                    const gameId = data.game_id;
                    const playerSide = data.player_side;
                    
                    // Créer le composant de jeu avec le bon côté
                    const container = document.getElementById('dynamicContent');
                    if (container) {
                        container.innerHTML = '';
                        const gameComponent = document.createElement('online-game');
                        await gameComponent.initGame(gameId, playerSide);
                        container.appendChild(gameComponent);
                    }
                }
            } catch (error) {
                console.error('Error in online menu websocket message:', error);
            }
        };

        this.gameSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.stopSearching();
        };

        this.gameSocket.onclose = () => {
            if (this.isSearching) {
                this.stopSearching();
            }
        };
    }

    async startOnlineGame(gameId, playerSide) {
        this.stopSearching();
        const container = document.getElementById('dynamicContent');
        if (container) {
            container.innerHTML = '';
            const gameComponent = document.createElement('online-game');
            container.appendChild(gameComponent);
            await gameComponent.initGame(gameId, playerSide);
        }
    }

    disconnectedCallback() {
        this.stopSearching();
        if (this.gameSocket) {
            this.gameSocket.close();
        }
    }

        static show() {
            const container = document.getElementById('dynamicContent');
            container.innerHTML = '';
            const onlineMenuComponent = document.createElement('online-menu');
            container.appendChild(onlineMenuComponent);
        }
    }

customElements.define('online-menu', onlineMenu);