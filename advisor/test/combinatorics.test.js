var chai = require('chai');
var assert = chai.assert;
var _ = require('lodash');
var cb = require('../combinatorics');
var ArgumentError = require('../argumenterror');
var proxyquire = require('proxyquire');

// Generate all rolls and keepers
var allRolls = sortedDiceArray(generateDice(5));
var allKeepers = _.range(6).reduce((pre, cur) => pre.concat(sortedDiceArray(generateDice(cur))), []);

// Generate all keepers from rolls
var rollKeepers = {};
allRolls.forEach(function(roll) {
    var key = roll.sort().join('');
    rollKeepers[key] = [];

    allKeepers.forEach(function(keepers) {
        if (arrayContains(roll, keepers)) rollKeepers[key].push(keepers);
    });
});

// Generate all rolls from keepers
var keepersRolls = {};
allKeepers.forEach(function(keepers) {
    var key = keepers.sort().join('');
    keepersRolls[key] = [];

    allRolls.forEach(function(roll) {
        if (arrayContains(roll, keepers)) keepersRolls[key].push(roll);
    });
});

/**
 * Generates all possible dice for the given size.
 * @param size The size used for generating the dice.
 * @param minValue The minimum value of the next integer, defaults to 1.
 * @returns {Array} All possible dice for the given size.
 */
function generateDice(size, minValue) {
    if (typeof minValue === 'undefined') minValue = 1;
    if (size === 0) return [[]];

    var output = [];

    for (var i = minValue; i <= 6; i++) {
        var nextDice = generateDice(size-1, i);
        var padded = nextDice.map(x => _.concat(i, x));
        output = output.concat(padded);
    }

    return output;
}

/**
 * Checks if the first array contains the second array, order
 * does not matter.
 * @param a The first array.
 * @param b The second array.
 * @returns {boolean} True if array `a` contains array `b`.
 */
function arrayContains(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length < b.length) return false;

    var count = {};

    for (var i = 0; i < a.length; i++) {
        if (!count[a[i]]) count[a[i]] = 0;
        count[a[i]]++;
    }

    for (var i = 0; i < b.length; i++) {
        if (!count[b[i]] || --count[b[i]] < 0) return false;
    }

    return true;
}

describe('combinatorics', function() {
    describe('#getAllRolls', function () {
        it('should return all 5 dice rolls', function () {
            var cbAllRolls = sortedDiceArray(cb.getAllRolls());

            assert.equal(allRolls.length, cbAllRolls.length);
            assert.sameDeepMembers(allRolls, cbAllRolls);
        });
    });

    describe('#getAllKeepers', function() {
        it('should return all 0 - 5 dice rolls', function() {
            this.timeout(5000);
            var cbAllKeepers = sortedDiceArray(cb.getAllKeepers());

            assert.equal(allKeepers.length, cbAllKeepers.length);
            assert.sameDeepMembers(allKeepers, cbAllKeepers);
        });
    });

    describe('#getKeepers', function() {
        it('should throw ArgumentError on invalid input', function() {
            var validatorMock = {
                isValidRoll: function(roll) { return false }
            };

            var cbProxy = proxyquire('../combinatorics', { './validator': validatorMock });

            assert.throws(cbProxy.getKeepers.bind(cb, [1,2,3,4,5]), ArgumentError);
        });

        it('should return correct keepers for all rolls', function() {
            this.timeout(5000);

            allRolls.forEach(function(roll) {
                var keepersForRoll = rollKeepers[roll.join('')];
                var cbRollKeepers = sortedDiceArray(cb.getKeepers(roll));

                assert.equal(keepersForRoll.length, cbRollKeepers.length);
                assert.sameDeepMembers(keepersForRoll, cbRollKeepers);
            });
        });
    });

    describe('#getRolls', function() {
        it('should throw ArgumentError on invalid input', function() {
            var validatorMock = {
                isValidDice: function(dice) { return false }
            };

            var cbProxy = proxyquire('../combinatorics', { './validator': validatorMock });

            assert.throws(cbProxy.getRolls.bind(cb, [1,2,3]), ArgumentError);
        });

        it('should return correct rolls for all keepers', function() {
            this.timeout(10000);

            allKeepers.forEach(function(keepers) {
                var rollsForKeepers = keepersRolls[keepers.join('')];
                var cbKeepersRolls = sortedDiceArray(cb.getRolls(keepers));

                assert.equal(rollsForKeepers.length, cbKeepersRolls.length);
                assert.sameDeepMembers(rollsForKeepers, cbKeepersRolls);
            });
        });
    });
});

/**
 * Sorts every dice array inside the entire array.
 * @param arr The array containing arrays of dice.
 * @returns {Array} The sorted dice array.
 */
function sortedDiceArray(arr) {
    for (var i = 0; i < arr.length; i++) arr[i].sort();
    return arr;
}