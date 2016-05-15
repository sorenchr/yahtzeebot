module.exports = (function() {

    var mod = {};
    var statemap;

    /**
     * Initializes the module.
     * @param conf An object containing the settings.
     */
    mod.init = function(conf) {
        if (!!conf.statemap) statemap = conf.statemap;
    };

    /**
     * Returns the best keepers to choose from the given game state.
     * @param scorecard The scorecard represented as a 15-integer array.
     * @param upperScore The upper score.
     * @param dice The 5 dice currently held by the player.
     * @param rollsLeft The number of rolls left before scoring.
     * @returns {Array.<number>} The best keepers to choose from the given game state.
     */
    mod.getBestKeepers = function(scorecard, upperScore, dice, rollsLeft) {
        rand = Math.floor((Math.random() * 5) + 1);
        return [0, 1, 2, 3, 4].slice(0, rand);
    };

    /**
     * Returns the best category to score in from the given game state.
     * @param scorecard The scorecard represented as a 15-integer array.
     * @param upperScore The upper score.
     * @param dice The 5 dice currently held by the player.
     * @returns {Number|number} The best category to score in from the given game state.
     */
    mod.getBestCategory = function(scorecard, upperScore, dice) {
        return scorecard.indexOf(0);
    };

    return mod;

})();
