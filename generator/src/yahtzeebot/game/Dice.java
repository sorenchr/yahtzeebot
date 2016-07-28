package yahtzeebot.game;

import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Dice {

    private List<Die> dice;

    public Dice(int... dice) {
        this.dice = new ArrayList<Die>();
        for (int i = 0; i < dice.length; i++) {
            this.dice.add(new Die(dice[i]));
        }
    }

    public Dice(List<Die> dice) {
        this.dice = dice;
    }

    public int getNumberOfDice(int faceValue) {
        int numberOfDice = 0;

        for (Die die : dice) {
            if (die.getFaceValue() == faceValue) numberOfDice++;
        }

        return numberOfDice;
    }

    public Map<Die, Integer> getCardinalityMap() {
        return CollectionUtils.getCardinalityMap(dice);
    }

    public int getSize() {
        return dice.size();
    }

    public List<Die> getDice() {
        return dice;
    }

    public boolean contains(Dice dice) {
        return CollectionUtils.isSubCollection(dice.getDice(), this.dice);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Dice dice1 = (Dice) o;

        return dice.equals(dice1.dice);
    }

    @Override
    public int hashCode() {
        return dice.hashCode();
    }

}
