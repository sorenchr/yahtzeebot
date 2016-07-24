var _ = require('lodash');
var validator = require('./validator');
var ArgumentError = require('./argumenterror');

var combinatorics = module.exports;

// Generate all rolls and keepers available
var allRolls = generateDice(5);
var allKeepers = _.range(6).reduce((pre, cur) => pre.concat(generateDice(cur)), []);

// Setup caches for keepers from all rolls, and rolls from all keepers
var keepersCache = {};
var rollsCache = {};

/**
 * Generates all possible rolls with 5 dice.
 * @returns {Array} All possible rolls with 5 dice.
 */
combinatorics.getAllRolls = function() {
    return allRolls;
};

/**
 * Generates all possible keepers, from 0 to 5 dice.
 * @returns {Array} All possible keepers.
 */
combinatorics.getAllKeepers = function() {
    return allKeepers;
};

/**
 * Generates all possible keepers from the given roll.
 * @param roll The roll to generate keepers for.
 * @returns {Array} All possible keepers from the given roll.
 */
combinatorics.getKeepers = function(roll) {
    // Validate input
    if (!validator.isValidRoll(roll)) throw new ArgumentError('Invalid roll: ' + roll);

    // Generate the cache key
    var key = roll.sort().join('');

    // Check if the keepers are in the cache
    if (key in keepersCache) return keepersCache[key];

    // Generate the keepers from the roll
    var keepers = _.uniqWith(powerset(roll), isSameDice);

    // Store the result in the cache for future lookups
    keepersCache[key] = keepers;

    return keepers;
};

/**
 * Generates all possible rolls from the given keepers.
 * @param keepers The keepers to generate rolls for.
 * @returns {Array} All possible rolls from the given keepers.
 */
combinatorics.getRolls = function(keepers) {
    // Validate input
    if (!validator.isValidDice(keepers)) throw new ArgumentError('Invalid keepers: ' + keepers);

    // Generate the cache key
    var key = keepers.sort().join('');

    // Check if the rolls are in the cache
    if (key in rollsCache) return rollsCache[key];

    // Generate the remaining dice and attach them to the keepers
    var remDice = generateDice(5 - keepers.length);
    var rolls = remDice.map(x => keepers.concat(x));

    // Store the result in the cache for future lookups
    rollsCache[key] = rolls;

    return rolls;
};

/**
 * Evaluates if the two dice arrays are the same, equality is based
 * on their cardinality being the same.
 * @param arr1 The first dice array.
 * @param arr2 The second dice array.
 * @returns {boolean} True if the two dice arrays are the same, false otherwise.
 */
function isSameDice(arr1, arr2) {
    return _.isEqual(_.countBy(arr1), _.countBy(arr2));
}

/**
 * Generates the powerset (all possible subsets) of the given array.
 * @param arr The array to generate the powerset for.
 * @returns {Array} The power of the given array.
 */
function powerset(arr) {
    if (arr.length === 0) return [[]];

    var rest = powerset(arr.slice(1));
    var combined = rest.map(x => x.concat(arr[0]));

    return rest.concat(combined);
}

/**
 * Generates all possible dice for the given size.
 * @param size The size used for generating the dice.
 * @param minValue The minimum value of the next integer, defaults to 1.
 * @returns {Array} All possible dice for the given size.
 */
function generateDice(size, minValue) {
    if (typeof minValue === 'undefined') minValue = 1;
    if (size === 0) return [[]];

    var output = [];

    for (var i = minValue; i <= 6; i++) {
        var nextDice = generateDice(size-1, i);
        var padded = nextDice.map(x => _.concat(i, x));
        output = output.concat(padded);
    }

    return output;
}