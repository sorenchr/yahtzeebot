var path = require('path');

// Setup the object that will contain all the public settings
var config = {
    get stateMap() {
        // Return the relative path to the statemap JSON file
        return path.resolve('', __dirname + '/statemap.json');
    }
};

module.exports = config;