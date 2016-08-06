var _ = require('lodash');

/**
 * Represents a new empty StateMap.
 * @constructor
 */
var StateMap = function(map) {
    this.map = map || {};
};

/**
 * Returns the stored EV for the given scorecard and upper score pair.
 * @param scorecard The scorecard to lookup EV for.
 * @param upperScore The upper score to lookup EV for.
 * @returns {float|null} The EV for the given scorecard and upper score pair,
 * or null if no EV entry exists.
 */
StateMap.prototype.getEV = function(scorecard, upperScore) {
    // Generate the scorecard key
    scorecard = scorecardToString(scorecard);

    // Cap the upper score at 63 (anything above doesn't matter)
    if (upperScore > 63) upperScore = 63;

    // Check if the entry exists
    if (!(scorecard in this.map) || !(upperScore in this.map[scorecard])) return null;

    return this.map[scorecard][upperScore];
};

/**
 * Stores the given EV for the given scorecard and upper score pair.
 * @param scorecard The scorecard to store the EV for.
 * @param upperScore The upper score to store the EV for.
 * @param ev The EV to store for the scorecard and upper score pair.
 */
StateMap.prototype.addEV = function (scorecard, upperScore, ev) {
    // Generate the scorecard key
    scorecard = scorecardToString(scorecard);

    // Cap the upper score at 63 (anything above doesn't matter)
    if (upperScore > 63) upperScore = 63;

    // Initialize the scorecard entry if needed
    if (!(scorecard in this.map)) this.map[scorecard] = {};

    // Store the EV entry
    this.map[scorecard][upperScore] = ev;
};

/**
 * Generates a string representation of the given scorecard array.
 * @param scorecard The scorecard that used for the string representation.
 * @returns {string} A string representation of the given scorecard array.
 */
function scorecardToString(scorecard) {
    return scorecard.map(x => x ? 1 : 0).join('');
}

/**
 * Retrieves the total number of states saved in this StateMap.
 * @returns {number} The total number of states saved in this StateMap.
 */
StateMap.prototype.size = function() {
    return _.keys(this.map).reduce((prev, curr) => prev + _.size(this.map[curr]), 0);
};

/**
 * Converts this StateMap into JSON format.
 * @returns {Object} A JSON object representing this map.
 */
StateMap.prototype.toJSON = function() {
    return this.map;
};

module.exports = StateMap;
