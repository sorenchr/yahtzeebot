var validator = require('./validator');
var ArgumentError = require('./argumenterror');
var InitializationError = require('./initializationerror');
var _ = require('lodash');
var scorecalc = require('./score-calculator');
var StateMap = require('./statemap');
var cmb = require('./combinatorics');
var FinalRollsMap = require('./finalrollsmap');
var KeepersMap = require('./keepersmap');
var RollsMap = require('./rollsmap');

var advisor = module.exports;

// The StateMap used for EV lookups
var settings;

/**
 * Initialize the module.
 * @param settings An object containing settings.
 */
advisor.init = function(initSettings) {
    if (!isValidSettings(initSettings)) throw new ArgumentError('Invalid settings: ' + initSettings);
    settings = initSettings;
};

/**
 * Checks if the given settings are valid.
 * @param settings The settings to check.
 * @returns {boolean} True if the settings are valid, false otherwise.
 */
function isValidSettings(settings) {
    if (settings !== Object(settings)) return false;
    if (Array.isArray(settings)) return false;
    if (!('stateMap' in settings)) return false;
    if (!(settings['stateMap'] instanceof StateMap)) return false;
    return true;
}

/**
 * Returns the best keepers to choose from the given game state.
 * @param scorecard The scorecard represented as a 15-integer array.
 * @param upperScore The upper score.
 * @param dice The 5 dice currently held by the player.
 * @param rollsLeft The number of rolls left before scoring.
 * @returns {Array.<number>} The best keepers to choose from the given game state.
 */
advisor.getBestKeepers = function(scorecard, upperScore, dice, rollsLeft) {
    // Check that module has been initialized
    if (!settings) throw new InitializationError('Module has not been initialized via init()');

    // Validate inputs
    if (!validator.isValidScorecard(scorecard)) throw new ArgumentError('Invalid scorecard: ' + scorecard);
    if (!_.includes(scorecard, false)) throw new ArgumentError('Scorecard is full: ' + scorecard);
    if (!validator.isValidUpperScore(upperScore)) throw new ArgumentError('Invalid upper score: ' + upperScore);
    if (!validator.isValidDice(dice)) throw new ArgumentError('Invalid dice: ' + dice);
    if (!validator.isValidRollsLeft(rollsLeft)) throw new ArgumentError('Invalid rolls left: ' + rollsLeft);

    // Generate the final rolls for this state
    var finalRollsMap = new FinalRollsMap(scorecard, upperScore, settings['stateMap']);

    // Generate the second keepers based on the final rolls
    var secondKeepers = new KeepersMap(finalRollsMap);

    // If rollsLeft=1 then the best keepers among the second keepers are selected
    if (rollsLeft === 1) return getBestKeepers(dice, secondKeepers);

    // Generate the second rolls based on the second keepers
    var secondRolls = new RollsMap(secondKeepers);

    // Generate the first keepers based on the second rolls
    var firstKeepers = new KeepersMap(secondRolls);

    // // If rollsLeft=2 then the best keepers among the first keepers are selected
    if (rollsLeft === 2) return getBestKeepers(dice, firstKeepers);
};

/**
 * Retrieves the best keepers from the given roll in the given map
 * of keepers and their EV's.
 * @param roll The roll from which the best keepers will be selected.
 * @param allKeepers A map of keepers and their associated EV.
 * @returns {Array} The best keepers to select from the given roll.
 */
function getBestKeepers(roll, allKeepers) {
    var bestKeepers = [];
    var bestKeepersEV = 0;

    // Iterate through all possible keepers from this roll
    cmb.getKeepers(roll).forEach(function(keepers) {
        var keepersEV = allKeepers.getEV(keepers);
        if (keepersEV >= bestKeepersEV) {
            bestKeepersEV = keepersEV;
            bestKeepers = keepers;
        }
    });

    return bestKeepers;
}

/**
 * Returns the best category to score in from the given game state.
 * @param scorecard The scorecard represented as a 15-integer array.
 * @param upperScore The upper score.
 * @param dice The 5 dice currently held by the player.
 * @returns {number} The best category to score in from the given game state.
 */
advisor.getBestCategory = function(scorecard, upperScore, dice) {
    // Check that module has been initialized
    if (!settings) throw new InitializationError('Module has not been initialized via init()');

    // Validate inputs
    if (!validator.isValidScorecard(scorecard)) throw new ArgumentError('Invalid scorecard: ' + scorecard);
    if (!validator.isValidUpperScore(upperScore)) throw new ArgumentError('Invalid upper score: ' + upperScore);
    if (!_.includes(scorecard, false)) throw new ArgumentError('Scorecard is full: ' + scorecard);
    if (!validator.isValidDice(dice)) throw new ArgumentError('Invalid dice: ' + dice);

    // Initialize variables to keep track of the best possible category
    var bestCategory = 0, bestCategoryEV = 0;

    // Iterate through each unmarked category
    for (var i = 0; i < scorecard.length; i++) {
        // Skip marked categories
        if (scorecard[i] != 0) continue;

        // Create a new scorecard where the category is marked
        var newScorecard = markedScorecard(scorecard, i);

        // Find the new upper score from scoring in this category
        var categoryScore = scorecalc.getCategoryScore(i, dice);
        var isUpperCategory = i >= 0 && i <= 5;
        var newUpperScore = isUpperCategory ? upperScore + categoryScore : upperScore;

        // Calculate the category EV
        var categoryEV = settings['stateMap'].getEV(newScorecard, newUpperScore) + categoryScore;

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
function markedScorecard(scorecard, i) {
    var newScorecard = _.clone(scorecard);
    newScorecard[i] = true;
    return newScorecard;
}