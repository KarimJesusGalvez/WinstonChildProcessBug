const wLog = require("winston").Logger

function createLogger(level="info", transports) {
    console.info("Returning new Logger instance with level " + level)
    return new wLog({
        level: level,
        transports: transports,
    })
};

module.exports = {createLogger}