var ArgumentError = function(message) {
    this.name = 'ArgumentError';
    this.message = message;
};

ArgumentError.prototype.toString = function() {
    return this.name + ': ' + this.message;
};

module.exports = ArgumentError;