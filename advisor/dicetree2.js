var _ = require('lodash');

var DiceTreeNode = function(value, parents, children) {
    this.value = value ? value : null;
    this.parents = parents ? parents : {};
    this.children = children ? children : {};
}

DiceTreeNode.prototype.getNode = function(path) {
    if (path.length === 0) return this;
    return this.children[path[0]].getNode(path.slice(1));
}

DiceTreeNode.prototype.getLeafNodePaths = function(depth) {
    if (depth == 0) return [[this.value]];

    var children = _.values(this.children);
    var childPaths = [];
    for (var i = 0; i < children.length; i++) {
        var leafNodePaths = children[i].getLeafNodePaths(depth-1);
        var thisChildPaths = leafNodePaths.map((path) => this.value ? [this.value].concat(path) : path);
        childPaths = childPaths.concat(thisChildPaths);
    }

    return childPaths;
}

DiceTreeNode.prototype.getRootNodePaths = function() {

}

var DiceTree = function(depth, maxValue) {
    // Construct the root node
    var tree = new DiceTreeNode();

    // Setup a map of parent nodes for each value in the previous depth
    var parentNodes = //_.range(0, maxValue+1).reduce((result, item) => result[item] = this.tree, {});
    _.range(1, maxValue+1).reduce(function(result, item) {
        result[item] = tree;
        return result;
    }, {});

    // Create #maxValue nodes for each depth
    for (var i = 0; i < depth; i++) {
        // Setup a map that will contain the nodes for this depth
        var childNodes = {};

        for (var j = 1; j <= maxValue; j++) {
            // Construct the new node with the proper value
            var node = new DiceTreeNode(j);

            // Attach the node to the proper parent nodes
            getParents(parentNodes, j).forEach(function(parent) {
                parent.children[j] = node;
                node.parents[parent.value] = parent;
            });

            // Add this node to the map of child nodes
            childNodes[j] = node;
        }

        parentNodes = childNodes;
    }

    this.tree = tree;
}

function getParents(parentNodes, maxValue) {
    var filteredNodes = _.pickBy(parentNodes, (value, key) => key <= maxValue);
    return _.values(filteredNodes);
}

module.exports = DiceTree;
