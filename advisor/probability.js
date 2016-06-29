var _ = require('lodash');

var probability = module.exports;
var facs = [1, 1, 2, 6, 24, 120]; // Pre-calculated factorials

probability.getRollProbability = function(roll) {
    // Get the cardinality of the roll as a flat array
    var cardinality = _.values(_.countBy(roll));

    // Pad the cardinality with a 1 entry so that reduce computes correctly
    cardinality.unshift(1);

    // Calculate the cardinality product of the roll
    var cdprod = cardinality.reduce(function(x, y) {
        return x * facs[y];
    });

    // Calculate the roll probability
    return facs[roll.length] / (Math.pow(6, roll.length) * cdprod);
}
