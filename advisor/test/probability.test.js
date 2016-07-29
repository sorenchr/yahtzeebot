var chai = require('chai');
var assert = chai.assert;
var prob = require('../probability');
var gens = require('../generators');
var _ = require('lodash');

describe('probability ', function() {
    describe('#getDiceProbability', function() {
        it('should return the correct probability for 0 dice', function() {
            this.timeout(0); // Kill the timeout for this test

            var allDice = generateDice(0);
            var allUniqueDice = gens.dice(0);

            allUniqueDice.forEach(function(dice) {
                assert.equal(prob.getDiceProbability(dice), getDiceProbability(dice, allDice));
            });
        });

        it('should return the correct probability for 1 dice', function() {
            this.timeout(0); // Kill the timeout for this test

            var allDice = generateDice(1);
            var allUniqueDice = gens.dice(1);

            allUniqueDice.forEach(function(dice) {
                assert.equal(prob.getDiceProbability(dice), getDiceProbability(dice, allDice));
            });
        });

        it('should return the correct probability for 2 dice', function() {
            this.timeout(0); // Kill the timeout for this test

            var allDice = generateDice(2);
            var allUniqueDice = gens.dice(2);

            allUniqueDice.forEach(function(dice) {
                assert.equal(prob.getDiceProbability(dice), getDiceProbability(dice, allDice));
            });
        });

        it('should return the correct probability for 3 dice', function() {
            this.timeout(0); // Kill the timeout for this test

            var allDice = generateDice(3);
            var allUniqueDice = gens.dice(3);

            allUniqueDice.forEach(function(dice) {
                assert.equal(prob.getDiceProbability(dice), getDiceProbability(dice, allDice));
            });
        });

        it('should return the correct probability for 4 dice', function() {
            this.timeout(0); // Kill the timeout for this test

            var allDice = generateDice(4);
            var allUniqueDice = gens.dice(4);

            allUniqueDice.forEach(function(dice) {
                assert.equal(prob.getDiceProbability(dice), getDiceProbability(dice, allDice));
            });
        });

        it('should return the correct probability for 5 dice', function() {
            this.timeout(0); // Kill the timeout for this test

            var allDice = generateDice(5);
            var allUniqueDice = gens.dice(5);

            allUniqueDice.forEach(function(dice) {
                assert.equal(prob.getDiceProbability(dice), getDiceProbability(dice, allDice));
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
function getDiceProbability(dice, allDice) {
    var count = 0;

    for (var i = 0; i < allDice.length; i++) {
        if (isSameDice(allDice[i], dice)) count++;
    }

    return count / allDice.length;
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