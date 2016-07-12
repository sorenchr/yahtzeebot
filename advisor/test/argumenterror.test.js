var chai = require('chai');
var assert = chai.assert;

describe('ArgumentError', function() {
    describe('#constructor', function () {
        it('should construct a valid ArgumentError instance', function () {
            var ArgumentError = require('../argumenterror');
            var msg = 'This is a test message';
            var err = new ArgumentError(msg);
            assert.equal(err.message, msg);
        });
    });

    describe('#toString', function() {
        it('should output a correctly formatted string', function() {
            var ArgumentError = require('../argumenterror');
            var msg = 'This is a test message';
            var err = new ArgumentError(msg);
            var expected = 'ArgumentError: ' + msg;
            assert.equal(err.toString(), expected);
        });
    });
});