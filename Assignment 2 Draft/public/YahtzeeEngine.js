
function calculateThreeOfAKind(combinedArray) {
    const counts = {};
    
    for (const num of combinedArray) {
        counts[num] = (counts[num] || 0) +1;
    }

    for (const num in counts) {
        if (counts[num] >= 3) {
            
            return combinedArray.reduce((total, num)=> total +num);
        }
    }
    return 0;
}


function calculateFourOfAKind(combinedArray) {
    const counts = {};

    for (const num of combinedArray) {
        counts[num] = (counts[num] || 0) +1;
    }

    for (const num in counts) {
        if (counts[num] >= 4) {
            return combinedArray.reduce((total, num)=> total +num);
        }
    }
    return 0;
    
}

function calculateSmallStraight(combinedArray) {
    // Sort and remove duplicates from the dice array for easier comparison
    const sortedDice = Array.from(new Set(combinedArray)).sort((a, b) => a - b);
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



function calculateLargeStraight(combinedArray) {
    // Sort the dice array for easier comparison
    const sortedDice = combinedArray.slice().sort((a, b) => a - b);
    
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



function calculateYahtzee(combinedArray) {
    //Use Set to check if all dice has the same value
    const uniqueValues = new Set(combinedArray);

    if (uniqueValues.size === 1) {
        return 50; 
        }   else {
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
        return onesScore*1;
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
        return twosScore*2;
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
        return threesScore*3;
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
        return foursScore*4;
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
        return fivesScore*5;
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
        return sixesScore*6;
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
        return 25; // Full House score
    } else {
        return 0;
    }
}





function calculateScores(permanentScores) {
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



function calculateFinalScore(permanentScores){
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

