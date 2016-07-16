var util = require('util');

function ArgumentError(message) {
    this.name = 'ArgumentError';
    this.message = message;
    Error.captureStackTrace(this, ArgumentError);
}

util.inherits(ArgumentError, Error);

module.exports = ArgumentError;