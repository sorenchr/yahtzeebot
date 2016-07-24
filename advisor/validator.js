var validator = module.exports;

/**
 * Checks if the given die is an integer between 1 and 6.
 * @param die The die to check.
 * @returns {boolean} True if the die is valid, false otherwise.
 */
validator.isValidDie = function(die) {
    if (!Number.isInteger(die)) return false;
    if (die < 1 || die > 6) return false;
    return true;
};

/**
 * Checks if the given dice is an array containing valid dice.
 * @param dice The dice to check.
 * @returns {boolean} True if the dice are valid, false otherwise.
 */
validator.isValidDice = function(dice) {
    if (!Array.isArray(dice)) return false;
    if (!dice.every(x => Number.isInteger(x))) return false;
    if (!dice.every(x => x >= 1 && x <= 6)) return false;
    return true;
};

/**
 * Checks if the given roll is an array of size 5 containing valid dice.
 * @param roll The roll to check.
 * @returns {boolean} True if the roll is valid, false otherwise.
 */
validator.isValidRoll = function(roll) {
    if (!validator.isValidDice(roll)) return false;
    if (roll.length != 5) return false;
    return true;
};

/**
 * Checks if the given category is an integer between 0 and 14.
 * @param category The category to check.
 * @returns {boolean} True if the category is valid, false otherwise.
 */
validator.isValidCategory = function(category) {
    if (!Number.isInteger(category)) return false;
    if (category < 0 || category > 14) return false;
    return true;
};

/**
 * Checks if the given scorecard is an array of size 15 with boolean values.
 * @param scorecard The scorecard to check.
 * @returns {boolean} True if the scorecard is valid, false otherwise.
 */
validator.isValidScorecard = function(scorecard) {
    if (!Array.isArray(scorecard)) return false;
    if (!scorecard.every(x => typeof x === 'boolean')) return false;
    if (scorecard.length != 15) return false;
    return true;
};

/**
 * Checks if the given upper score is a positive integer (0 also allowed).
 * @param upperScore The upper score to check.
 * @returns {boolean} True if the upper score is valid, false otherwise.
 */
validator.isValidUpperScore = function(upperScore) {
    if (!Number.isInteger(upperScore)) return false;
    if (upperScore < 0) return false;   
    return true;
};

/**
 * Checks if the given EV is a positive number between 0 and 63.
 * @param ev The EV to check.
 * @returns {boolean} True if the EV is valid, false otherwise.
 */
validator.isValidEV = function(ev) {
    if (typeof ev !== 'number') return false;
    if (isNaN(ev)) return false;
    if (ev < 0) return false;
    if (ev > 404) return false;
    return true;
};