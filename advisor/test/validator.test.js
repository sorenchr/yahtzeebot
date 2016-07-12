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
});