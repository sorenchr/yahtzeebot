package yahtzeebot.generator;

import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.caches.ProbabilityCache;
import yahtzeebot.game.Dice;
import yahtzeebot.game.Scorecard;

import java.util.Map;

public class Widget {

    private Scorecard scorecard;
    private int upperScore;
    private StateMap nextStates;
    private CombinatoricsCache cmb;
    private ProbabilityCache prob;

    public Widget(Scorecard scorecard, int upperScore, StateMap nextStates,
                  CombinatoricsCache cmb, ProbabilityCache prob) {
        this.scorecard = scorecard;
        this.upperScore = upperScore;
        this.nextStates = nextStates;
        this.cmb = cmb;
        this.prob = prob;
    }

    public double getEV() {
        // Generate the final rolls for this state
        DiceMap finalRollsMap = new FinalRollsMap(scorecard, upperScore, nextStates, cmb);

        // Generate the second keepers based on the final rolls
        DiceMap secondKeepers = new KeepersMap(finalRollsMap, cmb, prob);

        // Generate the second rolls based on the second keepers
        DiceMap secondRolls = new RollsMap(secondKeepers, cmb);

        // Generate the first keepers based on the second rolls
        DiceMap firstKeepers = new KeepersMap(secondRolls, cmb, prob);

        // Generate the first rolls based on the first keepers
        DiceMap firstRolls = new RollsMap(firstKeepers, cmb);

        // Calculate the EV sum of the first roll states
        double evSum = 0;
        for (Map.Entry<Dice, Double> entry : firstRolls.getAll().entrySet()) {
            evSum += prob.getProbability(entry.getKey()) * entry.getValue();
        }

        return evSum;
    }

}
