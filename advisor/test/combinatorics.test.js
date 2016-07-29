var chai = require('chai');
var assert = chai.assert;
var _ = require('lodash');
var cmb = require('../combinatorics');
var gens = require('../generators');
var dicekey = require('../dicekey');

// Generate all rolls and keepers
var allRolls = sortedDiceArray(gens.dice(5));
var allKeepers = sortedDiceArray(gens.diceUpTo(5));

// Generate all keepers from rolls
var rollKeepers = {};
allRolls.forEach(function(roll) {
    var key = dicekey(roll);
    rollKeepers[key] = [];

    allKeepers.forEach(function(keepers) {
        if (arrayContains(roll, keepers)) rollKeepers[key].push(keepers);
    });
});

// Generate all rolls from keepers
var keepersRolls = {};
allKeepers.forEach(function(keepers) {
    var key = dicekey(keepers);
    keepersRolls[key] = [];

    allRolls.forEach(function(roll) {
        if (arrayContains(roll, keepers)) keepersRolls[key].push(roll);
    });
});

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
            this.timeout(0); // Kill the timeout for this test

            var cbAllRolls = sortedDiceArray(cmb.getAllRolls());

            assert.equal(allRolls.length, cbAllRolls.length);
            assert.sameDeepMembers(allRolls, cbAllRolls);
        });
    });

    describe('#getAllKeepers', function() {
        it('should return all 0 - 5 dice rolls', function() {
            this.timeout(0); // Kill the timeout for this test

            var cbAllKeepers = sortedDiceArray(cmb.getAllKeepers());

            assert.equal(allKeepers.length, cbAllKeepers.length);
            assert.sameDeepMembers(allKeepers, cbAllKeepers);
        });
    });

    describe('#getKeepers', function() {
        it('should return correct keepers for all rolls', function() {
            this.timeout(0); // Kill the timeout for this test

            allRolls.forEach(function(roll) {
                var keepersForRoll = rollKeepers[dicekey(roll)];
                var cbRollKeepers = sortedDiceArray(cmb.getKeepers(roll));

                assert.equal(keepersForRoll.length, cbRollKeepers.length);
                assert.sameDeepMembers(keepersForRoll, cbRollKeepers);
            });
        });
    });

    describe('#getRolls', function() {
        it('should return correct rolls for all keepers', function() {
            this.timeout(0); // Kill the timeout for this test

            allKeepers.forEach(function(keepers) {
                var rollsForKeepers = keepersRolls[dicekey(keepers)];
                var cbKeepersRolls = sortedDiceArray(cmb.getRolls(keepers));

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