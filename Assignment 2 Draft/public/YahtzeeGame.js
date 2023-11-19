
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

/*diceElements.forEach(dice => {
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
});*/

function roll() {
    //diceValues = diceElements.map(dice => stopAnimation(dice));

    // Filter out null values from diceValues
    //diceValues = diceValues.filter(value => value !== null);
    combinedArray = selectedDice.concat(diceElements);
    console.log('Combined Array after selecting',combinedArray)

    // Calculate scores
    /*const OneScore = calculateOnes(combinedArray);
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
    const yahtzeeScore = calculateYahtzee(combinedArray);*/
    

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