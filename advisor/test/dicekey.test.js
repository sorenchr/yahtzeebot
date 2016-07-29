var chai = require('chai');
var assert = chai.assert;
var _ = require('lodash');
var gens = require('../generators');
var dicekey = require('../dicekey');

describe('dicekey', function() {
    it('should return the correct dice key for all possible dice', function() {
        // Generate all possible dice from a length of 0 to 5
        var allDice = gens.diceUpTo(5);

        // Go through each possible set of dice to check if the dicekey fits
        allDice.forEach(function(dice) {
            var key = dicekey(dice);

            // Split up the key and check that the cardinalities match
            key.split('').forEach(function(keyCount, i) {
                // Calculate how many dice with the given value are present in the dice
                var diceCount = dice.reduce((pre, cur) => pre + (cur == i +1 ? 1 : 0), 0);

                assert.equal(keyCount, diceCount);
            });
        });
    });
});