var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire').noPreserveCache();
var ArgumentError = require('../argumenterror');

describe('advisor', function() {
    describe('#init', function() {
        it('should use the StateMap provided in the settings', function() {

        });
    });

    describe('#getBestKeepers', function () {
        it('should throw ArgumentError on invalid scorecard', function() {
            var validatorMock = { isValidScorecard: function(scorecard) { return false } };
            var advisorProxy = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, 55, dice, 1), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function() {
            var validatorMock = { isValidUpperScore: function(upperScore) { return false } };
            var advisorProxy = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, 55, dice, 1), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function() {
            var validatorMock = { isValidDice: function(dice) { return false } };
            var advisorProxy = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, 55, dice, 1), ArgumentError);
        });

        it('should throw ArgumentError on invalid rolls left', function() {
            var validatorMock = { isValidRollsLeft: function(rollsLeft) { return false } };
            var advisorProxy = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestKeepers.bind(advisorProxy, scorecard, 55, dice, 1), ArgumentError);
        });
    });

    describe('#getBestCategory', function() {
        var advisor;

        it('should throw ArgumentError on invalid scorecard', function() {
            var validatorMock = { isValidScorecard: function(scorecard) { return false } };
            var advisorProxy = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestCategory.bind(advisorProxy, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function() {
            var validatorMock = { isValidUpperScore: function(upperScore) { return false } };
            var advisorProxy = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestCategory.bind(advisorProxy, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function() {
            var validatorMock = { isValidDice: function(dice) { return false } };
            var advisorProxy = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisorProxy.getBestCategory.bind(advisorProxy, scorecard, 55, dice), ArgumentError);
        });

        it('should choose the category with the best EV', function() {
            var scorecardToMatch = '000000000000001';

            var stateMapMock = {
                getEV: function(scorecard, upperScore) {
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === scorecardToMatch) return 2.0;
                    return 1.0;
                }
            };

            var scoreCalcMock = {
                getCategoryScore: function(category, dice) { return 0; }
            };

            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

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
            var stateMapMock = {
                getEV: function(scorecard, upperScore) { return 0; }
            };

            var bestCategory = 5;
            var scoreCalcMock = {
                getCategoryScore: function(category, dice) {
                    if (category === bestCategory) return 1;
                    return 0;
                }
            };

            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

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
            var stateMapMock = {
                getEV: function(scorecard, upperScore) {
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === '010000000000000') return 40.0;
                    if (scorecardString === '001000000000000') return 20.0;
                    return 0.0;
                }
            };

            var scoreCalcMock = {
                getCategoryScore: function(category, dice) {
                    if (category === 7) return 35.0;
                    if (category === 2) return 25.0;
                    return 0;
                }
            };

            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            var scorecard = new Array(15).fill(false);
            var upperScore = 25;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the 3rd category
            // because the sum of the EV and score is greater than scoring one of the
            // two by itself
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 2);
        });

        it('should skip marked categories', function() {
            var stateMapMock = {
                getEV: function(scorecard, upperScore) {
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === '000000000000001') return 5.0;
                    if (scorecardString === '000000010000001') return 2.0;
                    return 1.0;
                }
            };

            var scoreCalcMock = {
                getCategoryScore: function(category, dice) { return 0; }
            };

            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

            var scorecard = new Array(15).fill(false);
            scorecard[14] = true;
            var upperScore = 55;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the 8th category because
            // it should skip the 15th, even though it has greater EV
            assert.equal(advisorProxy.getBestCategory(scorecard, upperScore, dice), 7);
        });

        it('should account for the upper section bonus of 50', function() {
            var returnEV = 60.9;

            var stateMapMock = {
                getEV: function(scorecard, upperScore) {
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === '111110000000001') return returnEV;
                    return 1.0;
                }
            };

            var scoreCalcMock = {
                getCategoryScore: function(category, dice) {
                    if (category === 5) return 10;
                    return 0;
                }
            };

            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

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
            var stateMapMock = {
                getEV: function(scorecard, upperScore) { return 0; }
            };

            var returnVal = 2;
            var scoreCalcMock = {
                getCategoryScore: function(category, dice) {
                    if (category === 5) return returnVal;
                    if (category === 14) return 50;
                    return 0;
                }
            };

            var advisorProxy = proxyquire('../advisor', { './score-calculator': scoreCalcMock });
            advisorProxy.init({ 'stateMap': stateMapMock });

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