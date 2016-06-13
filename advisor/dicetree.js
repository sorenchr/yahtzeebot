var _ = require('lodash');

var DiceTreeNode = function(value, path, parent, children, parentLinks, childLinks) {
    this.value = value ? value : null;
    this.path = path ? path : [];
    this.parent = parent ? parent : null;
    this.children = children || {};
    this.parentLinks = parentLinks || [];
    this.childLinks = childLinks || [];
}

DiceTreeNode.prototype.getNode = function(path) {
    // This node is at the empty path
    if (path.length === 0) return this;

    // Follow the path recursively
    return this.children[path[0]].getNode(path.slice(1));
}

DiceTreeNode.prototype.getLeafNodePaths = function(followLinks) {
    // Check if this node is the bottom of the tree
    if (_.isEmpty(this.children)) return [this.path];

    // Get the leaf node paths of every child
    var childPaths = _.values(this.children).map(child => child.getLeafNodePaths(false));

    // Get the leaf node paths of every child link
    var childLinkPaths = followLinks ? this.childLinks.map(child => child.getLeafNodePaths(true)) : [];

    // Return the total list of paths
    return childPaths.concat(childLinkPaths).reduce((prev, curr) => prev.concat(curr));
}

DiceTreeNode.prototype.getRootNodePaths = function(followLinks) {
    // Check if this is the root node
    if (!this.parent.parent) return [this.path];

    // Get the paths for the parent node
    var parentPaths = this.parent.getRootNodePaths(false);

    // Get the paths for the linked parents
    var parentLinkPaths = followLinks ? this.parentLinks.map(parent => parent.getRootNodePaths(true)) : [];

    // Return the total list of paths
    return [this.path].concat(parentPaths).concat(parentLinkPaths);
}

var DiceTree = function() {
    // Setup the root node
    this.tree = new DiceTreeNode(3);

    // Setup a list of nodes for the previous depth
    var parentNodes = [this.tree];

    for (var depth = 1; depth <= 4; depth++) {
        var childNodes = [];

        // Create child nodes for each parent at the previous depth
        for (var i = 0; i < parentNodes.length; i++) {
            // Only use values up until the parent value
            for (var value = 1; value <= parentNodes[i].value; value++) {
                // Create new node
                var path = parentNodes[i].path.concat(value);
                var node = new DiceTreeNode(value, path, parentNodes[i]);

                // Attach to parent at proper index
                parentNodes[i].children[value] = node;

                // Check if the node should be linked to any other parent nodes
                for (var j = 0; j < parentNodes.length; j++) {
                    var contains = parentNodes[j].path.reduce((prev, curr, k) => prev && path[k+1] == curr, true);
                    if (contains && parentNodes[j] != parentNodes[i]) {
                        parentNodes[j].childLinks.push(node);
                        node.parentLinks.push(parentNodes[j]);
                    }
                }

                // Add to the list of nodes at this depth
                childNodes.push(node);
            }
        }

        parentNodes = childNodes;
    }
}

DiceTree.prototype.getRolls = function(keepers) {
    // Get the sorted path
    path = _.orderBy(keepers, _.identity, ['desc']);

    // Get the node at the specified path
    var node = this.tree.getNode(path);

    // Return the paths for all the leaf nodes reachable from the node
    return node.getLeafNodePaths(true);
}

DiceTree.prototype.getKeepers = function(roll) {
    // Get the sorted path
    path = _.orderBy(roll, _.identity, ['desc']);

    // Get the node at the specified path
    var node = this.tree.getNode(path);

    // Return all the possible paths to the root node from the node
    return node.getRootNodePaths(true).concat([[]]);
}

module.exports = DiceTree;
