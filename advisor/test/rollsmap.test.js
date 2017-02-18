var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');
var DiceMap = require('../src/dicemap');

describe('RollsMap', function() {
    describe('#constructor', function() {
        it('should use the highest keepers EV as the EV for each roll', function() {
            // Setup a mock for the combinatorics module
            var allRolls = [[1,2,3,4,5], [2,3,4,5,6]];
            var rollsKeepers = [[1,2], [2,3,4]];
            var cmbMock = {
                getAllRolls: function() { return allRolls; },
                getKeepers: function(roll) {
                    if (_.includes(allRolls, roll)) return rollsKeepers;
                    return 0;
                }
            };

            // Setup the RollsMap module
            var RollsMap = proxyquire('../src/rollsmap', {
                './combinatorics': cmbMock
            });

            // Setup the mock for the next keepers
            var nextKeepersMock = {
                getEV: function(keepers) {
                    if (keepers === rollsKeepers[0]) return 10;
                    if (keepers === rollsKeepers[1]) return 23;
                    return 0;
                }
            };

            // The EV for each roll should be 23
            var rollsMap = new RollsMap(nextKeepersMock);
            allRolls.forEach(function(roll) {
                assert.equal(rollsMap.getEV(roll), 23);
            });
        });
    });

    describe('#getEV', function() {
        it('should return the EV for the given roll', function() {
            // Setup a mock for the combinatorics module
            var cmbMock = {
                getAllRolls: function() { return []; }
            };

            // Setup the RollsMap module
            var RollsMap = proxyquire('../src/rollsmap', {
                './combinatorics': cmbMock
            });

            // Instantiate the FinalRollsMap
            var map = new RollsMap();

            map.rollsEV = new DiceMap();
            map.rollsEV.add([1,1,1,1,1], 27.5);
            assert.equal(map.getEV([1,1,1,1,1]), 27.5);

            map.rollsEV = new DiceMap();
            map.rollsEV.add([1,1,1,1,1], 2123.2);
            assert.equal(map.getEV([1,1,1,1,1]), 2123.2);

            map.rollsEV = new DiceMap();
            assert.isUndefined(map.getEV([1,2,3,4,5]));
        });
    });
});