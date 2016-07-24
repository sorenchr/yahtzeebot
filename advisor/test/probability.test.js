var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire').noPreserveCache();
var ArgumentError = require('../argumenterror');

describe('probability ', function() {
    describe('#getDiceProbability', function() {
        // Ones
        it('should return 0.0001286008230452675 for [1,1,1,1,1]', function() {
            var prob = require('../probability');
            var roll = [1,1,1,1,1];
            assert.equal(prob.getDiceProbability(roll), 0.0001286008230452675);
        });

        // One pair
        it('should return 0.007716049382716049 for [6,6,3,2,4]', function() {
            var prob = require('../probability');
            var roll = [6,6,3,2,4];
            assert.equal(prob.getDiceProbability(roll), 0.007716049382716049);
        });

        // Two pairs
        it('should return 0.0038580246913580245 for [6,6,3,3,4]', function() {
            var prob = require('../probability');
            var roll = [6,6,3,3,4];
            assert.equal(prob.getDiceProbability(roll), 0.0038580246913580245);
        });

        // Three of a kind
        it('should return 0.00257201646090535 for [6,6,3,6,4]', function() {
            var prob = require('../probability');
            var roll = [6,6,3,6,4];
            assert.equal(prob.getDiceProbability(roll), 0.00257201646090535);
        });

        // Four of a kind
        it('should return 0.0006430041152263374 for [1,1,1,1,4]', function() {
            var prob = require('../probability');
            var roll = [1,1,1,1,4];
            assert.equal(prob.getDiceProbability(roll), 0.0006430041152263374);
        });
        
        // Small straight
        it('should return 0.015432098765432098 for [1,2,3,4,5]', function() {
            var prob = require('../probability');
            var roll = [1,2,3,4,5];
            assert.equal(prob.getDiceProbability(roll), 0.015432098765432098);
        });

        // Full house
        it('should return 0.001286008230452675 for [6,6,5,5,5]', function() {
            var prob = require('../probability');
            var roll = [6,6,5,5,5];
            assert.equal(prob.getDiceProbability(roll), 0.001286008230452675);
        });

        // Chance (random dice)
        it('should return 0.007716049382716049 for [1,3,4,1,6]', function() {
            var prob = require('../probability');
            var roll = [1,3,4,1,6];
            assert.equal(prob.getDiceProbability(roll), 0.007716049382716049);
        });

        // Yahtzee
        it('should return 0.0001286008230452675 for [4,4,4,4,4]', function() {
            var prob = require('../probability');
            var roll = [4,4,4,4,4];
            assert.equal(prob.getDiceProbability(roll), 0.0001286008230452675);
        });

        // 4 dice (unique dice)
        it('should return 0.018518518518518517 for [1,2,3,4]', function() {
            var prob = require('../probability');
            var roll = [1,2,3,4];
            assert.equal(prob.getDiceProbability(roll), 0.018518518518518517);
        });

        // 4 dice (some of the same)
        it('should return 0.009259259259259259 for [2,2,3,4]', function() {
            var prob = require('../probability');
            var roll = [2,2,3,4];
            assert.equal(prob.getDiceProbability(roll), 0.009259259259259259);
        });

        // 4 dice (all the same)
        it('should return 0.0007716049382716049 for [4,4,4,4]', function() {
            var prob = require('../probability');
            var roll = [4,4,4,4];
            assert.equal(prob.getDiceProbability(roll), 0.0007716049382716049);
        });
        
        // 3 dice (unique dice)
        it('should return 0.027777777777777776 for [1,2,3]', function() {
            var prob = require('../probability');
            var roll = [1,2,3];
            assert.equal(prob.getDiceProbability(roll), 0.027777777777777776);
        });
        
        // 3 dice (some of the same)
        it('should return 0.027777777777777776 for [3,2,3]', function() {
            var prob = require('../probability');
            var roll = [1,2,3];
            assert.equal(prob.getDiceProbability(roll), 0.027777777777777776);
        });
        
        // 3 dice (all the same)
        it('should return 0.004629629629629629 for [3,3,3]', function() {
            var prob = require('../probability');
            var roll = [3,3,3];
            assert.equal(prob.getDiceProbability(roll), 0.004629629629629629);
        });
        
        // 2 dice (unique dice)
        it('should return 0.05555555555555555 for [1,2]', function() {
            var prob = require('../probability');
            var roll = [1,2];
            assert.equal(prob.getDiceProbability(roll), 0.05555555555555555);
        });
        
        // 2 dice (all the same)
        it('should return 0.027777777777777776 for [2,2]', function() {
            var prob = require('../probability');
            var roll = [2,2];
            assert.equal(prob.getDiceProbability(roll), 0.027777777777777776);
        });
        
        // 1 die
        it('should return 0.16666666666666666 for [1]', function() {
            var prob = require('../probability');
            var roll = [1];
            assert.equal(prob.getDiceProbability(roll), 0.16666666666666666);
        });

        it('should throw ArgumentError on invalid input', function() {
            var validatorMock = { isValidDice: function(dice) { return false } };
            var prob = proxyquire('../probability', { './validator': validatorMock });
            assert.throws(prob.getDiceProbability.bind(prob, [1,2]), ArgumentError);
        });
    });
});
