var _ = require('lodash');

var DiceTreeNode = function(value) {
    this.value = value ? value : null;
    this.path = [];
    this.parents = [];
    this.children = { linked: [], descendants: {} };
}

DiceTreeNode.prototype.getNode = function(path) {
    if (path.length === 0) return this;
    return this.children.descendants[path[0]].getNode(path.slice(1));
}

DiceTreeNode.prototype.addChild = function(node, linked) {
    if (linked) {
        this.children.linked.push(node);
    } else {
        node.path = this.path.concat(node.value);
        this.children.descendants[node.value] = node;
    }

    node.parents.push(this);
}

DiceTreeNode.prototype.getChildren = function() {
    return _.concat(this.children.linked, _.values(this.children.descendants));
}

DiceTreeNode.prototype.getLeafNodePaths = function(visitedNodes) {
    // Initialize the visited nodes if necessary
    if (typeof visitedNodes === 'undefined') visitedNodes = [];

    // Add this node to the list of visited nodes
    visitedNodes.push(this);

    // Check if this node is the bottom of the tree
    if (_.isEmpty(this.children.descendants)) return [this.path];

    // Visit each child not already visited
    return _.flatten(this.getChildren().filter((child) => !_.includes(visitedNodes, child)).
                map((child) => child.getLeafNodePaths(visitedNodes)));
}

DiceTreeNode.prototype.getRootNodePaths = function(visitedNodes) {
    // Initialize the visited nodes if necessary
    if (typeof visitedNodes === 'undefined') visitedNodes = [];

    // Add this node to the list of visited nodes
    visitedNodes.push(this);

    // Check if this node is the top of the tree
    if (_.isEmpty(this.parents)) return [this.path];

    // Get the root node paths for each parent
    var rootNodePaths = this.parents.filter((parent) => !_.includes(visitedNodes, parent)).
            map((parent) => parent.getRootNodePaths(visitedNodes));

    return _.concat([this.path], _.flatten(rootNodePaths));
}

var DiceTree = function(depth, maxValue) {
    this.rootNode = new DiceTreeNode(maxValue);

    // Setup the list of nodes for the previous depth
    var parentNodes = [this.rootNode];

    for (var i = 0; i < depth; i++) {
        // Setup the list for the nodes at this depth
        var childNodes = [];

        // Generate child nodes for each node at the previous depth
        parentNodes.forEach(function(parentNode) {
            // Only generate nodes with values up to the parent node's value
            for (var value = 1; value <= parentNode.value; value++) {
                var node = new DiceTreeNode(value);
                parentNode.addChild(node, false);

                // Check if the node should be linked to any other parent nodes
                parentNodes.forEach(function(otherParentNode) {
                    var contains = arrayContains(node.path, otherParentNode.path);
                    if (contains && parentNode !== otherParentNode) {
                        otherParentNode.addChild(node, true);
                    }
                });

                // Add to the list of nodes at this depth
                childNodes.push(node);
            }
        });

        parentNodes = childNodes;
    }

    this.rootNode.value = null;
}

function arrayContains(arr1, arr2) {
    if (arr1 === arr2) return true;
    if (arr1 == null || arr2 == null) return false;
    if (arr1.length < arr2.length) return false;

    var count = {};

    for (var i = 0; i < arr1.length; i++) {
        if (!count[arr1[i]]) count[arr1[i]] = 0;
        count[arr1[i]]++;
    }

    for (var i = 0; i < arr2.length; i++) {
        if (!count[arr2[i]] || --count[arr2[i]] < 0) return false;
    }

    return true;
}

DiceTree.prototype.getKeepers = function(roll) {
    // Get the sorted path
    path = _.orderBy(roll, _.identity, ['desc']);

    // Get the node at the specified path
    var node = this.rootNode.getNode(path);

    // Return all the possible paths to the root node from the node
    return node.getRootNodePaths();
}

DiceTree.prototype.getRolls = function(keepers) {
    // Get the sorted path
    path = _.orderBy(keepers, _.identity, ['desc']);

    // Get the node at the specified path
    var node = this.rootNode.getNode(path);

    // Return the paths for all the leaf nodes reachable from the node
    return node.getLeafNodePaths();
}

module.exports = DiceTree;
