const rollButton = document.getElementById('roll-button');
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const dice3 = document.getElementById('dice3');
const dice4 = document.getElementById('dice4');
const dice5 = document.getElementById('dice5');

let diceValues =[];

// Define an array to store selected dice values
let selectedDice = [];

const diceElements = [dice1, dice2, dice3, dice4, dice5];

let combinedArray = [];

let rollCount = 0;

rollButton.addEventListener('click', function() {
    onRollButtonClick();    
});

function handleDiceClick(){
    diceElements.classList.toggle('selected');
}

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
}

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








const totalDiv = document.getElementById('total');
const toakscore = document.getElementById('toak');
const foakscore = document.getElementById('foak');
const fullhouse = document.getElementById('fullhouse');
const smallstraight = document.getElementById('smallStr');
const largestraight = document.getElementById('largeStr');
const ones = document.getElementById('onesScore');
const twos = document.getElementById('twosScore');
const threes = document.getElementById('threesScore');
const fours = document.getElementById('foursScore');
const fives = document.getElementById('fivesScore');
const sixes = document.getElementById('sixesScore');

const yahtzeescore = document.getElementById('yahtzee');
const finalscore = document.getElementById('finalscore');


let permanentScores = [];

function onRollButtonClick() {
    // Increment roll count;
    rollCount++;
    diceRolled = true; 

    if (rollCount <=3) {
        diceElements.forEach(dice => startAnimation(dice));

        setTimeout(() => {
            roll();
            selectedScore();
        }, 1000);

    } else if (rollCount === 3) {
        resetGame();
    }
    
}

diceElements.forEach(dice => {
    dice.addEventListener('click', function() {
        dice.classList.toggle('selected');

        // Check if the dice is selected and add its value to the selectedDice array
        if (dice.classList.contains('selected')) {
            const diceValue = parseInt(dice.style.backgroundPositionX) / -100 + 1;
            selectedDice.push(diceValue);
        } else {
            // If the dice is deselected, remove its value from the selectedDice array
            const diceValue = parseInt(dice.style.backgroundPositionX) / -100 + 1;
            const index = selectedDice.indexOf(diceValue);
            if (index !== -1) {
                selectedDice.splice(index, 1);
            }
        }
    });
});

function roll() {
    diceValues = diceElements.map(dice => stopAnimation(dice));

    // Filter out null values from diceValues
    diceValues = diceValues.filter(value => value !== null);
    combinedArray = selectedDice.concat(diceValues);
    console.log('Combined Array after selecting',combinedArray)

    // Calculate scores
    const OneScore = calculateOnes(combinedArray);
    const TwoScore = calculateTwos(combinedArray);
    const ThreeScore = calculateThrees(combinedArray);
    const FourScore = calculateFours(combinedArray);
    const FiveScore = calculateFives(combinedArray);
    const SixScore = calculateSixes(combinedArray);
    const ChanceScore = calculateChance(combinedArray);
    const TOAKscore = calculateThreeOfAKind(combinedArray);
    const FOAKscore = calculateFourOfAKind(combinedArray);
    const fullHouseScoreValue = calculateFullHouse(combinedArray);
    const smallStraight = calculateSmallStraight(combinedArray);
    const largeStraight = calculateLargeStraight(combinedArray);
    const yahtzeeScore = calculateYahtzee(combinedArray);
    

    // Update score display
    if (!lockedCategories.includes(0)) {
        ones.textContent = OneScore;
    }
    
    if (!lockedCategories.includes(1)) {
        twos.textContent = TwoScore;
    }

    if (!lockedCategories.includes(2)) {
        threes.textContent = ThreeScore;
    }

    if (!lockedCategories.includes(3)) {
        fours.textContent = FourScore;
    }
    
    if (!lockedCategories.includes(4)) {
        fives.textContent = FiveScore;
    }

    if (!lockedCategories.includes(5)) {
        sixes.textContent = SixScore;
    }

    if (!lockedCategories.includes(8)) {
        toakscore.textContent = TOAKscore;
    }
    
    if (!lockedCategories.includes(9)) {
        foakscore.textContent = FOAKscore;
    }

    if (!lockedCategories.includes(10)) {
        fullhouse.textContent = fullHouseScoreValue;
    }

    if (!lockedCategories.includes(11)) {
        smallstraight.textContent = smallStraight;
    }

    if (!lockedCategories.includes(12)) {
        largestraight.textContent = largeStraight;
    }

    if (!lockedCategories.includes(13)) {
        totalDiv.textContent = ChanceScore;
    }

    if (!lockedCategories.includes(14)) {
        yahtzeescore.textContent = yahtzeeScore;
    }

     // Reset the isPlayerTurn variable to true for the next turn
     console.log('Setting isPlayerTurn to true');
     isPlayerTurn = true;

}

let isPlayerTurn = true;  
let lockedCategories=[];
let diceRolled = false; 
// Select all elements with the class "presentScore"
const scoreElements = document.querySelectorAll('.presentScore');
permanentScores= new Array (scoreElements.length -1).fill(-1);

function selectedScore() {
    
    // Add click event listeners to the score elements
    scoreElements.forEach((scoreElement, index) => {
        scoreElement.addEventListener('click', function() {
            
            if (diceRolled && scoreElement.getAttribute('data-clicked') === 'false' && isPlayerTurn ) {
                // Get the clicked score value as an integer
                const clickedScore = parseInt(scoreElement.textContent);
                // Store the clicked score as a permanent score
                permanentScores[index] = clickedScore;

                // Log the permanent scores (for demonstration purposes)
                console.log('Permanent Scores:', permanentScores);  
                                
                // Mark the score element as clicked (set data-clicked to true)
                scoreElement.setAttribute('data-clicked', 'true');
                diceElements.forEach(dice => dice.classList.remove('selected'));

                // Add the CSS class to visually indicate the clicked score
                scoreElement.classList.add('clicked');

                lockedCategories.push(index);
                console.log('lockCategoryScore',lockedCategories)

                // Calculate validScores and bonusScore based on permanentScores
                const { upperTotal, bonusScore } = calculateScores(permanentScores);
                // Find the index positions for upperScore and bonusScore
                const upperIndex = 6  // Change this to the correct index in your scoreElements array
                const bonusIndex = 7;  // Change this to the correct index in your scoreElements array

                // Update permanentScores with upperScore and bonusScore
                permanentScores[upperIndex] = upperTotal;
                permanentScores[bonusIndex] = bonusScore;

                // Call a separate function to update score displays
                updateScoreDisplays(upperTotal, bonusScore);
                
                if (lockedCategories.length === 13){
                    const FinalScore = calculateFinalScore(permanentScores);
                    finalscore.textContent= FinalScore;
                    showFinalScore(FinalScore);
                }

                // Reset the isPlayerTurn variable to false before resetting the game
                isPlayerTurn = false;

                // Reset the game after updating scores
                resetGame();
            }
        });
    });
}
//Initialize the click event listeners
selectedScore();