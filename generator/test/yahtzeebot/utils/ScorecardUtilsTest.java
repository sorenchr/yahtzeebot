package yahtzeebot.utils;

import org.junit.Assert;
import org.junit.Test;
import yahtzeebot.game.Category;
import yahtzeebot.game.Dice;

public class ScorecardUtilsTest {

    @Test
    public void shouldReturnCorrectScoreForOnes() {
        Dice dice1 = new Dice(6,1,1,3,1);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.ONES, dice1), 3);
        Dice dice2 = new Dice(1,1,1,1,1);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.ONES, dice2), 5);
    }

    @Test
    public void shouldReturnCorrectScoreForTwos() {
        Dice dice1 = new Dice(2,2,1,3,1);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.TWOS, dice1), 4);
        Dice dice2 = new Dice(2,2,1,2,2);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.TWOS, dice2), 8);
    }

    @Test
    public void shouldReturnCorrectScoreForThrees() {
        Dice dice1 = new Dice(2,2,1,3,1);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.THREES, dice1), 3);
        Dice dice2 = new Dice(3,2,3,2,3);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.THREES, dice2), 9);
    }

    @Test
    public void shouldReturnCorrectScoreForFours() {
        Dice dice1 = new Dice(2,2,4,3,4);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FOURS, dice1), 8);
        Dice dice2 = new Dice(4,4,4,4,4);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FOURS, dice2), 20);
    }
    @Test
    public void shouldReturnCorrectScoreForFives() {
        Dice dice1 = new Dice(5,5,4,5,4);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FIVES, dice1), 15);
        Dice dice2 = new Dice(5,5,5,5,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FIVES, dice2), 25);
    }
    @Test
    public void shouldReturnCorrectScoreForSixes() {
        Dice dice1 = new Dice(6,6,4,5,4);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.SIXES, dice1), 12);
        Dice dice2 = new Dice(6,6,6,6,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.SIXES, dice2), 24);
    }

    @Test
    public void shouldReturnCorrectScoreForOnePair() {
        Dice dice1 = new Dice(1,1,6,3,3);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.ONE_PAIR, dice1), 6);
        Dice dice2 = new Dice(1,2,3,4,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.ONE_PAIR, dice2), 0);
    }

    @Test
    public void shouldReturnCorrectScoreForTwoPairs() {
        Dice dice1 = new Dice(1,1,6,6,3);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.TWO_PAIRS, dice1), 14);
        Dice dice2 = new Dice(1,1,6,5,3);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.TWO_PAIRS, dice2), 0);
    }

    @Test
    public void shouldReturnCorrectScoreForThreeOfAKind() {
        Dice dice1 = new Dice(3,3,3,2,6);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.THREE_OF_A_KIND, dice1), 9);
        Dice dice2 = new Dice(3,3,2,2,6);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.THREE_OF_A_KIND, dice2), 0);
    }

    @Test
    public void shouldReturnCorrectScoreForFourOfAKind() {
        Dice dice1 = new Dice(3,2,2,2,2);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FOUR_OF_A_KIND, dice1), 8);
        Dice dice2 = new Dice(3,2,2,1,2);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FOUR_OF_A_KIND, dice2), 0);
    }

    @Test
    public void shouldReturnCorrectScoreForSmallStraight() {
        Dice dice1 = new Dice(1,2,3,4,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.SMALL_STRAIGHT, dice1), 15);
        Dice dice2 = new Dice(6,6,6,6,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.SMALL_STRAIGHT, dice2), 0);
    }

    @Test
    public void shouldReturnCorrectScoreForLargeStraight() {
        Dice dice1 = new Dice(2,3,4,5,6);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.LARGE_STRAIGHT, dice1), 20);
        Dice dice2 = new Dice(6,3,4,5,6 );
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.LARGE_STRAIGHT, dice2), 0);
    }

    @Test
    public void shouldReturnCorrectScoreForFullHouse() {
        Dice dice1 = new Dice(2,2,3,3,3);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FULL_HOUSE, dice1), 13);
        Dice dice2 = new Dice(6,6,5,5,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FULL_HOUSE, dice2), 27);
        Dice dice3 = new Dice(1,2,3,3,3);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.FULL_HOUSE, dice3), 0);
    }

    @Test
    public void shouldReturnCorrectScoreForChance() {
        Dice dice1 = new Dice(6,6,5,5,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.CHANCE, dice1), 27);
        Dice dice2 = new Dice(2,2,1,1,1);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.CHANCE, dice2), 7);
    }

    @Test
    public void shouldReturnCorrectScoreForLargeYahtzee() {
        Dice dice1 = new Dice(1,1,1,1,1);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.YAHTZEE, dice1), 55);
        Dice dice2 = new Dice(5,5,5,5,5);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.YAHTZEE, dice2), 75);
        Dice dice3 = new Dice(1,1,4,1,1);
        Assert.assertEquals(ScorecardUtils.getCategoryScore(Category.YAHTZEE, dice3), 0);
    }

}
