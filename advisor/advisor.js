var validator = require('./validator');
var ArgumentError = require('./argumenterror');

var advisor = module.exports;

/**
 * Returns the best keepers to choose from the given game state.
 * @param scorecard The scorecard represented as a 15-integer array.
 * @param upperScore The upper score.
 * @param dice The 5 dice currently held by the player.
 * @param rollsLeft The number of rolls left before scoring.
 * @returns {Array.<number>} The best keepers to choose from the given game state.
 */
advisor.getBestKeepers = function(scorecard, upperScore, dice, rollsLeft) {
    // Validate inputs
    if (!validator.isValidScorecard(scorecard)) throw new ArgumentError('Invalid scorecard: ' + scorecard);
    if (!validator.isValidUpperScore(upperScore)) throw new ArgumentError('Invalid upper score: ' + upperScore);
    if (!validator.isValidDice(dice)) throw new ArgumentError('Invalid dice: ' + dice);
    if (!validator.isValidRollsLeft(rollsLeft)) throw new ArgumentError('Invalid rolls left: ' + rollsLeft);
};

/**
 * Returns the best category to score in from the given game state.
 * @param scorecard The scorecard represented as a 15-integer array.
 * @param upperScore The upper score.
 * @param dice The 5 dice currently held by the player.
 * @returns {Number|number} The best category to score in from the given game state.
 */
advisor.getBestCategory = function(scorecard, upperScore, dice) {
    // Validate inputs
    if (!validator.isValidScorecard(scorecard)) throw new ArgumentError('Invalid scorecard: ' + scorecard);
    if (!validator.isValidUpperScore(upperScore)) throw new ArgumentError('Invalid upper score: ' + upperScore);
    if (!validator.isValidDice(dice)) throw new ArgumentError('Invalid dice: ' + dice);
};