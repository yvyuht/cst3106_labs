const express = require('express');

const app = express();
const PORT = 3000;


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
    console.log('return array',diceValue);
    console.log('return rotate',rotationValue);
});

app.post('/updateScores', (req,res)=> {
const diceValues = req.body.diceValues;
const threeOfAKindScore = calculateThreeOfAKind(diceValues);
const fourOfAKindScore = calculateFourOfAKind(diceValues);
const smallStraightScore = calculateSmallStraight(diceValues);

    const scores = {
        threeOfAKind: threeOfAKindScore,
        fourOfAKind: fourOfAKindScore,
        smallStraight: smallStraightScore,
    };

    res.json(scores);

});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});


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
  
