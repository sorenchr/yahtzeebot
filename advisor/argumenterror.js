var util = require('util');

/**
 * Represents an input argument validation error.
 * @param message The message to display when thrown.
 * @constructor
 */
function ArgumentError(message) {
    this.name = 'ArgumentError';
    this.message = message;
    Error.captureStackTrace(this, ArgumentError);
}

// Make ArgumentError inherit from the native Error class
util.inherits(ArgumentError, Error);

module.exports = ArgumentError;