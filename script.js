// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-button');
const numberDisplay = document.getElementById('number');
const correctClicksDisplay = document.getElementById('correct-clicks');
const concentrationDisplay = document.getElementById('concentration');

// Game state variables
let currentNumber = 100;        // Current number being displayed
let correctClicks = 0;         // Number of correct clicks by the user
let expectedClicks = 0;        // Total number of clicks needed for perfect score
let gameInterval;              // Holds the interval timer
let canClick = false;          // Flag to control when clicks are allowed

/**
 * Checks if a number should be clicked (last digit is 1 or 6)
 * @param {number} num - The number to check
 * @returns {boolean} - True if last digit is 1 or 6 
 */
function shouldClick(num) {
    const lastDigit = num % 10;  // Get the last digit using modulo
    return lastDigit === 1 || lastDigit === 6;
}

// Calculate total expected clicks by counting numbers ending in 1 or 6
for (let i = 100; i >= 0; i--) {
    if (shouldClick(i)) {
        expectedClicks++;
    }
}

/**
 * Shows the specified screen and hides others
 * @param {HTMLElement} screen - The screen to show
 */
function showScreen(screen) {
    [startScreen, gameScreen, resultScreen].forEach(s => {
        s.classList.add('hidden');
    });
    screen.classList.remove('hidden');
}

/**
 * Starts the game:
 * - Resets game state
 * - Shows game screen
 * - Starts countdown timer
 */
function startGame() {
    currentNumber = 100;
    correctClicks = 0;
    showScreen(gameScreen);
    numberDisplay.textContent = currentNumber;
    canClick = true;
    
    gameInterval = setInterval(() => {
        if (currentNumber === 0) {
            endGame();
            return;
        }
        currentNumber--;
        numberDisplay.textContent = currentNumber;
    }, 1000);
}

/**
 * Ends the game:
 * - Stops the timer
 * - Calculates concentration score
 * - Shows result screen
 */
function endGame() {
    clearInterval(gameInterval);
    canClick = false;
    const concentration = Math.round((correctClicks / expectedClicks) * 100);
    correctClicksDisplay.textContent = correctClicks;
    concentrationDisplay.textContent = concentration;
    showScreen(resultScreen);
}

// Event Listeners

// Start button click - begins the game
startButton.addEventListener('click', () => {
    console.log('Start button clicked');
    startGame();
});

// Game screen click - handles player clicks during the game
gameScreen.addEventListener('click', (e) => {
    if (!canClick) {
        console.log('Clicks not allowed right now');
        return;
    }
    
    console.log('Game screen clicked');
    console.log('Current number:', currentNumber);
    console.log('Should click?', shouldClick(currentNumber));
    
    if (shouldClick(currentNumber)) {
        correctClicks++;
        console.log('Correct click! Total correct clicks:', correctClicks);
    }
});

// Double click anywhere - restarts the game
document.addEventListener('dblclick', () => {
    console.log('Double click detected - restarting game');
    clearInterval(gameInterval);
    canClick = false;
    showScreen(startScreen);
}); 