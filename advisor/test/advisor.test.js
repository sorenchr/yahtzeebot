var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire').noPreserveCache();
var ArgumentError = require('../argumenterror');

describe('advisor', function() {
    describe('#getBestKeepers', function () {
        it('should throw ArgumentError on invalid scorecard', function() {
            var validatorMock = { isValidScorecard: function(scorecard) { return false } };
            var advisor = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, 55, dice, 1), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function() {
            var validatorMock = { isValidUpperScore: function(upperScore) { return false } };
            var advisor = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, 55, dice, 1), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function() {
            var validatorMock = { isValidDice: function(dice) { return false } };
            var advisor = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, 55, dice, 1), ArgumentError);
        });

        it('should throw ArgumentError on invalid rolls left', function() {
            var validatorMock = { isValidRollsLeft: function(rollsLeft) { return false } };
            var advisor = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, 55, dice, 1), ArgumentError);
        });
    });

    describe('#getBestCategory', function() {
        it('should throw ArgumentError on invalid scorecard', function() {
            var validatorMock = { isValidScorecard: function(scorecard) { return false } };
            var advisor = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function() {
            var validatorMock = { isValidUpperScore: function(upperScore) { return false } };
            var advisor = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function() {
            var validatorMock = { isValidDice: function(dice) { return false } };
            var advisor = proxyquire('../advisor', { './validator': validatorMock });

            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });
    });
});