package yahtzeebot.generator;


import yahtzeebot.game.Scorecard;

public class State {

    private Scorecard scorecard;
    private int upperScore;

    public State(Scorecard scorecard, int upperScore) {
        this.scorecard = scorecard;
        this.upperScore = upperScore;
    }

    public Scorecard getScorecard() {
        return scorecard;
    }

    public int getUpperScore() {
        return upperScore;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        State state = (State) o;

        if (upperScore != state.upperScore) return false;
        return scorecard.equals(state.scorecard);
    }

    @Override
    public int hashCode() {
        int result = scorecard.hashCode();
        result = 31 * result + upperScore;
        return result;
    }

}
