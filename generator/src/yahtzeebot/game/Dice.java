package yahtzeebot.game;

import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Dice {

    private List<Die> dice;
    private Map<Die, Integer> cardinalityMap;

    public Dice(List<Die> dice) {
        this.dice = dice;
        cardinalityMap = CollectionUtils.getCardinalityMap(this.dice);
    }

    public int getNumberOfDice(int faceValue) {
        return cardinalityMap.get(faceValue);
    }

    public Map<Die, Integer> getCardinalityMap() {
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

    public List<Die> getDice() {
        return dice;
    }

    public Dice addDice(Dice dice) {
        List<Die> newDice = new ArrayList<Die>(this.dice);
        newDice.addAll(dice.getDice());
        return new Dice(newDice);
    }

    public Dice subtractDice(Dice dice) {
        List<Die> newDices = new ArrayList(CollectionUtils.subtract(this.dice, dice.dice));
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

}
