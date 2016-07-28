package yahtzeebot.game;

public enum Category {

    ONES("Ones"),
    TWOS("Twos"),
    THREES("Threes"),
    FOURS("Fours"),
    FIVES("Fives"),
    SIXES("Sixes"),
    ONE_PAIR("One Pair"),
    TWO_PAIRS("Two Pairs"),
    THREE_OF_A_KIND("Three of a Kind"),
    FOUR_OF_A_KIND("Four of a Kind"),
    SMALL_STRAIGHT("Small Straight"),
    LARGE_STRAIGHT("Large Straight"),
    FULL_HOUSE("Full House"),
    CHANCE("Chance"),
    YAHTZEE("Yahtzee");

    private String name;

    Category(String name) {
        this.name = name;
    }

    public String toString() {
        return this.name;
    }

}