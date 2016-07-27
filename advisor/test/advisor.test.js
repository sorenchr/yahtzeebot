var chai = require('chai');
var assert = chai.assert;
var ArgumentError = require('../argumenterror');
var clearRequire = require('clear-require');
var rewire = require('rewire');
var sinon = require('sinon');
var StateMap = require('../statemap');
var proxyquire = require('proxyquire');
var _ = require('lodash');

describe('advisor', function() {
    describe('#init', function () {
        var advisor;

        beforeEach(function () {
            advisor = require('../advisor');
        });

        it('should throw ArgumentError if no settings are provided', function () {
            assert.throws(advisor.init.bind(advisor), ArgumentError);
        });

        it('should throw ArgumentError if no StateMap is present in the settings', function () {
            assert.throws(advisor.init.bind(advisor, {someOther: 'settings'}), ArgumentError);
        });

        it('should throw ArgumentError if the settings is not a simple object', function () {
            assert.throws(advisor.init.bind(advisor, 1), ArgumentError);
            assert.throws(advisor.init.bind(advisor, 'a'), ArgumentError);
            assert.throws(advisor.init.bind(advisor, 2.2), ArgumentError);
            assert.throws(advisor.init.bind(advisor, null), ArgumentError);
            assert.throws(advisor.init.bind(advisor, true), ArgumentError);
            assert.throws(advisor.init.bind(advisor, undefined), ArgumentError);
            assert.throws(advisor.init.bind(advisor, NaN), ArgumentError);
            assert.throws(advisor.init.bind(advisor, [2]), ArgumentError);
        });

        it('should throw ArgumentError if the state map is not a StateMap instance', function () {
            assert.throws(advisor.init.bind(advisor, {stateMap: 1}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: 'a'}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: 2.2}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: {}}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: null}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: true}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: undefined}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: NaN}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: new Date()}), ArgumentError);
            assert.throws(advisor.init.bind(advisor, {stateMap: [2]}), ArgumentError);
        });

        it('should use the StateMap provided in the settings', function () {
            var advisorRw = rewire('../advisor');
            var stateMapMock = sinon.createStubInstance(StateMap);
            advisorRw.init({stateMap: stateMapMock});
            assert.equal(advisorRw.__get__('stateMap'), stateMapMock);
        });

        afterEach(function () {
            clearRequire('../advisor');
        });
    });

    describe('#getBestKeepers', function () {
        it('should throw ArgumentError on invalid scorecard', function () {
            var validatorMock = {
                isValidRollsLeft: function (rollsLeft) { return true; },
                isValidScorecard: function (scorecard) { return false; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return true; }
            };
            var advisorProxy = proxyquire('../advisor', {'./validator': validatorMock});

            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function () {
            var validatorMock = {
                isValidRollsLeft: function (rollsLeft) { return true; },
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return false; },
                isValidDice: function(dice) { return true; }
            };
            var advisorProxy = proxyquire('../advisor', {'./validator': validatorMock});

            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function () {
            var validatorMock = {
                isValidRollsLeft: function (rollsLeft) { return true; },
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return false; }
            };
            var advisorProxy = proxyquire('../advisor', {'./validator': validatorMock});

            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on invalid rolls left', function () {
            var validatorMock = {
                isValidRollsLeft: function (rollsLeft) { return false; },
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return true; }
            };
            var advisorProxy = proxyquire('../advisor', {'./validator': validatorMock});

            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on full scorecard', function () {
            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            var advisor = require('../advisor');
            var stateMapMock = sinon.createStubInstance(StateMap);
            advisor.init({'stateMap': stateMapMock});

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should return the best keepers, all the way from the final rolls, when there is 1 roll left', function() {
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            // Create a combinatorics mock
            var keepers = [[1,2],[2,4],[4,5]];
            var cmbMock = {
                getKeepers: function(keepersDice) {
                    if (keepersDice === dice) return keepers;
                    return [];
                }
            };

            // Setup the advisor module
            var advisor = rewire('../advisor');
            var stateMapMock = sinon.createStubInstance(StateMap);
            advisor.__set__('cmb', cmbMock);
            advisor.init({ 'stateMap': stateMapMock });

            // Get references to the internal classes of the module
            var FinalRollsMap = advisor.__get__('FinalRollsMap');
            var KeepersMap = advisor.__get__('KeepersMap');

            // Setup the FinalRollsMap spy and inject it
            var frmStub = sinon.createStubInstance(FinalRollsMap);
            var frmSpy = sinon.spy(function() { return frmStub });
            advisor.__set__('FinalRollsMap', frmSpy);

            // Setup the KeepersMap spy and inject it
            var kmStub = sinon.createStubInstance(KeepersMap);
            kmStub.getEV = function(mapKeepers) {
                if (mapKeepers === keepers[0]) return 10;
                if (mapKeepers === keepers[1]) return 30;
                if (mapKeepers === keepers[2]) return 20;
                return 0;
            };
            var kmSpy = sinon.spy(function() { return kmStub });
            advisor.__set__('KeepersMap', kmSpy);

            // Call the method on the advisor module
            var bestKeepers = advisor.getBestKeepers(scorecard, upperScore, dice, rollsLeft);

            // Verify that the FinalRollsMap was built
            assert.isTrue(frmSpy.calledWithNew());
            assert.isTrue(frmSpy.calledWith(scorecard, upperScore));

            // Verify that the KeepersMap was called with the FinalRollsMap
            assert.isTrue(kmSpy.calledWithNew());
            assert.isTrue(kmSpy.calledWithExactly(frmStub));

            // Verify that the advisor has selected the keepers with the best EV
            assert.equal(bestKeepers, keepers[1]);
        });

        it('should return the best keepers, all the way from the final rolls, when there are 2 rolls left', function() {
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 2;

            // Create a combinatorics mock
            var keepers = [[1,2],[2,4],[4,5]];
            var cmbMock = {
                getKeepers: function(keepersDice) {
                    if (keepersDice === dice) return keepers;
                    return [];
                }
            };

            // Setup the advisor module
            var advisor = rewire('../advisor');
            var stateMapMock = sinon.createStubInstance(StateMap);
            advisor.__set__('cmb', cmbMock);
            advisor.init({ 'stateMap': stateMapMock });

            // Get references to the internal classes of the module
            var FinalRollsMap = advisor.__get__('FinalRollsMap');
            var KeepersMap = advisor.__get__('KeepersMap');
            var RollsMap = advisor.__get__('RollsMap');

            // Setup the FinalRollsMap spy and inject it
            var frmStub = sinon.createStubInstance(FinalRollsMap);
            var frmSpy = sinon.spy(function() { return frmStub });
            advisor.__set__('FinalRollsMap', frmSpy);

            // Setup the RollsMap spy and inject it
            var rmStub = sinon.createStubInstance(RollsMap);
            var rmSpy  = sinon.spy(function() { return rmStub });
            advisor.__set__('RollsMap', rmSpy);

            // Setup the KeepersMap spy and inject it
            var secondKmStub = sinon.createStubInstance(KeepersMap);
            var firstKmStub = sinon.createStubInstance(KeepersMap);
            firstKmStub.getEV = function(mapKeepers) {
                if (mapKeepers === keepers[0]) return 10;
                if (mapKeepers === keepers[1]) return 30;
                if (mapKeepers === keepers[2]) return 45;
                return 0;
            };
            var kmSpy = sinon.spy(function(map) {
                if (map === frmStub) return secondKmStub;
                if (map === rmStub) return firstKmStub;
            });
            advisor.__set__('KeepersMap', kmSpy);

            // Call the method on the advisor module
            var bestKeepers = advisor.getBestKeepers(scorecard, upperScore, dice, rollsLeft);

            // Verify that the FinalRollsMap was built
            assert.isTrue(frmSpy.calledWithNew());
            assert.isTrue(frmSpy.calledWith(scorecard, upperScore));

            // Verify that the KeepersMap was called with the FinalRollsMap
            assert.isTrue(kmSpy.calledWithNew());
            assert.isTrue(kmSpy.calledWithExactly(frmStub));

            // Verify that the RollsMap was called with the KeepersMap
            assert.isTrue(rmSpy.calledWithNew());
            assert.isTrue(rmSpy.calledWithExactly(secondKmStub));

            // Verify that the KeepersMap was called with the RollsMap
            assert.isTrue(kmSpy.calledWithNew());
            assert.isTrue(kmSpy.calledWithExactly(rmStub));

            // Verify that the advisor has selected the keepers with the best EV
            assert.equal(bestKeepers, keepers[2]);
        });
    });

    describe('FinalRollsMap', function() {
        describe('#constructor', function() {
            it('should use the EV from the StateMap for the best category for each roll', function() {
                var bestCategory = 5; // Returned in the getBestCategory() overwrite
                var evVal = 13.55; // Returned in the StateMap mock

                // Setup a mock StateMap that will return EV based on the input scorecard
                var stateMapMock = sinon.createStubInstance(StateMap);
                stateMapMock.getEV = function(scorecard, upperScore) {
                    // Check that the best category is being used for EV lookups
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    var expectedScorecard = new Array(15).fill(0);
                    expectedScorecard[bestCategory] = 1;
                    if (scorecardString === expectedScorecard.join('')) return evVal;
                    return 0;
                };

                // Setup a score-calculator mock that will just return 0 for everything
                var scoreCalcMock = {
                    getCategoryScore: function() { return 0; }
                };

                // Setup a combinatorics mock that will return a pre-determined list of rolls
                var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
                var cmbMock = {
                    getAllRolls: function() { return rolls; }
                };

                // Get internal FinalRollsMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                advisor.__set__('scorecalc', scoreCalcMock);
                var FinalRollsMap = advisor.__get__('FinalRollsMap');
                advisor.init({ 'stateMap': stateMapMock });

                // Rewrite the getBestCategory() method to inject a pre-determined category
                advisor.getBestCategory = function(scorecard, upperScore, dice) {
                    return bestCategory;
                };

                // Setup arguments for the method call
                var scorecard = new Array(15).fill(false);
                var upperScore = 25;

                // The EV should be equal to evVal
                var finalRolls = new FinalRollsMap(scorecard, upperScore);
                rolls.forEach(function(roll) {
                    assert.equal(finalRolls.getEV(roll), evVal);
                });
            });

            it('should set the category score to the EV for each roll', function() {
                var bestCategory = 5; // Returned in the getBestCategory() overwrite
                var categoryScore = 8.3213123; // Returned in the StateMap mock

                // Setup a mock StateMap that will return EV based on the input scorecard
                var stateMapMock = sinon.createStubInstance(StateMap);
                stateMapMock.getEV = function() { return 0; };

                // Setup a combinatorics mock that will return a pre-determined list of rolls
                var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
                var cmbMock = {
                    getAllRolls: function() { return rolls; }
                };

                // Setup a score-calculator mock that will just return 0 for everything
                var scoreCalcMock = {
                    getCategoryScore: function(category, dice) {
                        if (category === bestCategory && _.includes(rolls, dice)) return categoryScore;
                        return 0;
                    }
                };

                // Get internal FinalRollsMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                advisor.__set__('scorecalc', scoreCalcMock);
                var FinalRollsMap = advisor.__get__('FinalRollsMap');
                advisor.init({ 'stateMap': stateMapMock });

                // Rewrite the getBestCategory() method to inject a pre-determined category
                advisor.getBestCategory = function(scorecard, upperScore, dice) {
                    return bestCategory;
                };

                // Setup arguments for the method call
                var scorecard = new Array(15).fill(false);
                var upperScore = 25;

                // The EV should be equal to evVal
                var finalRolls = new FinalRollsMap(scorecard, upperScore);
                rolls.forEach(function(roll) {
                    assert.equal(finalRolls.getEV(roll), categoryScore);
                });
            });

            it('should set the sum of the StateMap EV and the category score to the EV for each roll', function() {
                var bestCategory = 5; // Returned in the getBestCategory() overwrite
                var evVal = 13.55; // Returned in the StateMap mock
                var categoryScore = 8.3213123; // Returned in the StateMap mock

                // Setup a mock StateMap that will return EV based on the input scorecard
                var stateMapMock = sinon.createStubInstance(StateMap);
                stateMapMock.getEV = function(scorecard, upperScore) {
                    // Check that the best category is being used for EV lookups
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    var expectedScorecard = new Array(15).fill(0);
                    expectedScorecard[bestCategory] = 1;
                    if (scorecardString === expectedScorecard.join('')) return evVal;
                    return 0;
                };

                // Setup a combinatorics mock that will return a pre-determined list of rolls
                var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
                var cmbMock = {
                    getAllRolls: function() { return rolls; }
                };

                // Setup a score-calculator mock that will just return 0 for everything
                var scoreCalcMock = {
                    getCategoryScore: function(category, dice) {
                        if (category === bestCategory && _.includes(rolls, dice)) return categoryScore;
                        return 0;
                    }
                };

                // Get internal FinalRollsMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                advisor.__set__('scorecalc', scoreCalcMock);
                var FinalRollsMap = advisor.__get__('FinalRollsMap');
                advisor.init({ 'stateMap': stateMapMock });

                // Rewrite the getBestCategory() method to inject a pre-determined category
                advisor.getBestCategory = function() {
                    return bestCategory;
                };

                // Setup arguments for the method call
                var scorecard = new Array(15).fill(false);
                var upperScore = 25;

                // The EV should be equal to evVal + categoryScore
                var finalRolls = new FinalRollsMap(scorecard, upperScore);
                rolls.forEach(function(roll) {
                    assert.equal(finalRolls.getEV(roll), evVal + categoryScore);
                });
            });

            it('should trigger the upper section bonus at an upper score of 63 or higher', function() {
                var bestCategory = 5; // Returned in the getBestCategory() overwrite
                var evVal = 13.55; // Returned in the StateMap mock
                var categoryScore = 4; // Returned in the StateMap mock

                // Setup a mock StateMap that will return EV based on the input scorecard
                var stateMapMock = sinon.createStubInstance(StateMap);
                stateMapMock.getEV = function(scorecard, upperScore) {
                    // Check that the best category is being used for EV lookups
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    var expectedScorecard = new Array(15).fill(0);
                    expectedScorecard[bestCategory] = 1;
                    if (scorecardString === expectedScorecard.join('')) return evVal;
                    return 0;
                };

                // Setup a combinatorics mock that will return a pre-determined list of rolls
                var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
                var cmbMock = {
                    getAllRolls: function() { return rolls; }
                };

                // Setup a score-calculator mock that will just return 0 for everything
                var scoreCalcMock = {
                    getCategoryScore: function(category, dice) {
                        if (category === bestCategory && _.includes(rolls, dice)) return categoryScore;
                        return 0;
                    }
                };

                // Get internal FinalRollsMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                advisor.__set__('scorecalc', scoreCalcMock);
                var FinalRollsMap = advisor.__get__('FinalRollsMap');
                advisor.init({ 'stateMap': stateMapMock });

                // Rewrite the getBestCategory() method to inject a pre-determined category
                advisor.getBestCategory = function() {
                    return bestCategory;
                };

                // Setup arguments for the method call
                var scorecard = new Array(15).fill(false);
                var upperScore = 63 - categoryScore;

                // The EV should be equal to evVal + categoryScore + 50 (for the bonus)
                var finalRolls = new FinalRollsMap(scorecard, upperScore);
                rolls.forEach(function(roll) {
                    assert.equal(finalRolls.getEV(roll), evVal + categoryScore + 50);
                });

                // The EV should be equal to evVal + categoryScore
                upperScore -= 1;
                var finalRolls = new FinalRollsMap(scorecard, upperScore);
                rolls.forEach(function(roll) {
                    assert.equal(finalRolls.getEV(roll), evVal + categoryScore);
                });
            });
        });

        describe('#getEV', function() {
            it('should return the EV for the given roll', function() {
                // Setup a mock for the combinatorics module
                var cmbMock = {
                    getAllRolls: function() { return []; }
                };

                // Get internal FinalRollsMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                var FinalRollsMap = advisor.__get__('FinalRollsMap');

                // Instantiate the FinalRollsMap
                var map = new FinalRollsMap();

                map.rollsEV = { '11111': 27.5 };
                assert.equal(map.getEV([1,1,1,1,1]), 27.5);
                map.rollsEV = { '11111': 2123.2 };
                assert.equal(map.getEV([1,1,1,1,1]), 2123.2);
                map.rollsEV = {};
                assert.isUndefined(map.getEV([1,2,3]));
            });
        });
    });

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

                // Get internal KeepersMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                advisor.__set__('prob', probMock);
                var KeepersMap = advisor.__get__('KeepersMap');

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

                // Get internal KeepersMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                advisor.__set__('prob', probMock);
                var KeepersMap = advisor.__get__('KeepersMap');

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

                // Get internal KeepersMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                var KeepersMap = advisor.__get__('KeepersMap');

                // Instantiate the FinalRollsMap
                var map = new KeepersMap();

                map.keepersEV = { '123': 27.5 };
                assert.equal(map.getEV([1,2,3]), 27.5);
                map.keepersEV = { '123': 2123.2 };
                assert.equal(map.getEV([1,2,3]), 2123.2);
                map.keepersEV = {};
                assert.isUndefined(map.getEV([1,2,3]));
            });
        });
    });

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

                // Get internal FinalRollsMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                var RollsMap = advisor.__get__('RollsMap');

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

                // Get internal FinalRollsMap from advisor module
                var advisor = rewire('../advisor');
                advisor.__set__('cmb', cmbMock);
                var RollsMap = advisor.__get__('RollsMap');

                // Instantiate the FinalRollsMap
                var map = new RollsMap();

                map.rollsEV = { '11111': 27.5 };
                assert.equal(map.getEV([1,1,1,1,1]), 27.5);
                map.rollsEV = { '11111': 2123.2 };
                assert.equal(map.getEV([1,1,1,1,1]), 2123.2);
                map.rollsEV = {};
                assert.isUndefined(map.getEV([1,2,3]));
            });
        });
    });

    describe('#getBestCategory', function() {
        it('should throw ArgumentError on invalid scorecard', function () {
            var validatorMock = {
                isValidScorecard: function (scorecard) { return false; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return true; }
            };
            var advisorProxy = proxyquire('../advisor', {'./validator': validatorMock});

            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestCategory.bind(advisorProxy, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function () {
            var validatorMock = {
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return false; },
                isValidDice: function(dice) { return true; }
            };
            var advisorProxy = proxyquire('../advisor', {'./validator': validatorMock});

            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestCategory.bind(advisorProxy, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function () {
            var validatorMock = {
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return false; }
            };
            var advisorProxy = proxyquire('../advisor', {'./validator': validatorMock});

            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestCategory.bind(advisorProxy, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on full scorecard', function () {
            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            var advisor = require('../advisor');
            var stateMapMock = sinon.createStubInstance(StateMap);
            advisor.init({'stateMap': stateMapMock});

            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });

        it('should choose the category with the best EV', function() {
            // A variable that will hold the scorecard that will provide the highest EV.
            // Used for coercing the advisor module into choosing the marked category.
            var scorecardToMatch = '000000000000001';

            // Setup a mock StateMap that will return EV based on the input scorecard
            var stateMapMock = sinon.createStubInstance(StateMap);
            stateMapMock.getEV = function(scorecard) {
                var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                if (scorecardString === scorecardToMatch) return 2.0;
                return 1.0;
            };

            // Setup a score-calculator mock that will just return 0 for everything
            var scoreCalcMock = {
                getCategoryScore: function() { return 0; }
            };

            // Setup the advisor module and inject score-calculator and StateMap mocks
            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the last category
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 14);

            // The advisor should suggest scoring the 12th category
            scorecardToMatch = '000000000001000';
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 11);
        });

        it('should choose the category with the best score', function() {
            // Setup a mock StateMap that will just return 0 on any input
            var stateMapMock = sinon.createStubInstance(StateMap);
            stateMapMock.getEV = function() { return 0; };

            // Setup a score-calculator mock that will return 1 for the best category.
            // Used for coercing the advisor module into choosing the marked category.
            var bestCategory = 5;
            var scoreCalcMock = {
                getCategoryScore: function(category, dice) {
                    if (category === bestCategory) return 1;
                    return 0;
                }
            };

            // Setup the advisor module and inject score-calculator and StateMap mocks
            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the best category
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), bestCategory);

            // The advisor should still suggest scoring the best category
            bestCategory = 12;
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), bestCategory);
        });

        it('should choose the category with the best EV and score', function() {
            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;
            var dice = [1,2,3,4,5];

            // Setup a mock StateMap that will vary in EV based on scorecard input
            var stateMapMock = sinon.createStubInstance(StateMap);
            stateMapMock.getEV = function(smScorecard) {
                var scorecardString = smScorecard.map(x => x ? 1 : 0).join('');
                if (scorecardString === '010000000000000') return 40.0;
                if (scorecardString === '001000000000000') return 20.0;
                return 0.0;
            };

            // Setup a score-calculator mock that will vary in EV based on category input
            var scoreCalcMock = {
                getCategoryScore: function(scCategory, scDice) {
                    if (scCategory === 7 && scDice === dice) return 35.0;
                    if (scCategory === 2 && scDice === dice) return 25.0;
                    return 0;
                }
            };

            // Setup the advisor module and inject score-calculator and StateMap mocks
            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            // The advisor should suggest scoring the 3rd category because the sum of the
            // EV and score is greater than scoring one of the two by itself
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 2);
        });

        it('should skip marked categories', function() {
            // Setup a mock StateMap that will vary in EV based on scorecard input
            var stateMapMock = sinon.createStubInstance(StateMap);
            stateMapMock.getEV = function(scorecard) {
                var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                if (scorecardString === '000000000000001') return 5.0;
                if (scorecardString === '000000010000001') return 2.0;
                return 1.0;
            };

            // Setup a score-calculator mock that just return 0 on any input
            var scoreCalcMock = {
                getCategoryScore: function(category, dice) { return 0; }
            };

            // Setup the advisor module and inject score-calculator and StateMap mocks
            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            scorecard[14] = true;
            var upperScore = 55;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the 8th category because
            // it should skip the 15th, even though it has greater EV
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 7);
        });

        it('should account for the upper section bonus of 50', function() {
            // Setup the EV that will be returned from the StateMap mock
            var returnEV = 60.9;

            // Setup a mock StateMap that will vary in EV based on a specific scorecard
            var stateMapMock = sinon.createStubInstance(StateMap);
            stateMapMock.getEV = function(scorecard) {
                var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                if (scorecardString === '111110000000001') return returnEV;
                return 1.0;
            };

            // Setup a score-calculator mock that will vary in EV based on category input
            var scoreCalcMock = {
                getCategoryScore: function(category) {
                    if (category === 5) return 10;
                    return 0;
                }
            };

            // Setup the advisor module and inject score-calculator and StateMap mocks
            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            // Setup arguments for the getBestCategory() call
            var scorecard = '111110000000000'.split('').map(x => x === '1');
            var upperScore = 55;
            var dice = [6,6,6,6,6];

            // The advisor should suggest scoring the 6th category because
            // it triggers the upper section bonus of 50
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 5);

            // The advisor should now suggest scoring in the 15th category
            // since the EV just tops the upper section bonus slightly
            returnEV = 61.1;
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 14);
        });

        it('should trigger the upper section bonus at an upper score of 63 or higher', function() {
            // Setup a mock StateMap that will just return 0 on any input
            var stateMapMock = sinon.createStubInstance(StateMap);
            stateMapMock.getEV = function() { return 0; };

            // Setup a score-calculator mock that will vary in EV based on category input
            var returnVal = 2;
            var scoreCalcMock = {
                getCategoryScore: function(category) {
                    if (category === 5) return returnVal;
                    if (category === 14) return 50;
                    return 0;
                }
            };

            // Setup the advisor module and inject score-calculator and StateMap mocks
            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            // Setup arguments for the getBestCategory() call
            var scorecard = '000000000000000'.split('').map(x => x === '1');
            var upperScore = 60;
            var dice = [6,6,6,6,6];

            // The advisor should suggest scoring the 14th category because the
            // upper section should not be triggered
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 14);

            // The advisor should suggest scoring the 6th category because the
            // upper section bonus should now be triggered at 63
            returnVal = 3;
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 5);

            // The advisor should still suggest scoring the 6th category
            returnVal = 300;
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 5);
        });
    });
});