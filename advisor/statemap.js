var StateMap = function() {
    this.map = {};
}

function getKey(scorecard, upperScore) {
    return scorecard.map(x => x ? 1 : 0).join('') + '|' + upperScore;
}

StateMap.prototype.getEV = function(scorecard, upperScore) {
    var key = getKey(scorecard, upperScore);
    return this.map[key];
}

StateMap.prototype.addEV = function (scorecard, upperScore, ev) {
    var key = getKey(scorecard, upperScore);
    this.map[key] = ev;
}

StateMap.prototype.toJSON = function() {
    return this.map;
}

StateMap.fromJSON = function(json) {
    var map = new StateMap();

    for (var key in json) {
        var keySplit = key.split('|');
        var scorecard = keySplit[0].split('');
        var upperScore = keySplit[1];
        map.addEV(scorecard, upperScore, json[key]);
    }

    return map;
}

module.exports = StateMap;
