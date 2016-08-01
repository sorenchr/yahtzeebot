package yahtzeebot.generator;

import yahtzeebot.game.Scorecard;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class StateMap {

    private Map<State, Double> map = new ConcurrentHashMap<State, Double>();

    public void addEV(Scorecard scorecard, int upperScore, double ev) {
        State state = new State(scorecard, upperScore);
        map.put(state, ev);
    }

    public Double getEV(Scorecard scorecard, double upperScore) {
        State state = new State(scorecard, upperScore);
        return map.get(state);
    }

}
