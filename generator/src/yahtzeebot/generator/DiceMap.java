package yahtzeebot.generator;

import yahtzeebot.game.Dice;

import java.util.Map;

public interface DiceMap {

    double getEV(Dice dice);

    Map<Dice, Double> getAll();

}
