package yahtzeebot.generator;

import yahtzeebot.game.Scorecard;

import java.util.HashMap;
import java.util.Map;

public class StateMap {

    private Map<State, Double> map = new HashMap<State, Double>();

    private void addEV(Scorecard scorecard, int upperScore, double ev) {
        State state = new State(scorecard, upperScore);
        map.put(state, ev);
    }

    private Double getEV(Scorecard scorecard, double upperScore) {
        State state = new State(scorecard, upperScore);
        return map.get(state);
    }

}
