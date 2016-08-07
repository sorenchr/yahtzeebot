package yahtzeebot.game;

import org.apache.commons.collections4.CollectionUtils;

import java.util.*;

public class Dice {

    private List<Die> dice;
    private Map<Integer, Integer> cardinalityMap;

    public Dice(int... dice) {
        List<Die> diceList = new ArrayList<Die>();

        for (int i = 0; i < dice.length; i++) {
            diceList.add(new Die(dice[i]));
        }

        this.dice = Collections.unmodifiableList(diceList);
        generateCardinalityMap();
    }

    public Dice(List<Die> dice) {
        this.dice = Collections.unmodifiableList(dice);
        generateCardinalityMap();
    }

    public int getNumberOfDice(int faceValue) {
        if (cardinalityMap.containsKey(faceValue)) return cardinalityMap.get(faceValue);
        return 0;
    }

    private void generateCardinalityMap() {
        Map<Die, Integer> dieCardinalityMap = CollectionUtils.getCardinalityMap(this.dice);
        Map<Integer, Integer> fvCardinalityMap = new HashMap<Integer, Integer>();
        for (Map.Entry<Die, Integer> entry : dieCardinalityMap.entrySet()) {
            fvCardinalityMap.put(entry.getKey().getFaceValue(), entry.getValue());
        }
        this.cardinalityMap = Collections.unmodifiableMap(fvCardinalityMap);
    }

    public Map<Integer, Integer> getCardinalityMap() {
        return cardinalityMap;
    }

    public int getSize() {
        return dice.size();
    }

    public int getSum() {
        int sum = 0;

        for (Die die : dice) {
            sum += die.getFaceValue();
        }

        return sum;
    }

    public List<Die> getDiceAsList() {
        return dice;
    }

    public Dice withDice(Dice dice) {
        List<Die> newDice = new ArrayList<Die>(this.dice);
        newDice.addAll(dice.getDiceAsList());
        return new Dice(newDice);
    }

    public Dice withoutDice(Dice dice) {
        Collection<Die> subtracted = CollectionUtils.subtract(this.dice, dice.dice);
        List<Die> newDices = new ArrayList<Die>(subtracted);
        return new Dice(newDices);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Dice dice1 = (Dice) o;

        return cardinalityMap.equals(dice1.getCardinalityMap());
    }

    @Override
    public int hashCode() {
        return cardinalityMap.hashCode();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Dice [");

        for (Die die : dice) {
            sb.append(die.getFaceValue() + ",");
        }

        sb.deleteCharAt(sb.length() - 1);
        sb.append("]");

        return sb.toString();
    }
}
