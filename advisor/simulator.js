var advisor = require('./advisor');
var scorecalc = require('./score-calculator');

var simulator = module.exports;

/**
 * Simulates a single game of yahtzee using the strategy implemented
 * in the advisor module.
 * @return {number} The score of the yahtzee game.
 */
simulator.simulate = function() {
    // Initialize game state
    var scorecard = new Array(15).fill(false), totalScore = 0, upperScore = 0;

    // Loop over all the rounds in the game
    for (var i = 0; i < 15; i++) {
        // Roll the dice
        var dice = rollDice(5);

        // Loop over all the rolls left
        for (var rollsLeft = 2; rollsLeft > 0; rollsLeft--) {
            // Get the best keepers for these dice
            var keepers = advisor.getBestKeepers(scorecard, upperScore, dice, rollsLeft);

            // Roll the remaining dice
            var newDice = rollDice(5 - keepers.length);

            // Merge the new dice with the keepers
            dice = keepers.concat(newDice);
        }

        // Get the best category to score in
        var category = advisor.getBestCategory(scorecard, upperScore, dice);

        // Mark the scorecard
        scorecard[category] = true;

        // Get the score for the category
        var score = scorecalc.getCategoryScore(category, dice);

        // Check if the score should be added to the upper score
        if (category < 6) {
            upperScore += score;
        }

        // Add the score to the total game score
        totalScore += score;
    }

    // Check if the upper score has released a bonus
    if (upperScore >= 63) {
        totalScore += 50;
    }

    return totalScore;
};

/**
 * Rolls a given number of dice and returns an arrary containing the result.
 * @param  {number} nDice The number of dice to roll.
 * @return {object} An array containing the resulting dice.
 */
function rollDice(nDice) {
    var dice = new Array(nDice);

    for (var i = 0; i < dice.length; i++) {
        dice[i] = Math.floor(Math.random() * 6) + 1;
    }

    return dice;
}
