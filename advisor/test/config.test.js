var chai = require('chai');
var assert = chai.assert;
var config = require('../config');
var rewire = require('rewire');
var sinon = require('sinon');

describe('config', function() {
    it('should be a simple object', function() {
        assert.isTrue(config === Object(config));
        assert.isFalse(Array.isArray(config));
    });

    it('should contain a path for the default state map', function() {
        assert.property(config, 'stateMap');
        assert.isString(config['stateMap']);
    });

    it('should contain the relative path to the state map', function() {
        // Rewire the config module
        var configRw = rewire('../config');
        var dirname = 'testdir';
        var result = 'pathresult';
        var resolveSpy = sinon.spy(function(from,to) { return result; });
        var pathMock = { resolve: resolveSpy };
        configRw.__set__('__dirname', dirname);
        configRw.__set__('path', pathMock);

        // Make sure that the relative path is generated properly, and returned
        assert.equal(configRw.stateMap, result);
        assert.isTrue(resolveSpy.calledWithExactly('', dirname + '/statemap.json'));
    });
});