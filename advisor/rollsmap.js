var cmb = require('./combinatorics');
var dicekey = require('./dicekey');

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

        rollsEV[dicekey(roll)] = ev;
    });

    this.rollsEV = rollsEV;
};

/**
 * Returns the EV for the given roll.
 * @param roll The roll to look up EV for.
 * @returns {number} The EV for the given roll.
 */
RollsMap.prototype.getEV = function(roll) {
    return this.rollsEV[dicekey(roll)];
};

module.exports = RollsMap;