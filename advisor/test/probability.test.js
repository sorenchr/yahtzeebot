var chai = require('chai');
var assert = chai.assert;
var prob = require('../probability');

describe('probability ', function() {
    describe('#getDiceProbability', function() {
        // 5 dice
        it('should return probability for 5 dice', function() {
            assert.equal(prob.getDiceProbability([1,2,3,4,5]), 0.015432098765432098);
            assert.equal(prob.getDiceProbability([2,2,3,4,5]), 0.007716049382716049);
            assert.equal(prob.getDiceProbability([2,2,2,4,5]), 0.00257201646090535);
            assert.equal(prob.getDiceProbability([2,2,2,2,5]), 0.0006430041152263374);
            assert.equal(prob.getDiceProbability([2,2,2,2,2]), 0.0001286008230452675);
        });

        // 4 dice
        it('should return probability for 4 dice', function() {
            assert.equal(prob.getDiceProbability([4,4,4,4]), 0.0007716049382716049);
            assert.equal(prob.getDiceProbability([2,2,3,4]), 0.009259259259259259);
            assert.equal(prob.getDiceProbability([1,2,3,4]), 0.018518518518518517);
            assert.equal(prob.getDiceProbability([5,5,5,4]), 0.0030864197530864196);
        });

        // 3 dice
        it('should return probability for 3 dice', function() {
            assert.equal(prob.getDiceProbability([3,3,3]), 0.004629629629629629);
            assert.equal(prob.getDiceProbability([1,2,3]), 0.027777777777777776);
            assert.equal(prob.getDiceProbability([3,3,4]), 0.013888888888888888);
        });

        // 2 dice
        it('should return probability for 2 dice', function() {
            assert.equal(prob.getDiceProbability([2,2]), 0.027777777777777776);
            assert.equal(prob.getDiceProbability([1,2]), 0.05555555555555555);
        });

        // 1 die
        it('should return probability for 1 die', function() {
            assert.equal(prob.getDiceProbability([1]), 0.16666666666666666);
            assert.equal(prob.getDiceProbability([2]), 0.16666666666666666);
        });
    });
});