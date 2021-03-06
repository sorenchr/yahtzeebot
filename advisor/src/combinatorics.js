var _ = require('lodash');
var DiceMap = require('./dicemap');

/** 
 * @module combinatorics 
 */
var combinatorics = module.exports;

// Generate all rolls and keepers available
var allRolls = dice(5), allKeepers = diceUpTo(5);

// Setup caches for keepers from all rolls, and rolls from all keepers
var keepersCache = new DiceMap(), rollsCache = new DiceMap();

/**
 * Generates all possible rolls with 5 dice.
 * @memberof module:combinatorics
 * @returns {Array<number[]>} All possible rolls with 5 dice.
 */
combinatorics.getAllRolls = function() {
    return allRolls;
};

/**
 * Generates all possible keepers, from 0 to 5 dice.
 * @memberof module:combinatorics
 * @returns {Array<number[]>} All possible keepers.
 */
combinatorics.getAllKeepers = function() {
    return allKeepers;
};

/**
 * Generates all possible keepers from the given roll.
 * @memberof module:combinatorics
 * @param roll {number[]} The roll to generate keepers for.
 * @returns {Array<number[]>} All possible keepers from the given roll.
 */
combinatorics.getKeepers = function(roll) {
    // Check if the keepers are in the cache
    if (keepersCache.has(roll)) return keepersCache.get(roll);

    // Generate the keepers from the roll
    var keepers = _.uniqWith(powerset(roll), isSameDice);

    // Store the result in the cache for future lookups
    keepersCache.add(roll, keepers);

    return keepers;
};

/**
 * Generates all possible rolls from the given keepers.
 * @memberof module:combinatorics
 * @param keepers {number[]} The keepers to generate rolls for.
 * @returns {Array<number[]>} All possible rolls from the given keepers.
 */
combinatorics.getRolls = function(keepers) {
    // Check if the rolls are in the cache
    if (rollsCache.has(keepers)) return rollsCache.get(keepers);

    // Generate the remaining dice and attach them to the keepers
    var remDice = dice(5 - keepers.length);
    var rolls = remDice.map(x => keepers.concat(x));

    // Store the result in the cache for future lookups
    rollsCache.add(keepers, rolls);

    return rolls;
};

/**
 * Evaluates if the two dice arrays are the same, equality is based
 * on their cardinality being the same.
 * @private
 * @param arr1 {number[]} The first dice array.
 * @param arr2 {number[]} The second dice array.
 * @returns {boolean} True if the two dice arrays are the same, false otherwise.
 */
function isSameDice(arr1, arr2) {
    return _.isEqual(_.countBy(arr1), _.countBy(arr2));
}

/**
 * Generates all possible dice for the given size.
 * @private
 * @param size {number} The size used for generating the dice.
 * @returns {Array} All possible dice for the given size.
 */
function dice(size) {
    var recurFn = function(size, minValue) {
        if (size === 0) return [[]];

        var output = [];

        for (var i = minValue; i <= 6; i++) {
            var nextDice = recurFn(size-1, i);
            var padded = nextDice.map(x => _.concat(i, x));
            output = output.concat(padded);
        }

        return output;
    };

    return recurFn(size, 1);
}

/**
 * Generates all possible dice with the size from 0 to the given size.
 * @private
 * @param size {number} The maximum size for the dice.
 */
function diceUpTo(size) {
    return _.flatten(_.range(size+1).map(x => dice(x)));
}

/**
 * Generates the powerset (all possible subsets) of the given array.
 * @private
 * @param arr {number[]} The array to generate the powerset for.
 * @returns {Array<number[]>} The power of the given array.
 */
function powerset(arr) {
    if (arr.length === 0) return [[]];

    var rest = powerset(arr.slice(1));
    var combined = rest.map(x => x.concat(arr[0]));

    return rest.concat(combined);
}