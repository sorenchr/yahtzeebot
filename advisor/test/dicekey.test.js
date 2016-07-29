var chai = require('chai');
var assert = chai.assert;
var _ = require('lodash');
var gens = require('../generators');
var dicekey = require('../dicekey');

describe('dicekey', function() {
    it('should return the correct dice key for all possible dice', function() {
        var allDice = _.range(7).map(x => gens.allDice(x));
        allDice.forEach(function(dice) {
            assert.equal(dicekey(dice), generateKey(dice));
        });
    });
});

function generateKey(dice) {
    var key = new Array(6).fill(0);
    var countMap = _.values(dice);
    return key.map((val, i) => countMap[i+1]).join('');
}