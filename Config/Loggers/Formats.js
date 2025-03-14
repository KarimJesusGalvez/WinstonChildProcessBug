const { combine, timestamp, label, printf, colorize} = require('winston').format;
const {cwd, title, pid} = require("node:process")

function getInfoFormat(options) { 
    const {level, message, label, timestamp} = options
    return `${timestamp.split(".")[0]} ${level}: [${label}]:- ${message}`;
}
function getErrorFormat(options) { 
    const {level, message, label, timestamp} = options
    return `${timestamp.split(".")[0]} ${level}: [${label}]:- ${message} from process ${title}(${pid})`;
}

function selectBaseFormat(level) {
    return printf(eval("get" + level[0].toUpperCase() + level.substring(1) + "Format"));
}

function getConsoleFormat(name, level) {
    return combine(
    label({ label: name }),
    timestamp(),
    colorize({colors: { debug: 'green', info: 'blue', warning: 'yellow', error: 'red' } }),
    selectBaseFormat(level));
}

function getFileFormat(name, level) {
    return combine(
    label({ label: name }),
    timestamp(),
    selectBaseFormat(level));
}

module.exports = {getFileFormat, getConsoleFormat, selectBaseFormat, getErrorFormat, getInfoFormat}