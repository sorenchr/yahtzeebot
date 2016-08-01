package yahtzeebot.generator;

import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.caches.ProbabilityCache;
import yahtzeebot.game.Category;
import yahtzeebot.game.Scorecard;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Generator {

    private ExecutorService executor;
    private CombinatoricsCache cmb;
    private ProbabilityCache prob;

    public Generator(CombinatoricsCache cmb, ProbabilityCache prob) {
        this.cmb = cmb;
        this.prob = prob;

        // Setup the ThreadPoolExecutor that will handle state calculation
        executor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
    }

    public StateMap generate(GeneratorListener listener) throws InterruptedException {
        // Setup the state map with terminal states
        StateMap stateMap = initializeStateMap();

        // Generate all possible rounds
        for (int round = 14; round >= 0; round--) {
            // Setup a list of all the futures for this round
            List<WidgetCallable> roundCallables = new ArrayList<WidgetCallable>();

            // Generate all possible scorecards
            for (Scorecard scorecard : cmb.getAllScorecards(round)) {
                // Generate all possible upper scores
                for (int upperScore = 0; upperScore <= 63; upperScore++) {
                    // Create the widget callable and store it for future execution
                    WidgetCallable callable = new WidgetCallable(scorecard, upperScore, stateMap, listener);
                    roundCallables.add(callable);
                }
            }

            // Invoke all of the futures for this round
            executor.invokeAll(roundCallables);
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

    private class WidgetCallable implements Callable<Void> {

        private Scorecard scorecard;
        private int upperScore;
        private StateMap nextStates;
        private GeneratorListener listener;

        public WidgetCallable(Scorecard scorecard, int upperScore, StateMap nextStates, GeneratorListener listener) {
            this.scorecard = scorecard;
            this.upperScore = upperScore;
            this.nextStates = nextStates;
            this.listener = listener;
        }

        public Void call() throws Exception {
            // Log the start time
            long startTime = System.currentTimeMillis();

            // Setup the widget
            Widget widget = new Widget(scorecard, upperScore, nextStates, cmb, prob);

            // Get the EV
            double ev = widget.getEV();

            // Store the EV in the state map
            nextStates.addEV(scorecard, upperScore, ev);

            // Log the stop time
            long stopTime = System.currentTimeMillis();

            // Notify the GeneratorListener
            listener.onGeneratorProgress(stopTime - startTime);

            return null;
        }

    }

}
