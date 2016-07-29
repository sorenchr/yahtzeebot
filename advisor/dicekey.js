var _ = require('lodash');

/**
 * Generates a key based on the cardinality of the given dice.
 * @param dice The dice to generate a key for.
 * @returns {string} The key representing the given dice.
 */
var dicekey = function(dice) {
    var key = new Array(6).fill(0);
    var countMap = _.countBy(dice);
    return key.map((val, i) => countMap[i+1] ? countMap[i+1] : 0).join('');
};

module.exports = dicekey;