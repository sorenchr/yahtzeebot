package yahtzeebot.generator;

import org.junit.Assert;
import org.junit.Test;
import yahtzeebot.game.Category;
import yahtzeebot.game.Scorecard;

public class StateTest {

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
