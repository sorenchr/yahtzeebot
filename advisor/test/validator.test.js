var chai = require('chai');
var assert = chai.assert;
var validator = require('../validator');

describe('validator', function() {
    describe('#isValidDice', function () {
        it('should return false on non-array input', function () {
            assert.isFalse(validator.isValidDice('abc'));
        });

        it('should return false on array with non-integer elements', function() {
            assert.isFalse(validator.isValidDice([2,1,'abc']));
            assert.isFalse(validator.isValidDice([2,1,'2']));
            assert.isFalse(validator.isValidDice([2,1,{}]));
            assert.isFalse(validator.isValidDice([2,1,null]));
            assert.isFalse(validator.isValidDice([2,1,true]));
            assert.isFalse(validator.isValidDice([2,1,undefined]));
            assert.isFalse(validator.isValidDice([2,1,NaN]));
            assert.isFalse(validator.isValidDice([2,1,new Date()]));
            assert.isFalse(validator.isValidDice([2,1,[2]]));
        });

        it('should return false on array with integers outside [1,6]', function() {
            assert.isFalse(validator.isValidDice([1,2,3,7]));
            assert.isFalse(validator.isValidDice([1,2,3,0]));
        });

        it('should return true on valid array', function() {
            assert.isTrue(validator.isValidDice([1,2,3,4,5,6]));
            assert.isTrue(validator.isValidDice([1,2,3,4,5]));
            assert.isTrue(validator.isValidDice([5,5,5,5,5]));
            assert.isTrue(validator.isValidDice([1,2,3,4]));
            assert.isTrue(validator.isValidDice([1,2,3]));
            assert.isTrue(validator.isValidDice([1,2]));
            assert.isTrue(validator.isValidDice([1]));
            assert.isTrue(validator.isValidDice([]));
        });
    });

    describe('#isValidRoll', function() {
        it('should return false on non-array input', function () {
            assert.isFalse(validator.isValidRoll('abc'));
        });

        it('should return false on array with non-integer elements', function() {
            assert.isFalse(validator.isValidRoll([2,1,'abc',2,1]));
            assert.isFalse(validator.isValidRoll([2,1,'2',2,1]));
            assert.isFalse(validator.isValidRoll([2,1,{},2,1]));
            assert.isFalse(validator.isValidRoll([2,1,null,2,1]));
            assert.isFalse(validator.isValidRoll([2,1,true,2,1]));
            assert.isFalse(validator.isValidRoll([2,1,undefined,2,1]));
            assert.isFalse(validator.isValidRoll([2,1,NaN,2,1]));
            assert.isFalse(validator.isValidRoll([2,1,new Date(),2,1]));
            assert.isFalse(validator.isValidRoll([2,1,[2],2,1]));
        });

        it('should return false on array with integers outside [1,6]', function() {
            assert.isFalse(validator.isValidRoll([1,2,3,7,3]));
            assert.isFalse(validator.isValidRoll([1,2,3,0,4]));
        });

        it('should return false on array not of length 5', function() {
            assert.isFalse(validator.isValidRoll([1,2,3,4,5,6]));
            assert.isFalse(validator.isValidRoll([1,2,3,4]));
        });

        it('should return true on valid array', function() {
            assert.isTrue(validator.isValidRoll([1,2,3,4,5]));
            assert.isTrue(validator.isValidRoll([5,5,5,5,5]));
        });
    });

    describe('#isValidCategory', function() {
        it('should return false on non-integer input', function() {
            assert.isFalse(validator.isValidCategory('a'));
            assert.isFalse(validator.isValidCategory('2.2'));
            assert.isFalse(validator.isValidCategory(2.2));
            assert.isFalse(validator.isValidCategory({}));
            assert.isFalse(validator.isValidCategory(null));
            assert.isFalse(validator.isValidCategory(true));
            assert.isFalse(validator.isValidCategory(undefined));
            assert.isFalse(validator.isValidCategory(NaN));
            assert.isFalse(validator.isValidCategory(new Date()));
            assert.isFalse(validator.isValidCategory([2]));
        });

        it('should return false on integer outside range [0,14]', function() {
            assert.isFalse(validator.isValidCategory(-1));
            assert.isFalse(validator.isValidCategory(15));
        });

        it('should true on valid integer', function() {
            for (var i = 0; i <= 14; i++) {
                assert.isTrue(validator.isValidCategory(i));
            }
        });
    });

    describe('#isValidScorecard', function() {
        it('should return false on non-array input', function () {
            assert.isFalse(validator.isValidScorecard('[2]'));
            assert.isFalse(validator.isValidScorecard('abc'));
            assert.isFalse(validator.isValidScorecard(2.2));
            assert.isFalse(validator.isValidScorecard({}));
            assert.isFalse(validator.isValidScorecard(null));
            assert.isFalse(validator.isValidScorecard(true));
            assert.isFalse(validator.isValidScorecard(undefined));
            assert.isFalse(validator.isValidScorecard(NaN));
            assert.isFalse(validator.isValidScorecard(new Date()));
            assert.isFalse(validator.isValidScorecard([2]));
        });

        it('should return false on array with non-boolean elements', function() {
            var scorecard = new Array(15).fill(true);
            var elms = ['[2]', 'true', 2.2, {}, null, undefined, NaN, new Date(), [2]];
            for (var i = 0; i < elms.length; i++) {
                scorecard[5] = elms[i];
                assert.isFalse(validator.isValidScorecard(scorecard));
            }
        });

        it('should return false on boolean array with size not 15', function() {
            var scorecard1 = new Array(14).fill(true);
            var scorecard2 = new Array(16).fill(true);
            assert.isFalse(validator.isValidScorecard(scorecard1));
            assert.isFalse(validator.isValidScorecard(scorecard2));
        });

        it('should return true on boolean array with size 15', function() {
            var scorecard = new Array(15).fill(true);
            assert.isTrue(validator.isValidScorecard(scorecard));
        });
    });

    describe('#isValidUpperScore', function() {
        it('should return false on non-integer input', function() {
            assert.isFalse(validator.isValidUpperScore('a'));
            assert.isFalse(validator.isValidUpperScore('22'));
            assert.isFalse(validator.isValidUpperScore(2.2));
            assert.isFalse(validator.isValidUpperScore({}));
            assert.isFalse(validator.isValidUpperScore(null));
            assert.isFalse(validator.isValidUpperScore(true));
            assert.isFalse(validator.isValidUpperScore(undefined));
            assert.isFalse(validator.isValidUpperScore(NaN));
            assert.isFalse(validator.isValidUpperScore(new Date()));
            assert.isFalse(validator.isValidUpperScore([2]));
        });

        it('should return false on negative integers', function() {
            assert.isFalse(validator.isValidUpperScore(-1));
        });

        it('should return true on positive integers', function() {
            assert.isTrue(validator.isValidUpperScore(0));
            assert.isTrue(validator.isValidUpperScore(5));
            assert.isTrue(validator.isValidUpperScore(50));
        });
    });

    describe('#isValidDie', function() {
        it('should return false on non-integer input', function() {
            assert.isFalse(validator.isValidDie('1'));
            assert.isFalse(validator.isValidDie('[2]'));
            assert.isFalse(validator.isValidDie(2.2));
            assert.isFalse(validator.isValidDie({}));
            assert.isFalse(validator.isValidDie(null));
            assert.isFalse(validator.isValidDie(true));
            assert.isFalse(validator.isValidDie(undefined));
            assert.isFalse(validator.isValidDie(NaN));
            assert.isFalse(validator.isValidDie(new Date()));
            assert.isFalse(validator.isValidDie([2]));
        });

        it('should return false on integers outside [1,6]', function() {
            assert.isFalse(validator.isValidDie(0));
            assert.isFalse(validator.isValidDie(7));
        });

        it('should return true on integers in [1,6]', function() {
            for (var i = 1; i <= 6; i++) {
                assert.isTrue(validator.isValidDie(i));
            }
        });
    });
});