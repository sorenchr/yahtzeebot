var dicekey = require('./dicekey');
var _ = require('lodash');

var probability = module.exports;
var facsCache = {}; // Will contain all cached factorials
var probCache = {}; // Will contain all cached probabilities

/**
 * Returns the probability of rolling the given dice.
 * @param dice The dice to calculate the probability for.
 * @returns {number} The probability of rolling the given dice.
 */
probability.getDiceProbability = function(dice) {
    // Generate the cache key
    var cacheKey = dicekey(dice);

    // Check if the result exists in the cache
    if (cacheKey in probCache) return probCache[cacheKey];

    // Get the cardinality of the roll as an array
    var cardinality = _.values(_.countBy(dice));

    // Calculate the cardinality product of the dice
    var cdProd = cardinality.reduce((x,y) => x * fac(y), 1);

    // Calculate the dice probability and store it in the cache
    probCache[cacheKey] = fac(dice.length) / (Math.pow(6, dice.length) * cdProd);

    return probCache[cacheKey];
};

/**
 * Computes the n'th factorial.
 * @param n The number to compute the factorial for.
 * @returns {number} The n'th factorial.
 */
function fac(n) {
    // 0! = 1
    if (n === 0) return 1;

    // Check if the result exists in the cache
    if (n in facsCache) return facsCache[n];

    // Calculate and store the result in the cache
    facsCache[n] = n * fac(n - 1);

    return facsCache[n];
}