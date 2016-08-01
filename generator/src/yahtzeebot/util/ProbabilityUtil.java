package yahtzeebot.util;

import yahtzeebot.game.Dice;
import yahtzeebot.game.Die;

import java.util.HashMap;
import java.util.Map;

public class ProbabilityUtil {

    private static int[] FACS = new int[] { 1, 1, 2, 6, 24, 120 };
    private static Map<Dice, Double> probCache = new HashMap<Dice, Double>();

    public static double getProbability(Dice dice) {
        // Check if the result is cached
        if (probCache.containsKey(dice)) return probCache.get(dice);

        // Get the cardinality of the dice
        Map<Die, Integer> cardinalityMap = dice.getCardinalityMap();

        // Calculate the cardinality product of the dice
        int cdProd = 1;
        for (Integer cardinality : cardinalityMap.values()) {
            cdProd *= FACS[cardinality];
        }

        // Calculate the dice probability and store it in the cache
        double prob = FACS[dice.getSize()] / (Math.pow(6, dice.getSize()) * cdProd);
        probCache.put(dice, prob);

        return prob;
    }

}