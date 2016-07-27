var validator = require('./validator');
var ArgumentError = require('./argumenterror');
var _ = require('lodash');
var scorecalc = require('./score-calculator');
var StateMap = require('./statemap');
var cmb = require('./combinatorics');
var prob = require('./probability');

var advisor = module.exports;

// The StateMap used for EV lookups
var stateMap;

/**
 * Initialize the module.
 * @param settings An object containing settings.
 */
advisor.init = function(settings) {
    if (!isValidSettings(settings)) throw new ArgumentError('Invalid settings: ' + settings);
    stateMap = settings['stateMap'];
};

/**
 * Checks if the given settings are valid and contains a StateMap.
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
    // Validate inputs
    if (!validator.isValidScorecard(scorecard)) throw new ArgumentError('Invalid scorecard: ' + scorecard);
    if (!_.includes(scorecard, false)) throw new ArgumentError('Scorecard is full: ' + scorecard);
    if (!validator.isValidUpperScore(upperScore)) throw new ArgumentError('Invalid upper score: ' + upperScore);
    if (!validator.isValidDice(dice)) throw new ArgumentError('Invalid dice: ' + dice);
    if (!validator.isValidRollsLeft(rollsLeft)) throw new ArgumentError('Invalid rolls left: ' + rollsLeft);

    // Generate the final rolls for this state
    var finalRollsMap = new FinalRollsMap(scorecard, upperScore);

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
 * Represents a map of final rolls and their EV's.
 * @param scorecard The scorecard used in constructing the final rolls.
 * @param upperScore The upper score used in constructing the final rolls.
 * @constructor
 */
var FinalRollsMap = function(scorecard, upperScore) {
    var rollsEV = {};

    // Loop through each possible roll and calculate their EV's
    cmb.getAllRolls().forEach(function(roll) {
        // Get the best category to score in for this roll
        var bestCategory = advisor.getBestCategory(scorecard, upperScore, roll);

        // Find the new upper score from scoring in this category
        var categoryScore = scorecalc.getCategoryScore(bestCategory, roll);
        var isUpperCategory = bestCategory >= 0 && bestCategory <= 5;
        var newUpperScore = isUpperCategory ? upperScore + categoryScore : upperScore;

        // Calculate the category EV
        var newScorecard = getMarkedScorecard(scorecard, bestCategory);
        var bestCategoryEV = stateMap.getEV(newScorecard, newUpperScore) + categoryScore;

        // Check if scoring the category results in the upper section bonus
        if (upperScore < 63 && newUpperScore >= 63) bestCategoryEV += 50;

        // Store the EV for this roll
        var key = roll.sort().join('');
        rollsEV[key] = bestCategoryEV;
    });

    this.rollsEV = rollsEV;
};

/**
 * Returns the EV for the given roll.
 * @param roll The roll to look up EV for.
 * @returns {number} The EV for the given roll.
 */
FinalRollsMap.prototype.getEV = function(roll) {
    var key = roll.sort().join('');
    return this.rollsEV[key];
};

/**
 * Represents a map of keepers and their EV's.
 * @param nextRolls A map of the next rolls these keepers should refer to.
 * @constructor
 */
var KeepersMap = function(nextRolls) {
    var keepersEV = {};

    // Loop through each possible keepers and calculate their EV's
    cmb.getAllKeepers().forEach(function(keepers) {
        var evSum = 0; // Will contain the total EV for these keepers

        // Iterate through all possible rolls resulting from these keepers
        cmb.getRolls(keepers).forEach(function(roll) {
            var remDice = subtractDice(roll, keepers);
            evSum += prob.getDiceProbability(remDice) * nextRolls.getEV(roll);
        });

        // Store the EV for these keepers
        var key = keepers.sort().join('');
        keepersEV[key] = evSum;
    });

    this.keepersEV = keepersEV;
};

/**
 * Subtracts all dice in `b` from the dice in `a`. Essentially
 * a subtraction of cardinalities.
 * @param a The first array.
 * @param b The second array that will subtracted from the first array.
 * @returns {Array.<number>} The difference between the two arrays.
 */
function subtractDice(a, b) {
    var newDice = a.slice(0);

    for (var i = 0; i < b.length; i++) {
        for (var k = 0; k < newDice.length; k++) {
            if (newDice[k] == b[i]) {
                newDice.splice(k, 1);
                break;
            }
        }
    }

    return newDice;
}

/**
 * Returns the EV for the given keepers.
 * @param keepers The keepers to look up EV for.
 * @returns {number} The EV for the given keepers.
 */
KeepersMap.prototype.getEV = function(keepers) {
    var key = keepers.sort().join('');
    return this.keepersEV[key];
};

/**
 * Represents a map of rolls and their EV's.
 * @param nextKeepers A map of the next keepers these rolls should refer to.
 * @constructor
 */
var RollsMap = function(nextKeepers) {
    var rollsEV = {};

    // Iterate through all possible rolls and calculate their EV's
    cmb.getAllRolls().forEach(function(roll) {
        var ev = 0;

        // Iterate through all possible keepers resulting from this roll
        cmb.getKeepers(roll).forEach(function(keepers) {
            var keepersEV = nextKeepers.getEV(keepers);
            if (keepersEV >= ev) ev = keepersEV;
        });

        var key = roll.sort().join('');
        rollsEV[key] = ev;
    });

    this.rollsEV = rollsEV;
};

/**
 * Returns the EV for the given roll.
 * @param roll The roll to look up EV for.
 * @returns {number} The EV for the given roll.
 */
RollsMap.prototype.getEV = function(roll) {
    var key = roll.sort().join('');
    return this.rollsEV[key];
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