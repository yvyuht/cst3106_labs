const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;
app.use(express.static('public', { index: 'yahtzee.html' }));

//initialize game state variables
const diceValues = new Map([
    [0, {isSelected: false, diceValue: 1}],
    [1,  {isSelected: false,diceValue: 1}],
    [2,  {isSelected: false,diceValue: 1 }],
    [3,  {isSelected: false, diceValue: 1}],
    [4,  {isSelected: false,diceValue: 1}]
]);

let rollCount = 1;
let justPlayed = false;
  
let lockedCategories=[];
let maxRolls = false; 
let permanentScores = [];

let setScoresFinal = false;
let FinalScore = 0;

let currentRound = 1;

// index positions for upperScore and bonusScore
const upperIndex = 6  
const bonusIndex = 7; 

//request to get current game state
app.get('/get-game-state', (req, res) => {
    const state ={
      rollCount:rollCount,
      maxRolls:maxRolls,
      justPlayed:justPlayed,
      currentRound:currentRound
    }
    //send to client
    res.json(state);
});

//request to click dice
app.post('/click-dice', (req, res) => {
    try {
        // Log the request body
        console.log('Request Body:', req.body);
        // Check if req.body is defined
        if (!req.body) {throw new Error('Request body is undefined');}
        
        //everything is okay, process request
        const diceData = diceValues.get(req.body.index);
        if (req.body.isSelected) {
            diceData.isSelected = true;
        } else {
            // If the dice is deselected, remove set isSelected back to false
            diceData.isSelected = false;
        }
        diceValues.set(req.body.index, diceData);
        res.status(200).json({
            message: 'Successfully processed the click-dice request',
        });
    } catch (error) {
        console.error('Error processing click-dice request:', error);
        res.status(500).json({
            message: 'Internal Server Error. Check server logs',
        });
    }
});

//request to play a certain category
app.post('/play-category', (req, res) => {
    try {
        // Log the request body
        console.log('Request Body:', req.body);
        // Check if req.body is defined
        if (!req.body) {throw new Error('Request body is undefined');}
        
        //everything is okay, process request - request logic
        //add the score to the final permanent scores array
        justPlayed = true;
        let message = '';
        permanentScores[req.body.index] = req.body.clickedScore;
        console.log('Permanent Scores:', permanentScores);
        //mark the category as locked
        lockedCategories.push(req.body.index);
        console.log('Locked category scores:',lockedCategories)

        // Calculate validScores and bonusScore based on permanentScores and update the scores
        calculateScores(permanentScores);
        //end game if 13 rounds. Otherwise continue playing
        if (currentRound == 13){
            FinalScore = calculateFinalScore(permanentScores);
            console.log('Final score', FinalScore);
            message = 'Successfully processed the play-category request. You have played 13 rounds. Game is over'
            setScoresFinal = true;
        } else{
            message = 'Successfully processed the play-category request.'
            resetGame();
        }
    
    ++currentRound;
    dataS = {
        upperTotal: permanentScores[upperIndex],
        bonusScore: permanentScores[bonusIndex],
        finalScore: FinalScore,
        setScoresFinal: setScoresFinal,
        message: message
    }
        //send info back
        res.json(dataS);
        
    } catch (error) {
        console.error('Error processing play-category request:', error);
        res.status(500).json({
            message: 'Internal Server Error. Check server logs',
        });
    }
});

app.post('/restart-game', (req, res) => {
    try {
        // Log the request body
        console.log('Request Body:', req.body);
        // Check if req.body is defined
        if (!req.body) {throw new Error('Request body is undefined');}
        
        //everything is okay, process request
        justPlayed = false;
        lockedCategories=[];
        maxRolls = false; 
        permanentScores = [];
        setScoresFinal = false;
        FinalScore = 0;
        rollCount = 1;
        diceValues.forEach((diceData) => {
            diceData.isSelected = false;
        });
        currentRound = 1;
        console.log('Game restarted. Updated game state variables:');
        console.log('Updated Roll Count:', rollCount);
        console.log('Updated Max Rolls:', maxRolls);
        console.log('Updated Dice Values:', diceValues);


        res.status(200).json({
            message: 'Successfully restarted game on server end',
        });
    } catch (error) {
        console.error('Error processing restart game request:', error);
        res.status(500).json({
            message: 'Internal Server Error. Check server logs',
        });
    }
});


//roll-dice request to get a new array of dice values
app.get('/roll-dice', (req, res) => {
   
    diceValues.forEach((diceData, key) => {
        if (!diceData.isSelected){
            diceData.diceValue = Math.floor(Math.random() * 6) + 1;

        }
        console.log('Dice Values:');
        console.log(`Key: ${key}, isSelected: ${diceData.isSelected}, diceValue: ${diceData.diceValue}`);
    });

    const newDiceValues = Array.from(diceValues.values()).map(diceData => diceData.diceValue);

    //calculate scores
    const OneScore = calculateOnes(newDiceValues);
    const TwoScore = calculateTwos(newDiceValues);
    const ThreeScore = calculateThrees(newDiceValues);
    const FourScore = calculateFours(newDiceValues);
    const FiveScore = calculateFives(newDiceValues);
    const SixScore = calculateSixes(newDiceValues);
    const ChanceScore = calculateChance(newDiceValues);
    const TOAKscore = calculateThreeOfAKind(newDiceValues);
    const FOAKscore = calculateFourOfAKind(newDiceValues);
    const fullHouseScoreValue = calculateFullHouse(newDiceValues);
    const smallStraight = calculateSmallStraight(newDiceValues);
    const largeStraight = calculateLargeStraight(newDiceValues);
    const yahtzeeScore = calculateYahtzee(newDiceValues);
    

    //save array of dice values to send to client
    const data = {
        newDiceValues: newDiceValues,
        lockedCategories : lockedCategories,
        OneScore: OneScore,
        TwoScore: TwoScore,
        ThreeScore: ThreeScore,
        FourScore: FourScore,
        FiveScore: FiveScore,
        SixScore: SixScore,
        ChanceScore: ChanceScore,
        TOAKscore: TOAKscore,
        FOAKscore: FOAKscore,
        FullHouseScore: fullHouseScoreValue,
        SmallStraightScore: smallStraight,
        LargeStraightScore: largeStraight,
        YahtzeeScore: yahtzeeScore,
        maxRolls : maxRolls
    };

    ++rollCount;
    if (rollCount<=3){} else {maxRolls = true;}

    if (justPlayed){justPlayed = false;}
    
    //send to client
    res.json(data);
});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});

function resetGame() {
    rollCount = 1;
    maxRolls = false;
    diceValues.forEach((diceData) => {
        diceData.isSelected = false;
    });
    console.log('Game reset. Updated game state variables:');
    console.log('Updated Roll Count:', rollCount);
    console.log('Updated Max Rolls:', maxRolls);
    console.log('Updated Dice Values:', diceValues);
}

function calculateThreeOfAKind(combinedArray) {
    const counts = {};

    for (const num of combinedArray) {
        counts[num] = (counts[num] || 0) + 1;
    }

    for (const num in counts) {
        if (counts[num] >= 3) {
            return combinedArray.reduce((total, num) => total + num);
        }
    }
    return 0;
}

function calculateFourOfAKind(combinedArray) {
    const counts = {};

    for (const num of combinedArray) {
        counts[num] = (counts[num] || 0) + 1;
    }

    for (const num in counts) {
        if (counts[num] >= 4) {
            return combinedArray.reduce((total, num) => total + num);
        }
    }
    return 0;
}

function calculateSmallStraight(combinedArray) {
    const sortedDice = Array.from(new Set(combinedArray)).sort((a, b) => a - b);

    for (let i = 0; i <= sortedDice.length - 4; i++) {
        if (sortedDice[i] === sortedDice[i + 1] - 1 &&
            sortedDice[i + 1] === sortedDice[i + 2] - 1 &&
            sortedDice[i + 2] === sortedDice[i + 3] - 1) {
            return 30;
        }
    }

    return 0;
}

function calculateLargeStraight(combinedArray) {
    const sortedDice = combinedArray.slice().sort((a, b) => a - b);

    for (let i = 0; i <= sortedDice.length - 4; i++) {
        if (sortedDice[i] === sortedDice[i + 1] - 1 &&
            sortedDice[i + 1] === sortedDice[i + 2] - 1 &&
            sortedDice[i + 2] === sortedDice[i + 3] - 1 &&
            sortedDice[i + 3] === sortedDice[i + 4] - 1) {
            return 40;
        }
    }

    return 0;
}

function calculateYahtzee(combinedArray) {
    const uniqueValues = new Set(combinedArray);

    if (uniqueValues.size === 1) {
        return 50;
    } else {
        return 0;
    }
}

function calculateChance(combinedArray) {
    return combinedArray.reduce((total, num) => total + num, 0);
}

function calculateOnes(combinedArray) {
    let onesScore = 0;

    for (let i = 0; i < combinedArray.length; i++) {
        if (combinedArray[i] === 1) {
            onesScore += 1;
        }
    }

    if (onesScore > 0) {
        return onesScore * 1;
    } else {
        return 0;
    }
}

function calculateTwos(combinedArray) {
    let twosScore = 0;

    for (let i = 0; i < combinedArray.length; i++) {
        if (combinedArray[i] === 2) {
            twosScore += 1;
        }
    }

    if (twosScore > 0) {
        return twosScore * 2;
    } else {
        return 0;
    }
}

function calculateThrees(combinedArray) {
    let threesScore = 0;

    for (let i = 0; i < combinedArray.length; i++) {
        if (combinedArray[i] === 3) {
            threesScore += 1;
        }
    }

    if (threesScore > 0) {
        return threesScore * 3;
    } else {
        return 0;
    }
}

function calculateFours(combinedArray) {
    let foursScore = 0;

    for (let i = 0; i < combinedArray.length; i++) {
        if (combinedArray[i] === 4) {
            foursScore += 1;
        }
    }

    if (foursScore > 0) {
        return foursScore * 4;
    } else {
        return 0;
    }
}

function calculateFives(combinedArray) {
    let fivesScore = 0;

    for (let i = 0; i < combinedArray.length; i++) {
        if (combinedArray[i] === 5) {
            fivesScore += 1;
        }
    }

    if (fivesScore > 0) {
        return fivesScore * 5;
    } else {
        return 0;
    }
}

function calculateSixes(combinedArray) {
    let sixesScore = 0;

    for (let i = 0; i < combinedArray.length; i++) {
        if (combinedArray[i] === 6) {
            sixesScore += 1;
        }
    }

    if (sixesScore > 0) {
        return sixesScore * 6;
    } else {
        return 0;
    }
}

function calculateFullHouse(combinedArray) {
    const counts = {};
    for (const num of combinedArray) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    const uniqueCounts = new Set(Object.values(counts));

    if (uniqueCounts.size === 2 && (uniqueCounts.has(2) && uniqueCounts.has(3))) {
        return 25;
    } else {
        return 0;
    }
}

function calculateScores(permanentScores) {
    const upperScores = permanentScores.slice(0, 6);

    const hasUnselectedCategories = upperScores.some(score => score === -1);

    if (!hasUnselectedCategories) {
        const upperTotal = upperScores.reduce((acc, score) => {
            if (score !== -1) {
                return acc + score;
            }
            return acc;
        }, 0);

        const bonusScore = upperTotal >= 63 ? 35 : 0;

        //scores.upperTotal = upperTotal;
        //scores.bonusScore = bonusScore;
        permanentScores[upperIndex] = upperTotal;
        permanentScores[bonusIndex] = bonusScore;

    }
}

function calculateFinalScore(permanentScores) {
    const finalScores = permanentScores.slice(0, 15);

    const hasUnselectedCategories2 = finalScores.some(score => score === -1);

    if (!hasUnselectedCategories2) {
        const FinalTotal = finalScores.reduce((acc, score) => acc + score, 0);
        return FinalTotal;
    } else {
        return 0;
    }
}

