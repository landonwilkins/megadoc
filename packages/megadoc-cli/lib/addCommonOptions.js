const pkg = require('../package');

module.exports = function addCommonOptions(program) {
  program
    .version(pkg.version)
    .option('-c, --config [PATH]', 'path to megadoc config file', 'megadoc.conf.js')
    .option('-o, --output-dir [PATH]', 'directory to store generated documentation in')
    .option('--asset-root [PATH]', 'absolute path to the root directory from which all files should be located')
    .option('--tmp-dir [PATH]', 'directory to use for temporary files')
    .option('-v, --verbose', 'print diagnostic information')
    .option('--debug', 'print painful diagnostic information')
    .option('--strict', 'fail hard on documentation errors')
    .option('-j, --threads [COUNT]', 'number of threads to use for processing (1 means foreground)')
  ;

  return program;
}