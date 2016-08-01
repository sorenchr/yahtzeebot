var chai = require('chai');
var assert = chai.assert;
var InitializationError = require('../initializationerror');

describe('InitializationError', function() {
    describe('#constructor', function () {
        it('should construct a valid InitializationError instance', function () {
            var msg = 'This is a test message';
            var err = new InitializationError(msg);
            assert.equal(err.message, msg);
        });

        it('should inherit from Error', function() {
            var err = new InitializationError();
            assert.instanceOf(err, Error);
        });
    });
});