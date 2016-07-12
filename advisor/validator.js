var validator = module.exports;

validator.isValidDice = function(dice) {
    if (!Array.isArray(dice)) return false;
    if (!dice.every(x => Number.isInteger(x))) return false;
    if (!dice.every(x => x >= 1 && x <= 6)) return false;
    return true;
};