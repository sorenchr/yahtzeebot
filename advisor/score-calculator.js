module.exports = (function() {

    var mod = {};

    /**
     * Gets the score for the given category and roll.
     * @param category The category, a number between 0 and 14.
     * @param roll The 5-dice roll.
     * @returns {*} The score for the given category and roll.
     */
    mod.getCategoryScore = function(category, roll) {
        switch(category) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return getNumberOfDice(category + 1, roll) * (category + 1);
            case 6:
                return getOnePairScore(roll);
            case 7:
                return getTwoPairsScore(roll);
            case 8:
                return getThreeOfAKindScore(roll);
            case 9:
                return getFourOfAKindScore(roll);
            case 10:
                return getSmallStraightScore(roll);
            case 11:
                return getLargeStraightScore(roll);
            case 12:
                return getFullHouseScore(roll);
            case 13:
                return getChanceScore(roll);
            case 14:
                return getYahtzeeScore(roll);
            default:
                throw "UnknownCategoryError";
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

    return mod;

})();
