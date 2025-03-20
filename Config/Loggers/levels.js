const levels = {
    "error": 0,
    "warn": 1,
    "info": 2,
    "http": 3,
    "verbose": 4,
    "debug": 5,
    "silly": 6
}
const levels_int = [
    "error",
    "warn",
    "info",
    "http",
    "verbose",
    "debug",
    "silly"
]
function ChangeLevelType(level, returnType) {
    if (typeof returnType === "number" && typeof level === "number") {return level}
    else if (typeof returnType === "number" && typeof level === "string") {return levels[level]}
    else if (typeof returnType === "string" && typeof level === "string") {return level}
    else if (typeof returnType === "string" && typeof level === "number") {return levels_int[level]}
    else {throw Error(`Cannot parse ${level} (${typeof level }) as ${returnType} (${typeof returnType })`)}
}

module.exports = {levels, levels_int, ChangeLevelType}