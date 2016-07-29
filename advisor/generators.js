var _ = require('lodash');

var generators = module.exports;

/**
 * Generates all possible dice for the given size.
 * @param size The size used for generating the dice.
 * @returns {Array} All possible dice for the given size.
 */
generators.dice = function(size) {
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
};

/**
 * Generates all possible dice with the size from 0 to the given size.
 * @param size The maximum size for the dice.
 */
generators.diceUpTo = function(size) {
    return _.flatten(_.range(size+1).map(x => generators.dice(x)));
};

/**
 * Generates the powerset (all possible subsets) of the given array.
 * @param arr The array to generate the powerset for.
 * @returns {Array} The power of the given array.
 */
generators.powerset = function(arr) {
    if (arr.length === 0) return [[]];

    var rest = generators.powerset(arr.slice(1));
    var combined = rest.map(x => x.concat(arr[0]));

    return rest.concat(combined);
};