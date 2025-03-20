const {getConsoleFormat, getFileFormat} = require("./Formats")
const w_transport = require("winston").transports
const {cwd, pid, ppid} = require("node:process")
const sep = require("node:path").sep
const levels = require("./levels")

function get_label(filepath) { return filepath.replace(".js", "").replace(cwd(), "") }


function createConsoleTransport(filepath, level='info'){
    const format = getConsoleFormat(filepath.replace(cwd(), "").replace(".js", ""), level)
    return new w_transport.Console({level: level, format: format});
}

function createFileTransport(filepath, level='info', basePath){
    writeFile = basePath + sep + "Global_" + level +  "_pid_" + pid + "_" + ppid + ".log"
    return new w_transport.File({filename: writeFile, level:level, format: getFileFormat(get_label(filepath), level)});
  };

function generateDefaultTransports(filePath, level="info", basePath=cwd() + sep + "Reports") {
  let transports = [];
    transports.push(createConsoleTransport(filePath, level));
    transports.push(createFileTransport(filePath, level, basePath));
  if (levels.ChangeLevelType(level, 1) < levels.ChangeLevelType("debug", 1)) {
    transports.push(createFileTransport(filePath, "debug", basePath));
  }
  return transports
}

module.exports = {createConsoleTransport, createFileTransport, generateDefaultTransports}