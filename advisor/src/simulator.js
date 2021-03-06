var advisor = require('./advisor');
var scorecalc = require('./score-calculator');
var _ = require('lodash');

/** 
 * @module simulator 
 */
var simulator = module.exports;

/**
 * Initialize the module.
 * @memberof module:simulator
 * @param settings {Object} An object containing settings.
 */
simulator.init = function(initSettings) {
    advisor.init(initSettings);
};

/**
 * Simulates a single game using the strategy implemented in the advisor module.
 * @memberof module:simulator
 * @return {number} The score of the yahtzee game.
 */
simulator.simulateGame = function() {
    // Initialize game state
    var scorecard = new Array(15).fill(false), score = 0, upperScore = 0;

    // Loop over all the rounds in the game
    for (var i = 0; i < 15; i++) {
        // Simulate the round
        var result = simulator.simulateRound(scorecard, score, upperScore);

        // Extract the results
        scorecard = result.scorecard;
        score = result.score;
        upperScore = result.upperScore;
    }

    return score;
};

/**
 * Simulates a single round using the strategy implemented in the advisor module.
 * @memberof module:simulator
 * @param scorecard {boolean[]} The scorecard at the beginning of the round.
 * @param score {number} The score at the beginning of the round.
 * @param upperScore {number} The upper score at the beginning of the round.
 * @returns {{scorecard: Array, score: number, upperScore: number}} The new game state.
 */
simulator.simulateRound = function(scorecard, score, upperScore) {
    // Go through two rounds of rolling dice
    var dice = rollDice(5);
    var firstKeepers = advisor.getBestKeepers(scorecard, upperScore, dice, 2);
    dice = rollRemainingDice(firstKeepers);
    var secondKeepers = advisor.getBestKeepers(scorecard, upperScore, dice, 1);
    dice = rollRemainingDice(secondKeepers);

    // Get the best category to score in and its score
    var category = advisor.getBestCategory(scorecard, upperScore, dice);
    var categoryScore = scorecalc.getCategoryScore(category, dice);

    // Get game state flags
    var isUpperCategory = category < 6;
    var triggersBonus = isUpperCategory && upperScore < 63 && (upperScore + categoryScore) >= 63;

    return {
        scorecard: markedScorecard(scorecard, category),
        score: score + categoryScore + (triggersBonus ? 50 : 0),
        upperScore: upperScore + (isUpperCategory ? categoryScore : 0)
    };
};

/**
 * Rolls a given number of dice and returns an arrary containing the result.
 * @private
 * @param  {number} size The number of dice to roll.
 * @return {number[]} An array containing the resulting dice.
 */
function rollDice(size) {
    return _.range(size).map(x => Math.floor(Math.random() * 6) + 1);
}

/**
 * Takes the given dice and rolls the remaining (5 - dice.length) dice.
 * The result is the combination of the two.
 * @private
 * @param dice The dice to start out with.
 * @returns {Array} The merged roll with 5 dice.
 */
function rollRemainingDice(dice) {
    return _.concat(dice, rollDice(5 - dice.length));
}

/**
 * Clones the given scorecard and returns the clone with the marked category.
 * @private
 * @param scorecard {boolean[]} The scorecard to clone.
 * @param i {number} The category to mark as scored.
 * @returns {boolean[]} The cloned scorecard with the marked category.
 */
function markedScorecard(scorecard, i) {
    var newScorecard = _.clone(scorecard);
    newScorecard[i] = true;
    return newScorecard;
}
