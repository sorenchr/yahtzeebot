package yahtzeebot.generator;

public interface GeneratorListener {

    /**
     * Called when the generator has progressed a round in the calculations.
     */
    void onGeneratorProgress();

}
