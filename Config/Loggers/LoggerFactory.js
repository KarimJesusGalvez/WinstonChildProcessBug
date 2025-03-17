const wLog = require("winston").Logger
const sep = require("node:path").sep
const cwd = require("node:process").cwd
const {createConsoleTransport, createFileTransport} = require("./Transports")

function createLogger(level="info", transports) {
    console.info("Returning new Logger instance with level " + level)
    return new wLog({
        level: level,
        transports: transports,
    })
};
function createDefaultLogger(filepath, level = "info") {
    return createLogger(level, [createConsoleTransport(filepath, level), createFileTransport(filepath, level, cwd() + sep + "Reports")])
};

module.exports = {createLogger, createDefaultLogger}