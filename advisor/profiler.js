var commander = require('commander');
var simulator = require('./simulator');
var fs = require('fs');
var ProgressBar = require('progress');

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
var pbar = new ProgressBar('[:percent]:bar[100%] :etas', { total: commander.games });

// Run the specified number of games and get the scores
gameScores = [];
for (var i = 1; i <= commander.games; i++) {
    var score = simulator.simulate();
    pbar.tick();
    gameScores.push(score);
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

// Calculate the average and output the results
var sum = gameScores.reduce(function(a, b) { return a + b });
var avg = sum / gameScores.length;
console.log("Done. Simulated " + gameScores.length + " games with an average score of: " + avg);
