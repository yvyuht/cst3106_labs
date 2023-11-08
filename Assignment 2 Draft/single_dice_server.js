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
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});