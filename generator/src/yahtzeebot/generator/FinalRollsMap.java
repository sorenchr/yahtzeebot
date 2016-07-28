package yahtzeebot.generator;


import yahtzeebot.game.Dice;
import yahtzeebot.game.Scorecard;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FinalRollsMap {

    private Map<Dice, Double> evMap = new HashMap<Dice, Double>();

    public FinalRollsMap(Scorecard scorecard, int upperScore, StateMap stateMap) {

    }

    public double getEV(Dice dice) {
        return evMap.get(dice);
    }

}
