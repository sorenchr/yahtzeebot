var cmb = require('./combinatorics');
var prob = require('./probability');
var DiceMap = require('./dicemap');

/**
 * Represents a map of keepers and their EV's.
 * @param nextRolls A map of the next rolls these keepers should refer to.
 * @constructor
 */
var KeepersMap = function(nextRolls) {
    var keepersEV = new DiceMap();

    // Loop through each possible keepers and calculate their EV's
    cmb.getAllKeepers().forEach(function(keepers) {
        var evSum = 0; // Will contain the total EV for these keepers

        // Iterate through all possible rolls resulting from these keepers
        cmb.getRolls(keepers).forEach(function(roll) {
            var remDice = subtractDice(roll, keepers);
            evSum += prob.getDiceProbability(remDice) * nextRolls.getEV(roll);
        });

        // Store the EV for these keepers
        keepersEV.add(keepers, evSum);
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
    return this.keepersEV.get(keepers);
};

module.exports = KeepersMap;