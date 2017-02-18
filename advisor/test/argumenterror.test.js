var chai = require('chai');
var assert = chai.assert;
var ArgumentError = require('../src/argumenterror');

describe('ArgumentError', function() {
    describe('#constructor', function () {
        it('should construct a valid ArgumentError instance', function () {
            var msg = 'This is a test message';
            var err = new ArgumentError(msg);
            assert.equal(err.message, msg);
        });

        it('should inherit from Error', function() {
            var err = new ArgumentError();
            assert.instanceOf(err, Error);
        });
    });
});