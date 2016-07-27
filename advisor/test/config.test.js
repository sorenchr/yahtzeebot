var chai = require('chai');
var assert = chai.assert;
var config = require('../config');

describe('config', function() {
    it('should be a simple object', function() {
        assert.isTrue(config === Object(config));
        assert.isFalse(Array.isArray(config));
    });

    it('should contain a path for the default state map', function() {
        assert.property(config, 'stateMap');
        assert.isString(config['stateMap']);
    });
});