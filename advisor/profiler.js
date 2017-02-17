var commander = require('commander');
var simulator = require('./simulator');
var fs = require('fs');
var ProgressBar = require('progress');
var _ = require('lodash');
var prettyMs = require('pretty-ms');
var StateMap = require('./statemap');
var jsonfile = require('jsonfile');

// Setup command-line arguments
commander
    .version('0.1')
    .option('-o, --output [value]', 'Output file path')
    .option('-g, --games <n>', 'Number of games', parseInt)
    .option('-s, --statemap <path>', 'Path to state map')
    .parse(process.argv);

// Verify arguments
if (!commander.games) writeAndExit('Please specify the number of games to simulate (-g)');
if (commander.games < 1) writeAndExit('Number of games must be 1 or greater');
if (!commander.statemap) writeAndExit('Please specify a path to a state map');

// Setup the simulator module
var stateMapJson = jsonfile.readFileSync(commander.statemap);
var stateMap = new StateMap(stateMapJson);
simulator.init({ stateMap: stateMap });

// Setup the ProgressBar
var pbar = new ProgressBar('[:percent]:bar[100%] :etas rem.', { total: commander.games });

// Run the specified number of games and get the output
var outputs = _.range(commander.games).map(x => simulateGame());

// Save result to disk if the user has requested it
if (commander.output) saveOutputToDisk(outputs);

// Notify the user that the simulation completed
console.log('Simulated ' + commander.games + ' games successfully');
console.log('Average score: ' + _.meanBy(outputs, (o) => o.score));
console.log('Average time pr. game simulation: ' + prettyMs(_.meanBy(outputs, (o) => o.runTime)));
console.log('Total simulation time: ' + prettyMs(_.sumBy(outputs, (o) => o.runTime)));
if(commander.output) console.log('Results saved to: ' + commander.output);

/**
 * Writes a message to the console and exists the process.
 * @private
 * @param msg {string} The message to write.
 */
function writeAndExit(msg) {
    console.log(msg);
    process.exit(1);
}

/**
 * Simulate a single game and return the results (score and runtime in milliseconds).
 * @private
 * @returns {{score: number, runTime: number}} The score and runtime of a single simulation.
 */
function simulateGame() {
    // Simulate the game and record the delta timespan
    var startTime = Date.now();
    var score = simulator.simulateGame();
    var endTime = Date.now();

    // Tick the progress bar
    pbar.tick();

    return { score: score, runTime: endTime - startTime };
}

/**
 * Saves a list of output objects to disk.
 * @private
 * @param output {Object[]} The list of output objects to save.
 */
function saveOutputToDisk(output) {
    var fileStream = fs.createWriteStream(commander.output);

    fileStream.on('error', function(err) {
        throw err;
    });

    // Write header and each entry in the game scores array
    fileStream.write("Game,Score\n");
    for (var i = 1; i <= output.length; i++) {
        fileStream.write(i + "," + output[i-1].score);
        if (i < output.length) fileStream.write('\n');
    }

    fileStream.end();
}


