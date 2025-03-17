const formats = require('../Config/Loggers/Formats');
const assert = require("assert");
const sinon = require("sinon");
const rewire = require("rewire");
const winston = require("winston");


afterEach(() => {
    sinon.restore();
  });

describe('Unit Formats', function () {

    it('getInfoFormat valid', function () {
        const formatOptions = {level: "info", message: "msg", label: "path as label", timestamp: "date.time"}
        const format = formats.getInfoFormat(formatOptions);
        assert.equal(format, "date info: [path as label]:- msg")
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
    it('select info base format', function () {
        const format = formats.selectBaseFormat("info");
        assert.equal(format.template, formats.getInfoFormat)    
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
            assert.equal(arguments[2].options.colors.error, "red")
            assert.equal(arguments[3].template.name, formats.getErrorFormat.name)
            assert.equal(typeof arguments[3], typeof winston.format.printf())
        };
        FormatsMod.__with__({combine: mocked_combine})
        (function () {FormatsMod.getConsoleFormat("B", "error");});
    });
});