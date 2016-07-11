var _ = require('lodash');

var probability = module.exports;
var facs = {};

probability.getRollProbability = function(roll) {
    // Get the cardinality of the roll as an array
    var cardinality = _.values(_.countBy(roll));

    // Calculate the cardinality product of the roll
    var cdProd = cardinality.reduce((x,y) => x * fac(y), 1);

    // Calculate the roll probability
    return fac(roll.length) / (Math.pow(6, roll.length) * cdProd);
};

function fac(n) {
    if (n in facs) return facs[n];
    facs[n] = n == 0 ? 1 : n * fac(n - 1);
    return facs[n];
}
