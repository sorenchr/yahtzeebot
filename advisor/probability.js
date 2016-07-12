var _ = require('lodash');
var validator = require('./validator');
var ArgumentError = require('./argumenterror');

var probability = module.exports;
var facs = {}; // Will contain all cached factorials

/**
 * Returns the probability of rolling the given dice.
 * @param dice The dice to calculate the probability for.
 * @returns {number} The probability of rolling the given dice.
 */
probability.getDiceProbability = function(dice) {
    // Validate dice
    if (!validator.isValidDice(dice)) throw new ArgumentError('Invalid dice: ' + dice);

    // Get the cardinality of the roll as an array
    var cardinality = _.values(_.countBy(dice));

    // Calculate the cardinality product of the dice
    var cdProd = cardinality.reduce((x,y) => x * fac(y), 1);

    // Calculate the dice probability
    return fac(dice.length) / (Math.pow(6, dice.length) * cdProd);
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