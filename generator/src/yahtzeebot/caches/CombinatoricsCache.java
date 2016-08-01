package yahtzeebot.caches;

import org.paukov.combinatorics.Factory;
import org.paukov.combinatorics.Generator;
import org.paukov.combinatorics.ICombinatoricsVector;
import yahtzeebot.game.Category;
import yahtzeebot.game.Dice;
import yahtzeebot.game.Die;
import yahtzeebot.game.Scorecard;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CombinatoricsCache {

    private List<Dice> allRolls;
    private List<Dice> allKeepers;
    private Map<Integer, List<Scorecard>> allScorecards;
    private Map<Dice, List<Dice>> rollsKeepers;
    private Map<Dice, List<Dice>> keepersRolls;

    public CombinatoricsCache() {
        // Generate all possible dice rolls of size 5
        allRolls = generateDice(5);

        // Generate all possible keepers of size 0 - 5
        allKeepers = new ArrayList<Dice>();
        for (int i = 0; i <= 5; i++) {
            allKeepers.addAll(generateDice(i));
        }

        // Generate all keepers from rolls
        rollsKeepers = new HashMap<Dice, List<Dice>>();
        for (Dice roll : allRolls) {
            rollsKeepers.put(roll, generateKeepers(roll));
        }

        // Generate all rolls from keepers
        keepersRolls = new HashMap<Dice, List<Dice>>();
        for (Dice keepers : allKeepers) {
            keepersRolls.put(keepers, generateRolls(keepers));
        }

        // Generate all scorecards from size 0 to 15
        allScorecards = new HashMap<Integer, List<Scorecard>>();
        for (int i = 0; i <= 15; i++) {
            allScorecards.put(i, generateScorecards(i));
        }
    }

    public List<Dice> getAllRolls() {
        return allRolls;
    }

    public List<Dice> getAllKeepers() {
        return allKeepers;
    }

    public List<Dice> getKeepers(Dice roll) {
        return rollsKeepers.get(roll);
    }

    public List<Dice> getRolls(Dice keepers) {
        return keepersRolls.get(keepers);
    }

    public List<Scorecard> getAllScorecards(int size) {
        return allScorecards.get(size);
    }

    private List<Dice> generateDice(int size) {
        // Setup the dice list to return
        List<Dice> dice = new ArrayList<Dice>();

        // Setup generator
        ICombinatoricsVector<Integer> initialVector = Factory.createVector(new Integer[]{ 1,2,3,4,5,6 } );
        Generator<Integer> gen = Factory.createMultiCombinationGenerator(initialVector, size);

        // Create all rolls
        for (ICombinatoricsVector<Integer> combination : gen) {
            // Setup the list that will contain the transformed dice
            List<Die> dieList = new ArrayList<Die>();

            // Transform each int value in the combination to a Die object
            for (Integer faceValue : combination.getVector()) {
                dieList.add(new Die(faceValue));
            }

            // Add the dice to the total result
            dice.add(new Dice(dieList));
        }

        return dice;
    }

    private List<Dice> generateKeepers(Dice roll) {
        // Setup the keepers list
        List<Dice> keepers = new ArrayList<Dice>();

        // Setup generator
        ICombinatoricsVector<Die> initialSet = Factory.createVector(roll.getDice());
        Generator<Die> gen = Factory.createSubSetGenerator(initialSet);

        // Add each combination to the keepers list
        for (ICombinatoricsVector<Die> subSet : gen) {
            keepers.add(new Dice(subSet.getVector()));
        }

        return keepers;
    }

    public List<Dice> generateRolls(Dice keepers) {
        // Setup the rolls list
        List<Dice> rolls = new ArrayList<Dice>();

        // Generate the remaining dice
        List<Dice> remDice = generateDice(5 - keepers.getSize());

        // Pad each set of remaining dice with the keepers
        for (Dice dice : remDice) {
            rolls.add(dice.addDice(keepers));
        }

        return rolls;
    }

    public List<Scorecard> generateScorecards(int size) {
        // Setup the scorecards list
        List<Scorecard> scorecards = new ArrayList<Scorecard>();

        // Setup generator
        ICombinatoricsVector<Category> initialSet = Factory.createVector(Category.values());
        Generator<Category> gen = Factory.createSimpleCombinationGenerator(initialSet, size);

        // Create all scorecards
        for (ICombinatoricsVector<Category> subSet : gen) {
            Scorecard scorecard = new Scorecard(subSet.getVector());
            scorecards.add(scorecard);
        }

        return scorecards;
    }

}
