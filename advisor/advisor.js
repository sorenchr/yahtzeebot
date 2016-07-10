var _ = require('lodash');
var DiceTree = require('./dicetree');
var scorecalc = require('./score-calculator');
var StateMap = require('./statemap');
var jsonfile = require('jsonfile');
var prob = require('./probability');

var advisor = module.exports;

// Setup DiceTree with a depth of 5
var dicetree = new DiceTree(5,6);

// Setup the StateMap
var jsonmap = jsonfile.readFileSync('output_new.json');
var statemap = StateMap.fromJSON(jsonmap);

/**
 * Returns the best keepers to choose from the given game state.
 * @param scorecard The scorecard represented as a 15-integer array.
 * @param upperScore The upper score.
 * @param dice The 5 dice currently held by the player.
 * @param rollsLeft The number of rolls left before scoring.
 * @returns {Array.<number>} The best keepers to choose from the given game state.
 */
advisor.getBestKeepers = function(scorecard, upperScore, dice, rollsLeft) {
    var finalRolls = generateFinalRolls(scorecard, upperScore);
    var secondKeepers = generateKeepers(finalRolls);
    if (rollsLeft == 1) return getBestKeepers(dice, secondKeepers);
    
    var secondRoll = generateRolls(secondKeepers);
    var firstKeepers = generateKeepers(secondRoll);
    if (rollsLeft == 2) return getBestKeepers(dice, firstKeepers);
};

function generateFinalRolls(scorecard, upperScore) {
    var finalRolls = {};

    dicetree.getAllRolls().forEach(function(roll) {
        // Get the best category to score in for this roll
        var bestCategory = advisor.getBestCategory(scorecard, upperScore, roll);

        // Find the new upper score from scoring in this category
        var categoryScore = scorecalc.getCategoryScore(bestCategory, roll);
        var isUpperCategory = bestCategory >= 0 && bestCategory <= 5;
        var newUpperScore = isUpperCategory ? upperScore + categoryScore : upperScore;

        // Calculate the category EV
        var newScorecard = getMarkedScorecard(scorecard, bestCategory);
        var bestCategoryEV = statemap.getEV(newScorecard, newUpperScore) + categoryScore;

        // Check if scoring the category results in the upper section bonus
        if (upperScore < 63 && newUpperScore >= 63) bestCategoryEV += 50;

        // Store the EV for this roll
        finalRolls[roll.join('')] = bestCategoryEV;
    });

    return finalRolls;
}

function generateKeepers(nextRolls) {
    var keepersEV = {};

    // Iterate through all possible keepers
    dicetree.getAllKeepers().forEach(function(keepers) {
        var evSum = 0;

        // Iterate through all possible rolls resulting from these keepers
        dicetree.getRolls(keepers).forEach(function(roll) {
            var remDice = subtractDice(roll, keepers);
            var rollEV = nextRolls[roll.join('')];
            evSum += prob.getRollProbability(remDice) * rollEV;
        });

        keepersEV[keepers.join('')] = evSum;
    });

    return keepersEV;
}

function subtractDice(a, b) {
    var newDice = a.slice(0);

    for (var i = 0; i < b.length; i++) {
        for (var k = 0; k < newDice.length; k++) {
            if (newDice[k] == b[i]) {
                newDice.splice(k, 1);
                break;
            }
        }
    }

    return newDice;
}

function getBestKeepers(roll, allKeepers) {
    var bestKeepers = [];
    var bestKeepersEV = 0;

    // Iterate through all possible keepers from this roll
    dicetree.getKeepers(roll).forEach(function(keepers) {
        var keepersEV = allKeepers[keepers.join('')];
        if (keepersEV >= bestKeepersEV) {
            bestKeepersEV = keepersEV;
            bestKeepers = keepers;
        }
    });

    return bestKeepers;
}

function generateRolls(nextKeepers) {
    var rollsEV = {};

    // Iterate through all possible rolls
    dicetree.getAllRolls().forEach(function(roll) {
        var ev = 0;

        // Iterate through all possible keepers resulting from this roll
        dicetree.getKeepers(roll).forEach(function(keepers) {
            var keepersEV = nextKeepers[keepers.join('')];
            if (keepersEV >= ev) {
                ev = keepersEV;
            }
        });

        rollsEV[roll.join('')] = ev;
    });

    return rollsEV;
}

/**
 * Returns the best category to score in from the given game state.
 * @param scorecard The scorecard represented as a 15-integer array.
 * @param upperScore The upper score.
 * @param dice The 5 dice currently held by the player.
 * @returns {Number|number} The best category to score in from the given game state.
 */
advisor.getBestCategory = function(scorecard, upperScore, dice) {
    var bestCategory = 0;
    var bestCategoryEV = 0;

    // Iterate through each unmarked category
    for (var i = 0; i < scorecard.length; i++) {
        // Skip marked categories
        if (scorecard[i] != 0) continue;

        // Create a new scorecard where the category is marked
        var newScorecard = getMarkedScorecard(scorecard, i);

        // Find the new upper score from scoring in this category
        var categoryScore = scorecalc.getCategoryScore(i, dice);
        var isUpperCategory = i >= 0 && i <= 5;
        var newUpperScore = isUpperCategory ? upperScore + categoryScore : upperScore;

        // Calculate the category EV
        var categoryEV = statemap.getEV(newScorecard, newUpperScore) + categoryScore;

        // Check if scoring the category results in the upper section bonus
        if (upperScore < 63 && newUpperScore >= 63) categoryEV += 50;

        // Check if this is the best category so far
        if (categoryEV >= bestCategoryEV) {
            bestCategory = i;
            bestCategoryEV = categoryEV;
        }
    }

    return bestCategory;
};

function getMarkedScorecard(scorecard, i) {
    var newScorecard = _.clone(scorecard);
    newScorecard[i] = true;
    return newScorecard;
}
