package yahtzeebot.game;

import java.util.List;

public class Roll extends Dice {

    public Roll(List<Die> dice) {
        if (dice.size() != 5) {
            throw new IllegalArgumentException("Size of dice must be 5 for a roll.");
        }

        super(dice);
    }
}
