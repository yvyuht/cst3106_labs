let diceSelected = [];
        
        const rollButton = document.getElementById('roll-button');
        $(document).ready(function() {
            $('#roll-button').on('click', function() {
                onRollButtonClick();
                updateScoreTable();
            });
        });

    async function onRollButtonClick() {
        let response = await fetch('/roll-dice');
        let data = await response.json();
        console.log('return data',data);

        let diceElements = data.diceValue;
        console.log('return diceElements array',diceElements);

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

async function updateScoreTable(){
    try {
        let response = await fetch('/roll-dice');
        let data = await response.json();
        const scoreResponse = await fetch ('/updateScores', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                diceValues: data.diceValue,
            }),
        });
        const scores = await scoreResponse.json();
        // Output scores to console (you can update your UI as needed)
        console.log('Three of a Kind Score:', scores.threeOfAKind);
        console.log('Four of a Kind Score:', scores.fourOfAKind);
        console.log('Small Straight Score:', scores.smallStraight);
    } catch (error) {
        console.error('Error:', error);
    }
     
}


    


      