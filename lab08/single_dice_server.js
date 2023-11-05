const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/roll-dice', (req, res) => {
    let diceValues = [];
    for (let i = 0; i < 5; i++) {
      diceValues.push(Math.floor(Math.random() * 6) + 1);
    }
    res.json(diceValues);
});
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});