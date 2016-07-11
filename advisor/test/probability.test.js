var chai = require('chai');
var assert = chai.assert;

describe('probability ', function() {
    describe('#getRollProbability', function() {
        // Ones
        it('should return 0.0001286008230452675 for [1,1,1,1,1]', function() {
            var prob = require('../probability');
            var roll = [1,1,1,1,1];
            assert.equal(prob.getRollProbability(roll), 0.0001286008230452675);
        });

        // One pair
        it('should return 0.007716049382716049 for [6,6,3,2,4]', function() {
            var prob = require('../probability');
            var roll = [6,6,3,2,4];
            assert.equal(prob.getRollProbability(roll), 0.007716049382716049);
        });

        // Two pairs
        it('should return 0.0038580246913580245 for [6,6,3,3,4]', function() {
            var prob = require('../probability');
            var roll = [6,6,3,3,4];
            assert.equal(prob.getRollProbability(roll), 0.0038580246913580245);
        });

        // Three of a kind
        it('should return 0.00257201646090535 for [6,6,3,6,4]', function() {
            var prob = require('../probability');
            var roll = [6,6,3,6,4];
            assert.equal(prob.getRollProbability(roll), 0.00257201646090535);
        });

        // Four of a kind
        it('should return 0.0006430041152263374 for [1,1,1,1,4]', function() {
            var prob = require('../probability');
            var roll = [1,1,1,1,4];
            assert.equal(prob.getRollProbability(roll), 0.0006430041152263374);
        });
        
        // Small straight
        it('should return 0.015432098765432098 for [1,2,3,4,5]', function() {
            var prob = require('../probability');
            var roll = [1,2,3,4,5];
            assert.equal(prob.getRollProbability(roll), 0.015432098765432098);
        });

        // Full house
        it('should return 0.001286008230452675 for [6,6,5,5,5]', function() {
            var prob = require('../probability');
            var roll = [6,6,5,5,5];
            assert.equal(prob.getRollProbability(roll), 0.001286008230452675);
        });

        // Chance (random dice)
        it('should return 0.007716049382716049 for [1,3,4,1,6]', function() {
            var prob = require('../probability');
            var roll = [1,3,4,1,6];
            assert.equal(prob.getRollProbability(roll), 0.007716049382716049);
        });

        // Yahtzee
        it('should return 0.0001286008230452675 for [4,4,4,4,4]', function() {
            var prob = require('../probability');
            var roll = [4,4,4,4,4];
            assert.equal(prob.getRollProbability(roll), 0.0001286008230452675);
        });
    });
});
