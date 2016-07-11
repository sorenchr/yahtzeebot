var _ = require('lodash');

var StateMap = function() {
    this.map = {};
};

function formatScorecard(scorecard) {
    return scorecard.map(x => x ? 1 : 0).join('');
}

StateMap.prototype.getEV = function(scorecard, upperScore) {
    scorecard = formatScorecard(scorecard);
    if (upperScore > 63) upperScore = 63;
    if (!(scorecard in this.map) || !(upperScore in this.map[scorecard])) return null;
    return this.map[scorecard][upperScore];
};

StateMap.prototype.addEV = function (scorecard, upperScore, ev) {
    scorecard = formatScorecard(scorecard);
    if (upperScore > 63) upperScore = 63;
    if (!(scorecard in this.map)) this.map[scorecard] = {};
    this.map[scorecard][upperScore] = ev;
};

StateMap.prototype.size = function() {
    var entries = 0;

    for (var scorecard in this.map) {
        entries += _.size(this.map[scorecard]);
    }

    return entries;
};

StateMap.prototype.toJSON = function() {
    return this.map;
};

StateMap.fromJSON = function(json) {
    var map = new StateMap();

    for (var scorecard in json) {
        var scorecardArray = scorecard.split('').map(x => x == 1 ? true : false);
        for (var upperScore in json[scorecard]) {
            map.addEV(scorecardArray, upperScore, json[scorecard][upperScore]);
        }
    }

    return map;
};

module.exports = StateMap;
