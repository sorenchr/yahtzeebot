var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');
var DiceMap = require('../src/dicemap');

describe('KeepersMap', function() {
    describe('#constructor', function() {
        it('should calculate the sum of all roll EV\'s for each keepers', function() {
            // Setup a mock for the combinatorics module
            var allKeepers = [[1,2], [2,3,4]];
            var rollsFromKeepers = [[1,2,3,4,5], [2,3,4,5,6]];
            var cmbMock = {
                getAllKeepers: function() { return allKeepers; },
                getRolls: function(keepers) {
                    if (_.includes(allKeepers, keepers)) return rollsFromKeepers;
                    return 0;
                }
            };

            // Setup a probability mock module that always just returns 1
            var probMock = { getDiceProbability: function() { return 1; } };

            // Setup the KeepersMap module
            var KeepersMap = proxyquire('../src/keepersmap', {
                './combinatorics': cmbMock,
                './probability': probMock
            });

            // Setup the mock for the next rolls
            var nextRollsMock = {
                getEV: function(roll) {
                    if (_.includes(rollsFromKeepers, roll)) return 50.0;
                    return 0;
                }
            };

            // The EV for each keepers should be 100 (2 rolls per keepers)
            var keepersMap = new KeepersMap(nextRollsMock);
            allKeepers.forEach(function(keepers) {
                assert.equal(keepersMap.getEV(keepers), 100);
            });
        });

        it('should account for the probability of the remaining dice', function() {
            // Setup a mock for the combinatorics module
            var allKeepers = [[1,2], [2,3,4]];
            var rollsFromKeepers = [[1,2,3,4,5], [1,2,3,4,6]];
            var cmbMock = {
                getAllKeepers: function() { return allKeepers; },
                getRolls: function(keepers) {
                    if (_.includes(allKeepers, keepers)) return rollsFromKeepers;
                    return 0;
                }
            };

            // Setup a probability mock module that returns probability based
            // on the input dice
            var probMock = {
                getDiceProbability: function(dice) {
                    var diceString = dice.sort().join('');
                    if (diceString === '345') return 2.5;
                    if (diceString === '346') return 2.5;
                    if (diceString === '15') return 2.5;
                    if (diceString === '16') return 2.5;
                    return 0;
                }
            };

            // Setup the KeepersMap module
            var KeepersMap = proxyquire('../src/keepersmap', {
                './combinatorics': cmbMock,
                './probability': probMock
            });

            // Setup the mock for the next rolls
            var nextRollsMock = {
                getEV: function(roll) {
                    if (_.includes(rollsFromKeepers, roll)) return 50.0;
                    return 0;
                }
            };

            // The EV for each keepers should be 100 (2 rolls per keepers)
            var keepersMap = new KeepersMap(nextRollsMock);
            allKeepers.forEach(function(keepers) {
                assert.equal(keepersMap.getEV(keepers), 250);
            });
        });
    });

    describe('#getEV', function() {
        it('should return the EV for the given keepers', function() {
            // Setup a mock for the combinatorics module
            var cmbMock = {
                getAllKeepers: function() { return []; }
            };

            // Setup the KeepersMap module
            var KeepersMap = proxyquire('../src/keepersmap', {
                './combinatorics': cmbMock
            });

            // Instantiate the FinalRollsMap
            var map = new KeepersMap();

            map.keepersEV = new DiceMap();
            map.keepersEV.add([1,2,3], 27.5);
            assert.equal(map.getEV([1,2,3]), 27.5);

            map.keepersEV = new DiceMap();
            map.keepersEV.add([1,2,3], 2123.2);
            assert.equal(map.getEV([1,2,3]), 2123.2);

            map.keepersEV = new DiceMap();
            assert.isUndefined(map.getEV([1,2,3]));
        });
    });
});