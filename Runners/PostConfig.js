const logger = require("../Config/Loggers/LoggerFactory").createDefaultLogger(__filename)

logger.log("info", "Running Postconfig...")
logger.log("error", "Error in PostConfig")