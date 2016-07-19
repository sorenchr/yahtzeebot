var validator = require('./validator');
var ArgumentError = require('./argumenterror');
var _ = require('lodash');

var DiceNode = function(dice) {
    if (!validator.isValidDice(dice)) throw new ArgumentError('Invalid dice: ' + dice);
    this.dice = dice;
    this.parents = [];
    this.children = {};
};

DiceNode.prototype.addChild = function(child) {
    if (!(child instanceof DiceNode)) throw new ArgumentError('Invalid child node: ' + child);
    var key = child.dice.join('');
    this.children[key] = child;
};

DiceNode.prototype.getChildren = function() {
    return _.values(this.children);
};

module.exports = DiceNode;