var chai = require('chai');
var assert = chai.assert;
var _ = require('lodash');
var cb = require('../combinatorics');
var ArgumentError = require('../argumenterror');
var proxyquire = require('proxyquire');

describe('combinatorics', function() {
    describe('#getAllRolls', function () {
        it('should return all 5 dice rolls', function () {
            var allRolls = generateDice(5);
            var cbAllRolls = sortedDiceArray(cb.getAllRolls());
            assert.equal(allRolls.length, cbAllRolls.length);
            assert.sameDeepMembers(allRolls, cbAllRolls);
        });
    });

    describe('#getAllKeepers', function() {
        it('should return all 0 - 5 dice rolls', function() {
            this.timeout(3000);
            var allKeepers = _.range(6).reduce((pre, cur) => pre.concat(generateDice(cur)), []);
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
            var allRolls = generateDice(5);
            allRolls.forEach(function(roll) {
                var rollKeepers = sortedDiceArray(_.uniqWith(powerset(roll), isSameDice));
                var cbRollKeepers = sortedDiceArray(cb.getKeepers(roll));
                assert.equal(rollKeepers.length, cbRollKeepers.length);
                assert.sameDeepMembers(rollKeepers, cbRollKeepers);
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
            this.timeout(5000);
            var allKeepers = _.range(6).reduce((pre, cur) => pre.concat(generateDice(cur)), [[]]);
            allKeepers.forEach(function(keepers) {
                var keepersRolls = sortedDiceArray(generateRolls(keepers));
                var cbKeepersRolls = sortedDiceArray(cb.getRolls(keepers));
                assert.equal(keepersRolls.length, cbKeepersRolls.length);
                assert.sameDeepMembers(keepersRolls, cbKeepersRolls);
            });
        });
    });
});

function isSameDice(arr1, arr2) {
    return _.isEqual(_.countBy(arr1), _.countBy(arr2));
}

function powerset(arr) {
    if (arr.length === 0) return [[]];

    var rest = powerset(arr.slice(1));
    var combined = rest.map(x => x.concat(arr[0]));

    return rest.concat(combined);
}

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

function generateRolls(keepers) {
    var remDice = generateDice(5 - keepers.length);
    return remDice.map(x => keepers.concat(x));
}

function sortedDiceArray(arr) {
    for (var i = 0; i < arr.length; i++) arr[i].sort();
    return arr;
}