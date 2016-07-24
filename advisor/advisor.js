var validator = require('./validator');
var ArgumentError = require('./argumenterror');
var _ = require('lodash');
var scorecalc = require('./score-calculator');

var advisor = module.exports;

// The StateMap used for EV lookups
var stateMap;

/**
 * Initialize the module.
 * @param config An object containing settings.
 */
advisor.init = function(config) {
    stateMap = config['stateMap'];
};

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

    // Initialize variables to keep track of the best possible category
    var bestCategory = 0, bestCategoryEV = 0;

    // Iterate through each unmarked category
    for (var i = 0; i < scorecard.length; i++) {
        // Skip marked categories
        if (scorecard[i] != 0) continue;

        // Create a new scorecard where the category is marked
        var newScorecard = getMarkedScorecard(scorecard, i);

        // Find the new upper score from scoring in this category
        var categoryScore = scorecalc.getCategoryScore(i, dice);
        var isUpperCategory = i >= 0 && i <= 5;
        var newUpperScore = isUpperCategory ? upperScore + categoryScore : upperScore;

        // Calculate the category EV
        var categoryEV = stateMap.getEV(newScorecard, newUpperScore) + categoryScore;

        // Check if scoring the category results in the upper section bonus
        if (upperScore < 63 && newUpperScore >= 63) categoryEV += 50;

        // Check if this is the best category so far
        if (categoryEV >= bestCategoryEV) {
            bestCategory = i;
            bestCategoryEV = categoryEV;
        }
    }

    return bestCategory;
};

/**
 * Clones the given scorecard and returns the clone with the marked category.
 * @param scorecard The scorecard to clone.
 * @param i The category to mark as scored.
 * @returns {Array} The cloned scorecard with the marked category.
 */
function getMarkedScorecard(scorecard, i) {
    var newScorecard = _.clone(scorecard);
    newScorecard[i] = true;
    return newScorecard;
}