# yahtzeebot

This is a pet project providing a fully functional optimal strategy for Yahtzee. The project contains two main subprojects:

* *advisor* - An optimal strategy implementation in JavaScript providing two central API methods for playing optimal Yahtzee: What dice should I keep from my previous roll? And, what category should I score in?
* *generator* - A command-line program written in Java that creates a map of entry states (the beginning state of a round before any rolls) for each round from 1 to 15 and their associated expected value (EV). The map is essential to the advisor since it provides a cache of EV's, saving the advisor a massive amount of calculations.

The project is largely based on James Glenn's paper "[An optimal strategy for Yahtzee](http://www.cs.loyola.edu/~jglenn/research/optimal_yahtzee.pdf)".

## advisor

A package of JavaScript modules with the main **advisor** module providing optimal strategy advice. The package is supported by a full test suite and several helpful Gulp targets. 
Throughout the package a number of terms are used which represent game states or objects:

* *roll* and *keepers* are sets of dice represented by a numeric array: `[6,2,3,3,5]`
* *scorecard* is a boolean array of size 15 representing which categories has been marked
* *category* is an integer between 0 and 14 representing the following score categories: 
    * 0 to 5 - Number of dices with face value 1 - 6.
    * 6 - One pair
    * 7 - Two pairs
    * 8 - Three of a kind
    * 9 - Four of a kind
    * 10 - Small straight
    * 11 - Large straight
    * 12 - Full house
    * 13 - Chance
    * 14 - Yahtzee

### Basic usage

```sh
> var advisor = require('./advisor');
> var sm = require('../statemap.json');

> advisor.init({stateMap: sm});

> var scorecard = new Array(15).fill(false); // empty scorecard
> var upperScore = 0;
> var dice = [3,3,3,3,5];
> var rollsLeft = 2;

> advisor.getBestCategory(scorecard, upperScore, dice);
2

> advisor.getBestKeepers(scorecard, upperScore, dice, rollsLeft);
[3,3,3,3]
```

### Install

Install all dependencies by running NPM:

```sh
$ npm install
```

### Test

A full test suite (including test coverage) is available and may be run through Gulp:

```sh
$ gulp test
$ gulp coverage
```

Mocha is used for running the tests suites and Istanbul is used for test coverage.

### Docs

Each module is documented using JSDoc 3, to generate documentation use Gulp:

```sh
$ gulp docs
```

### Build

The entire package may be compiled into a single-file module (with the advisor module as the entry point):

```sh
$ gulp build
```

The resulting advisor module will be written to `out/`

### Clean directories

The `out/`, `docs/` and `coverage/` directories can easily be deleted with:

```sh
$ gulp clean
```

### Profiler

The package also contains a profiler that uses the advisor module on simulated games. Run the profiler through Node.JS:

```sh
$ node profiler.js -g 10
[100%]==========[100%] 0.0s rem.
Simulated 10 games successfully
Average score: 277.5
Average time pr. game simulation: 4.4s
Total simulation time: 44s
```

Internally the profiler uses the simulator module, you can create your own command-line script that uses this module if you require some additional functionality.

### Advisor API

#### init(initSettings)

Initializes the module with the given settings. The method expects a settings object containing a `stateMap` entry with a `StateMap` object as value.

As of right now the generator module is still under development, so you should use the statemap.json file provided.

#### getBestKeepers(scorecard, upperScore, dice, rollsLeft)

Returns the best set of keepers from the current dice from the given game state.

#### getBestCategory(scorecard, upperScore, dice)

Returns the best category to score in from the given game state.

## Copyright and license

Code copyright 2017 Søren Qvist Christensen. Code released under [the MIT license](https://github.com/sorenchr/yahtzeebot/blob/master/LICENSE).

