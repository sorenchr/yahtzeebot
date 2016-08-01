package yahtzeebot.generator;

import yahtzeebot.game.Category;
import yahtzeebot.game.Scorecard;
import yahtzeebot.util.CombinatoricsUtil;

public class GeneratorSingleThread {

    public StateMap generate(GeneratorListener listener) throws InterruptedException {
        // Setup the state map with terminal states
        StateMap stateMap = initializeStateMap();

        // Generate all possible rounds
        for (int round = 14; round >= 0; round--) {
            // Generate all possible scorecards
            for (Scorecard scorecard : CombinatoricsUtil.getAllScorecards(round)) {
                // Generate all possible upper scores
                for (int upperScore = 0; upperScore <= 63; upperScore++) {
                    // Log the start time
                    long startTime = System.currentTimeMillis();

                    // Setup the widget
                    Widget widget = new Widget(scorecard, upperScore, stateMap);

                    // Get the EV
                    double ev = widget.getEV();

                    // Store the EV in the state map
                    stateMap.addEV(scorecard, upperScore, ev);

                    // Log the stop time
                    long stopTime = System.currentTimeMillis();

                    // Notify the GeneratorListener
                    listener.onGeneratorProgress(stopTime - startTime);
                }
            }
        }

        return stateMap;
    }

    private StateMap initializeStateMap() {
        StateMap stateMap = new StateMap();

        Scorecard scorecard = new Scorecard(Category.values());
        for (int upperScore = 0; upperScore <= 63; upperScore++) {
            stateMap.addEV(scorecard, upperScore, 0);
        }

        return stateMap;
    }

}
