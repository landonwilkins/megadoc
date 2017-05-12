const invariant = require('invariant');
const scanSources = require('./utils/scanSources');
const ConfigUtils = require('megadoc-config-utils');

// TODO: extract decorators
module.exports = function createCompilation(commonOptions, runOptions, source) {
  const processorEntry = ConfigUtils.getConfigurablePair(source.processor);
  const files = scanSources(source.pattern, source.include, source.exclude);
  const whitelistedFiles = runOptions.changedSources ?
    files.filter(x => runOptions.changedSources[x] === true) :
    files
  ;
  const paths = extractProcessingFunctionPaths(processorEntry);
  const processorOptions = paths.configureFnPath ?
    require(paths.configureFnPath)(processorEntry.options || {}) :
    processorEntry.options
  ;

  return {
    id: source.id, // TODO: auto-infer
    documents: null,
    files: whitelistedFiles,
    commonOptions: commonOptions,
    processor: paths,
    processorOptions,
    processorState: null,
    rawDocuments: null,
    refinedDocuments: null,
    renderOperations: null,
    renderedTree: null,
    stats: {},
    tree: null,
    treeOperations: null,
    logger: runOptions.logger,
  };
};

function extractProcessingFunctionPaths(processorEntry) {
  const spec = require(processorEntry.name);
  const hasAtomicParser = typeof spec.parseFnPath === 'string';
  const hasBulkParser = typeof spec.parseBulkFnPath === 'string';

  invariant(hasAtomicParser || hasBulkParser,
    "A processor must define either a parseFn or parseBulkFn parsing routine."
  );

  invariant(typeof spec.reduceFnPath === 'string',
    "A processor must define a reducing routine found in 'reduceFnPath'."
  );

  return {
    initFnPath: spec.initFnPath,
    configureFnPath: spec.configureFnPath,
    parseFnPath: spec.parseFnPath,
    parseBulkFnPath: spec.parseBulkFnPath,
    reduceFnPath: spec.reduceFnPath,
    reduceTreeFnPath: spec.reduceTreeFnPath,
    refineFnPath: spec.refineFnPath,
    renderFnPath: spec.renderFnPath,
    serializerOptions: spec.serializerOptions || {},
  };
}
