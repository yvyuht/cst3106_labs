
//get button elements
const rollButton = document.getElementById('roll-button');
const closeButton = document.getElementsByClassName('close')[0]; //for modal
const ruleButton = document.getElementById('ruleButton');
const ruleInfo = document.getElementById('ruleInfo');

//get modal element
const modal = document.getElementById('myModal');

//get score card elements
const ones = document.getElementById('onesScore');
const twos = document.getElementById('twosScore');
const threes = document.getElementById('threesScore');
const fours = document.getElementById('foursScore');
const fives = document.getElementById('fivesScore');
const sixes = document.getElementById('sixesScore');
const toakscore = document.getElementById('toak');
const foakscore = document.getElementById('foak');
const smallstraight = document.getElementById('smallStr');
const largestraight = document.getElementById('largeStr');
const fullhouse = document.getElementById('fullhouse');
const yahtzeescore = document.getElementById('yahtzee');
const totalDiv = document.getElementById('total');
const finalscore = document.getElementById('finalscore');
const validScoresElement = document.getElementById('upperScore');
const bonusScoreElement = document.getElementById('bonusScore');
const finalScoreElement = document.getElementById('finalScore');
const scoreElements = document.querySelectorAll('.presentScore');
permanentScores= new Array (scoreElements.length -1).fill(-1);

//get dice elements
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const dice3 = document.getElementById('dice3');
const dice4 = document.getElementById('dice4');
const dice5 = document.getElementById('dice5');
//add them to an array for easy access
const diceElements = [dice1, dice2, dice3, dice4, dice5];

//add click listener to be able to select dice
diceElements.forEach((dice, index) => {
    dice.addEventListener('click', function() {
        dice.classList.toggle('selected');

        const data = {
            isSelected: dice.classList.contains('selected'),
            //diceValue: (parseInt(dice.style.backgroundPositionX) / -100 + 1),
            index: index
        };
        fetch('/click-dice', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(serverResponse => {
            // Handle the server response message
            console.log(serverResponse.message);
        })
        .catch(error => {
            console.error('Error: unable to click dice', error);
        });
    });
});

//add click listener to scorecard elements
let isPlayerTurn = true;  
let lockedCategories=[];
let diceRolled = false; 

scoreElements.forEach((scoreElement, index) => {
    scoreElement.addEventListener('click', async function() {
        const stateResponse = await fetch('/get-game-state');
        const state = await stateResponse.json();

        if (state.justPlayed){
            alert("You just played a category! Please roll the dice to continue.");
        } else {
            if (scoreElement.getAttribute('data-clicked') === 'false'){
                // Mark the score element as clicked (set data-clicked to true)
                scoreElement.setAttribute('data-clicked', 'true');
                // Add the CSS class to visually indicate the clicked score
                scoreElement.classList.add('clicked');
    
                const data = {
                    clickedScore : parseInt(scoreElement.textContent),
                    index : index
                };
    
                /*fetch('/play-category', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(dataS => {
                    console.log(dataS);
                updateBonusAndUpper(dataS.upperTotal, dataS.bonusScore);
    
                if (dataS.setScoresFinal){
                    finalscore.textContent= dataS.FinalScore;
                    showFinalScore(dataS.FinalScore);
                    console.log('Game over! Restarted game. Final score for last play:', FinalScore);
                }
    
                resetGame();
                console.log(dataS.message);
                })
                .catch(error => {
                    console.error('Error: unable to click dice', error);
                });*/
                try {
                    const playCategoryResponse = await fetch('/play-category', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                
                    if (!playCategoryResponse.ok) {
                        // Handle non-OK response, e.g., throw an error
                        throw new Error('Unable to play category');
                    }
                
                    const dataS = await playCategoryResponse.json();
                
                    console.log(dataS);
                    updateBonusAndUpper(dataS.upperTotal, dataS.bonusScore);
                
                    if (dataS.setScoresFinal) {
                        finalscore.textContent = dataS.finalScore;
                        showFinalScore(dataS.finalScore);
                        console.log('Game over! Restarted game. Final score for last play:', dataS.finalScore);
                        const restartGameData = {};
                        fetch('/restart-game', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json',},
                            body: JSON.stringify(restartGameData),
                        }).then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                return response.json();
                            }).then(data => {
                                // Handle the success response from the server
                                console.log(data.message);
                                restartGame();
                            })
                            .catch(error => {
                                // Handle errors during the fetch
                                console.error('Fetch error:', error);
                            });
                    } else{
                        resetGame();
                        console.log(dataS.message);
                    }
                } catch (error) {
                    console.error('Error: unable to play category', error);
                }
            } else {
                alert("You have already played this category.");
                console.log ('Category already played');
            }
        }
    });
});

 // Event listeners for modal to close when the user clicks on the close button or anywhere outside it
 closeButton.onclick = function() {
     modal.style.display = 'none';
     restartGame();
     
 };

 window.onclick = function(event) {
     if (event.target === modal) {
         modal.style.display = 'none';
         restartGame();
     }
 };

 //Display rule information when the button is being hovered over
ruleButton.addEventListener('mouseover', () => {
    ruleInfo.style.display = 'block';
});
ruleButton.addEventListener('mouseout', () => {
    ruleInfo.style.display = 'none';
});
        
//roll button click listener
async function onRollButtonClick() {
    try {
        const stateResponse = await fetch('/get-game-state');
        const state = await stateResponse.json();

        if (state.maxRolls) {
            console.log(state.maxRolls);
            rollButton.disabled = true;
            alert("Max rolls reached! Choose a category to score in before you can continue.");
        } else {
            console.log('Max rolls? ', state.maxRolls);
            
            // start animation
            diceElements.forEach((dice) => {
                if (!dice.classList.contains('selected'))
                    dice.style.animation = 'roll 1s steps(6) infinite';
            });

            // roll the dice
            const rollResponse = await fetch('/roll-dice');
            const data = await rollResponse.json();
            console.log('Roll Dice data:', data);

            // stop animation & update dice display
            setTimeout(() => {
                diceValues = data.newDiceValues;

                diceElements.forEach((dice, index) => {
                    // update dice display image
                    dice.style.backgroundPosition = -100 * (diceValues[index] - 1) + '% 0';
                    dice.style.animation = 'none';
                });
            }, 1000); // 1000 milliseconds (1 second)

            // update score card
            updateScoreCard(data.lockedCategories, data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


rollButton.addEventListener("click", onRollButtonClick);

//function definitions

//display the final score
function showFinalScore(score) {
    console.log('showing final score', score);
    finalScoreElement.textContent = score;
    modal.style.display = 'block';
}

//reset dice selection & enable roll button
function resetGame() {
    diceElements.forEach(dice => {
        if (dice.classList.contains('selected')){dice.classList.toggle('selected');}
    });
    rollButton.disabled = false;
}

function restartGame(){
    resetGame();
    scoreElements.forEach((scoreElement) => {
        scoreElement.setAttribute('data-clicked', 'false');
        scoreElement.classList.remove('clicked');
    });

    const data = {
        OneScore: 0,
        TwoScore: 0,
        ThreeScore: 0,
        FourScore: 0,
        FiveScore: 0,
        SixScore: 0,
        ChanceScore: 0,
        TOAKscore: 0,
        FOAKscore: 0,
        FullHouseScore: 0,
        SmallStraightScore: 0,
        LargeStraightScore: 0,
        YahtzeeScore: 0
    }
    updateScoreCard([], data)
    updateBonusAndUpper(0, 0);
    console.log('Successfully restarted game on client end');
}

function updateBonusAndUpper(validScores, bonusScore) {
    // Update score display for validScores
    validScoresElement.textContent = validScores;
    // Update score display for bonusScore
    bonusScoreElement.textContent = bonusScore;
}

//update score card elements
function updateScoreCard (lockedCategories, data){
    if (!lockedCategories.includes(0)) {ones.textContent = data.OneScore;}
    
    if (!lockedCategories.includes(1)) {twos.textContent = data.TwoScore;}

    if (!lockedCategories.includes(2)) {threes.textContent = data.ThreeScore;}

    if (!lockedCategories.includes(3)) {fours.textContent = data.FourScore;}
    
    if (!lockedCategories.includes(4)) {fives.textContent = data.FiveScore;}

    if (!lockedCategories.includes(5)) {sixes.textContent = data.SixScore;}

    if (!lockedCategories.includes(8)) {toakscore.textContent = data.TOAKscore;}
    
    if (!lockedCategories.includes(9)) {foakscore.textContent = data.FOAKscore;}

    if (!lockedCategories.includes(10)) {fullhouse.textContent = data.FullHouseScore;}

    if (!lockedCategories.includes(11)) {smallstraight.textContent = data.SmallStraightScore;}

    if (!lockedCategories.includes(12)) {largestraight.textContent = data.LargeStraightScore;}

    if (!lockedCategories.includes(13)) {totalDiv.textContent = data.ChanceScore;}

    if (!lockedCategories.includes(14)) {yahtzeescore.textContent = data.YahtzeeScore;}
}


    


      