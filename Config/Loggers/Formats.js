const { combine, timestamp, label, printf, colorize } = require('winston').format;
const {cwd, title, pid} = require("node:process")

function getInfoFormat() { 
    return printf(({ level, message, label, timestamp }) => {
        return `${timestamp.split(".")[0]} ${level}: [${label}]:- ${message}`;
        }); 
}

function getErrorFormat() { 
  const stack_origin = (new Error().stack.split("\n")[1].trim().split(cwd())[1].replace(")", ""))
    return printf(({ level, message, label, timestamp}) => {
        return `${timestamp.split(".")[0]} ${level}: [${label}]:- ${message} from process ${title}(${pid})`;
    }); 
}

function selectBaseFormat(level) {
    return eval("get" + level[0].toUpperCase() + level.substring(1) + "Format()");
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

module.exports = {getFileFormat, getConsoleFormat}