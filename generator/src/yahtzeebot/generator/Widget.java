package yahtzeebot.generator;

import yahtzeebot.game.Dice;
import yahtzeebot.game.Scorecard;
import yahtzeebot.util.ProbabilityUtil;

import java.util.Map;

public class Widget {

    private Scorecard scorecard;
    private int upperScore;
    private StateMap nextStates;

    public Widget(Scorecard scorecard, int upperScore, StateMap nextStates) {
        this.scorecard = scorecard;
        this.upperScore = upperScore;
        this.nextStates = nextStates;
    }

    public double getEV() {
        // Generate the final rolls for this state
        DiceMap finalRollsMap = new FinalRollsMap(scorecard, upperScore, nextStates);

        // Generate the second keepers based on the final rolls
        DiceMap secondKeepers = new KeepersMap(finalRollsMap);

        // Generate the second rolls based on the second keepers
        DiceMap secondRolls = new RollsMap(secondKeepers);

        // Generate the first keepers based on the second rolls
        DiceMap firstKeepers = new KeepersMap(secondRolls);

        // Generate the first rolls based on the first keepers
        DiceMap firstRolls = new RollsMap(firstKeepers);

        // Calculate the EV sum of the first roll states
        double evSum = 0;
        for (Map.Entry<Dice, Double> entry : firstRolls.getAll().entrySet()) {
            evSum += ProbabilityUtil.getProbability(entry.getKey()) * entry.getValue();
        }

        return evSum;
    }

}
