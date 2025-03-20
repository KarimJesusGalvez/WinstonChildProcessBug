const formats = require('../Config/Loggers/Formats');
const assert = require("assert");
const sinon = require("sinon");
const rewire = require("rewire");
const winston = require("winston");
const { ChangeLevelType } = require('../Config/Loggers/levels');


afterEach(() => {
    sinon.restore();
});

describe('Unit Formats', function () {
    it('getDebugFormat valid', function () {
        const formatOptions = {level: "debug", message: "msg", label: "path as label", timestamp: "date.time"}
        const format = formats.getDebugFormat(formatOptions);
        assert.equal("date debug: [path as label]:- msg from ", format.split("process")[0])
    });
    it('getInfoFormat valid', function () {
        const formatOptions = {level: "info", message: "msg", label: "path as label", timestamp: "date.time"}
        const format = formats.getInfoFormat(formatOptions);
        assert.equal(format, "date info: [path as label]:- msg")
    });
    it('getWarnFormat valid', function () {
        const formatOptions = {level: "warn", message: "msg", label: "path as label", timestamp: "date.time"}
        const format = formats.getWarnFormat(formatOptions);
        assert.equal("date warn: [path as label]:- msg from ", format.split("process")[0])
    });
    it('getErrorFormat', function () {
        const formatOptions = {level: "error", message: "msg", label: "path as label", timestamp: "date.time"}
        const format = formats.getErrorFormat(formatOptions);     
        assert.equal("date error: [path as label]:- msg from ", format.split("process")[0])
    });
}); 
describe('Unit get Formats', function () {

    it('select error base format', function () {
        const format = formats.selectBaseFormat("error");
        assert.equal(format.template, formats.getErrorFormat)    
    });
    it('select warn base format', function () {
        const format = formats.selectBaseFormat("warn");
        assert.equal(format.template, formats.getWarnFormat)    
    });
    it('select info base format', function () {
        const format = formats.selectBaseFormat("info");
        assert.equal(format.template, formats.getInfoFormat)    
    });
    it('select debug base format', function () {
        const format = formats.selectBaseFormat("debug");
        assert.equal(format.template, formats.getDebugFormat)    
    });
    it('getFileFormat', function () {
        const FormatsMod = rewire("../Config/Loggers/Formats.js");

        function mocked_combine () {
            assert.equal(arguments.length, 3)
            assert.deepEqual(arguments[0].options.label, "A")
            assert.equal(Object.keys(arguments[1].options).length, 0)
            assert.equal(arguments[2].template.name, formats.getInfoFormat.name)
            assert.equal(typeof arguments[2], typeof winston.format.printf())
        };
        FormatsMod.__with__({combine: mocked_combine})
        (function () {FormatsMod.getFileFormat("A", "info");});
    });

    it('getConsoleFormat', function () {
        const FormatsMod = rewire("../Config/Loggers/Formats.js");

        function mocked_combine () {
            assert.equal(arguments.length, 4)
            assert.deepEqual(arguments[0].options.label, "B")
            assert.equal(Object.keys(arguments[1].options).length, 0)
            assert.equal(arguments[2].options.colors.error, "bold red blackBG")
            assert.equal(arguments[3].template.name, formats.getErrorFormat.name)
            assert.equal(typeof arguments[3], typeof winston.format.printf())
        };
        FormatsMod.__with__({combine: mocked_combine})
        (function () {FormatsMod.getConsoleFormat("B", "error");});
    });
});
describe('Unit get Formats', function () {
    let tests = [
        {args: ["debug", ""]},
        {args: ["info", ""]},
        {args: ["warn", 1]},
        {args: ["error", 1]},
      ];
    
      tests.forEach(({args}) => {
        it(`can parse a ${typeof args[0]} level into a ${typeof args[1]} level`, function () {
            const newLevel = ChangeLevelType(args[0], args[1])
            assert.equal(typeof newLevel, typeof args[1])
            assert.equal(ChangeLevelType(newLevel, args[0]), args[0])
        });
      });
    tests = [
        {args: [999, ""]},
        {args: ["None", 1]}
      ];
      tests.forEach(({args}) => {

        it(`cannot parse an invalid ${typeof args[0]} into a ${typeof args[1]} level`, function () {
            const newLevel = ChangeLevelType(args[0], args[1])
            assert(newLevel === undefined)
            //assert.t(ChangeLevelType(newLevel, args[0]), args[0])
        });
    });
});
