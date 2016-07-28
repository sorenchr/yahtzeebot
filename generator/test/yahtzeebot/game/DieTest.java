package yahtzeebot.game;

import org.junit.Assert;
import org.junit.Test;

public class DieTest {

    @Test
    public void shouldHaveCorrectFaceValue() {
        Die die = new Die(1);
        Assert.assertEquals(1, die.getFaceValue());
        die = new Die(2);
        Assert.assertEquals(2, die.getFaceValue());
    }

}
