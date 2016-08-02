var cmb = require('./combinatorics');
var scorecalc = require('./score-calculator');
var _ = require('lodash');
var DiceMap = require('./dicemap');
var gens = require('./generators');

/**
 * Represents a map of final rolls and their EV's.
 * @param scorecard The scorecard used in constructing the final rolls.
 * @param upperScore The upper score used in constructing the final rolls.
 * @constructor
 */
var FinalRollsMap = function(scorecard, upperScore, stateMap) {
    var rollsEV = new DiceMap();

    // Loop through each possible roll and calculate their EV's
    cmb.getAllRolls().forEach(function(roll) {
        var rollEV = 0; // Will contain the EV for this roll

        // Iterate through each unmarked category
        for (var i = 0; i < scorecard.length; i++) {
            // Skip marked categories
            if (scorecard[i] != 0) continue;

            // Find the new upper score from scoring in this category
            var categoryScore = scorecalc.getCategoryScore(i, roll);
            var isUpperCategory = i >= 0 && i <= 5;
            var newUpperScore = isUpperCategory ? upperScore + categoryScore : upperScore;

            // Calculate the category EV
            var newScorecard = gens.markedScorecard(scorecard, i);
            var categoryEV = stateMap.getEV(newScorecard, newUpperScore) + categoryScore;

            // Check if scoring the category results in the upper section bonus
            if (upperScore < 63 && newUpperScore >= 63) categoryEV += 50;

            // Check if this is the best EV for the category
            if (categoryEV > rollEV) rollEV = categoryEV;
        }

        // Store the EV for this roll
        rollsEV.add(roll, rollEV);
    });

    this.rollsEV = rollsEV;
};

/**
 * Returns the EV for the given roll.
 * @param roll The roll to look up EV for.
 * @returns {number} The EV for the given roll.
 */
FinalRollsMap.prototype.getEV = function(roll) {
    return this.rollsEV.get(roll);
};

module.exports = FinalRollsMap;