var chai = require('chai');
var assert = chai.assert;

describe('probability ', function() {
    describe('#getRollProbability', function() {
        it('should return 0.0001286008230452675', function() {
            var prob = require('../probability');
            var roll = [1, 1, 1, 1, 1];
            assert.equal(prob.getRollProbability(roll), 0.0001286008230452675);
        });
    });
});
