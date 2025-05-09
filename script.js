/**
 * Concentration Game
 * A game where players must click numbers ending in 1 or 6, and special randomly skipped numbers.
 * The game tests player's concentration and reaction time.
 */

// DOM Elements - UI components
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-button');
const numberDisplay = document.getElementById('number');
const correctClicksDisplay = document.getElementById('correct-clicks');
const incorrectClicksDisplay = document.getElementById('incorrect-clicks');
const expectedClicksDisplay = document.getElementById('expected-clicks');
const concentrationDisplay = document.getElementById('concentration');

// Game configuration
const INITIAL_NUMBER = 100;     // Starting number
const TIME_INTERVAL = 1500;     // Time between number changes (ms)
const RANDOM_CHANCE = 10;       // 1 in X chance for random number skip

// Game state variables
let currentNumber = INITIAL_NUMBER;  // Current number being displayed
let correctClicks = 0;              // Number of correct clicks by the user
let incorrectClicks = 0;               // Number of wrong clicks by the user
let expectedClicks = 0;             // Total number of clicks needed for perfect score
let gameInterval;                   // Holds the interval timer
let canClick = false;               // Flag to control when clicks are allowed
let randomNumbersToClick = [];      // Array to store numbers that were randomly skipped
let clickedNumbers = new Set();     // Set to track which numbers have been clicked

/**
 * Checks if a number should be clicked (last digit is 1 or 6)
 * @param {number} num - The number to check
 * @returns {boolean} - True if last digit is 1 or 6 
 */
function shouldClick(num) {
    const lastDigit = num % 10;  // Get the last digit using modulo
    return lastDigit === 1 || lastDigit === 6;
}

/**
 * Checks if a number is safe to jump (last digit is not 7 or 2)
 * @param {number} num - The number to check
 * @returns {boolean} - True if number is safe to jump
 */
function shouldJump(num) {
    const lastDigit = num % 10;
    return lastDigit !== 7 && lastDigit !== 2 && num !== 1;
}



/**
 * Generates a random trigger for number skipping
 * @param {number} chance - The denominator for the random chance (1 in X)
 * @returns {boolean} - True if random trigger is activated
 */
function randomTrigger(chance) {
    const randomNumber = Math.floor(Math.random() * chance);
    return randomNumber === 1;
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
    // Reset game state
    currentNumber = INITIAL_NUMBER;
    correctClicks = 0;
    incorrectClicks = 0;
    expectedClicks = 0;
    randomNumbersToClick = [];
    clickedNumbers.clear();  // Clear clicked numbers tracking

    // Calculate total expected clicks by counting numbers ending in 1 or 6
    for (let i = INITIAL_NUMBER; i >= 0; i--) {
        if (shouldClick(i)) {
            expectedClicks++;
        }
    }
    
    // Initialize UI
    showScreen(gameScreen);
    numberDisplay.textContent = currentNumber;
    canClick = true;
    
    // Start game loop
    gameInterval = setInterval(() => {
        if (currentNumber === 0) {
            endGame();
            return;
        }
        
        // Handle random number skipping
        if (randomTrigger(RANDOM_CHANCE) && shouldJump(currentNumber)) {
            currentNumber -= 2;  // Skip one number
            randomNumbersToClick.push(currentNumber);

            // Update expected clicks if the skipped number wasn't already a target
            if (!shouldClick(currentNumber)) {
                expectedClicks++;
                console.log('Expected clicks increased to:', expectedClicks);
            }
        } else {
            currentNumber--;
        }
        
        numberDisplay.textContent = currentNumber;
    }, TIME_INTERVAL);
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
    
    // Calculate final score
    const correctClicksMinusIncorrectClicks = correctClicks - incorrectClicks;
    const concentration = Math.round((correctClicksMinusIncorrectClicks / expectedClicks) * 100);
    
    // Update UI with results
    correctClicksDisplay.textContent = correctClicks;
    incorrectClicksDisplay.textContent = incorrectClicks;
    expectedClicksDisplay.textContent = expectedClicks;
    concentrationDisplay.textContent = concentration;
    console.log('correctClicks - incorrectClicks:', correctClicksMinusIncorrectClicks);
    showScreen(resultScreen);
}

// Event Listeners

// Start button click - begins the game
startButton.addEventListener('click', () => {
    startGame();
});

// Game screen click - handles player clicks during the game
gameScreen.addEventListener('click', (e) => {
    if (!canClick) {
        console.log('Clicks not allowed right now');
        return;
    }

    // Check if this number has already been clicked
    if (clickedNumbers.has(currentNumber)) {
        console.log('Number already clicked:', currentNumber);
        return;
    }

    // Handle correct clicks
    if (shouldClick(currentNumber)) {
        correctClicks++;
        clickedNumbers.add(currentNumber);
        console.log('Correct click! Total correct clicks:', correctClicks);
    } else if (randomNumbersToClick.includes(currentNumber) && !shouldClick(currentNumber)) {
        correctClicks++;
        clickedNumbers.add(currentNumber);
        console.log('Correct click! Total correct clicks:', correctClicks);
    } else if (!randomNumbersToClick.includes(currentNumber) && !shouldClick(currentNumber)) {
        incorrectClicks++;
        console.log('Incorrect click:', currentNumber);
    }
});

// Double click anywhere - restarts the game
document.addEventListener('dblclick', () => {
    console.log('Double click detected - restarting game');
    clearInterval(gameInterval);
    canClick = false;
    showScreen(startScreen);
}); 