package yahtzeebot.generator;

import yahtzeebot.game.Dice;
import yahtzeebot.util.CombinatoricsUtil;

import java.util.HashMap;
import java.util.Map;

public class RollsMap implements DiceMap {

    private Map<Dice, Double> rollsEV = new HashMap<Dice, Double>();

    public RollsMap(DiceMap nextKeepersMap) {
        // Iterate through all possible rolls and calculate their EV's
        for (Dice roll : CombinatoricsUtil.getAllRolls()) {
            double ev = 0; // Will contain the EV for this roll

            // Iterate through all possible keepers resulting from this roll
            for (Dice keepers : CombinatoricsUtil.getKeepers(roll)) {
                double keepersEV = nextKeepersMap.getEV(keepers);
                if (keepersEV >= ev) ev = keepersEV;
            }

            rollsEV.put(roll, ev);
        }
    }

    public double getEV(Dice dice) {
        return rollsEV.get(dice);
    }

    public Map<Dice, Double> getAll() {
        return rollsEV;
    }

}
