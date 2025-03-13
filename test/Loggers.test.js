var formats = require('../Config/Loggers/Formats');
var assert = require("assert");


describe('Formats', function () {

  describe('CreateConsoleFormat', function () {
    const tests = [
        {args: ["A/Path/To/File", "info", ]},
        {args: ["A/Path/To/File", "error"]}
      ];
    
      tests.forEach(({args}) => {
        it(`can generate an ${args[1]} console format with a path`, function () {
            const format = formats.getConsoleFormat(...args);
            assert(format.Format, "function")
        });
      });
    });
    describe('CreateFileFormat', function () {
        const tests = [
                {args: ["A/Path/To/File", "info", ]},
                {args: ["A/Path/To/File", "error"]}
        ];
        tests.forEach(({args}) => {
            it(`can generate an ${args[1]} file format with a path`, function () {
                const format = formats.getFileFormat(...args);
                assert(format.Format, "function")
            });
        });
    });
});


// it("calls callback with deserialized data", function () {
//     var callback = sinon.fake();
//     getTodos(42, callback);
  
//     // This is part of the FakeXMLHttpRequest API
//     server.requests[0].respond(
//       200,
//       { "Content-Type": "application/json" },
//       JSON.stringify([{ id: 1, text: "Provide examples", done: true }]),
//     );
  
//     assert(callback.calledOnce);
//   });