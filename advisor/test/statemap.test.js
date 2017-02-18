var chai = require('chai');
var assert = chai.assert;

describe('StateMap ', function() {
    var StateMap;

    beforeEach(function() {
        StateMap = require('../src/statemap');
    });

    describe('#constructor', function() {
        it('should construct empty StateMap instance', function() {
            var statemap = new StateMap();

            assert.equal(statemap.size(), 0);
        });

        it('should construct map from JSON', function() {
            var json = {
                '111111111111111': { '55': 25.2, '53': 26.78 },
                '000111000111000': { '23': 43.222 }
            };

            var statemap = new StateMap(json);

            var scorecard1 = new Array(15).fill(true);
            var scorecard2 = [0,0,0,1,1,1,0,0,0,1,1,1,0,0,0].map(x => x ? true : false);

            assert.equal(3, statemap.size());
            assert.equal(statemap.getEV(scorecard1,55),25.2);
            assert.equal(statemap.getEV(scorecard1,53),26.78);
            assert.equal(statemap.getEV(scorecard2,23),43.222);
        });

        it('should read JSON from toJSON()', function() {
            var statemap = new StateMap();

            var scorecard1 = new Array(15).fill(true);
            var scorecard2 = new Array(15).fill(false);

            statemap.addEV(scorecard1, 1, 55.2);
            statemap.addEV(scorecard1, 2, 230.2);
            statemap.addEV(scorecard2, 22, 20.2);
            statemap.addEV(scorecard2, 3, 50);

            var json = statemap.toJSON();
            var parsed = new StateMap(json);

            assert.equal(parsed.size(), 4);
            assert.equal(parsed.getEV(scorecard1, 1), 55.2);
            assert.equal(parsed.getEV(scorecard1, 2), 230.2);
            assert.equal(parsed.getEV(scorecard2, 22), 20.2);
            assert.equal(parsed.getEV(scorecard2, 3), 50);
        });
    });

    describe('#getEV', function () {
        it('should return 25.2 for added EV', function () {
            var statemap = new StateMap();

            var scorecard = new Array(15).fill(true);
            var upperScore = 25;
            var ev = 25.2;

            statemap.addEV(scorecard, upperScore, ev);

            assert.equal(statemap.getEV(scorecard, upperScore), ev);
        });

        it('should return null for unadded EV', function () {
            var statemap = new StateMap();

            var scorecard = new Array(15).fill(true);
            var upperScore = 25;

            assert.isNull(statemap.getEV(scorecard, upperScore));
        });

        it('should cap upper score at 63', function () {
            var statemap = new StateMap();

            var scorecard = new Array(15).fill(true);
            var upperScore = 100;
            var ev = 25.2;

            statemap.addEV(scorecard, upperScore, ev);

            assert.equal(statemap.size(), 1); // Ensure that only one entry exists in the map
            assert.equal(statemap.getEV(scorecard, 63), ev);
            assert.isNull(statemap.getEV(scorecard, 62));
        });
    });

    describe('#addEV', function() {
        it('should add EV to map', function() {
            var statemap = new StateMap();

            var scorecard = new Array(15).fill(true);
            scorecard[12] = false;
            var upperScore = 33;
            var ev = 180.3;

            statemap.addEV(scorecard, upperScore, ev);

            assert.equal(statemap.getEV(scorecard, upperScore), ev);
        });

        it('should cap upper score at 63', function() {
            var statemap = new StateMap();

            var scorecard = new Array(15).fill(true);
            var upperScore = 180;
            var ev = 200;

            statemap.addEV(scorecard, upperScore, ev);

            assert.equal(statemap.size(), 1); // Ensure that only one entry exists in the map
            assert.equal(statemap.getEV(scorecard, 63), ev);
            assert.isNull(statemap.getEV(scorecard, 62));
        });
    });

    describe('#toJSON', function() {
        it('should return JSON for the map', function() {
            var expected = {
                '111111111111111': { '55': 25.2, '53': 26.78 },
                '000111000111000': { '23': 43.222 }
            };

            var statemap = new StateMap();

            var scorecard1 = new Array(15).fill(true);
            var scorecard2 = [0,0,0,1,1,1,0,0,0,1,1,1,0,0,0].map(x => x ? true : false);

            statemap.addEV(scorecard1, 55, 25.2);
            statemap.addEV(scorecard1, 53, 26.78);
            statemap.addEV(scorecard2   , 23, 43.222);

            assert.deepEqual(expected, statemap.toJSON());
        });
    });

    describe('#size', function() {
        it('should return the size of the map', function() {
            var statemap = new StateMap();

            assert.equal(statemap.size(), 0);

            var scorecard1 = new Array(15).fill(true);
            var scorecard2 = [0,0,0,1,1,1,0,0,0,1,1,1,0,0,0].map(x => x ? true : false);

            statemap.addEV(scorecard1, 55, 25.2);
            statemap.addEV(scorecard1, 53, 26.78);
            statemap.addEV(scorecard2, 23, 43.222);

            assert.equal(statemap.size(), 3);
        });
    });
});