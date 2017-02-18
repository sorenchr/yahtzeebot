var chai = require('chai');
var assert = chai.assert;
var DiceMap = require('../src/dicemap');

describe('DiceMap', function() {
    describe('#constructor', function() {
        it('should create an empty instance of DiceMap', function() {
            var dm = new DiceMap();

            assert.equal(dm.size(), 0);
        });
    });

    describe('#add', function() {
        it('should add a single value to the map', function() {
            var dm = new DiceMap();

            dm.add([1,2,3,4,5], 'abc');

            assert.equal(dm.size(), 1);
        });

        it('should add multiple values to the map', function() {
            var dm = new DiceMap();

            dm.add([1,1,1,1,1], 'abc');
            dm.add([2,2,2,2,2], 'def');
            dm.add([3,3,3,3,3], 'ghi');

            assert.equal(dm.size(), 3);
        });
    });

    describe('#get', function() {
        it('should retrieve the value from the map', function() {
            var dm = new DiceMap();

            var dice = [1,2,3,4,5];
            var value = 'abcd';

            dm.add(dice, value);

            assert.equal(dm.get(dice), value);
        });

        it('should use the dice cardinality for keys', function() {
            var dm = new DiceMap();

            // dice1 and dice2 should be equal keys
            var dice1 = [1,2,3];
            var dice2 = [3,2,1];
            var value1 = 'test1';

            // dice3 and dice4 should be equal keys
            var dice3 = [3,3,4,5,5];
            var dice4 = [3,5,3,5,4];
            var value2 = 'test2';

            dm.add(dice1, value1);
            dm.add(dice3, value2);

            assert.equal(dm.get(dice2), value1);
            assert.equal(dm.get(dice4), value2);
        });
    });

    describe('#has', function() {
        it('should return true if a value has been added', function() {
            var dm = new DiceMap();

            var dice = [1,2,3,4,5];

            assert.isFalse(dm.has(dice));

            dm.add(dice, 'abc');

            assert.isTrue(dm.has(dice));
        });

        it('should return true for dice with same cardinality', function() {
            var dm = new DiceMap();

            dm.add([1,2,3], 'bdd');

            assert.isTrue(dm.has([3,2,1]));
        });

        it('should return false if a value hasn\'t been added', function() {
            var dm = new DiceMap();

            assert.isFalse(dm.has([1,2,3,4,5]));
        });
    });

    describe('#size', function() {
        it('should return the correct size of the map', function() {
            var dm = new DiceMap();

            assert.equal(dm.size(), 0);

            dm.add([1,2,3,4,5], 'abc');

            assert.equal(dm.size(), 1);

            dm.add([1,2,3], 'bdd');
            dm.add([4,5,2], 'basdas');

            assert.equal(dm.size(), 3);
        });
    });
});

function permutations(arr) {
    if (arr.length === 1) return [arr];

    var output = [];

    for (var i = 0; i < arr.length; i++) {
        var cloneArr = arr.slice();
        cloneArr.splice(i, 1);
        var nextPermutations = permutations(cloneArr);
        for (var j = 0; j < nextPermutations.length; j++) {
            output.push(nextPermutations[j].concat(arr[i]));
        }
    }

    return output;
}
