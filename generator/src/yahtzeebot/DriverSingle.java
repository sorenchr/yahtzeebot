package yahtzeebot;

import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.caches.ProbabilityCache;
import yahtzeebot.generator.GeneratorListener;
import yahtzeebot.generator.GeneratorSingleThread;

public class DriverSingle {

    public static void main(String[] args) {
        CombinatoricsCache cmb = new CombinatoricsCache();
        ProbabilityCache prob = new ProbabilityCache(cmb);
        GeneratorSingleThread generator = new GeneratorSingleThread(cmb, prob);

        final int[] count = {0};
        generator.generate(new GeneratorListener() {
            public void onGeneratorProgress(long executionTime) {
                count[0]++;
                System.out.println("Done with " + count[0] + ", exec time: " + executionTime + "ms");
            }
        });
    }

}
