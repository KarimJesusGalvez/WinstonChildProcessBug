const {mkdirSync, statSync} = require('node:fs');
const {pid, ppid} = require('node:process');
const {resolve, sep} = require("node:path")
const {getConsoleFormat, getFileFormat} = require('../Config/Loggers/Formats');
const transports = require('../Config/Loggers/Transports');
const factory = require('../Config/Loggers/LoggerFactory');
const w_logger = require('winston').Logger;
const w_transports = require('winston').transports;
const assert = require("assert");
const rimraf = require("rimraf").windowsSync
const testTempFilePath = resolve(__dirname + sep + "__TestTempFiles")
const {level} = require("../Config/Loggers/levels")

describe('Acceptance Formats', function () {

  describe('CreateConsoleFormat', function () {
    const tests = [
        {args: ["A/Path/To/File", "info", ]},
        {args: ["A/Path/To/File", "error"]}
      ];
    
      tests.forEach(({args}) => {
        it(`can generate an ${args[1]} console format with a path`, function () {
            const format = getConsoleFormat(...args);
            assert(format.Format, "function")
        });
      });
    });
    describe('CreateFileFormat', function () {
        const tests = [
                {args: ["A/Path/To/File", "info"]},
                {args: ["A/Path/To/File", "error"]}
        ];
        tests.forEach(({args}) => {
            it(`can generate an ${args[1]} file format with a path`, function () {
                const format = getFileFormat(...args);
                assert(format.Format, "function")
            });
        });
    });
});

describe('Acceptance Trasports', function () {

    describe('CreateConsoleTransport', function () {
      const tests = [
          {args: ["A/Path/To/File", "info", ]},
          {args: ["A/Path/To/File", "error"]}
        ];
      
        tests.forEach(({args}) => {
          it(`can generate an ${args[1]} console format with a path`, function () {
              const transport = transports.createConsoleTransport(...args);
              assert(typeof transport, typeof w_transports.Console)
              assert(transport.level, args[1]);
          });
        });
      });
      describe('CreateFileTransport', function () {
        const tests = [
            {args: ["PathTo/MsgOrigin", "info", testTempFilePath]},
            {args: ["PathTo/MsgOrigin", "error", testTempFilePath]}
          ];
          tests.forEach(({args}) => {
              it(`can generate an ${args[1]} file format with a path`, function () {
                  const transport = transports.createFileTransport(...args);
                  transport.close();
                  assert(typeof transport, typeof w_transports.File)
                  assert(transport.level, args[1]);
                  assert(transport.dirname, args[2])
                  assert(transport.filename,  "Global_" + args[1] +  "_pid_" + pid + "_" + ppid + ".log")
                });
          });
      });
      describe("CreateDefaultTransport", function () {
        describe("CreateDefault<Debug", function () {
          const tests = [
            { args: ["PathTo/MsgOrigin", "debug", testTempFilePath] },
            // TODO  { args: ["PathTo/MsgOrigin", "silly", testTempFilePath] },
          ];
          tests.forEach(({ args }) => {
            it(`can create default transports for level ${args[1]}`, function () {
              const transport = transports.generateDefaultTransports(...args);
              assert.equal(transport.length, 2);
              transport.forEach((t) =>
                assert.match(t.level, new RegExp(`${args[1]}`))
              );
            });
          });
        });

        describe("CreateDefault>Debug", function () {
          const tests = [
            { args: ["PathTo/MsgOrigin", "error", testTempFilePath] },
            { args: ["PathTo/MsgOrigin", "info", testTempFilePath] },
          ];
          tests.forEach(({ args }) => {
            it(`can create default transports for level ${args[1]} and add a debug file transport`, function () {
              const transport = transports.generateDefaultTransports(...args);
              assert.equal(transport.length, 3);
              transport.forEach((t) =>
                assert.match(t.level, new RegExp(`${args[1]}||debug`))
              );
            });
          });
        });
      });
  });

describe('Acceptance LoggerFactory', function () {
  before(function () {
    mkdirSync(testTempFilePath, { recursive: true } )
  });
  
  describe('CreateLogger', function () {
    const tests = [
        {args: ["info", []]},
        {args: ["error", []]}
      ];
    
      tests.forEach(({args}) => {
        it(`can create a ${args[0]} logger with ${args[1].length} transporters`, function () {
            const logger = factory.createLogger(...args);
            logger.close();
            assert(typeof logger, typeof w_logger)
            assert(logger.level, args[0]);
        });
      });
    });
    it(`can generate a default logger`, function () {
      const logger = factory.createDefaultLogger("testOrigin");
      logger.close();
      assert(typeof logger, typeof w_logger)
      assert(logger.level, "info");

    });
  describe('LogMsg to console', function () {
    const tests = [
        {args: ["info", [transports.createConsoleTransport("A/Path/To/File", "info")]]},
        {args: ["error", [transports.createConsoleTransport("A/Path/To/File", "error")]]}
      ];
    
      tests.forEach(({args}) => {
        it(`can log a ${args[0]} message in a console logger with ${args[1].length} transporters`, function () {
            const logger = factory.createLogger(...args);
            logger.log(args[0], args[0] + " msg")
            logger.close();
            assert(typeof logger, typeof w_logger)
            assert(logger.level, args[0]);
        });
      });

      // TODO test with 2 transports: <level, > level, === level
    });
    describe('LogMsg to File', function () {
      const tests = [
          {args: ["info", [transports.createFileTransport("PathTo/MsgOrigin", "info", testTempFilePath)]]},
          {args: ["error", [transports.createFileTransport("PathTo/MsgOrigin", "error", testTempFilePath)]]}
        ];
      
        tests.forEach(({args}) => {
          it(`can log a ${args[0]} message in a file logger with ${args[1].length} transporters`, function () {
              const filename = "Global_" + args[0] +  "_pid_" + pid + "_" + ppid + ".log"
              
              const logger = factory.createLogger(...args);
              logger.log(args[0], args[0] + " msg")
              logger.transports.forEach((t)=> {t.close();})
              
              assert(typeof logger, typeof w_logger)
              assert(logger.level, args[0]);
              assert(typeof logger.transports[0], typeof w_transports.File)
              assert(logger.transports[0].level, args[1]);
              assert(logger.transports[0].dirname, args[2])
              assert(logger.transports[0].filename, filename)
              assert(statSync(testTempFilePath + sep + filename).size > 0);
          });
        });
      });
  // TODO test with 2 transports: <level, > level, === level
  after(function () {
    try{rimraf(testTempFilePath);}catch{}
  });
});
