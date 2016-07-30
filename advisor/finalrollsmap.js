var cmb = require('./combinatorics');
var advisor = require('./advisor');
var scorecalc = require('./score-calculator');
var _ = require('lodash');
var dicekey = require('./dicekey');

/**
 * Represents a map of final rolls and their EV's.
 * @param scorecard The scorecard used in constructing the final rolls.
 * @param upperScore The upper score used in constructing the final rolls.
 * @constructor
 */
var FinalRollsMap = function(scorecard, upperScore, stateMap) {
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
        rollsEV[dicekey(roll)] = bestCategoryEV;
    });

    this.rollsEV = rollsEV;
};

/**
 * Returns the EV for the given roll.
 * @param roll The roll to look up EV for.
 * @returns {number} The EV for the given roll.
 */
FinalRollsMap.prototype.getEV = function(roll) {
    return this.rollsEV[dicekey(roll)];
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

module.exports = FinalRollsMap;