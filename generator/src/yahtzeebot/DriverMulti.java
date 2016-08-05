package yahtzeebot;

import com.google.gson.*;
import me.tongfei.progressbar.ProgressBar;
import yahtzeebot.caches.CombinatoricsCache;
import yahtzeebot.caches.ProbabilityCache;
import yahtzeebot.game.Category;
import yahtzeebot.game.Scorecard;
import yahtzeebot.generator.Generator;
import yahtzeebot.generator.GeneratorListener;
import yahtzeebot.generator.State;
import yahtzeebot.generator.StateMap;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class DriverMulti {

    public static void main(String[] args) throws InterruptedException, FileNotFoundException {
        CombinatoricsCache cmb = new CombinatoricsCache();
        ProbabilityCache prob = new ProbabilityCache(cmb);
        Generator generator = new Generator(cmb, prob);

        final ProgressBar progressBar = new ProgressBar("Generator", 1400000);

        final int[] count = {0};
        final int[] lastCount = {0};
        final long start = System.currentTimeMillis();

        progressBar.start();

        Runnable helloRunnable = new Runnable() {
            public void run() {
//                double deltaSecs = ((double)System.currentTimeMillis() - start) / 1000;
//                double widgetsPerSec = count[0] / deltaSecs;
//                System.out.println("Done with " + count[0] + ", widgets pr. sec: " + widgetsPerSec);
                int delta = count[0] - lastCount[0];
                progressBar.stepBy(delta);
                lastCount[0] = count[0];
            }
        };

        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(helloRunnable, 0, 3, TimeUnit.SECONDS);


        StateMap statemap = generator.generate(new GeneratorListener() {
            public void onGeneratorProgress(long executionTime) {
                count[0]++;
            }
        });
        saveStateMapToDisk(statemap, "statemap.json");

        progressBar.stop();
    }

    private static void saveStateMapToDisk(StateMap stateMap, String path) throws FileNotFoundException {
        // Serialize the StateMap
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(StateMap.class, new StateMapSerializer());
        Gson gson = gsonBuilder.create();
        String json = gson.toJson(stateMap);

        // Save the resulting JSON to disk
        File file = new File(path);
        PrintWriter pw = new PrintWriter(file);
        pw.write(json);
        pw.close();
    }

    private static class StateMapSerializer implements JsonSerializer<StateMap> {

        public JsonElement serialize(StateMap stateMap, Type type,
                                     JsonSerializationContext jsonSerializationContext) {
            JsonObject obj = new JsonObject();

            for(Map.Entry<State, Double> entry : stateMap.getAll().entrySet()) {
                State state = entry.getKey();
                String formattedScorecard = formatScorecard(state.getScorecard());

                // Get scorecard or initialize if it's not already added
                JsonObject scorecardObj;
                if (!obj.has(formattedScorecard)) {
                    scorecardObj = new JsonObject();
                    obj.add(formattedScorecard, scorecardObj);
                } else {
                    scorecardObj = obj.getAsJsonObject(formattedScorecard);
                }

                scorecardObj.addProperty(String.valueOf(state.getUpperScore()), entry.getValue());
            }

            return obj;
        }

        private String formatScorecard(Scorecard scorecard) {
            StringBuilder sb = new StringBuilder("000000000000000");

            for (Category category : scorecard.getMarkedCategories()) {
                sb.setCharAt(category.getIndex(), '1');
            }

            return sb.toString();
        }

    }

}
