var _ = require('lodash');

var generators = module.exports;

/**
 * Generates all possible dice for the given size.
 * @param size The size used for generating the dice.
 * @returns {Array} All possible dice for the given size.
 */
generators.generateDice = function(size) {
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
generators.generateDiceUpTo = function(size) {
    return _.flatten(_.range(size+1).map(x => generators.generateDice(x)));
};