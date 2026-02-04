const fragrances = [
    "Dior Sauvage",
    "Creed Aventus",
    "Bleu de Chanel",
    "Versace Eros",
    "Acqua di Gio - Giorgio Armani",
    "Baccarat Rouge 540 - Maison Francis Kurkdjian",
    "Santal 33 - Le Labo",
    "Tom Ford Black Orchid",
    "Tobacco Vanille - Tom Ford",
    "Oud Wood - Tom Ford",
    "Spicebomb - Viktor&Rolf",
    "Invictus - Paco Rabanne",
    "1 Million - Paco Rabanne",
    "Le Male - Jean Paul Gaultier",
    "CK One - Calvin Klein",
    "Yves Saint Laurent Y",
    "Terre d'Hermès",
    "Voyage d'Hermès",
    "Green Irish Tweed - Creed",
    "Silver Mountain Water - Creed",
    "Layton - Parfums de Marly",
    "Herod - Parfums de Marly",
    "Pegasus - Parfums de Marly",
    "Jazz Club - Maison Margiela",
    "By the Fireplace - Maison Margiela",
    "Black Saffron - Byredo",
    "Gypsy Water - Byredo",
    "Bal d'Afrique - Byredo",
    "Mojave Ghost - Byredo",
    "Dior Homme Intense",
    "Prada L'Homme",
    "L'Homme Idéal - Guerlain",
    "Ombré Leather - Tom Ford",
    "Explorer - Montblanc",
    "Stronger With You - Emporio Armani",
    "YSL La Nuit de l'Homme",
    "Valentino Uomo Born In Roma",
    "Azzaro Wanted by Night",
    "Spicebomb Extreme - Viktor&Rolf",
    "Acqua di Parma Colonia",
    "Guerlain Habit Rouge",
    "Bentley For Men Intense",
    "Encre Noire - Lalique",
    "Man in Black - Bvlgari",
    "Nuit d'Issey - Issey Miyake",
    "Luna Rossa Carbon - Prada",
    "Gentleman - Givenchy",
    "Ultra Male - Jean Paul Gaultier",
    "D&G The One for Men",
    "Sauvage Elixir - Dior"
];

// State
let players = [];
let currentPlayerIndex = 0;
let impostorIndex = -1;
let selectedFragrance = "";
let gameState = 'SETUP'; // SETUP, PASS, REVEAL, DASHBOARD, RESULT

// DOM Elements
const screens = {
    setup: document.getElementById('setup-screen'),
    pass: document.getElementById('pass-screen'),
    reveal: document.getElementById('reveal-screen'),
    dashboard: document.getElementById('game-dashboard'),
    result: document.getElementById('result-screen')
};

const setupUI = {
    input: document.getElementById('player-name-input'),
    addBtn: document.getElementById('add-player-btn'),
    list: document.getElementById('player-list'),
    startBtn: document.getElementById('start-game-btn')
};

const passUI = {
    name: document.getElementById('current-player-name'),
    revealBtn: document.getElementById('reveal-role-btn')
};

const revealUI = {
    title: document.getElementById('role-title'),
    content: document.getElementById('role-content'),
    nextBtn: document.getElementById('next-player-btn')
};

const dashboardUI = {
    revealResultBtn: document.getElementById('reveal-impostor-btn'),
    newGameBtn: document.getElementById('new-game-btn')
};

const resultUI = {
    impostorName: document.getElementById('impostor-name'),
    actualFragrance: document.getElementById('actual-fragrance'),
    homeBtn: document.getElementById('home-btn')
};

// Event Listeners
setupUI.addBtn.addEventListener('click', addPlayer);
setupUI.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
});
setupUI.startBtn.addEventListener('click', startGame);

passUI.revealBtn.addEventListener('click', showRole);
revealUI.nextBtn.addEventListener('click', nextPlayer);

dashboardUI.revealResultBtn.addEventListener('click', showResults);
dashboardUI.newGameBtn.addEventListener('click', resetGame);
resultUI.homeBtn.addEventListener('click', resetGame);

// Functions

function switchScreen(screenName) {
    // Hide all
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden'); // Helper class for display:none
    });

    // Show target
    const target = screens[screenName];
    target.classList.remove('hidden');
    // Small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
        target.classList.add('active');
    }, 10);
}

function addPlayer() {
    const name = setupUI.input.value.trim();
    if (!name) return;

    players.push(name);
    setupUI.input.value = '';
    renderPlayerList();
    checkStartButton();
}

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayerList();
    checkStartButton();
}

function renderPlayerList() {
    setupUI.list.innerHTML = '';
    players.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.innerHTML = `
            <span>${player}</span>
            <button class="delete-btn" aria-label="Remove ${player}">×</button>
        `;
        item.querySelector('.delete-btn').addEventListener('click', () => removePlayer(index));
        setupUI.list.appendChild(item);
    });
}

function checkStartButton() {
    setupUI.startBtn.disabled = players.length < 3;
}

function startGame() {
    if (players.length < 3) return;

    // Game Setup
    currentPlayerIndex = 0;
    impostorIndex = Math.floor(Math.random() * players.length);
    selectedFragrance = fragrances[Math.floor(Math.random() * fragrances.length)];

    // Start Logic
    prepareTurn();
}

function prepareTurn() {
    if (currentPlayerIndex >= players.length) {
        // All players have seen
        switchScreen('dashboard');
        return;
    }

    passUI.name.textContent = players[currentPlayerIndex];
    switchScreen('pass');
}

function showRole() {
    switchScreen('reveal');

    // Check role
    const isImpostor = currentPlayerIndex === impostorIndex;

    if (isImpostor) {
        revealUI.title.textContent = "You are the Impostor";
        revealUI.content.textContent = "🤫 You don't know the fragrance.";
        revealUI.content.style.color = "#ff5252"; // Red warning color
    } else {
        revealUI.title.textContent = "The Secret Fragrance is";
        revealUI.content.textContent = selectedFragrance;
        revealUI.content.style.color = "#ffd700"; // Gold color
    }
}

function nextPlayer() {
    currentPlayerIndex++;
    prepareTurn();
}

function showResults() {
    resultUI.impostorName.textContent = players[impostorIndex];
    resultUI.actualFragrance.textContent = selectedFragrance;
    switchScreen('result');
}

function resetGame() {
    // Keep players, reset game state logic?
    // User flow: "New Game" -> usually want same players or slightly modified.
    // "Back to Home" -> Setup screen

    // Let's decide: New Game -> Setup screen to allow adding/removing, but keep list?
    // Actually, "New Game" from Dashboard could just instantly restart with same players?
    // For simplicity, let's go back to Setup for now so they can change players if needed.

    switchScreen('setup');
}

// Initial Render
renderPlayerList();
checkStartButton();
