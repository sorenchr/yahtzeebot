var _ = require('lodash');
var validator = require('./validator');
var ArgumentError = require('./argumenterror');

var probability = module.exports;
var facs = {}; // Will contain all cached factorials

/**
 * Returns the probability of rolling the given dice.
 * @param roll The dice to calculate the probability for.
 * @returns {number} The probability of rolling the given dice.
 */
probability.getRollProbability = function(roll) {
    // Validate roll
    if (!validator.isValidDice(roll)) throw new ArgumentError('Variable \'roll\' is not a valid set of dice');

    // Get the cardinality of the roll as an array
    var cardinality = _.values(_.countBy(roll));

    // Calculate the cardinality product of the roll
    var cdProd = cardinality.reduce((x,y) => x * fac(y), 1);

    // Calculate the roll probability
    return fac(roll.length) / (Math.pow(6, roll.length) * cdProd);
};

/**
 * Computes the n'th factorial.
 * @param n The number to compute the factorial for.
 * @returns {*} The n'th factorial.
 */
function fac(n) {
    if (n in facs) return facs[n];
    facs[n] = n == 0 ? 1 : n * fac(n - 1);
    return facs[n];
}