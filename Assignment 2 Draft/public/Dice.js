//const rollButton = document.getElementById('roll-button');
/*const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const dice3 = document.getElementById('dice3');
const dice4 = document.getElementById('dice4');
const dice5 = document.getElementById('dice5');*/



// Define an array to store selected dice values
let selectedDice = [];

//const diceElements = [dice1, dice2, dice3, dice4, dice5];

let combinedArray = [];

let rollCount = 0;
/*
rollButton.addEventListener('click', function() {
    onRollButtonClick();    
});*/

function handleDiceClick(){
    diceElements.classList.toggle('selected');
}

/*

function startAnimation(dice) {
    if(!dice.classList.contains('selected')) {
    dice.style.animation = 'roll 1s steps(6) infinite';
    }
}

function stopAnimation(dice) {
    if (dice.classList.contains('selected')) {
        return null;
    }
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    dice.style.animation = 'none';
    dice.style.backgroundPosition = -100 * (randomNumber - 1) + '% 0';
    return randomNumber;
}*/

function updateScoreDisplays(validScores, bonusScore) {
    const validScoresElement = document.getElementById('upperScore');
    const bonusScoreElement = document.getElementById('bonusScore');

    // Update score display for validScores
    validScoresElement.textContent = validScores;

    // Update score display for bonusScore
    bonusScoreElement.textContent = bonusScore;
}

function resetGame() {
    console.log('resetGame');
    rollCount = 0;
    selectedDice = [];
    combinedArray = [];

    diceElements.forEach(dice => dice.classList.remove('selected'));

    rollButton.disabled = false; 
    // Add the click event listeners again after resetting the game
    //selectedScore();

}

// Function to show the final score modal
function showFinalScore(score) {
    const modal = document.getElementById('myModal');
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = score;
    modal.style.display = 'block';

    // Close the modal when the user clicks on the close button
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.onclick = function() {
        modal.style.display = 'none';
        restartGame();
        
    };

    // Close the modal when the user clicks anywhere outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            restartGame();
        }
    };
}

function restartGame() {
    console.log("Gamre restart")
    permanentScores.fill(-1); // Reset permanentScores array to -1 values
    
    upperTotal=0;
    bonusScore=0;
    FinalScore=0;
    
    upperIndex = 6  // Change this to the correct index in your scoreElements array
    bonusIndex = 7;
    console.log(permanentScores);
    resetGame();
    isPlayerTurn = true;
    lockedCategories = [];
    
    // Reset UI elements (customize this based on your UI structure)
    const scoreElements = document.querySelectorAll('.presentScore');

    scoreElements.forEach((scoreElement, index) => {
        scoreElement.textContent = ''; // Reset scores to empty
        if (scoreElement.id !== 'upperScore' && scoreElement.id !== 'bonusScore' && scoreElement.id !== 'finalscore') {
            scoreElement.setAttribute('data-clicked', 'false'); // Reset clicked status for non-excluded elements
        }
        scoreElement.classList.remove('clicked'); // Remove clicked class
        
        // Update permanentScores with upperScore and bonusScore
        permanentScores[upperIndex] = null;
        permanentScores[bonusIndex] = null;
    });
    selectedScore();
}

//Display rule information when the button is being hovered over
const ruleButton = document.getElementById('ruleButton');
const ruleInfo = document.getElementById('ruleInfo');

ruleButton.addEventListener('mouseover', () => {
    ruleInfo.style.display = 'block';
});

ruleButton.addEventListener('mouseout', () => {
    ruleInfo.style.display = 'none';
});

//Display each category information
const scoreCategories = document.querySelectorAll('.score-category');
const scoreExplanations = document.querySelectorAll('.score-explanation');

scoreCategories.forEach(category => {
    category.addEventListener('mouseover', () => {
        const explanationId = category.id + '-explanation';
        const explanationElement = document.getElementById(explanationId);
        explanationElement.style.display = 'block';
    });

    category.addEventListener('mouseout', () => {
        const explanationId = category.id + '-explanation';
        const explanationElement = document.getElementById(explanationId);
        explanationElement.style.display = 'none';
    });
});






