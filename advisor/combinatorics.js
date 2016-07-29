var _ = require('lodash');
var dicekey = require('./dicekey');
var gens = require('./generators');

var combinatorics = module.exports;

// Generate all rolls and keepers available
var allRolls = gens.dice(5), allKeepers = gens.diceUpTo(5);

// Setup caches for keepers from all rolls, and rolls from all keepers
var keepersCache = {}, rollsCache = {};

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
    // Generate the cache key
    var key = dicekey(roll);

    // Check if the keepers are in the cache
    if (key in keepersCache) return keepersCache[key];

    // Generate the keepers from the roll
    var keepers = _.uniqWith(gens.powerset(roll), isSameDice);

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
    // Generate the cache key
    var key = dicekey(keepers);

    // Check if the rolls are in the cache
    if (key in rollsCache) return rollsCache[key];

    // Generate the remaining dice and attach them to the keepers
    var remDice = gens.dice(5 - keepers.length);
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