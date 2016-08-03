package yahtzeebot.game;

import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DiceTest {

    @Test
    public void shouldCreateDiceFromFaceValues() {
        Dice dice = new Dice(1,2,3,4,5);
        List<Die> expectedDice = Arrays.asList(new Die(1), new Die(2), new Die(3), new Die(4), new Die(5));
        Assert.assertEquals(expectedDice, dice.getDiceAsList());
    }

    @Test
    public void shouldCreateDiceFromList() {
        List<Die> expectedDice = Arrays.asList(new Die(1), new Die(2), new Die(3), new Die(4), new Die(5));
        Dice dice = new Dice(expectedDice);
        Assert.assertEquals(expectedDice, dice.getDiceAsList());
    }

    @Test
    public void shouldReturnNumberOfDice() {
        Dice dice = new Dice(1,2,2,3,4);
        Assert.assertEquals(1, dice.getNumberOfDice(1));
        Assert.assertEquals(2, dice.getNumberOfDice(2));
        Assert.assertEquals(1, dice.getNumberOfDice(3));
        Assert.assertEquals(1, dice.getNumberOfDice(4));
        Assert.assertEquals(0, dice.getNumberOfDice(5));
        Assert.assertEquals(0, dice.getNumberOfDice(6));
    }

    @Test
    public void shouldReturnTheCardinalityMap() {
        Dice dice1 = new Dice(2,2,1,5,6);
        Map<Integer, Integer> expectedMap1 = new HashMap<Integer, Integer>();
        expectedMap1.put(1, 1);
        expectedMap1.put(2, 2);
        expectedMap1.put(5, 1);
        expectedMap1.put(6, 1);
        Assert.assertEquals(expectedMap1, dice1.getCardinalityMap());

        Dice dice2 = new Dice(1,2,2);
        Map<Integer, Integer> expectedMap2 = new HashMap<Integer, Integer>();
        expectedMap2.put(1,1);
        expectedMap2.put(2,2);
        Assert.assertEquals(expectedMap2, dice2.getCardinalityMap());
    }

    @Test (expected = UnsupportedOperationException.class)
    public void shouldReturnUnmodifiableCardinalityMap() {
        Dice dice = new Dice(1,3,2);
        dice.getCardinalityMap().put(1,4);
    }

    @Test
    public void shouldReturnTheSize() {
        Dice dice1 = new Dice(1,2,3,4,5);
        Assert.assertEquals(5, dice1.getSize());
        Dice dice2 = new Dice(1,2,3);
        Assert.assertEquals(3, dice2.getSize());
    }

    @Test
    public void shouldReturnTheSum() {
        Dice dice1 = new Dice(1,2,3,4,5);
        Assert.assertEquals(15, dice1.getSum());
        Dice dice2 = new Dice(5,4,2,3,3);
        Assert.assertEquals(17, dice2.getSum());
    }

    @Test
    public void shouldReturnDiceAsList() {
        Dice dice1 = new Dice(1,2,3,4,5);
        List<Die> expectedDice1 = Arrays.asList(new Die(1), new Die(2), new Die(3), new Die(4), new Die(5));
        Assert.assertEquals(expectedDice1, dice1.getDiceAsList());

        Dice dice2 = new Dice(2,2,3);
        List<Die> expectedDice2 = Arrays.asList(new Die(2), new Die(2), new Die(3));
        Assert.assertEquals(expectedDice2, dice2.getDiceAsList());
    }

    @Test (expected = UnsupportedOperationException.class)
    public void shouldReturnDiceAsUnmodifiableList() {
        Dice dice = new Dice(1,2,3,4);
        dice.getDiceAsList().add(new Die(5));
    }

    @Test
    public void shouldReturnDiceWithoutSpecifiedDice() {
        Dice dice1 = new Dice(1,2,3,4,5);
        Dice withoutThese1 = new Dice(1,2,3);
        Assert.assertEquals(dice1.withoutDice(withoutThese1), new Dice(4,5));

        // Check that non-existing dice are ignored
        Dice dice2 = new Dice(1,2,3,4,5);
        Dice withoutThese2 = new Dice(3,4,5,6);
        Assert.assertEquals(dice2.withoutDice(withoutThese2), new Dice(1,2));
    }

    @Test
    public void shouldReturnDiceWithSpecifiedDice() {
        Dice dice = new Dice(1,2);
        Dice withThese = new Dice(3,4,5);
        Assert.assertEquals(dice.withDice(withThese), new Dice(1,2,3,4,5));
    }

    @Test
    public void shouldHaveTransitiveHashCodeAndEquals() {
        Dice dice1 = new Dice(1,2,3,4,5);
        Dice dice2 = new Dice(1,2,3,4,5);
        Dice dice3 = new Dice(1,2,3,4,5);
        Assert.assertTrue(dice1.equals(dice2));
        Assert.assertTrue(dice2.equals(dice3));
        Assert.assertTrue(dice1.equals(dice3));
    }

    @Test
    public void shouldHaveSymmetricHashCodeAndEquals() {
        Dice dice1 = new Dice(1,2,3,4,5);
        Dice dice2 = new Dice(1,2,3,4,5);
        Assert.assertTrue(dice1.equals(dice2));
        Assert.assertTrue(dice2.equals(dice1));
        Assert.assertEquals(dice2.hashCode(), dice1.hashCode());
    }

    @Test
    public void shouldHaveReflexiveHashCodeEquals() {
        Dice dice = new Dice(1,2,3,4,5);
        Assert.assertTrue(dice.equals(dice));
        Assert.assertEquals(dice.hashCode(), dice.hashCode());
    }

}
