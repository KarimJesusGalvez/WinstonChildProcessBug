"use strict"
const logger = require("../Config/Loggers/LoggerFactory").createDefaultLogger(__filename)
const {execSync, exec} = require("node:child_process")
const {pid, title} = require("node:process")

function exec_cmd (cmd, sync = true) {
    logger.log("info", "Starting " + (sync ? 'sync ': 'async ') + "task: " + cmd);
    try {
        if (sync) {return execSync( cmd, { stdio: 'inherit' } )}
        else {
            let child = exec(cmd, { stdio: 'inherit' });
            child.on('spawn', ()=> logger.log("debug", "async task: '".concat(cmd, "' Started from main process ", pid, ": ", title)));
            child.stdout.on('data', parseChildData);
            child.on('close', ()=> logger.log("info", "async task: '".concat(cmd,"' finished with code ",child.exitCode)));
        };
    }
    catch (error){ console.error("Error in exec_cmd: " + error) };
}

function parseChildData(data) {
    data = data.replace("\n", "")
    if (data.search("error") > -1) {
        data = data.replaceAll(/\[[0-9]?[0-9]m/g, "")
        logger.log("error", `Received error in main process ${data}`);
    }
    else { console.info(`Received chunk in main process: ${data}`); }
}

logger.log("info", "Running ChildRunner...");

const prechild = exec_cmd("node ./Runners/PreConfig", false);

logger.log("error", "Error in ChildRunner");

const postchild = exec_cmd("node ./Runners/PostConfig", false);