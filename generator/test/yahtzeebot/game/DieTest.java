package yahtzeebot.game;

import org.junit.Assert;
import org.junit.Test;

public class DieTest {

    @Test
    public void shouldHaveCorrectFaceValue() {
        for (int i = 1; i <= 6; i++) {
            Die die = new Die(i);
            Assert.assertEquals(i, die.getFaceValue());
        }
    }

    @Test
    public void shouldEqualDiceWithSameFaceValue() {
        for (int i = 1; i <= 6; i++) {
            Die die1 = new Die(i);
            Die die2 = new Die(i);
            Assert.assertEquals(die1, die2);
        }
    }

    @Test (expected = IllegalArgumentException.class)
    public void shouldThrowExceptionOnFaceValueBelowOne() {
        Die die = new Die(0);
    }

    @Test (expected = IllegalArgumentException.class)
    public void shouldThrowExceptionOnFaceValueAboveSix() {
        Die die = new Die(7);
    }

    @Test
    public void shouldHaveTransitiveHashCodeAndEquals() {
        Die die1 = new Die(5);
        Die die2 = new Die(5);
        Die die3 = new Die(5);
        Assert.assertTrue(die1.equals(die2));
        Assert.assertTrue(die2.equals(die3));
        Assert.assertTrue(die1.equals(die3));
    }

    @Test
    public void shouldHaveSymmetricHashCodeAndEquals() {
        Die die1 = new Die(5);
        Die die2 = new Die(5);
        Assert.assertTrue(die1.equals(die2));
        Assert.assertTrue(die2.equals(die1));
        Assert.assertEquals(die1.hashCode(), die2.hashCode());
    }

    @Test
    public void shouldHaveReflexiveHashCodeEquals() {
        Die die = new Die(5);
        Assert.assertTrue(die.equals(die));
        Assert.assertEquals(die.hashCode(), die.hashCode());
    }

}
