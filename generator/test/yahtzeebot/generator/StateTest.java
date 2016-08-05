package yahtzeebot.generator;

import org.junit.Assert;
import org.junit.Test;
import scala.runtime.TraitSetter;
import yahtzeebot.game.Category;
import yahtzeebot.game.Scorecard;

public class StateTest {

    @Test
    public void shouldConstructWithScorecardAndUpperScore() {
        Scorecard scorecard = new Scorecard(Category.ONES, Category.TWOS, Category.FULL_HOUSE);
        int upperScore = 54;
        State state = new State(scorecard, upperScore);
        Assert.assertEquals(scorecard, state.getScorecard());
        Assert.assertEquals(upperScore, state.getUpperScore());
    }

    @Test
    public void shouldHaveTransitiveHashCodeAndEquals() {
        State state1 = new State(new Scorecard(Category.ONES, Category.TWOS), 22);
        State state2 = new State(new Scorecard(Category.ONES, Category.TWOS), 22);
        State state3 = new State(new Scorecard(Category.ONES, Category.TWOS), 22);
        Assert.assertTrue(state1.equals(state2));
        Assert.assertTrue(state2.equals(state3));
        Assert.assertTrue(state1.equals(state3));
    }

    @Test
    public void shouldHaveSymmetricHashCodeAndEquals() {
        State state1 = new State(new Scorecard(Category.ONES, Category.TWOS), 22);
        State state2 = new State(new Scorecard(Category.ONES, Category.TWOS), 22);
        Assert.assertTrue(state1.equals(state2));
        Assert.assertTrue(state2.equals(state1));
        Assert.assertEquals(state2.hashCode(), state1.hashCode());
    }

    @Test
    public void shouldHaveReflexiveHashCodeEquals() {
        State state = new State(new Scorecard(Category.ONES, Category.TWOS), 22);
        Assert.assertTrue(state.equals(state));
        Assert.assertEquals(state.hashCode(), state.hashCode());
    }

}
