import yahtzeebot.generator.Generator;
import yahtzeebot.generator.GeneratorListener;
import yahtzeebot.generator.GeneratorSingleThread;

public class Driver {

    public static void main(String[] args) throws InterruptedException {
        Generator generator = new Generator();

        final int[] count = {0};
        generator.generate(new GeneratorListener() {
            public void onGeneratorProgress(long executionTime) {
                count[0]++;
                double percentDone = (double)count[0] * 100 / 2097076;
                System.out.println("Finished state: " + count[0] + ", " + percentDone + "% done, avg. exec time: " + executionTime + "ms");
            }
        });
    }

}
