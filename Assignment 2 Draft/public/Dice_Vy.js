//let diceSelected = [];
let diceElements=[]; // Declare a variable to store diceElements
        
        const rollButton = document.getElementById('roll-button');
        $(document).ready(function() {
            $('#roll-button').on('click', async function() {
                // Check if diceElements is not yet fetched
                
                onRollButtonClick(); // Fetch diceElements if not already fetched
                
                calculateScores(diceElements); // Pass diceElements to updateScoreTable
            });
        });

    async function onRollButtonClick() {
        let response = await fetch('/roll-dice');
        let data = await response.json();
        console.log('return data',data);

        diceElements = data.diceValue;
        console.log('return diceElements array',diceElements);
        await calculateScores();

        $('.dice').each(function(index) {
            //console.log('return index', index);
            let dice = $(this);
            let diceElement = diceElements[index]; // Assuming data is an array of dice values sent from the server
            let dotElements = dice.find('.dot');
            let rotationValues =data.rotationValue[index];

            dice.css('transform', 'rotate(' + rotationValues + ')');
            
            // Clear existing dots
            dice.find('.dot').remove();

            // Based on dice value, append the appropriate dots
            for (let i = 0; i < diceElement; i++) {
                let dot = $(dotElements[i]);
                if (diceElement === 1) {
                    dice.append('<div class="dot" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>');
                } else if (diceElement === 2) {
                    dice.append('<div class="dot" style="top: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; right: 25%;"></div>');
                } else if (diceElement === 3) {
                    dice.append('<div class="dot" style="top: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; right: 25%;"></div>');
                } else if (diceElement === 4) {
                    dice.append('<div class="dot" style="top: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="top: 25%; right: 25%;"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; right: 25%;"></div>');
                } else if (diceElement === 5) {
                    dice.append('<div class="dot" style="top: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="top: 25%; right: 25%;"></div>');
                    dice.append('<div class="dot" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; right: 25%;"></div>');
                } else if (diceElement === 6) {
                    dice.append('<div class="dot" style="top: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="top: 25%; right: 25%;"></div>');
                    dice.append('<div class="dot" style="top: 50%; left: 25%; transform: translate(0, -50%);"></div>');
                    dice.append('<div class="dot" style="top: 50%; right: 25%; transform: translate(0, -50%);"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; left: 25%;"></div>');
                    dice.append('<div class="dot" style="bottom: 25%; right: 25%;"></div>');
                }
            }
            
        });
        
    }

async function calculateScores(){
    
    try {
        const response = await fetch ('/calculate-score', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                diceElements: diceElements,
                
            }),
        });
        const {scores :updateScores}  = await response.json();
        
        // Output scores to console (you can update your UI as needed)
        console.log('Three of a Kind Score:', updateScores.threeOfAKind);
        console.log('Four of a Kind Score:', updateScores.fourOfAKind);
        console.log('Small Straight Score:', updateScores.smallStraight);
        console.log('Large Straight Score:', updateScores.largeStraight);

        console.log('Ones Score:', updateScores.Ones);
        console.log('Twos Score:', updateScores.Twos);
        console.log('Threes Score:', updateScores.Threes);
        console.log('Fours Score:', updateScores.Fours);
        console.log('Fives Score:', updateScores.Fives);
        console.log('Sixes Score:', updateScores.Sixes);

        console.log('Chance Score:', updateScores.Chance);
        console.log('Full House Score:', updateScores.fullHouse);
    
        updateScoreDisplays(updateScores);
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateScoreDisplays(updateScores){
    
   // let isPlayerTurn = true;  
    //let lockedCategories=[];
    //let diceRolled = false; 
        //diceValues = diceElements.map(dice => stopAnimation(dice));
    
        // Filter out null values from diceValues
        //diceValues = diceValues.filter(value => value !== null);
        //combinedArray = selectedDice.concat(diceElements);
        //console.log('Combined Array after selecting',combinedArray)
        
        const ones = document.getElementById('onesScore');
        const twos = document.getElementById('twosScore');
    
        // Update score display
       
            ones.textContent = updateScores.Ones;
        
            twos.textContent = updateScores.Twos;
        
    /*
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
    */
         // Reset the isPlayerTurn variable to true for the next turn
         //console.log('Setting isPlayerTurn to true');
         //isPlayerTurn = true;
    
    
}



    


      