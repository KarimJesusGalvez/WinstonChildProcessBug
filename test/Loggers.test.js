const { mkdirSync, rmSync} = require('node:fs');
const {pid, ppid} = require('node:process');
const {resolve, sep} = require("node:path")
const formats = require('../Config/Loggers/Formats');
const transports = require('../Config/Loggers/Transports');
const factory = require('../Config/Loggers/LoggerFactory');
const w_logger = require('winston').Logger;
const w_transports = require('winston').transports;
const assert = require("assert");
const rimraf = require("rimraf").manualSync


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
                {args: ["A/Path/To/File", "info"]},
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

describe('Trasports', function () {

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
        before(function () {
          mkdirSync("./test/.TempFilesTrasport", { recursive: true } )
        });
        const tests = [
            {args: ["PathTo/MsgOrigin", "info", resolve(__dirname + "/.TempFilesTrasport")]},
            {args: ["PathTo/MsgOrigin", "error", resolve(__dirname + "/.TempFilesTrasport")]}
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
          after(function () {
            rimraf("./test/.TempFilesTrasport")
          });
      });
  });

  describe('LoggerFactory', function () {

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
});