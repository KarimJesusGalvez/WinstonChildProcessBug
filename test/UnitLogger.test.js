const formats = require('../Config/Loggers/Formats');
const assert = require("assert");
const sinon = require("sinon");


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
        assert(format.template, formats.getErrorFormat)    
    });
    it('select info base format', function () {
        const format = formats.selectBaseFormat("info");
        assert(format.template, formats.getInfoFormat)    
    });
});