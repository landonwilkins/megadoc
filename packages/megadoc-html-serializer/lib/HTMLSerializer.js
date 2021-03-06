const R = require('ramda');
const AssetUtils = require('./AssetUtils');
const ClientSandbox = require('./emit/ClientSandbox');
const NodeURIDecorator = require('./NodeURIDecorator');
const createAssets = require('./createAssets');
const render = require('./render');
const emit = require('./emit');
const purge = require('./purge');
const renderRoutines = require('./renderRoutines');
const defaults = require('./config');
const { extractSummary } = require('megadoc-markdown-utils');

/**
 * @module HTMLSerializer
 *
 * @param {js__megadoc-compiler/Config} compilerConfig
 * @param {Object} userSerializerOptions
 */
function HTMLSerializer(compilerConfig, userSerializerOptions = {}, deps) {
  this.compilerConfig = compilerConfig;
  this.assetUtils = new AssetUtils(this.compilerConfig);
  this.config = Object.assign({},
    defaults,
    R.omit([ 'layoutOptions' ], userSerializerOptions),
    userSerializerOptions.layoutOptions
  );
  this.corpusVisitor = NodeURIDecorator(this.config);

  this.state = {
    assets: null,
    clientSandbox: deps && deps.clientSandbox || new ClientSandbox(this.config),
  };
};

HTMLSerializer.prototype.renderRoutines = renderRoutines;
HTMLSerializer.prototype.renderOne = function(node) {
  const summary = extractSummaryForNode(node);

  if (summary) {
    return R.merge(node, { summary });
  }
  else {
    return node;
  }
};

HTMLSerializer.prototype.start = function(compilations, done) {
  this.state.assets = createAssets(this.config, this.compilerConfig, compilations);
  this.state.clientSandbox.start(this.state.assets, done);
};

HTMLSerializer.prototype.seal = function(withTrees, done) {
  render({ serializer: this, compilations: withTrees }, function(err, result) {
    if (err) {
      done(err)
    }
    else {
      done(null, {
        compilations: withTrees,
        renderedCorpus: result.renderedCorpus,
        edgeGraph: result.edgeGraph,
      })
    }
  });
};

HTMLSerializer.prototype.emit = function(withCorpus, done) {
  const { compilations, renderedCorpus } = withCorpus;

  emit({ serializer: this, compilations, renderedCorpus, }, function(err) {
    done(err, withCorpus);
  });
};

HTMLSerializer.prototype.purge = function(corpusInfo, done) {
  purge({ serializer: this, corpusInfo }, function(err) {
    done(err, corpusInfo);
  });
};

HTMLSerializer.prototype.stop = function(done) {
  if (!this.state.clientSandbox) {
    return done();
  }

  this.state.clientSandbox.stop(this.state.assets, (err) => {
    if (err) {
      done(err);
    }
    else {
      this.state = {};

      done();
    }
  })
};

function extractSummaryForNode({ summaryFields = [], properties = {} }) {
  const summaryInput = summaryFields.reduce(function(value, fieldName) {
    return value || properties[fieldName];
  }, null);

  if (summaryInput) {
    return extractSummary(summaryInput, { plainText: true });
  }
  else {
    return null;
  }
}

module.exports = HTMLSerializer;