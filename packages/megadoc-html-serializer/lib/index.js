const async = require('async');
const path = require('path');
const MegadocCorpus = require('megadoc-corpus');
const AssetUtils = require('./AssetUtils');
const DocumentFileEmitter = require('./DocumentFileEmitter');
const ClientSandbox = require('./ClientSandbox');
const NodeURIDecorator = require('./NodeURIDecorator');
const TreeRenderer = require('./TreeRenderer');
const createAssets = require('./createAssets');
const emitAssets = require('./emitAssets');
const Renderer = require('megadoc/lib/Renderer');
const renderRoutines = require('./renderRoutines');

const DefaultConfig = {
  /**
   * @property {String}
   *
   * An array of paths to files you want to copy to the output directory.
   * They will be found under `assets/` with their **full source path**.
   *
   * For example:
   *
   *     exports.assets = [ 'app/images/box.png' ];
   *
   * Will be found at:
   *
   *     /assets/app/images/box.png
   *
   */
  assets: [],

  /**
   * @property {Boolean}
   *
   * Whether to show a button for collapsing the sidebar.
   */
  collapsibleSidebar: false,

  compileCSS: true,

  /**
   * @property {Boolean}
   *
   * Whether we should generate .html files for every document.
   */
  emitFiles: true,
  emittedFileExtension: '.html',

  /**
   * @property {String}
   *
   * Path to where a favicon can be found. Clear this if you don't want any.
   */
  favicon: null,

  /**
   * @property {String}
   *
   * A small message (can be Markdown) to display at the bottom of the app.
   *
   * Set this to an empty string, or null, if you don't want the footer
   * to be shown.
   */
  footer: 'Made with &#9829; using [megadoc](https://github.com/megadoc).',

  htmlFile: path.resolve(__dirname, '../../../ui/index.tmpl.html'),

  /**
   * @property {Object}
   */
  layoutOptions: {
    /**
     * @property {Object.<String, String>}
     *
     * Override the default URL for certain documents. You must use [[UIDs | CorpusUIDs]]
     * to specify the documents you want to rewrite.
     *
     * @example
     *
     *     {
     *       "api/Cache": "/cache.html"
     *     }
     */
    rewrite: {},

    /**
     * @property {Boolean}
     *
     * Launch megadoc into "single-page" mode where you want to present all
     * the contents in a single page. This flag MUST be turned in order for
     * links to work online and offline.
     *
     * See the [guides/single-page-md Single Page Mode guide]() for more information.
     */
    singlePageMode: false,

    /**
     * @property {Array.<BannerLink>}
     *
     * @typedef {BannerLink}
     * @property {String} text
     * @property {String} href
     */
    bannerLinks: []
  },

  metaDescription: '',

  /**
   * @property {String}
   *
   * A brief sentence describing what this is about. It will be displayed right
   * next to the title in a small type.
   */
  motto: null,

  /**
   * @property {Boolean}
   *
   * Whether the side-bar should be resizable. Affects all
   * layouts that show a sidebar.
   */
  resizableSidebar: true,

  /**
   * @property {Boolean}
   *
   * Turn this on if you want the side-bar links to become
   * active as the user is scrolling the page.
   *
   * Only works when using the single page layout.
   */
  scrollSpying: false,

  spotlight: true,

  /**
   * @property {String}
   *
   * Absolute path to a .css or .less file to include in the CSS bundle.
   * If you provide a .less file, you can (re)use the variables that the
   * UI's stock stylesheets use.
   *
   * If you want to override the variables, say for custom branding,
   * look at the @styleOverrides parameter.
   *
   * Example:
   *
   *     exports.stylesheet = "doc/mega.less";
   *
   */
  styleSheet: null,

  /**
   * @property {String}
   *
   * Absolute path to a .less stylesheet file that re-defines variables
   * used in the stock UI's stylesheets. This allows for complete theming
   * without messing with the source files, or having to use !important
   * directives, etc.
   *
   * Example:
   *
   *     exports.styleOverrides = "doc/mega/overrides.less";
   *
   */
  styleOverrides: null,

  tooltipPreviews: true,

  /**
   * @property {String}
   *
   * Starting window title.
   */
  title: "megadoc",

  theme: null,
};

function HTMLSerializer(compilerConfig, userSerializerOptions) {
  this.compilerConfig = {
    assetRoot: compilerConfig.assetRoot,
    outputDir: compilerConfig.outputDir,
    tmpDir: compilerConfig.tmpDir,
    verbose: compilerConfig.verbose,
    strict: compilerConfig.strict,
  };

  this.assetUtils = new AssetUtils(this.compilerConfig);
  this.config = Object.assign({}, DefaultConfig, userSerializerOptions);
  this.corpusVisitor = NodeURIDecorator(this.config);

  this.markdownRenderer = new Renderer({
    layoutOptions: this.config.layoutOptions,
  });

  this.state = {
    assets: null,
    clientSandbox: new ClientSandbox(this.config),
  };
};

HTMLSerializer.prototype.renderRoutines = renderRoutines;

HTMLSerializer.prototype.start = function(compilations, done) {
  this.state.assets = createAssets(this.config, compilations);
  this.state.clientSandbox.start(this.state.assets, done);
};

HTMLSerializer.prototype.renderCorpus = function(withTrees, done) {
  const corpusInfo = aggregateTreesIntoCorpus(this, withTrees);
  const corpus = corpusInfo.corpus;
  const rootNodes = corpusInfo.rootNodes;

  const withNodes = rootNodes.map((node, index) => {
    return { node: node, compilation: withTrees[index] };
  });

  const state = {
    markdownRenderer: this.markdownRenderer,
    linkResolver: null,
    corpus: corpus,
  };

  // todo: distribute
  async.map(withNodes, renderTree, (err, renderedNodes) => {
    if (err) {
      done(err);
    }
    else {
      const renderedCorpus = aggregateRenderedTreesIntoCorpus(this, renderedNodes);

      done(null, {
        corpus: renderedCorpus,
        edgeGraph: null
      });
    }
  });

  function renderTree(compilationWithNode, callback) {
    const node = compilationWithNode.node;
    const compilation = compilationWithNode.compilation;
    const { options, renderOperations } = compilation;

    callback(null, TreeRenderer.renderTree(state, options, node, renderOperations));
  }
};

HTMLSerializer.prototype.emitCorpusDocuments = function(corpusInfo, done) {
  const flatCorpus = corpusInfo.corpus.toJSON();

  this.state.clientSandbox.exposeCorpus(flatCorpus);

  const emitDocumentFile = DocumentFileEmitter({
    assets: this.state.assets,
    assetUtils: this.assetUtils,
    corpus: flatCorpus,
    htmlFile: this.config.htmlFile,
    ui: this.state.clientSandbox.getDelegate(),
    verbose: this.compilerConfig.verbose,
  });

  const documentUIDs = Object.keys(flatCorpus);

  emitAssets(
    Object.assign({}, this.config, {
      verbose: this.compilerConfig.verbose,
    }),
    {
      assets: this.state.assets,
      flatCorpus: flatCorpus,
      assetUtils: this.assetUtils,
    },
    function(err) {
      if (err) {
        return done(err);
      }
      else {
        async.eachSeries(documentUIDs, emitDocumentFile, done);
      }
    }
  )
};

HTMLSerializer.prototype.stop = function(done) {
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

function aggregateTreesIntoCorpus(serializer, compilations) {
  const corpus = MegadocCorpus.Corpus({
    strict: serializer.compilerConfig.strict,
    debug: serializer.compilerConfig.debug
  });

  corpus.visit(serializer.corpusVisitor);

  const rootNodes = compilations.map(function(compilation) {
    const serializerOptions = compilation.processor.serializerOptions.html || {};

    compilation.tree.meta.defaultLayouts = serializerOptions.defaultLayouts;

    return corpus.add(compilation.tree);
  });

  return { corpus: corpus, rootNodes: rootNodes };
}

function aggregateRenderedTreesIntoCorpus(serializer, trees) {
  const corpus = MegadocCorpus.Corpus({
    strict: serializer.compilerConfig.strict,
    debug: serializer.compilerConfig.debug
  });

  trees.forEach(function(tree) {
    corpus.add(tree);
  });

  return corpus;
}

module.exports = HTMLSerializer;
