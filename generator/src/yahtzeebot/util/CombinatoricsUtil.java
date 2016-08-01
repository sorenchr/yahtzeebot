package yahtzeebot.util;

import org.paukov.combinatorics.Factory;
import org.paukov.combinatorics.Generator;
import org.paukov.combinatorics.ICombinatoricsVector;
import yahtzeebot.game.Category;
import yahtzeebot.game.Dice;
import yahtzeebot.game.Die;
import yahtzeebot.game.Scorecard;

import java.util.*;

public class CombinatoricsUtil {

    private static List<Dice> allRolls;
    private static List<Dice> allKeepers;
    private static Map<Dice, List<Dice>> allRollKeepers = new HashMap<Dice, List<Dice>>();
    private static Map<Dice, List<Dice>> allKeepersRolls = new HashMap<Dice, List<Dice>>();
    private static Map<Integer, List<Scorecard>> allScorecards = new HashMap<Integer, List<Scorecard>>();

    public synchronized static List<Dice> getAllRolls() {
        // Check if the result is cached
        if (allRolls != null) return allRolls;

        // Setup the rolls list
        allRolls = generateDice(5);

        return allRolls;
    }

    public synchronized static List<Dice> getAllKeepers() {
        // Check if the result is cached
        if (allKeepers != null) return allKeepers;

        // Setup the keepers list
        allKeepers = new ArrayList<Dice>();

        // Add all keepers to the list
        for (int i = 0; i <= 5; i++) {
            allKeepers.addAll(generateDice(i));
        }

         return allKeepers;
    }

    public synchronized static List<Dice> getKeepers(Dice roll) {
        // Check if the result is cached
        if (allRollKeepers.containsKey(roll)) return allRollKeepers.get(roll);

        // Setup the keepers list
        List<Dice> keepers = new ArrayList<Dice>();

        // Setup generator
        ICombinatoricsVector<Die> initialSet = Factory.createVector(roll.getDice());
        Generator<Die> gen = Factory.createSubSetGenerator(initialSet);

        // Add each combination to the keepers list
        for (ICombinatoricsVector<Die> subSet : gen) {
            keepers.add(new Dice(subSet.getVector()));
        }

        // Cache the result
        allRollKeepers.put(roll, keepers);

        return keepers;
    }

    public synchronized static List<Dice> getRolls(Dice keepers) {
        // Check if the result is cached
        if (allKeepersRolls.containsKey(keepers)) return allKeepersRolls.get(keepers);

        // Setup the rolls list
        List<Dice> rolls = new ArrayList<Dice>();

        // Generate the remaining dice
        List<Dice> remDice = generateDice(5 - keepers.getSize());

        // Pad each set of remaining dice with the keepers
        for (Dice dice : remDice) {
            rolls.add(dice.addDice(keepers));
        }

        // Cache the result
        allKeepersRolls.put(keepers, rolls);

        return rolls;
    }

    public synchronized static List<Scorecard> getAllScorecards(int size) {
        // Check if the result is cached
        if (allScorecards.containsKey(size)) return allScorecards.get(size);

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

        // Store the scorecards
        allScorecards.put(size, scorecards);

        return scorecards;
    }

    private static List<Dice> generateDice(int size) {
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

}
