var chai = require('chai');
var assert = chai.assert;

describe('scorecard ', function() {
    describe('#getCategoryScore', function() {
        describe('ones', function() {
            it('should return 3', function() {
                var scorecalc = require('../score-calculator');
                var dice = [6, 1, 1, 3, 1];
                assert.equal(scorecalc.getCategoryScore(0, dice), 3);
            });

            it('should return 5', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 1, 1, 1, 1];
                assert.equal(scorecalc.getCategoryScore(0, dice), 5);
            });
        });

        describe('twos', function() {
            it('should return 4', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 2, 1, 3, 1];
                assert.equal(scorecalc.getCategoryScore(1, dice), 4);
            });

            it('should return 8', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 2, 1, 2, 2];
                assert.equal(scorecalc.getCategoryScore(1, dice), 8);
            });
        });

        describe('threes', function() {
            it('should return 3', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 2, 1, 3, 1];
                assert.equal(scorecalc.getCategoryScore(2, dice), 3);
            });

            it('should return 9', function() {
                var scorecalc = require('../score-calculator');
                var dice = [3, 2, 3, 2, 3];
                assert.equal(scorecalc.getCategoryScore(2, dice), 9);
            });
        });

        describe('fours', function() {
            it('should return 8', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 2, 4, 3, 4];
                assert.equal(scorecalc.getCategoryScore(3, dice), 8);
            });

            it('should return 20', function() {
                var scorecalc = require('../score-calculator');
                var dice = [4, 4, 4, 4, 4];
                assert.equal(scorecalc.getCategoryScore(3, dice), 20);
            });
        });

        describe('fours', function() {
            it('should return 8', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 2, 4, 3, 4];
                assert.equal(scorecalc.getCategoryScore(3, dice), 8);
            });

            it('should return 20', function() {
                var scorecalc = require('../score-calculator');
                var dice = [4, 4, 4, 4, 4];
                assert.equal(scorecalc.getCategoryScore(3, dice), 20);
            });
        });

        describe('fives', function() {
            it('should return 15', function() {
                var scorecalc = require('../score-calculator');
                var dice = [5, 5, 4, 5, 4];
                assert.equal(scorecalc.getCategoryScore(4, dice), 15);
            });

            it('should return 25', function() {
                var scorecalc = require('../score-calculator');
                var dice = [5, 5, 5, 5, 5];
                assert.equal(scorecalc.getCategoryScore(4, dice), 25);
            });
        });

        describe('sixes', function() {
            it('should return 12', function() {
                var scorecalc = require('../score-calculator');
                var dice = [6, 6, 4, 5, 4];
                assert.equal(scorecalc.getCategoryScore(5, dice), 12);
            });

            it('should return 24', function() {
                var scorecalc = require('../score-calculator');
                var dice = [6, 6, 6, 6, 5];
                assert.equal(scorecalc.getCategoryScore(5, dice), 24);
            });
        });

        describe('one pair', function() {
            it('should return 6', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 1, 6, 3, 3];
                assert.equal(scorecalc.getCategoryScore(6, dice), 6);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 2, 3, 4, 5];
                assert.equal(scorecalc.getCategoryScore(6, dice), 0);
            });
        });

        describe('two pairs', function() {
            it('should return 14', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 1, 6, 6, 3];
                assert.equal(scorecalc.getCategoryScore(7, dice), 14);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 1, 6, 5, 3];
                assert.equal(scorecalc.getCategoryScore(7, dice), 0);
            });
        });

        describe('three of a kind', function() {
            it('should return 9', function() {
                var scorecalc = require('../score-calculator');
                var dice = [3, 3, 3, 2, 6];
                assert.equal(scorecalc.getCategoryScore(8, dice), 9);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [3, 3, 2, 2, 6];
                assert.equal(scorecalc.getCategoryScore(8, dice), 0);
            });
        });

        describe('four of a kind', function() {
            it('should return 8', function() {
                var scorecalc = require('../score-calculator');
                var dice = [3, 2, 2, 2, 2];
                assert.equal(scorecalc.getCategoryScore(9, dice), 8);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [3, 2, 2, 1, 2];
                assert.equal(scorecalc.getCategoryScore(9, dice), 0);
            });
        });

        describe('small straight', function() {
            it('should return 15', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 2, 3, 4, 5];
                assert.equal(scorecalc.getCategoryScore(10, dice), 15);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 2, 3, 3, 5];
                assert.equal(scorecalc.getCategoryScore(10, dice), 0);
            });
        });

        describe('large straight', function() {
            it('should return 20', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 3, 4, 5, 6];
                assert.equal(scorecalc.getCategoryScore(11, dice), 20);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [6, 3, 4, 5, 6];
                assert.equal(scorecalc.getCategoryScore(11, dice), 0);
            });
        });

        describe('full house', function() {
            it('should return 13', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 2, 3, 3, 3];
                assert.equal(scorecalc.getCategoryScore(12, dice), 13);
            });

            it('should return 27', function() {
                var scorecalc = require('../score-calculator');
                var dice = [6, 6, 5, 5, 5];
                assert.equal(scorecalc.getCategoryScore(12, dice), 27);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 2, 3, 3, 3];
                assert.equal(scorecalc.getCategoryScore(12, dice), 0);
            });
        });

        describe('chance', function() {
            it('should return 27', function() {
                var scorecalc = require('../score-calculator');
                var dice = [6, 6, 5, 5, 5];
                assert.equal(scorecalc.getCategoryScore(13, dice), 27);
            });

            it('should return 7', function() {
                var scorecalc = require('../score-calculator');
                var dice = [2, 2, 1, 1, 1];
                assert.equal(scorecalc.getCategoryScore(13, dice), 7);
            });
        });

        describe('yahtzee', function() {
            it('should return 55', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 1, 1, 1, 1];
                assert.equal(scorecalc.getCategoryScore(14, dice), 55);
            });

            it('should return 75', function() {
                var scorecalc = require('../score-calculator');
                var dice = [5, 5, 5, 5, 5];
                assert.equal(scorecalc.getCategoryScore(14, dice), 75);
            });

            it('should return 0', function() {
                var scorecalc = require('../score-calculator');
                var dice = [1, 1, 4, 1, 1];
                assert.equal(scorecalc.getCategoryScore(14, dice), 0);
            });
        });
    });
});
