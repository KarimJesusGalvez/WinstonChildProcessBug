"use strict"
const logger = require("../Config/Loggers/LoggerFactory").createDefaultLogger(__filename)
const {execSync, exec} = require("node:child_process")

function exec_cmd (cmd, sync = true) {
    logger.log("info", "Starting " + (sync ? 'sync ': 'async ') + "task: " + cmd);
    try {
        if (sync) {return execSync( cmd, { stdio: 'inherit' } )}
        else {
            const { stdout, stderr } = exec(cmd, { stdio: 'inherit' })
            console.log(stdout)
            console.error(stderr)};
    }
    catch (error){ console.error("Error in exec_cmd: " + error) };
}

logger.log("info", "Running ChildRunner...");

const prechild = exec_cmd("node ./Runners/PreConfig", false);

logger.log("error", "Error in ChildRunner");

const postchild = exec_cmd("node ./Runners/PostConfig", false);