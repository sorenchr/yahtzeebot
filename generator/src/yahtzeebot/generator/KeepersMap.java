package yahtzeebot.generator;

import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.caches.ProbabilityCache;
import yahtzeebot.game.Dice;

import java.util.HashMap;
import java.util.Map;

public class KeepersMap implements DiceMap {

    private Map<Dice, Double> keepersEV = new HashMap<Dice, Double>();

    public KeepersMap(DiceMap nextRollsMap, CombinatoricsCache cmb, ProbabilityCache prob) {
        // Loop through each possible keepers and calculate their EV's
        for (Dice keepers : cmb.getAllKeepers()) {
            double evSum = 0; // Will contain the total EV for these keepers

            // Iterate through all possible rolls resulting from these keepers
            for (Dice roll : cmb.getRolls(keepers)) {
                Dice remDice = roll.subtractDice(keepers);
                evSum += prob.getProbability(remDice) * nextRollsMap.getEV(roll);
            }

            keepersEV.put(keepers, evSum);
        }
    }

    public double getEV(Dice dice) {
        return keepersEV.get(dice);
    }

    public Map<Dice, Double> getAll() {
        return keepersEV;
    }

}
