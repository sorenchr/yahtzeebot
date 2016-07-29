var chai = require('chai');
var assert = chai.assert;
var prob = require('../probability');
var gens = require('../generators');
var _ = require('lodash');

// Generate all dices possible (ranging from 0 to 5 dice)
var allDice = {};
for (var i = 0; i <= 5; i++) {
    allDice[i] = generateDice(i);
}

describe('probability ', function() {
    describe('#getDiceProbability', function() {
        it('should return the correct probability for all dice', function() {
            this.timeout(0); // Kill the timeout for this test

            var allUniqueDice = gens.generateDiceUpTo(5);
            allUniqueDice.forEach(function(dice) {
                assert.equal(prob.getDiceProbability(dice), getDiceProbability(dice));
            });
        });
    });
});

/**
 * Generates all possible dice of size `n` and does not
 * take cardinality into account (i.e. [1,1] and [1,1] are
 * not the same).
 * @param n The size of the dice.
 * @returns {Array} An array of all possible dice.
 */
function generateDice(n) {
    if (n === 0) return [[]];

    var dice = [];

    var nextDice = generateDice(n-1);
    for (var i = 1; i <= 6; i++) {
        for (var j = 0; j < nextDice.length; j++) {
            dice.push(nextDice[j].concat(i));
        }
    }

    return dice;
}

/**
 * Calculates the fraction of occurrence for this dice among
 * all the possible dice.
 * @param dice The dice to get the probability of occurrence for.
 * @returns {number} The probability of rolling the given dice.
 */
function getDiceProbability(dice) {
    var count = 0;

    for (var i = 0; i < allDice[dice.length].length; i++) {
        if (isSameDice(allDice[dice.length][i], dice)) count++;
    }

    return count / _.size(allDice[dice.length]);
}

/**
 * Checks if two sets of dice are the same, based on their
 * cardinality.
 * @param d1 The first set of dice to check.
 * @param d2 The second set of dice to check.
 * @returns {boolean} True if their cardinalities match, false otherwise.
 */
function isSameDice(d1, d2) {
    return _.isEqual(_.countBy(d1), _.countBy(d2));
}