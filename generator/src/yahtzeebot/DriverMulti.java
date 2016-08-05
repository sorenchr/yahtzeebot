package yahtzeebot;

import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.caches.ProbabilityCache;
import yahtzeebot.generator.Generator;
import yahtzeebot.generator.GeneratorListener;

import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class DriverMulti {

    public static void main(String[] args) throws InterruptedException {
        CombinatoricsCache cmb = new CombinatoricsCache();
        ProbabilityCache prob = new ProbabilityCache(cmb);
        Generator generator = new Generator(cmb, prob);

        final int[] count = {0};
        final long start = System.currentTimeMillis();

        Runnable helloRunnable = new Runnable() {
            public void run() {
                double deltaSecs = ((double)System.currentTimeMillis() - start) / 1000;
                double widgetsPerSec = count[0] / deltaSecs;
                System.out.println("Done with " + count[0] + ", widgets pr. sec: " + widgetsPerSec);
            }
        };

        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(helloRunnable, 0, 3, TimeUnit.SECONDS);


        generator.generate(new GeneratorListener() {
            public void onGeneratorProgress(long executionTime) {
                count[0]++;
            }
        });
    }

}
