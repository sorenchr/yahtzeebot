var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var _ = require('lodash');

describe('FinalRollsMap', function() {
    describe('#constructor', function() {
        it('should use the EV from the StateMap for the best category for each roll', function() {
            var bestCategory = 5; // Returned in the getBestCategory() overwrite
            var evVal = 13.55; // Returned in the StateMap mock

            // Setup a mock StateMap that will return EV based on the input scorecard
            var smMock = {
                getEV: function(scorecard, upperScore) {
                    // Check that the best category is being used for EV lookups
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    var expectedScorecard = new Array(15).fill(0);
                    expectedScorecard[bestCategory] = 1;
                    if (scorecardString === expectedScorecard.join('')) return evVal;
                    return 0;
                }
            };

            // Setup a score-calculator mock that will just return 0 for everything
            var scMock = {
                getCategoryScore: function() { return 0; }
            };

            // Setup a combinatorics mock that will return a pre-determined list of rolls
            var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
            var cmbMock = {
                getAllRolls: function() { return rolls; }
            };

            // Setup an advisor mock to inject a pre-determined category
            var aMock = {
                getBestCategory: function(scorecard, upperScore, dice) {
                    return bestCategory;
                }
            };

            // Setup the FinalRollsMap module
            var FinalRollsMap = proxyquire('../finalrollsmap', {
                './combinatorics': cmbMock,
                './score-calculator': scMock,
                './advisor': aMock
            });

            // Setup arguments for the method call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;

            // The EV should be equal to evVal
            var finalRolls = new FinalRollsMap(scorecard, upperScore, smMock);
            rolls.forEach(function(roll) {
                assert.equal(finalRolls.getEV(roll), evVal);
            });
        });

        it('should set the category score to the EV for each roll', function() {
            var bestCategory = 5; // Returned in the getBestCategory() overwrite
            var categoryScore = 8.3213123; // Returned in the StateMap mock

            // Setup a mock StateMap that will return EV based on the input scorecard
            var smMock = {
                getEV: function() { return 0; }
            };

            // Setup a combinatorics mock that will return a pre-determined list of rolls
            var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
            var cmbMock = {
                getAllRolls: function() { return rolls; }
            };

            // Setup a score-calculator mock that will just return 0 for everything
            var scMock = {
                getCategoryScore: function(category, dice) {
                    if (category === bestCategory && _.includes(rolls, dice)) return categoryScore;
                    return 0;
                }
            };

            // Setup an advisor mock to inject a pre-determined category
            var aMock = {
                getBestCategory: function(scorecard, upperScore, dice) {
                    return bestCategory;
                }
            };

            // Setup the FinalRollsMap module
            var FinalRollsMap = proxyquire('../finalrollsmap', {
                './combinatorics': cmbMock,
                './score-calculator': scMock,
                './advisor': aMock
            });

            // Setup arguments for the method call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;

            // The EV should be equal to evVal
            var finalRolls = new FinalRollsMap(scorecard, upperScore, smMock);
            rolls.forEach(function(roll) {
                assert.equal(finalRolls.getEV(roll), categoryScore);
            });
        });

        it('should set the sum of the StateMap EV and the category score to the EV for each roll', function() {
            var bestCategory = 5; // Returned in the getBestCategory() overwrite
            var evVal = 13.55; // Returned in the StateMap mock
            var categoryScore = 8.3213123; // Returned in the StateMap mock

            // Setup a mock StateMap that will return EV based on the input scorecard
            var smMock = {
                getEV: function(scorecard, upperScore) {
                    // Check that the best category is being used for EV lookups
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    var expectedScorecard = new Array(15).fill(0);
                    expectedScorecard[bestCategory] = 1;
                    if (scorecardString === expectedScorecard.join('')) return evVal;
                    return 0;
                }
            };

            // Setup a combinatorics mock that will return a pre-determined list of rolls
            var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
            var cmbMock = {
                getAllRolls: function() { return rolls; }
            };

            // Setup a score-calculator mock that will just return 0 for everything
            var scMock = {
                getCategoryScore: function(category, dice) {
                    if (category === bestCategory && _.includes(rolls, dice)) return categoryScore;
                    return 0;
                }
            };

            // Setup an advisor mock to inject a pre-determined category
            var aMock = {
                getBestCategory: function(scorecard, upperScore, dice) {
                    return bestCategory;
                }
            };

            // Setup the FinalRollsMap module
            var FinalRollsMap = proxyquire('../finalrollsmap', {
                './combinatorics': cmbMock,
                './score-calculator': scMock,
                './advisor': aMock
            });

            // Setup arguments for the method call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;

            // The EV should be equal to evVal + categoryScore
            var finalRolls = new FinalRollsMap(scorecard, upperScore, smMock);
            rolls.forEach(function(roll) {
                assert.equal(finalRolls.getEV(roll), evVal + categoryScore);
            });
        });

        it('should trigger the upper section bonus at an upper score of 63 or higher', function() {
            var bestCategory = 5; // Returned in the getBestCategory() overwrite
            var evVal = 13.55; // Returned in the StateMap mock
            var categoryScore = 4; // Returned in the StateMap mock

            // Setup a mock StateMap that will return EV based on the input scorecard
            var smMock = {
                getEV: function(scorecard, upperScore) {
                    // Check that the best category is being used for EV lookups
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    var expectedScorecard = new Array(15).fill(0);
                    expectedScorecard[bestCategory] = 1;
                    if (scorecardString === expectedScorecard.join('')) return evVal;
                    return 0;
                }
            };

            // Setup a combinatorics mock that will return a pre-determined list of rolls
            var rolls = [[1,2,3,4,5], [2,3,4,5,6]];
            var cmbMock = {
                getAllRolls: function() { return rolls; }
            };

            // Setup a score-calculator mock that will just return 0 for everything
            var scMock = {
                getCategoryScore: function(category, dice) {
                    if (category === bestCategory && _.includes(rolls, dice)) return categoryScore;
                    return 0;
                }
            };

            // Setup an advisor mock to inject a pre-determined category
            var aMock = {
                getBestCategory: function(scorecard, upperScore, dice) {
                    return bestCategory;
                }
            };

            // Setup the FinalRollsMap module
            var FinalRollsMap = proxyquire('../finalrollsmap', {
                './combinatorics': cmbMock,
                './score-calculator': scMock,
                './advisor': aMock
            });

            // Setup arguments for the method call
            var scorecard = new Array(15).fill(false);
            var upperScore = 63 - categoryScore;

            // The EV should be equal to evVal + categoryScore + 50 (for the bonus)
            var finalRolls = new FinalRollsMap(scorecard, upperScore, smMock);
            rolls.forEach(function(roll) {
                assert.equal(finalRolls.getEV(roll), evVal + categoryScore + 50);
            });

            // The EV should be equal to evVal + categoryScore
            upperScore -= 1;
            var finalRolls = new FinalRollsMap(scorecard, upperScore, smMock);
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

            // Setup an advisor mock to inject a pre-determined category
            var aMock = {
                getBestCategory: function(scorecard, upperScore, dice) {
                    return bestCategory;
                }
            };

            // Setup the FinalRollsMap module
            var FinalRollsMap = proxyquire('../finalrollsmap', {
                './combinatorics': cmbMock,
                './advisor': aMock
            });

            // Instantiate the FinalRollsMap
            var map = new FinalRollsMap();

            map.rollsEV = { '500000': 27.5 };
            assert.equal(map.getEV([1,1,1,1,1]), 27.5);
            map.rollsEV = { '500000': 2123.2 };
            assert.equal(map.getEV([1,1,1,1,1]), 2123.2);
            map.rollsEV = {};
            assert.isUndefined(map.getEV([1,2,3]));
        });
    });
});