package yahtzeebot.generator;


import yahtzeebot.game.Scorecard;

public class State {

    private Scorecard scorecard;
    private double ev;

    public State(Scorecard scorecard, double ev) {
        this.scorecard = scorecard;
        this.ev = ev;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        State state = (State) o;

        if (Double.compare(state.ev, ev) != 0) return false;
        return scorecard.equals(state.scorecard);
    }

    @Override
    public int hashCode() {
        int result;
        long temp;
        result = scorecard.hashCode();
        temp = Double.doubleToLongBits(ev);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        return result;
    }
}
