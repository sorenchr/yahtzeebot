var validator = module.exports;

validator.isValidDice = function(dice) {
    if (!Array.isArray(dice)) return false;
    if (!dice.every(x => Number.isInteger(x))) return false;
    if (!dice.every(x => x >= 1 && x <= 6)) return false;
    return true;
};

validator.isValidRoll = function(roll) {
    if (!validator.isValidDice(roll)) return false;
    if (roll.length != 5) return false;
    return true;
};

validator.isValidCategory = function(category) {
    if (!Number.isInteger(category)) return false;
    if (category < 0 || category > 14) return false;
    return true;
};