var validator = require('./validator');
var ArgumentError = require('./argumenterror');

var sc = module.exports;

/**
 * Gets the score for the given category and roll.
 * @param category The category, a number between 0 and 14.
 * @param roll The 5-dice roll.
 * @returns {*} The score for the given category and roll.
 */
sc.getCategoryScore = function(category, roll) {
    // Validate input
    if (!validator.isValidCategory(category)) throw new ArgumentError('Invalid category: ' + category);
    if (!validator.isValidRoll(roll)) throw new ArgumentError('Invalid roll: ' + roll);
    
    // Get the score for the given category
    if ((category >= 0) && (category <= 5)) {
        return getNumberOfDice(category + 1, roll) * (category + 1);
    } else if (category == 6) {
        return getOnePairScore(roll);
    } else if (category == 7) {
        return getTwoPairsScore(roll);
    } else if (category == 8) {
        return getThreeOfAKindScore(roll);
    } else if (category == 9) {
        return getFourOfAKindScore(roll);
    } else if (category == 10) {
        return getSmallStraightScore(roll);
    } else if (category == 11) {
        return getLargeStraightScore(roll);
    } else if (category == 12) {
        return getFullHouseScore(roll);
    } else if (category == 13) {
        return getChanceScore(roll);
    } else if (category == 14) {
        return getYahtzeeScore(roll);
    }
};

/**
 * Returns the number of dice in the roll with the given face-value.
 * @param faceValue The face-value to check for.
 * @param roll The roll to search.
 * @returns {number} The number of dice in the roll with the given face-value.
 */
function getNumberOfDice(faceValue, roll) {
    var numberOfDice = 0;

    for (var i = 0; i < roll.length; i++) {
        if (roll[i] == faceValue) numberOfDice++;
    }

    return numberOfDice;
}

/**
 * Returns the one-pair score for this roll.
 * @param roll The roll to check.
 * @returns {number} The one-pair score for this roll.
 */
function getOnePairScore(roll) {
    var highestPair = 0;

    for (var i = 1; i <= 6; i++) {
        if (getNumberOfDice(i, roll) >= 2) {
            highestPair = i;
        }
    }

    return highestPair * 2;
}

/**
 * Returns the two-pair score for this roll.
 * @param roll The roll to check.
 * @returns {number} The two-pair score for this roll.
 */
function getTwoPairsScore(roll) {
    var twoPairScore = 0;
    var numberOfPairs = 0;

    for (var i = 1; i <= 6; i++) {
        if (getNumberOfDice(i, roll) >= 2) {
            twoPairScore += i * 2;
            numberOfPairs++;
        }
    }

    return numberOfPairs == 2 ? twoPairScore : 0;
}

/**
 * Returns the three-of-a-kind score for this roll.
 * @param roll The roll to check.
 * @returns {number} The three-of-a-kind score for this roll.
 */
function getThreeOfAKindScore(roll) {
    for (var i = 1; i <= 6; i++) {
        if (getNumberOfDice(i, roll) >= 3) {
            return i * 3;
        }
    }

    return 0;
}

/**
 * Returns the four-of-a-kind score for this roll.
 * @param roll The roll to check.
 * @returns {number} The four-of-a-kind score for this roll.
 */
function getFourOfAKindScore(roll) {
    for (var i = 1; i <= 6; i++) {
        if (getNumberOfDice(i, roll) >= 4) {
            return i * 4;
        }
    }

    return 0;
}

/**
 * Returns the small straight score for this roll.
 * @param roll The roll to check.
 * @returns {number} The small straight score for this roll.
 */
function getSmallStraightScore(roll) {
    var numberOfNeededDice = 0;

    for (var i = 1; i <= 5; i++) {
        if (getNumberOfDice(i, roll) == 1) {
            numberOfNeededDice++;
        }
    }

    return numberOfNeededDice == 5 ? 15 : 0;
}

/**
 * Returns the large straight score for this roll.
 * @param roll The roll to check.
 * @returns {number} The large straight score for this roll.
 */
function getLargeStraightScore(roll) {
    var numberOfNeededDice = 0;

    for (var i = 2; i <= 6; i++) {
        if (getNumberOfDice(i, roll) == 1) {
            numberOfNeededDice++;
        }
    }

    return numberOfNeededDice == 5 ? 20 : 0;
}

/**
 * Returns the full house score for this roll.
 * @param roll The roll to check.
 * @returns {number} The full house score for this roll.
 */
function getFullHouseScore(roll) {
    var twoOfAKindDiceValue = 0;
    var threeOfAKindDiceValue = 0;

    for (var i = 1; i <= 6; i++) {
        if (getNumberOfDice(i, roll) == 3) {
            threeOfAKindDiceValue = i;
        } else if (getNumberOfDice(i, roll) == 2) {
            twoOfAKindDiceValue = i;
        }
    }

    if ((twoOfAKindDiceValue > 0) && (threeOfAKindDiceValue > 0)) {
        return twoOfAKindDiceValue * 2 + threeOfAKindDiceValue * 3;
    }

    return 0;
}

/**
 * Returns the chance score for this roll.
 * @param roll The roll to check.
 * @returns {*} The chance score for this roll.
 */
function getChanceScore(roll) {
    return roll.reduce(function(x, y) {
        return x + y;
    });
}

/**
 * Returns the yahtzee score for this roll.
 * @param roll The roll to check.
 * @returns {number} The yahtzee score for this roll.
 */
function getYahtzeeScore(roll) {
    for (var i = 1; i <= 6; i++) {
        if (getNumberOfDice(i, roll) == 5) {
            return i * 5 + 50;
        }
    }

    return 0;
}
