package yahtzeebot.caches;

import yahtzeebot.game.Dice;
import yahtzeebot.game.Die;

import java.util.HashMap;
import java.util.Map;

public class ProbabilityCache {

    private static int[] FACS = new int[] { 1, 1, 2, 6, 24, 120 };

    private Map<Dice, Double> probs = new HashMap<Dice, Double>();

    public ProbabilityCache(CombinatoricsCache cmb) {
        // Build the probability cache
        for (Dice dice : cmb.getAllKeepers()) {
            // Get the cardinality of the dice
            Map<Die, Integer> cardinalityMap = dice.getCardinalityMap();

            // Calculate the cardinality product of the dice
            int cdProd = 1;
            for (Integer cardinality : cardinalityMap.values()) {
                cdProd *= FACS[cardinality];
            }

            // Calculate the dice probability and store it in the cache
            double prob = FACS[dice.getSize()] / (Math.pow(6, dice.getSize()) * cdProd);
            probs.put(dice, prob);
        }
    }

    public double getProbability(Dice dice) {
        return probs.get(dice);
    }

}
