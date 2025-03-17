const logger = require("./Config/Loggers/LoggerFactory").createDefaultLogger(__filename)

logger.log("info", "Running main...")

const preconfig = require("./Runners/PreConfig")

logger.log("error", "Error in main")

const postconfig = require("./Runners/PostConfig")

