package yahtzeebot.game;

/**
 * A six-sided die.
 */
public final class Die {

    private int faceValue;

    /**
     * Constructs a new Die with the given face value.
     * @param faceValue The face value of the die. A number between 1 and 6.
     */
    public Die(int faceValue) {
        if (faceValue < 1 || faceValue > 6) {
            throw new IllegalArgumentException("Face value must be between 1 and 6.");
        }

        this.faceValue = faceValue;
    }

    /**
     * Returns the face value of this die.
     * @return The face value of this die.
     */
    public int getFaceValue() {
        return faceValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Die die = (Die) o;

        return faceValue == die.faceValue;
    }

    @Override
    public int hashCode() {
        return faceValue;
    }

}