package yahtzeebot.game;

import org.apache.commons.collections4.CollectionUtils;

import java.util.*;

public class Scorecard {

    private Set<Category> markedCategories;

    public Scorecard(Collection<Category> markedCategories) {
        this.markedCategories = new HashSet<Category>(markedCategories);
    }

    public Scorecard(Category[] markedCategories) {
        this.markedCategories = new HashSet<Category>(Arrays.asList(markedCategories));
    }

    public Scorecard withMarkedCategory(Category category) {
        Set<Category> newMarkedCategories = new HashSet<Category>(markedCategories);
        newMarkedCategories.add(category);
        return new Scorecard(newMarkedCategories);
    }

    public List<Category> getUnmarkedCategories() {
        return new ArrayList(CollectionUtils.subtract(Arrays.asList(Category.values()), markedCategories));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Scorecard scorecard = (Scorecard) o;

        return markedCategories.equals(scorecard.markedCategories);
    }

    @Override
    public int hashCode() {
        return markedCategories.hashCode();
    }

}
