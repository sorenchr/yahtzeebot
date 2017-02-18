var _ = require('lodash');

/**
 * Represents a map from dice to a value. The dice
 * acts as keys and are stored based on their cardinality.
 * @constructor
 */
var DiceMap = function() {
    this.map = {};
};

/**
 * Adds the given value to the map with the given dice as key.
 * @param dice {number[]} The dice to use as key.
 * @param value {*} The value to store.
 */
DiceMap.prototype.add = function(dice, value) {
    this.map[key(dice)] = value;
};

/**
 * Retrieves the value for the given dice.
 * @param dice {number[]} The dice to use as key.
 * @returns {*} The value stored for the given dice.
 */
DiceMap.prototype.get = function(dice) {
    return this.map[key(dice)];
};

/**
 * Checks if the given dice exists as a key in the map.
 * @param dice {number[]} The dice to use as key.
 * @returns {boolean} True if the key exists, false otherwise.
 */
DiceMap.prototype.has = function(dice) {
    return key(dice) in this.map;
};

/**
 * Returns the size of this map.
 * @returns {number} The size of this map.
 */
DiceMap.prototype.size = function() {
    return _.size(this.map);
};

/**
 * Generates a key based on the cardinality of the given dice.
 * @private
 * @param dice {number[]} The dice to generate a key for.
 * @returns {string} The key representing the given dice.
 */
function key(dice) {
    var key = new Array(6).fill(0);
    var countMap = _.countBy(dice);
    return key.map((val, i) => countMap[i+1] ? countMap[i+1] : 0).join('');
}

module.exports = DiceMap;