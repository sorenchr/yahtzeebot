package yahtzeebot.generator;

import org.junit.Assert;
import org.junit.Test;
import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.game.Dice;

import java.util.*;

import static org.mockito.Mockito.*;

public class RollsMapTest {

    @Test
    public void shouldUseTheHighestKeepersEVAsEVForEachRoll() {
        // Setup RollsMap with mocks
        DiceMap dmMock = mock(DiceMap.class);
        CombinatoricsCache cmbMock = mock(CombinatoricsCache.class);

        // Setup the 3 dice sets that will be returned in getAllRolls()
        Dice dice1 = new Dice(1,2,3,4,5);
        Dice dice2 = new Dice(2,3,4,5,6);
        Dice dice3 = new Dice(1,1,1,1,1);
        when(cmbMock.getAllRolls()).thenReturn(Arrays.asList(dice1, dice2, dice3));

        // Setup the keepers that will be returned for each getKeepers() call
        Dice keepers11 = new Dice(1,2,3);
        Dice keepers12 = new Dice(2,3);
        Dice keepers13 = new Dice(4,5);
        Dice keepers21 = new Dice(2,3,4);
        Dice keepers22 = new Dice(4,5,6);
        Dice keepers31 = new Dice(1,1);
        Dice keepers32 = new Dice(1,1,1,1,1);

        // Setup the getKeepers() calls
        when(cmbMock.getKeepers(dice1)).thenReturn(Arrays.asList(keepers11, keepers12, keepers13));
        when(cmbMock.getKeepers(dice2)).thenReturn(Arrays.asList(keepers21, keepers22));
        when(cmbMock.getKeepers(dice3)).thenReturn(Arrays.asList(keepers31, keepers32));

        // Setup the EV returned on each set of keepers
        when(dmMock.getEV(keepers11)).thenReturn(10.5);
        when(dmMock.getEV(keepers12)).thenReturn(20.5); // Keepers12 should provide the highest EV
        when(dmMock.getEV(keepers13)).thenReturn(0.5);
        when(dmMock.getEV(keepers21)).thenReturn(13.3); // Keepers21 should provide the highest EV
        when(dmMock.getEV(keepers22)).thenReturn(0.3);
        when(dmMock.getEV(keepers31)).thenReturn(5.7);
        when(dmMock.getEV(keepers32)).thenReturn(10.7); // Keepers32 should provide the highest EV

        RollsMap rollsMap = new RollsMap(dmMock, cmbMock);
        Assert.assertEquals(20.5, rollsMap.getEV(dice1), 0);
        Assert.assertEquals(13.3, rollsMap.getEV(dice2), 0);
        Assert.assertEquals(10.7, rollsMap.getEV(dice3), 0);
        Assert.assertEquals(3, rollsMap.getAll().size());
    }

    @Test
    public void shouldReturnTheEVForTheGivenRoll() {
        // Setup RollsMap with mocks
        DiceMap dmMock = mock(DiceMap.class);
        CombinatoricsCache cmbMock = mock(CombinatoricsCache.class);

        // Setup the dice that will be returned in getAllRolls()
        Dice dice = new Dice(1,2,3,4,5);
        when(cmbMock.getAllRolls()).thenReturn(Arrays.asList(dice));

        // Setup the keepers that will be returned for the getKeepers() call
        List<Dice> keepers = Arrays.asList(new Dice(1,2,3));

        // Setup the getKeepers() calls
        when(cmbMock.getKeepers(dice)).thenReturn(keepers);

        // Setup the EV returned on each set of keepers
        when(dmMock.getEV(keepers.get(0))).thenReturn(10.5);

        RollsMap rollsMap = new RollsMap(dmMock, cmbMock);
        Assert.assertEquals(10.5, rollsMap.getEV(dice), 0);
    }

    @Test
    public void shouldReturnAMapOfAllEVs() {
        // Setup RollsMap with mocks
        DiceMap dmMock = mock(DiceMap.class);
        CombinatoricsCache cmbMock = mock(CombinatoricsCache.class);

        // Setup the 3 dice sets that will be returned in getAllRolls()
        Dice dice1 = new Dice(1,2,3,4,5);
        Dice dice2 = new Dice(2,3,4,5,6);
        Dice dice3 = new Dice(1,1,1,1,1);
        when(cmbMock.getAllRolls()).thenReturn(Arrays.asList(dice1, dice2, dice3));

        // Setup the keepers that will be returned for each getKeepers() call
        Dice keepers11 = new Dice(1,2,3);
        Dice keepers12 = new Dice(2,3);
        Dice keepers13 = new Dice(4,5);
        Dice keepers21 = new Dice(2,3,4);
        Dice keepers22 = new Dice(4,5,6);
        Dice keepers31 = new Dice(1,1);
        Dice keepers32 = new Dice(1,1,1,1,1);

        // Setup the getKeepers() calls
        when(cmbMock.getKeepers(dice1)).thenReturn(Arrays.asList(keepers11, keepers12, keepers13));
        when(cmbMock.getKeepers(dice2)).thenReturn(Arrays.asList(keepers21, keepers22));
        when(cmbMock.getKeepers(dice3)).thenReturn(Arrays.asList(keepers31, keepers32));

        // Setup the EV returned on each set of keepers
        when(dmMock.getEV(keepers11)).thenReturn(10.5);
        when(dmMock.getEV(keepers12)).thenReturn(20.5); // Keepers12 should provide the highest EV
        when(dmMock.getEV(keepers13)).thenReturn(0.5);
        when(dmMock.getEV(keepers21)).thenReturn(13.3); // Keepers21 should provide the highest EV
        when(dmMock.getEV(keepers22)).thenReturn(0.3);
        when(dmMock.getEV(keepers31)).thenReturn(5.7);
        when(dmMock.getEV(keepers32)).thenReturn(10.7); // Keepers32 should provide the highest EV

        RollsMap rollsMap = new RollsMap(dmMock, cmbMock);
        Map<Dice, Double> rollEVs = rollsMap.getAll();
        Assert.assertEquals(3, rollEVs.size());
        Assert.assertEquals(20.5, rollEVs.get(dice1), 0);
        Assert.assertEquals(13.3, rollEVs.get(dice2), 0);
        Assert.assertEquals(10.7, rollEVs.get(dice3), 0);
    }

}
