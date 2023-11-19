const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/roll-dice', (req, res) => {
    let diceValue = [];
    let rotationValue = [];
    for (let i = 0; i < 5; i++) {
      diceValue.push(Math.floor(Math.random() * 6) + 1);
      rotationValue.push(Math.floor(Math.random() * 360) + 1);
    }

    const data ={
      diceValue: diceValue,
      rotationValue: rotationValue.map(value => value + "deg")
    }
    res.json(data);
    console.log('return diceValue array',diceValue);
    
});

app.post('/calculate-score', (req,res)=> {

    const diceElements = req.body.diceElements; 
    let scores = {};
    
    console.log('return diceElement from client request', diceElements);


    function calculateThreeOfAKind(diceElements) {
        const counts = {};
        
        for (const num of diceElements) {
            counts[num] = (counts[num] || 0) +1;
        }
    
        for (const num in counts) {
            if (counts[num] >= 3) {
                
                return diceElements.reduce((total, num)=> total +num);
            }
        }
        return 0;
    }
    
    
    function calculateFourOfAKind(diceElements) {
        const counts = {};
    
        for (const num of diceElements) {
            counts[num] = (counts[num] || 0) +1;
        }
    
        for (const num in counts) {
            if (counts[num] >= 4) {
                return diceElements.reduce((total, num)=> total +num);
            }
        }
        return 0;
        
    }
    
    function calculateSmallStraight(diceElements) {
        // Sort and remove duplicates from the dice array for easier comparison
        const sortedDice = Array.from(new Set(diceElements)).sort((a, b) => a - b);
        console.log('sorted array', sortedDice);
        
        // A Small Straight is a sequence of four consecutive numbers
        // Loop through the sorted dice to find a sequence of four numbers
        for (let i = 0; i <= sortedDice.length - 4; i++) {
            if (sortedDice[i] === sortedDice[i + 1] - 1 &&
                sortedDice[i + 1] === sortedDice[i + 2] - 1 &&
                sortedDice[i + 2] === sortedDice[i + 3] - 1) {
                return 30; // Return 30 points for Small Straight
            }
        }
    
        return 0; // Return null points if no Small Straight is found
    }
    
    
    
    function calculateLargeStraight(diceElements) {
        // Sort the dice array for easier comparison
        const sortedDice = diceElements.slice().sort((a, b) => a - b);
        
        // A Large Straight is a sequence of four consecutive numbers
        // Loop through the sorted dice to find a sequence of five numbers
        for (let i = 0; i <= sortedDice.length - 4; i++) {
            if (sortedDice[i] === sortedDice[i + 1] - 1 &&
                sortedDice[i + 1] === sortedDice[i + 2] - 1 &&
                sortedDice[i + 2] === sortedDice[i + 3] - 1 &&
                sortedDice[i + 3] === sortedDice[i + 4] - 1) {
                return 40; // Return 40 points for Large Straight
            }
        }
    
        return 0; // Return null points if no Large Straight is found
    }
    
    
    
    function calculateYahtzee(diceElements) {
        //Use Set to check if all dice has the same value
        const uniqueValues = new Set(diceElements);
    
        if (uniqueValues.size === 1) {
            return 50; 
            }   else {
                return 0;
            }
    
    }
    
    
    function calculateChance(diceElements) {
        return diceElements.reduce((total, num) => total + num, 0);
    }
    
    
    function calculateOnes(diceElements) {
        let onesScore = 0;
    
        for (let i = 0; i < diceElements.length; i++) {
            if (diceElements[i] === 1) {
                onesScore += 1;
            }
        }
    
      
    
        if (onesScore > 0) {
            return onesScore*1;
        } else {
            return 0;
        }
    }
    
    function calculateTwos(diceElements) {
        let twosScore = 0;
    
        for (let i = 0; i < diceElements.length; i++) {
            if (diceElements[i] === 2) {
                twosScore += 1;
            }
        }
    
     
    
        if (twosScore > 0) {
            return twosScore*2;
        } else {
            return 0;
        }
    }
    
    function calculateThrees(diceElements) {
        let threesScore = 0;
    
        for (let i = 0; i < diceElements.length; i++) {
            if (diceElements[i] === 3) {
                threesScore += 1;
            }
        }
    
        if (threesScore > 0) {
            return threesScore*3;
        } else {
            return 0;
        }
    }
    
    function calculateFours(diceElements) {
        let foursScore = 0;
    
        for (let i = 0; i < diceElements.length; i++) {
            if (diceElements[i] === 4) {
                foursScore += 1;
            }
        }
    
        
    
        if (foursScore > 0) {
            return foursScore*4;
        } else {
            return 0;
        }
    }
    
    function calculateFives(diceElements) {
        let fivesScore = 0;
    
        for (let i = 0; i < diceElements.length; i++) {
            if (diceElements[i] === 5) {
                fivesScore += 1;
            }
        }
    
        if (fivesScore > 0) {
            return fivesScore*5;
        } else {
            return 0;
        }
    }
    
    function calculateSixes(diceElements) {
        let sixesScore = 0;
    
        for (let i = 0; i < diceElements.length; i++) {
            if (diceElements[i] === 6) {
                sixesScore += 1;
            }
        }
    
        if (sixesScore > 0) {
            return sixesScore*6;
        } else {
            return 0;
        }
    }
    
    function calculateFullHouse(diceElements) {
        const counts = {};
        for (const num of diceElements) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
    
        const uniqueCounts = new Set(Object.values(counts));
    
        if (uniqueCounts.size === 2 && (uniqueCounts.has(2) && uniqueCounts.has(3))) {
            return 25; // Full House score
        } else {
            return 0;
        }
    }
    
    
    
    
    
    function calculateScores(diceElements) {
        // Check if all categories from Ones to Sixes have been selected
        const upperScores = permanentScores.slice(0, 6);
    
        // Check if there are any unselected categories (indicated by 0)
        const hasUnselectedCategories = upperScores.some(score => score === -1);
    
        if (!hasUnselectedCategories) {
            // Filter out 0 values (indicating not selected) and sum up the valid scores
            const upperTotal = upperScores.reduce((acc, score) => {
                if (score !== -1) {
                    return acc + score;
                }
                return acc;
            }, 0);
    
            // Calculate bonus score based on valid scores
            const bonusScore = upperTotal >= 63 ? 35 : 0;
    
            // Return an object containing both validScores and bonusScore
            return {
                upperTotal: upperTotal,
                bonusScore: bonusScore
            };
        } else {
            // Return null if not all categories have been selected
            return 0;
        }
    }
    
    
    
    function calculateFinalScore(diceElements){
        // Check if all categories from Ones to Sixes have been selected
        const finalScores = permanentScores.slice(0, 15);
    
        // Check if there are any unselected categories (indicated by 0)
        const hasUnselectedCategories2 = finalScores.some(score => score === -1);
    
        if (!hasUnselectedCategories2) {
            // Calculate total score by summing up all the scores in permanentScores
            const FinalTotal = finalScores.reduce((acc, score) => acc + score, 0) ;
            return FinalTotal;
                 
        } else {
            // Return null if not all categories have been selected
            return 0;
    }
    }



    const OneScore = calculateOnes(diceElements);
    const TwoScore = calculateTwos(diceElements);
    const ThreeScore = calculateThrees(diceElements);
    const FourScore = calculateFours(diceElements);
    const FiveScore = calculateFives(diceElements);
    const SixScore = calculateSixes(diceElements);
    const ChanceScore = calculateChance(diceElements);
    const threeOfAKindScore = calculateThreeOfAKind(diceElements);
    const fourOfAKindScore = calculateFourOfAKind(diceElements);
    const fullHouseScoreValue = calculateFullHouse(diceElements);
    const smallStraightScore = calculateSmallStraight(diceElements);
    const largeStraightScore = calculateLargeStraight(diceElements);
    const yahtzeeScore = calculateYahtzee(diceElements);

    scores = {
        Ones:OneScore,
        Twos:TwoScore,
        Threes:ThreeScore,
        Fours:FourScore,
        Fives:FiveScore,
        Sixes:SixScore,
        Chance:ChanceScore,
        threeOfAKind: threeOfAKindScore,
        fourOfAKind: fourOfAKindScore,
        fullHouse:fullHouseScoreValue,
        smallStraight: smallStraightScore,
        largeStraight: largeStraightScore,
        yahtzee:yahtzeeScore,

    };

    res.json({scores: scores});

  
    

});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});

