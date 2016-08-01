package yahtzeebot.generator;

import yahtzeebot.game.Dice;
import yahtzeebot.util.CombinatoricsUtil;
import yahtzeebot.util.ProbabilityUtil;

import java.util.HashMap;
import java.util.Map;

public class KeepersMap implements DiceMap {

    private Map<Dice, Double> keepersEV = new HashMap<Dice, Double>();

    public KeepersMap(DiceMap nextRollsMap) {
        // Loop through each possible keepers and calculate their EV's
        for (Dice keepers : CombinatoricsUtil.getAllKeepers()) {
            double evSum = 0; // Will contain the total EV for these keepers

            // Iterate through all possible rolls resulting from these keepers
            for (Dice roll : CombinatoricsUtil.getRolls(keepers)) {
                Dice remDice = roll.subtractDice(keepers);
                try {
                    evSum += ProbabilityUtil.getProbability(remDice) * nextRollsMap.getEV(roll);
                } catch(NullPointerException e) {
                    System.out.println(e);
                }
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
