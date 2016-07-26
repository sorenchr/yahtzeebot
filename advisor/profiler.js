var commander = require('commander');
var simulator = require('./simulator');
var fs = require('fs');
var ProgressBar = require('progress');
var _ = require('lodash');
var prettyMs = require('pretty-ms');

// Setup command-line arguments
commander
    .version('0.1')
    .option('-o, --output [value]', 'Output file path')
    .option('-g, --games <n>', 'Number of games', parseInt)
    .parse(process.argv);

// Verify arguments
if (!commander.games) {
    console.log("Error. Please specify the number of games to simulate.");
    process.exit(1);
}

if (commander.games < 1) {
    console.log("Error. Please enter a positive number of games to simulate.");
    process.exit(1);
}

// Setup the ProgressBar
var pbar = new ProgressBar('[:percent]:bar[100%] :etas rem.', { total: commander.games });

// Run the specified number of games and get the scores
var gameScores = [];
var gameRunningTimes = [];
for (var i = 1; i <= commander.games; i++) {
    var startTime = Date.now();
    var score = simulator.simulate();
    var endTime = Date.now();

    pbar.tick();

    gameScores.push(score);
    gameRunningTimes.push(endTime - startTime);
}

// Save result to disk if the user has requested it
if (commander.output) {
    var fileStream = fs.createWriteStream(commander.output);

    fileStream.on('error', function(err) {
        throw err;
    });

    // Write header and each entry in the game scores array
    fileStream.write("Game,Score\n");
    for (var i = 1; i <= gameScores.length; i++) {
        fileStream.write(i + "," + gameScores[i-1]);
        if (i < gameScores.length) fileStream.write('\n');
    }

    fileStream.end();
}

console.log('Simulated ' + commander.games + ' games successfully');
console.log('Average score: ' + _.mean(gameScores));
console.log('Average time pr. game simulation: ' + prettyMs(_.mean(gameRunningTimes)));
console.log('Total simulation time: ' + prettyMs(_.sum(gameRunningTimes)));
if(commander.output) console.log('Results saved to: ' + commander.output);
