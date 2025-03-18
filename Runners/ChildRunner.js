"use strict"
const logger = require("../Config/Loggers/LoggerFactory").createDefaultLogger(__filename)
const {execSync, exec} = require("node:child_process")

function exec_cmd (cmd, sync = true) {
    logger.log("info", "Starting " + (sync ? 'sync ': 'async ') + "task: " + cmd);
    try {
        if (sync) {return execSync( cmd, { stdio: 'inherit' } )}
        else {
            let child = exec(cmd, { stdio: 'inherit' });
            child.on('spawn', ()=> logger.log("info", 'async ' + "task: " + cmd  +" Started"));
            child.stdout.on('data', parseChildData);
            child.on('close', ()=> logger.log("info", 'async ' + "task: '" + cmd  +"' finished with code " + child.exitCode));
        };
    }
    catch (error){ console.error("Error in exec_cmd: " + error) };
}

function parseChildData(data) {
    data = data.replace("\n", "").replaceAll(/\[[0-9]?[0-9]m/g, "")
    console.info(`Received chunk ${data}`);
    //logger.log("info", `Received chunk ${data}`);
}

logger.log("info", "Running ChildRunner...");

const prechild = exec_cmd("node ./Runners/PreConfig", false);

logger.log("error", "Error in ChildRunner");

const postchild = exec_cmd("node ./Runners/PostConfig", false);