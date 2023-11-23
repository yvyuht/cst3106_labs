# Yahtzee Game

Welcome to the Yahtzee game! This is a simple web-based implementation of the classic Yahtzee dice game. Below, you'll find an overview of the server and client-side scripts, along with instructions on how to play.

## Server-side Script

### Technologies Used
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)

### How to Run
1. Make sure you have Node.js installed on your computer.
2. Navigate to the server directory in your terminal.
3. Run `npm install` to install the necessary dependencies.
4. Run `node yahtzee_server.js` in that directory to start the server.

### Endpoints
- `GET /get-game-state`: Retrieves the current game state. This is used by the client to determine whether to end the game and how to handle certaian actions by the player.
- `POST /click-dice`: Handles clicking on dice to select/deselect them.
- `POST /play-category`: Handles playing a category and updating the game state. This is where much of the game logic is processed.
- `POST /restart-game`: Restarts the game, resetting all variables.
- `GET /roll-dice`: Generates a new set of dice values and calculates scores based on them.

## Client-side Script

### Technologies Used
- HTML
- CSS
- JavaScript

### How to Run
1. After starting the server, open the link listed there for you. It should be something like: 'http://localhost:3000'

### Features
- Roll the dice to get a new set of values.
- Click on dice to select/deselect them. Clicking on a die ensures you retain its value and it does not roll
- Play various Yahtzee categories and score points.
- View game state, including the number of rolls and current round.
- Restart the game after the maximum number of rounds has been reached. This is initialized in the server to 13 rounds, but can be edited by changing the totalRounds variable in the server
- View game rules by hovering over the "rule information" button

## How to Play

1. **Roll the Dice:** Click the "Roll" button to roll the dice. You can roll up to three times per turn.
2. **Select Dice:** Click on individual dice to select or deselect them to strategize and play specific categories.
3. **Score Categories:** Click on the different categories on the scorecard to score points for the current dice values.
4. **Winning:** The game currently consists of 13 rounds. After the 13th round, the final score is calculated, including bonuses for upper section scores. The player with the highest total score wins.

Enjoy playing Yahtzee! If you encounter any issues, check the server logs for more information. Feel free to customize and enhance the game to suit your preferences. Happy gaming!
