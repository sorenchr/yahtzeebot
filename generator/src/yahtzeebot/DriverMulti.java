package yahtzeebot;

import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.caches.ProbabilityCache;
import yahtzeebot.generator.Generator;
import yahtzeebot.generator.GeneratorListener;

public class DriverMulti {

    public static void main(String[] args) throws InterruptedException {
        CombinatoricsCache cmb = new CombinatoricsCache();
        ProbabilityCache prob = new ProbabilityCache(cmb);
        Generator generator = new Generator(cmb, prob);

        final int[] count = {0};
        final long start = System.currentTimeMillis();
        generator.generate(new GeneratorListener() {
            public void onGeneratorProgress(long executionTime) {
                count[0]++;
                double deltaSecs = ((double)System.currentTimeMillis() - start) / 1000;
                double widgetsPerSec = count[0] / deltaSecs;
                System.out.println("Done with " + count[0] + ", exec time: " + executionTime + "ms, widgets pr. sec: " + widgetsPerSec);
            }
        });
    }

}
