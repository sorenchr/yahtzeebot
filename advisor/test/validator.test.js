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
});