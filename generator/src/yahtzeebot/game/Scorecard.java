package yahtzeebot.game;

import org.apache.commons.collections4.CollectionUtils;

import java.util.*;

public class Scorecard {

    private Set<Category> markedCategories;

    public Scorecard(Collection<Category> markedCategories) {
        this.markedCategories = Collections.unmodifiableSet(new HashSet<Category>(markedCategories));
    }

    public Scorecard(Category... markedCategories) {
        this.markedCategories = Collections.unmodifiableSet(new HashSet<Category>(Arrays.asList(markedCategories)));
    }

    public Scorecard withMarkedCategory(Category category) {
        Set<Category> newMarkedCategories = new HashSet<Category>(markedCategories);
        newMarkedCategories.add(category);
        return new Scorecard(newMarkedCategories);
    }

    public Set<Category> getMarkedCategories() {
        return markedCategories;
    }

    public Set<Category> getUnmarkedCategories() {
        List<Category> allCategories = Arrays.asList(Category.values());
        Collection<Category> subtracted = CollectionUtils.subtract(allCategories, markedCategories);
        return new HashSet<Category>(subtracted);
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
