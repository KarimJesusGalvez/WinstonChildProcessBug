const { combine, timestamp, label, printf, colorize} = require('winston').format;
const {cwd, title, pid} = require("node:process")

const colors = {
    styles: {bold: "bold", dim: "dim", italic: "italic", underline: "underline", inverse: "inverse", hidden:  "hidden",  strikethrough: "strikethrough"},
    foreground: {black: "black", red:"red", green:"green", yellow:"yellow", blue:"blue", magenta:"magenta", cyan:"cyan", white:"white", gray:"gray", grey:"grey"},
    background: {blackBG:"blackBG", redBG:"redBG", greenBG:"greenBG", yellowBG:"yellowBG", blueBG:"blueBG", magentaBG:"magentaBG", cyanBG:"cyanBG", whiteBG:"whiteBG"}
}

function infoColor(){
    return colors.styles.italic.concat(" ", colors.foreground.blue, " ", colors.background.blackBG)
}
function errorColor(){
    return colors.styles.bold.concat(" ", colors.foreground.red, " ", colors.background.blackBG)
}

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
    colorize({colors: { info: infoColor(), error: errorColor()} }),
    selectBaseFormat(level));
}

function getFileFormat(name, level) {
    return combine(
    label({ label: name }),
    timestamp(),
    selectBaseFormat(level));
}

module.exports = {getFileFormat, getConsoleFormat, selectBaseFormat, getErrorFormat, getInfoFormat}