package yahtzeebot.generator;


import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.game.Category;
import yahtzeebot.game.Dice;
import yahtzeebot.game.Scorecard;
import yahtzeebot.utils.ScorecardUtils;

import java.util.HashMap;
import java.util.Map;

public class FinalRollsMap implements DiceMap {

    private Map<Dice, Double> rollsEV = new HashMap<Dice, Double>();

    public FinalRollsMap(Scorecard scorecard, int upperScore, StateMap stateMap,
                         CombinatoricsCache cmb) {
        for (Dice roll : cmb.getAllRolls()) {
            double rollEV = 0;

            // Loop through each unmarked category
            for (Category category : scorecard.getUnmarkedCategories()) {
                // Find the new upper score from scoring in this category
                int categoryScore = ScorecardUtils.getCategoryScore(category, roll);
                int newUpperScore = category.isUpperCategory() ? upperScore + categoryScore : upperScore;

                // Calculate the category EV
                Scorecard newScorecard = scorecard.withMarkedCategory(category);
                double categoryEV = stateMap.getEV(newScorecard, newUpperScore) + categoryScore;

                // Check if scoring the category results in the upper section bonus
                if (upperScore < 63 && newUpperScore >= 63) categoryEV += 50;

                // Check if scoring the category resulted in the bonus
                if (upperScore < 63 && newUpperScore >= 63) {
                    categoryEV += 50;
                }

                // Check if this is the best EV for the category
                if (categoryEV > rollEV) {
                    rollEV = categoryEV;
                }
            }

            // Store the EV for this roll
            rollsEV.put(roll, rollEV);
        }
    }

    public double getEV(Dice dice) {
        return rollsEV.get(dice);
    }

    public Map<Dice, Double> getAll() {
        return rollsEV;
    }

}
