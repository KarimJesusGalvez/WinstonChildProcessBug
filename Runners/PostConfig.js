const logger = require("../Config/Loggers/LoggerFactory").createDefaultLogger(__filename)

logger.log("info", "Running Postconfig...")
console.info("Preconfig stdin")
console.error("Preconfig stderr")
logger.log("error", "Error in PostConfig")