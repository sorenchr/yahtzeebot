var _ = require('lodash');

var probability = module.exports;
var facs = {};

probability.getRollProbability = function(roll) {
    // Get the cardinality of the roll as a flat array
    var cardinality = _.values(_.countBy(roll));

    // Pad the cardinality with a 1 entry so that reduce computes correctly
    cardinality.unshift(1);

    // Calculate the cardinality product of the roll
    var cdprod = cardinality.reduce(function(x, y) {
        return x * fac(y);
    });

    // Calculate the roll probability
    return fac(roll.length) / (Math.pow(6, roll.length) * cdprod);
};

function fac(n) {
    if (n in facs) return facs[n];
    facs[n] = n == 0 ? 1 : n * fac(n - 1);
    return facs[n];
}
