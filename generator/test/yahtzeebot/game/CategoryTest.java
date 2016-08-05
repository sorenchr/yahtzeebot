package yahtzeebot.game;

import org.junit.Assert;
import org.junit.Test;

public class CategoryTest {

    @Test
    public void shouldReturnCorrectIndex() {
        Assert.assertEquals(0, Category.ONES.getIndex());
        Assert.assertEquals(1, Category.TWOS.getIndex());
        Assert.assertEquals(2, Category.THREES.getIndex());
        Assert.assertEquals(3, Category.FOURS.getIndex());
        Assert.assertEquals(4, Category.FIVES.getIndex());
        Assert.assertEquals(5, Category.SIXES.getIndex());
        Assert.assertEquals(6, Category.ONE_PAIR.getIndex());
        Assert.assertEquals(7, Category.TWO_PAIRS.getIndex());
        Assert.assertEquals(8, Category.THREE_OF_A_KIND.getIndex());
        Assert.assertEquals(9, Category.FOUR_OF_A_KIND.getIndex());
        Assert.assertEquals(10, Category.SMALL_STRAIGHT.getIndex());
        Assert.assertEquals(11, Category.LARGE_STRAIGHT.getIndex());
        Assert.assertEquals(12, Category.FULL_HOUSE.getIndex());
        Assert.assertEquals(13, Category.CHANCE.getIndex());
        Assert.assertEquals(14, Category.YAHTZEE.getIndex());
    }

    @Test
    public void shouldReturnCorrectName() {
        Assert.assertEquals("Ones", Category.ONES.getName());
        Assert.assertEquals("Twos", Category.TWOS.getName());
        Assert.assertEquals("Threes", Category.THREES.getName());
        Assert.assertEquals("Fours", Category.FOURS.getName());
        Assert.assertEquals("Fives", Category.FIVES.getName());
        Assert.assertEquals("Sixes", Category.SIXES.getName());
        Assert.assertEquals("One Pair", Category.ONE_PAIR.getName());
        Assert.assertEquals("Two Pairs", Category.TWO_PAIRS.getName());
        Assert.assertEquals("Three of a Kind", Category.THREE_OF_A_KIND.getName());
        Assert.assertEquals("Four of a Kind", Category.FOUR_OF_A_KIND.getName());
        Assert.assertEquals("Small Straight", Category.SMALL_STRAIGHT.getName());
        Assert.assertEquals("Large Straight", Category.LARGE_STRAIGHT.getName());
        Assert.assertEquals("Full House", Category.FULL_HOUSE.getName());
        Assert.assertEquals("Chance", Category.CHANCE.getName());
        Assert.assertEquals("Yahtzee", Category.YAHTZEE.getName());
    }

}
