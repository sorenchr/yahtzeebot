package yahtzeebot.game;

public enum Category {

    ONES("Ones", 0),
    TWOS("Twos", 1),
    THREES("Threes", 2),
    FOURS("Fours", 3),
    FIVES("Fives", 4),
    SIXES("Sixes", 5),
    ONE_PAIR("One Pair", 6),
    TWO_PAIRS("Two Pairs", 7),
    THREE_OF_A_KIND("Three of a Kind", 8),
    FOUR_OF_A_KIND("Four of a Kind", 9),
    SMALL_STRAIGHT("Small Straight", 10),
    LARGE_STRAIGHT("Large Straight", 11),
    FULL_HOUSE("Full House", 12),
    CHANCE("Chance", 13),
    YAHTZEE("Yahtzee", 14);

    private String name;
    private int index;

    Category(String name, int index) {
        this.name = name;
        this.index = index;
    }

    public String getName() {
        return name;
    }

    public int getIndex() {
        return index;
    }

    public String toString() {
        return this.name;
    }

    public boolean isUpperCategory() {
        return index <= 6;
    }

}