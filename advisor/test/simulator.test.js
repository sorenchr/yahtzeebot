var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');
var sinon = require('sinon');
var StateMap = require('../src/statemap');

describe('simulator', function() {
    it('should init advisor with StateMap from own init', function() {
        var avMock = { init: sinon.spy() };
        var smMock = sinon.createStubInstance(StateMap);

        var simulator = proxyquire('../src/simulator', {
            './advisor': avMock
        });
        simulator.init({ stateMap: smMock });

        assert(avMock.init.calledOnce);
        var callArg = avMock.init.getCall(0).args[0];
        assert.strictEqual(callArg.stateMap, smMock);
    });

    describe('#simulateGame', function() {
        it('should call simulateRound() with a fresh game state', function() {
            var avMock = { };

            var simulator = proxyquire('../src/simulator', {
                './advisor': avMock
            });

            simulator.simulateRound = sinon.spy(function() {
                return { scorecard: [], score: 0, upperScore: 0 };
            });

            simulator.simulateGame();
            var firstCallArgs = simulator.simulateRound.getCall(0).args;

            assert.sameMembers(firstCallArgs[0], new Array(15).fill(false));
            assert.equal(firstCallArgs[1], 0);
            assert.equal(firstCallArgs[2], 0);
        });

        it('should call simulateRound() for reach round in the game', function() {
            var avMock = { };

            var simulator = proxyquire('../src/simulator', {
                './advisor': avMock
            });

            // Make each call to simulateRound return the following:
            // { scorecard: a marked scorecard up to 'counter', score: 'counter', upperScore: 'counter' }
            var counter = 1;
            simulator.simulateRound = sinon.spy(function(scorecard) {
                var counterTemp = counter;
                var newScorecard = _.clone(scorecard);
                newScorecard[counterTemp] = true;
                var result = { scorecard: newScorecard, score: counterTemp, upperScore: counterTemp };
                counter++;
                return result;
            });

            var score = simulator.simulateGame();

            // Verify that each call to simulateRound() was connected to the last
            for (var i = 0; i < 15; i++) {
                var callArgs = simulator.simulateRound.getCall(i).args;
                var expectedScorecard = _.range(15).map((x,j) => j < i);
                assert.sameMembers(callArgs[0], expectedScorecard);
                assert.equal(callArgs[1], i);
                assert.equal(callArgs[2], i);
            }

            // Verify that simulateRound() was called 15 times
            assert.equal(score, 15);
        })
    });

    describe('#simulateRound', function() {
        it('should return the new marked scorecard', function() {
            var bestCategory = 0;
            var avMock = {
                getBestKeepers: function(scorecard, upperScore, dice) { return dice; },
                getBestCategory: function() { return bestCategory; }
            };

            var simulator = proxyquire('../src/simulator', {
                './advisor': avMock
            });

            // bestCategory = 0
            var scorecard = new Array(15).fill(false);
            var result = simulator.simulateRound(scorecard, 55, 55);
            assert.notStrictEqual(result.scorecard, scorecard);
            var formattedScoreard = result.scorecard.map(x => x ? '1' : '0').join('');
            var expectedScorecard = _.range(15).map((x,i) => i === bestCategory ? '1' : '0').join('');
            assert.equal(formattedScoreard, expectedScorecard);

            // bestCategory = 7
            scorecard = new Array(15).fill(false);
            bestCategory = 7;
            result = simulator.simulateRound(scorecard, 55, 55);
            assert.notStrictEqual(result.scorecard, scorecard);
            var formattedScoreard = result.scorecard.map(x => x ? '1' : '0').join('');
            var expectedScorecard = _.range(15).map((x,i) => i === bestCategory ? '1' : '0').join('');
            assert.equal(formattedScoreard, expectedScorecard);
        });

        it('should return the new score with the category score', function() {
            var bestCategory = 0;
            var avMock = {
                getBestKeepers: function(scorecard, upperScore, dice) { return dice; },
                getBestCategory: function() { return bestCategory; }
            };

            var scMock = {
                getCategoryScore: function(category) {
                    if (category === bestCategory) return 5;
                    return 0;
                }
            };

            var simulator = proxyquire('../src/simulator', {
                './advisor': avMock,
                './score-calculator': scMock
            });

            // bestCategory = 0
            var score = 30;
            var scorecard = new Array(15).fill(false);
            var result = simulator.simulateRound(scorecard, score, 20);
            assert.equal(result.score, score + 5);

            // bestCategory = 5
            bestCategory = 5;
            score = 30;
            scorecard = new Array(15).fill(false);
            result = simulator.simulateRound(scorecard, score, 20);
            assert.equal(result.score, score + 5);
        });

        it('should trigger the bonus', function() {
            var bestCategory = 0;
            var avMock = {
                getBestKeepers: function(scorecard, upperScore, dice) { return dice; },
                getBestCategory: function() { return bestCategory; }
            };

            var categoryScore = 2;
            var scMock = {
                getCategoryScore: function(category) {
                    if (category === bestCategory) return categoryScore;
                    return 0;
                }
            };

            var simulator = proxyquire('../src/simulator', {
                './advisor': avMock,
                './score-calculator': scMock
            });

            // bestCategory = 0, categoryScore = 2 (just enough to trigger the bonus)
            var score = 20;
            var upperScore = 61;
            var scorecard = new Array(15).fill(false);
            var result = simulator.simulateRound(scorecard, score, upperScore);
            assert.equal(result.score, score + categoryScore + 50);

            // bestCategory = 5, categoryScore = 2 (just enough to trigger the bonus)
            score = 20;
            bestCategory = 5;
            upperScore = 61;
            scorecard = new Array(15).fill(false);
            result = simulator.simulateRound(scorecard, score, upperScore);
            assert.equal(result.score, score + categoryScore + 50);

            // bestCategory = 5, categoryScore = 1 (not enough to trigger the bonus)
            score = 20;
            bestCategory = 5;
            categoryScore = 1;
            upperScore = 61;
            scorecard = new Array(15).fill(false);
            result = simulator.simulateRound(scorecard, score, upperScore);
            assert.equal(result.score, score + categoryScore);
        });

        it('should return the new upper score', function() {
            var bestCategory = 0;
            var avMock = {
                getBestKeepers: function(scorecard, upperScore, dice) { return dice; },
                getBestCategory: function() { return bestCategory; }
            };

            var categoryScore = 2;
            var scMock = {
                getCategoryScore: function(category) {
                    if (category === bestCategory) return categoryScore;
                    return 0;
                }
            };

            var simulator = proxyquire('../src/simulator', {
                './advisor': avMock,
                './score-calculator': scMock
            });

            // bestCategory = 0
            var score = 20;
            var upperScore = 40;
            var scorecard = new Array(15).fill(false);
            var result = simulator.simulateRound(scorecard, score, upperScore);
            assert.equal(result.upperScore, upperScore + categoryScore);

            // bestCategory = 5
            bestCategory = 5;
            var score = 20;
            var upperScore = 40;
            var scorecard = new Array(15).fill(false);
            var result = simulator.simulateRound(scorecard, score, upperScore);
            assert.equal(result.upperScore, upperScore + categoryScore);

            // bestCategory = 6
            bestCategory = 6;
            var score = 20;
            var upperScore = 40;
            var scorecard = new Array(15).fill(false);
            var result = simulator.simulateRound(scorecard, score, upperScore);
            assert.equal(result.upperScore, upperScore);
        })
    });
});