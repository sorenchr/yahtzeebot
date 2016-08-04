package yahtzeebot.generator;

import org.junit.Assert;
import org.junit.Test;
import yahtzeebot.game.Category;
import yahtzeebot.game.Scorecard;

public class StateMapTest {

    @Test
    public void shouldCreateNewEmptyInstance() {
        StateMap stateMap = new StateMap();
        Assert.assertEquals(0, stateMap.getSize());
    }

    @Test
    public void shouldAddEVToMap() {
        StateMap stateMap = new StateMap();

        stateMap.addEV(new Scorecard(), 55, 25.5);
        Assert.assertEquals(1, stateMap.getSize());

        stateMap.addEV(new Scorecard(), 23, 23);
        Assert.assertEquals(2, stateMap.getSize());

        stateMap.addEV(new Scorecard(), 11, 23.2);
        Assert.assertEquals(3, stateMap.getSize());
    }

    @Test
    public void shouldGetEVFromMap() {
        StateMap stateMap = new StateMap();
        Scorecard scorecard = new Scorecard(Category.ONES, Category.TWOS);
        int upperScore = 55;
        double ev = 2323.2314;

        stateMap.addEV(scorecard, upperScore, ev);

        Assert.assertEquals(ev, stateMap.getEV(scorecard, upperScore), 0);
    }

    @Test
    public void shouldReturnNullOnNonExistentEntry() {
        StateMap stateMap = new StateMap();
        Assert.assertNull(stateMap.getEV(new Scorecard(), 44));
    }

}
