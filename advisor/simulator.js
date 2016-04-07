var advisor = require('./advisor');
var scorecalc = require('./score-calculator');

module.exports = (function() {

    var mod = {};

    mod.simulate = function() {
        // Initialize game state
        scorecard = Array(15);
        for (var i = 0; i < scorecard.length; i++) scorecard[i] = 0;
        totalScore = 0;
        upperScore = 0;

        // Loop over all the rounds in the game
        for (var i = 0; i < 15; i++) {
            // Roll the dice
            dice = rollDice(5);

            // Loop over all the rolls left
            for (var rollsLeft = 3; rollsLeft > 0; rollsLeft--) {
                // Get the best keepers for these dice
                var keepers = advisor.getBestKeepers(scorecard, upperScore, dice, rollsLeft)

                // Roll the remaining dice
                newDice = rollDice(5 - keepers.length);

                // Get the face values of the keepers
                var keepersValues = keepers.map(function(x) {
                    return dice[x];
                });

                // Merge the new dice with the keepers
                dice = keepersValues.concat(newDice);
            }

            // Get the best category to score in
            category = advisor.getBestCategory(scorecard, upperScore, dice);

            // Mark the scorecard
            scorecard[category] = 1;

            // Get the score for the category
            score = scorecalc.getCategoryScore(category, dice);

            // Check if the score should be added to the upper score
            if (category < 6) {
                upperScore += score;
            }

            // Add the score to the total game score
            totalScore += score;
        }

        // Check if the upper score has released a bonus
        if (upperScore >= 63) {
            score += 50;
        }

        return totalScore;
    };

    function rollDice(nDice) {
        var dice = Array(nDice);

        for (var i = 0; i < 5; i++) {
            dice[i] = Math.floor(Math.random() * 6) + 1;
        }

        return dice;
    }

    return mod;

})();
