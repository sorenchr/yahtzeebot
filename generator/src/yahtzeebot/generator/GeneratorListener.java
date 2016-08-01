package yahtzeebot.generator;

public interface GeneratorListener {

    /**
     * Called when the generator has progressed a round in the calculations.
     * @param executionTime The execution time for this tick.
     */
    void onGeneratorProgress(long executionTime);

}
