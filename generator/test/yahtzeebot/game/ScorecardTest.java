package yahtzeebot.game;

import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class ScorecardTest {

    @Test
    public void shouldCreateScorecardFromCollection() {
        Category[] markedCategories = new Category[] {
                Category.ONES, Category.TWOS, Category.THREES,
                Category.FOURS, Category.FIVES, Category.SIXES
        };
        Set<Category> markedCategoriesSet = new HashSet<Category>(Arrays.asList(markedCategories));
        Scorecard scorecard = new Scorecard(markedCategoriesSet);

        Assert.assertEquals(markedCategoriesSet, scorecard.getMarkedCategories());
    }

    @Test
    public void shouldCreateScorecardFromArray() {
        Category[] markedCategories = new Category[] {
                Category.ONES, Category.TWOS, Category.THREES,
                Category.FOURS, Category.FIVES, Category.SIXES
        };
        Scorecard scorecard = new Scorecard(markedCategories);
        Set<Category> markedCategoriesSet = new HashSet<Category>(Arrays.asList(markedCategories));

        Assert.assertEquals(markedCategoriesSet, scorecard.getMarkedCategories());
    }

    @Test (expected = UnsupportedOperationException.class)
    public void shouldReturnUnmodifiableCopy() {
        Scorecard scorecard = new Scorecard(Category.ONES, Category.TWOS);
        scorecard.getMarkedCategories().add(Category.THREES);
    }

    @Test
    public void shouldReturnCopyWithMarkedCategory() {
        Category[] markedCategories = new Category[] {
            Category.ONES, Category.TWOS, Category.THREES,
            Category.FOURS, Category.FIVES, Category.SIXES
        };
        Category[] expectedMarkedCategories = new Category[] {
            Category.ONES, Category.TWOS, Category.THREES,
            Category.FOURS, Category.FIVES, Category.SIXES,
            Category.ONE_PAIR
        };
        Set<Category> markedCategoriesSet = new HashSet<Category>(Arrays.asList(markedCategories));
        Set<Category> expectedMarkedCategoriesSet = new HashSet<Category>(Arrays.asList(expectedMarkedCategories));

        Scorecard scorecard = new Scorecard(markedCategories);
        Scorecard markedScorecard = scorecard.withMarkedCategory(Category.ONE_PAIR);

        Assert.assertNotEquals(scorecard, markedScorecard);
        Assert.assertNotSame(scorecard, markedScorecard);
        Assert.assertEquals(expectedMarkedCategoriesSet, markedScorecard.getMarkedCategories());
        Assert.assertEquals(markedCategoriesSet, scorecard.getMarkedCategories());
    }

    @Test
    public void shouldReturnAllTheUnmarkedCategories() {
        Category[] markedCategories = new Category[] {
            Category.ONES, Category.TWOS, Category.THREES,
            Category.FOURS, Category.FIVES, Category.SIXES
        };

        Category[] unmarkedCategories = new Category[] {
            Category.ONE_PAIR, Category.TWO_PAIRS, Category.THREE_OF_A_KIND,
            Category.FOUR_OF_A_KIND, Category.FULL_HOUSE, Category.SMALL_STRAIGHT,
            Category.LARGE_STRAIGHT, Category.CHANCE, Category.YAHTZEE
        };
        Set<Category> unmarkedCategoriesSet = new HashSet<Category>(Arrays.asList(unmarkedCategories));

        Scorecard scorecard = new Scorecard(markedCategories);
        Assert.assertEquals(unmarkedCategoriesSet, scorecard.getUnmarkedCategories());
    }

    @Test
    public void shouldHaveTransitiveHashCodeAndEquals() {
        Scorecard scorecard1 = new Scorecard(Category.ONES, Category.TWOS);
        Scorecard scorecard2 = new Scorecard(Category.ONES, Category.TWOS);
        Scorecard scorecard3 = new Scorecard(Category.ONES, Category.TWOS);
        Assert.assertTrue(scorecard1.equals(scorecard2));
        Assert.assertTrue(scorecard2.equals(scorecard3));
        Assert.assertTrue(scorecard1.equals(scorecard3));
    }

    @Test
    public void shouldHaveSymmetricHashCodeAndEquals() {
        Scorecard scorecard1 = new Scorecard(Category.ONES, Category.TWOS);
        Scorecard scorecard2 = new Scorecard(Category.ONES, Category.TWOS);
        Assert.assertTrue(scorecard1.equals(scorecard2));
        Assert.assertTrue(scorecard2.equals(scorecard1));
        Assert.assertEquals(scorecard2.hashCode(), scorecard1.hashCode());
    }

    @Test
    public void shouldHaveReflexiveHashCodeEquals() {
        Scorecard scorecard = new Scorecard(Category.ONES, Category.TWOS);
        Assert.assertTrue(scorecard.equals(scorecard));
        Assert.assertEquals(scorecard.hashCode(), scorecard.hashCode());
    }

}
