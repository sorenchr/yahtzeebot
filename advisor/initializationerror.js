var util = require('util');

/**
 * Represents a module initialization error.
 * @param message {string} The message to display when thrown.
 * @constructor
 */
function InitializationError(message) {
    this.name = 'InitializationError';
    this.message = message;
    Error.captureStackTrace(this, InitializationError);
}

// Make ArgumentError inherit from the native Error class
util.inherits(InitializationError, Error);

module.exports = InitializationError;