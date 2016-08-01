package yahtzeebot.util;

import yahtzeebot.game.Category;
import yahtzeebot.game.Dice;

public class ScoreUtil {

    public static int getCategoryScore(Category category, Dice roll) {
        switch (category) {
            case ONES:
                return roll.getNumberOfDice(1);
            case TWOS:
                return roll.getNumberOfDice(2) * 2;
            case THREES:
                return roll.getNumberOfDice(3) * 3;
            case FOURS:
                return roll.getNumberOfDice(4) * 4;
            case FIVES:
                return roll.getNumberOfDice(5) * 5;
            case SIXES:
                return roll.getNumberOfDice(6) * 6;
            case ONE_PAIR:
                return getOnePairScore(roll);
            case TWO_PAIRS:
                return getTwoPairsScore(roll);
            case THREE_OF_A_KIND:
                return getThreeOfAKindScore(roll);
            case FOUR_OF_A_KIND:
                return getFourOfAKindScore(roll);
            case SMALL_STRAIGHT:
                return getSmallStraightScore(roll);
            case LARGE_STRAIGHT:
                return getLargeStraightScore(roll);
            case FULL_HOUSE:
                return getFullHouseScore(roll);
            case CHANCE:
                return getChanceScore(roll);
            case YAHTZEE:
                return getYahtzeeScore(roll);
        }

        throw new IllegalArgumentException("Unknown category : " + category);
    }

    private static int getOnePairScore(Dice roll) {
        int highestPair = 0;
        for (int i = 1; i <= 6; i++) {
            if (roll.getNumberOfDice(i) >= 2) {
                highestPair = i;
            }
        }

        return highestPair * 2;
    }

    private static int getTwoPairsScore(Dice roll) {
        int twoPairScore = 0;
        int numberOfPairs = 0;
        for (int i = 1; i <= 6; i++) {
            if (roll.getNumberOfDice(i) >= 2) {
                twoPairScore += i * 2;
                numberOfPairs++;
            }
        }

        return numberOfPairs == 2 ? twoPairScore : 0;
    }

    private static int getThreeOfAKindScore(Dice roll) {
        for (int i = 1; i <= 6; i++) {
            if (roll.getNumberOfDice(i) >= 3) {
                return i * 3;
            }
        }

        return 0;
    }

    private static int getFourOfAKindScore(Dice roll) {
        for (int i = 1; i <= 6; i++) {
            if (roll.getNumberOfDice(i) >= 4) {
                return i * 4;
            }
        }

        return 0;
    }

    private static int getFullHouseScore(Dice roll) {
        int twoOfAKindDiceValue = 0;
        int threeOfAKindDiceValue = 0;
        for (int i = 1; i <= 6; i++) {
            if (roll.getNumberOfDice(i) == 3) {
                threeOfAKindDiceValue = i;
            } else if (roll.getNumberOfDice(i) == 2) {
                twoOfAKindDiceValue = i;
            }
        }

        if ((twoOfAKindDiceValue > 0) && (threeOfAKindDiceValue > 0)) {
            return twoOfAKindDiceValue * 2 + threeOfAKindDiceValue * 3;
        }

        return 0;
    }

    private static int getSmallStraightScore(Dice roll) {
        int numberOfNeededDice = 0;
        for (int i = 1; i <= 5; i++) {
            if (roll.getNumberOfDice(i) == 1) {
                numberOfNeededDice++;
            }
        }

        return numberOfNeededDice == 5 ? 15 : 0;
    }

    private static int getLargeStraightScore(Dice roll) {
        int numberOfNeededDice = 0;
        for (int i = 2; i <= 6; i++) {
            if (roll.getNumberOfDice(i) == 1) {
                numberOfNeededDice++;
            }
        }

        return numberOfNeededDice == 5 ? 20 : 0;
    }

    private static int getChanceScore(Dice roll) {
        return roll.getSum();
    }

    private static int getYahtzeeScore(Dice roll) {
        for (int i = 1; i <= 6; i++) {
            if (roll.getNumberOfDice(i) == 5) {
                return i * 5 + 50;
            }
        }

        return 0;
    }

}
