const {getConsoleFormat, getFileFormat} = require("./Formats")
const w_transport = require("winston").transports
const {cwd, pid, ppid} = require("node:process")
const sep = require("node:path").sep

function get_label(filepath) { return filepath.replace(".js", "").replace(cwd(), "") }


function createConsoleTransport(filepath, level='info'){
    const format = getConsoleFormat(filepath.replace(cwd(), "").replace(".js", ""), level)
    return new w_transport.Console({level: level, format: format});
}

function createFileTransport(filepath, level='info', basePath){
    writeFile = basePath + sep + "Global_" + level +  "_pid_" + pid + "_" + ppid + ".log"
    return new w_transport.File({filename: writeFile, level:level, format: getFileFormat(get_label(filepath), level)});
  };

module.exports = {createConsoleTransport, createFileTransport}