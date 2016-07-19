var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire').noPreserveCache();
var ArgumentError = require('../argumenterror');

describe('DiceNode', function() {
    describe('#constructor', function () {
        it('should construct a new node', function () {
            var DiceNode = require('../dicenode');
            var dice = [1];
            var node = new DiceNode(dice);
            assert.equal(node.dice, dice);
            assert.deepEqual(node.parents, []);
            assert.deepEqual(node.children, {});
        });

        it('should throw ArgumentError on incorrect dice', function() {
            var validatorMock = {
                isValidDice: function(dice) { return false }
            };
            var DiceNode = proxyquire('../dicenode', { './validator': validatorMock });
            assert.throws(function() { new DiceNode([1,2,3,4,5]) }, ArgumentError);
        });
    });

    describe('#addChild', function() {
        it('should throw ArgumentError on invalid child node', function() {
            var DiceNode = require('../dicenode');
            var node = new DiceNode([1]);
            assert.throws(node.addChild.bind(node, '1'), ArgumentError);
            assert.throws(node.addChild.bind(node, '[2]'), ArgumentError);
            assert.throws(node.addChild.bind(node, 2.2)), ArgumentError;
            assert.throws(node.addChild.bind(node, {}), ArgumentError);
            assert.throws(node.addChild.bind(node, null), ArgumentError);
            assert.throws(node.addChild.bind(node, true), ArgumentError);
            assert.throws(node.addChild.bind(node, undefined), ArgumentError);
            assert.throws(node.addChild.bind(node, NaN), ArgumentError);
            assert.throws(node.addChild.bind(node, new Date()), ArgumentError);
            assert.throws(node.addChild.bind(node, [2]), ArgumentError);
        });

        it('should attach children to the node', function() {
            var DiceNode = require('../dicenode');
            var node = new DiceNode([1]);
            var child1 = new DiceNode([5]);
            var child2 = new DiceNode([6]);
            node.addChild(child1);
            node.addChild(child2);
            assert.sameMembers([child1, child2], node.getChildren());
        });
    });

    describe('#getChildren', function() {
        it('should return an array of the children', function() {
            var DiceNode = require('../dicenode');
            var node = new DiceNode([1]);
            var child = new DiceNode([5]);
            node.addChild(child);
            assert.sameMembers([child], node.getChildren());
        });
    });
});