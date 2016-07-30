var chai = require('chai');
var assert = chai.assert;
var ArgumentError = require('../argumenterror');
var sinon = require('sinon');
var StateMap = require('../statemap');
var proxyquire = require('proxyquire').noPreserveCache();
var _ = require('lodash');

describe('advisor', function() {
    describe('#getBestKeepers', function () {
        it('should throw ArgumentError on invalid scorecard', function () {
            // Setup a validator that will return false on isValidScorecard
            var vMock = {
                isValidRollsLeft: function (rollsLeft) { return true; },
                isValidScorecard: function (scorecard) { return false; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return true; }
            };

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './validator': vMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestKeepers call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function () {
            // Setup a validator that will return false on isValidUpperScore
            var vMock = {
                isValidRollsLeft: function (rollsLeft) { return true; },
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return false; },
                isValidDice: function(dice) { return true; }
            };

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './validator': vMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestKeepers call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function () {
            // Setup a validator that will return false on isValidDice
            var vMock = {
                isValidRollsLeft: function (rollsLeft) { return true; },
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return false; }
            };

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './validator': vMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestKeepers call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on invalid rolls left', function () {
            // Setup a validator that will return false on isValidRollsLeft
            var vMock = {
                isValidRollsLeft: function (rollsLeft) { return false; },
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return true; }
            };

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './validator': vMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestKeepers call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should throw ArgumentError on full scorecard', function () {
            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestKeepers call arguments
            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            assert.throws(advisor.getBestKeepers.bind(advisor, scorecard, upperScore, dice, rollsLeft), ArgumentError);
        });

        it('should return the best keepers, all the way from the final rolls, when there is 1 roll left', function() {
            // Setup the getBestKeepers call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 1;

            // Create a combinatorics mock
            var keepers = [[1,2],[2,4],[4,5]];
            var cmbMock = {
                getKeepers: function(keepersDice) {
                    if (keepersDice === dice) return keepers;
                    return [];
                }
            };

            // Setup the FinalRollsMap spy and inject it
            var frmStub = {};
            var frmSpy = sinon.spy(function() { return frmStub });

            // Setup the KeepersMap spy and inject it
            var kmStub = {
                getEV: function(mapKeepers) {
                    if (mapKeepers === keepers[0]) return 10;
                    if (mapKeepers === keepers[1]) return 30;
                    if (mapKeepers === keepers[2]) return 20;
                    return 0;
                }
            };
            var kmSpy = sinon.spy(function() { return kmStub });

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                'jsonfile': jfMock,
                './statemap': smMock,
                './combinatorics': cmbMock,
                './finalrollsmap': frmSpy,
                './keepersmap': kmSpy
            });

            // Call the method on the advisor module
            var bestKeepers = advisor.getBestKeepers(scorecard, upperScore, dice, rollsLeft);

            // Verify that the FinalRollsMap was built
            assert.isTrue(frmSpy.calledWithNew());
            assert.isTrue(frmSpy.calledWithExactly(scorecard, upperScore, {}));

            // Verify that the KeepersMap was called with the FinalRollsMap
            assert.isTrue(kmSpy.calledWithNew());
            assert.isTrue(kmSpy.calledWithExactly(frmStub));

            // Verify that the advisor has selected the keepers with the best EV
            assert.equal(bestKeepers, keepers[1]);
        });

        it('should return the best keepers, all the way from the final rolls, when there are 2 rolls left', function() {
            // Setup the getBestKeepers call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];
            var upperScore = 55;
            var rollsLeft = 2;

            // Create a combinatorics mock
            var keepers = [[1,2],[2,4],[4,5]];
            var cmbMock = {
                getKeepers: function(keepersDice) {
                    if (keepersDice === dice) return keepers;
                    return [];
                }
            };

            // Setup the FinalRollsMap spy
            var frmStub = {};
            var frmSpy = sinon.spy(function() { return frmStub });

            // Setup the RollsMap spy
            var rmStub = {};
            var rmSpy  = sinon.spy(function() { return rmStub });

            // Setup the KeepersMap spy
            var secondKmStub = {};
            var firstKmStub = {
                getEV: function(mapKeepers) {
                    if (mapKeepers === keepers[0]) return 10;
                    if (mapKeepers === keepers[1]) return 30;
                    if (mapKeepers === keepers[2]) return 45;
                    return 0;
                }
            };
            var kmSpy = sinon.spy(function(inputMap) {
                if (inputMap === frmStub) return secondKmStub;
                if (inputMap === rmStub) return firstKmStub;
            });

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                'jsonfile': jfMock,
                './statemap': smMock,
                './combinatorics': cmbMock,
                './finalrollsmap': frmSpy,
                './keepersmap': kmSpy,
                './rollsmap': rmSpy
            });

            // Call the method on the advisor module
            var bestKeepers = advisor.getBestKeepers(scorecard, upperScore, dice, rollsLeft);

            // Verify that the FinalRollsMap was built
            assert.isTrue(frmSpy.calledWithNew());
            assert.isTrue(frmSpy.calledWithExactly(scorecard, upperScore, {}));

            // Verify that the KeepersMap was called with the FinalRollsMap
            assert.isTrue(kmSpy.calledWithNew());
            assert.isTrue(kmSpy.calledWithExactly(frmStub));

            // Verify that the RollsMap was called with the KeepersMap
            assert.isTrue(rmSpy.calledWithNew());
            assert.isTrue(rmSpy.calledWithExactly(secondKmStub));

            // Verify that the KeepersMap was called with the RollsMap
            assert.isTrue(kmSpy.calledWithNew());
            assert.isTrue(kmSpy.calledWithExactly(rmStub));

            // Verify that the advisor has selected the keepers with the best EV
            assert.equal(bestKeepers, keepers[2]);
        });
    });

    describe('#getBestCategory', function() {
        it('should throw ArgumentError on invalid scorecard', function () {
            // Setup a validator that will return false on isValidScorecard
            var vMock = {
                isValidScorecard: function (scorecard) { return false; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return true; }
            };

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './validator': vMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestCategory call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid upper score', function () {
            // Setup a validator that will return false on isValidUpperScore
            var vMock = {
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return false; },
                isValidDice: function(dice) { return true; }
            };

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './validator': vMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestCategory call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on invalid dice', function () {
            // Setup a validator that will return false on isValidDice
            var vMock = {
                isValidScorecard: function (scorecard) { return true; },
                isValidUpperScore: function (upperScore) { return true; },
                isValidDice: function(dice) { return false; }
            };

            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './validator': vMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestCategory call arguments
            var scorecard = new Array(15).fill(false);
            var dice = [1,2,3,4,5];

            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });

        it('should throw ArgumentError on full scorecard', function () {
            // Setup jsonfile and StateMap mocks
            var jfMock = { readFileSync: function() { return {} } };
            var smMock = { fromJSON: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup the getBestCategory call arguments
            var scorecard = new Array(15).fill(true);
            var dice = [1,2,3,4,5];


            assert.throws(advisor.getBestCategory.bind(advisor, scorecard, 55, dice), ArgumentError);
        });

        it('should choose the category with the best EV', function() {
            // A variable that will hold the scorecard that will provide the highest EV.
            // Used for coercing the advisor module into choosing the marked category.
            var scorecardToMatch = '000000000000001';

            // Setup a mock StateMap that will return EV based on the input scorecard
            var smMock = {
                fromJSON: function() { return smMock },
                getEV: function(scorecard) {
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === scorecardToMatch) return 2.0;
                    return 1.0;
                }
            };

            // Setup a score-calculator mock that will just return 0 for everything
            var scMock = {
                getCategoryScore: function() { return 0; }
            };

            // Setup jsonfile mock
            var jfMock = { readFileSync: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './score-calculator': scMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the last category
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 14);

            // The advisor should suggest scoring the 12th category
            scorecardToMatch = '000000000001000';
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 11);
        });

        it('should choose the category with the best score', function() {
            // Setup a mock StateMap that will just return 0 on any input
            var smMock = {
                fromJSON: function() { return smMock },
                getEV: function() { return 0; }
            };

            // Setup a score-calculator mock that will return 1 for the best category.
            // Used for coercing the advisor module into choosing the marked category.
            var bestCategory = 5;
            var scMock = {
                getCategoryScore: function(category, dice) {
                    if (category === bestCategory) return 1;
                    return 0;
                }
            };

            // Setup jsonfile mock
            var jfMock = { readFileSync: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './score-calculator': scMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the best category
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), bestCategory);

            // The advisor should still suggest scoring the best category
            bestCategory = 12;
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), bestCategory);
        });

        it('should choose the category with the best EV and score', function() {
            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            var upperScore = 25;
            var dice = [1,2,3,4,5];

            // Setup a mock StateMap that will vary in EV based on scorecard input
            var smMock = {
                fromJSON: function() { return smMock },
                getEV: function(smScorecard) {
                    var scorecardString = smScorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === '010000000000000') return 40.0;
                    if (scorecardString === '001000000000000') return 20.0;
                    return 0.0;
                }
            };

            // Setup a score-calculator mock that will vary in EV based on category input
            var scMock = {
                getCategoryScore: function(scCategory, scDice) {
                    if (scCategory === 7 && scDice === dice) return 35.0;
                    if (scCategory === 2 && scDice === dice) return 25.0;
                    return 0;
                }
            };

            // Setup jsonfile mock
            var jfMock = { readFileSync: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './score-calculator': scMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // The advisor should suggest scoring the 3rd category because the sum of the
            // EV and score is greater than scoring one of the two by itself
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 2);
        });

        it('should skip marked categories', function() {
            // Setup a mock StateMap that will vary in EV based on scorecard input
            var smMock = {
                fromJSON: function() { return smMock },
                getEV: function(scorecard) {
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === '000000000000001') return 5.0;
                    if (scorecardString === '000000010000001') return 2.0;
                    return 1.0;
                }
            };

            // Setup a score-calculator mock that just return 0 on any input
            var scMock = {
                getCategoryScore: function(category, dice) { return 0; }
            };

            // Setup jsonfile mock
            var jfMock = { readFileSync: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './score-calculator': scMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup arguments for the getBestCategory() call
            var scorecard = new Array(15).fill(false);
            scorecard[14] = true;
            var upperScore = 55;
            var dice = [1,2,3,4,5];

            // The advisor should suggest scoring the 8th category because
            // it should skip the 15th, even though it has greater EV
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 7);
        });

        it('should account for the upper section bonus of 50', function() {
            // Setup the EV that will be returned from the StateMap mock
            var returnEV = 60.9;

            // Setup a mock StateMap that will vary in EV based on a specific scorecard
            var smMock = {
                fromJSON: function() { return smMock },
                getEV: function(scorecard) {
                    var scorecardString = scorecard.map(x => x ? 1 : 0).join('');
                    if (scorecardString === '111110000000001') return returnEV;
                    return 1.0;
                }
            };

            // Setup a score-calculator mock that will vary in EV based on category input
            var scMock = {
                getCategoryScore: function(category) {
                    if (category === 5) return 10;
                    return 0;
                }
            };

            // Setup jsonfile mock
            var jfMock = { readFileSync: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './score-calculator': scMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup arguments for the getBestCategory() call
            var scorecard = '111110000000000'.split('').map(x => x === '1');
            var upperScore = 55;
            var dice = [6,6,6,6,6];

            // The advisor should suggest scoring the 6th category because
            // it triggers the upper section bonus of 50
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 5);

            // The advisor should now suggest scoring in the 15th category
            // since the EV just tops the upper section bonus slightly
            returnEV = 61.1;
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 14);
        });

        it('should trigger the upper section bonus at an upper score of 63 or higher', function() {
            // Setup a mock StateMap that will just return 0 on any input
            var smMock = {
                fromJSON: function() { return smMock },
                getEV: function() { return 0; }
            };

            // Setup a score-calculator mock that will vary in EV based on category input
            var returnVal = 2;
            var scMock = {
                getCategoryScore: function(category) {
                    if (category === 5) return returnVal;
                    if (category === 14) return 50;
                    return 0;
                }
            };

            // Setup jsonfile mock
            var jfMock = { readFileSync: function() { return {} } };

            // Setup the advisor module
            var advisor = proxyquire('../advisor', {
                './score-calculator': scMock,
                'jsonfile': jfMock,
                './statemap': smMock
            });

            // Setup arguments for the getBestCategory() call
            var scorecard = '000000000000000'.split('').map(x => x === '1');
            var upperScore = 60;
            var dice = [6,6,6,6,6];

            // The advisor should suggest scoring the 14th category because the
            // upper section should not be triggered
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 14);

            // The advisor should suggest scoring the 6th category because the
            // upper section bonus should now be triggered at 63
            returnVal = 3;
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 5);

            // The advisor should still suggest scoring the 6th category
            returnVal = 300;
            assert.equal(advisor.getBestCategory(scorecard, upperScore, dice), 5);
        });
    });
});