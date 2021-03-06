/**
 * @module Config
 * @preserveOrder
 */
module.exports = {
  /**
   * @property {String}
   *           A unique identifier for this plugin (throughout all other
   *           plugins in your megadoc config.)
   *
   *           This will be used in the corpus to namespace documents and may
   *           affect the URL if you leave [.url]() blank.
   */
  id: 'js',

  /**
   * @property {String}
   *           The URL to reach the JavaScript documentation at.
   *           The default is to infer it from [.id]().
   */
  url: null,

  /**
   * @property {String}
   *
   * A title that categorizes the modules parsed by the plugin. This title will
   * be used in certain parts like the Spotlight when listing search hits and
   * some other places.
   *
   * It's better to keep it short.
   */
  title: 'JS',

  /**
   * @property {String[]} source
   *
   * A list of patterns to match the source files to parse.
   */
  source: [ '**/*.js' ],

  /**
   * @property {String[]}
   *
   * A list of patterns to exclude source files.
   */
  exclude: null,

  /**
   * @property {Boolean}
   *
   * Turn this on if you want to use the file's folder name as its namespace.
   * This will be used only if the source file defines no @namespace tag.
   */
  useDirAsNamespace: true,

  /**
   * @property {Boolean}
   *
   * In case a module is not explicitly tagged with a name (using a tag such
   * as @module or @name) and its name could not be inferred from the code (e.g.
   * it is an anonymous function or export) then we will try to infer its name
   * from its filename.
   *
   * For example, the following module will be named as `cache`:
   *
   *     // @file: lib/core/cache.js
   *     /**
   *      * My hot cache module.
   *      *\/
   *     module.exports = function() {
   *     };
   */
  inferModuleIdFromFileName: true,

  /**
   * @property {Boolean}
   *
   * Automatically classify a module as part of a namespace if its name
   * contains "." characters.
   *
   * For example, the following module will be namespaced under "core":
   *
   *     /**
   *      * @module core.cache
   *      *\/
   *      function cache() {}
   */
  inferNamespaces: true,

  /**
   * @property {Function}
   *
   * You can implement this function if you need to perform any custom
   * decoration or transformation on a source file's doc entry.
   *
   * The parameter you receive is a Dox construct. Please refer to its
   * documentation for how that looks like.
   */
  analyzeNode: null,

  customTags: {},

  /**
   * @property {Boolean}
   *
   * Whether to show the file path the module was defined in.
   */
  showSourcePaths: true,

  verbose: false,

  /**
   * @property {Object.<String, String|Array.<String>>}
   *
   * A map of module IDs and a list of aliases to use for them. This config is
   * useful for refactored modules that get renamed and you end up with broken
   * links since its name has changed and the source links have not been
   * updated.
   *
   * Example usage for aliasing a module named 'Core.Cache' to 'MyCacheModule':
   *
   *     {
   *       'Core.Cache': [ 'MyCacheModule' ]
   *     }
   *
   */
  alias: {},

  /**
   * @property {Config~ParseRoutine}
   *
   * An override routine for generating an AST for a block of code. By default,
   * we use [babel](babeljs.io) for parsing source-code, but if you want to use
   * something else, pass this in.
   *
   * @callback Config~ParseRoutine
   *
   * @param {String} sourceCode
   * @param {String} filePath
   *        File path relative to the [Config.assetRoot](). Use this for error
   *        reporting.
   *
   * @param {String} absoluteFilePath
   *        Absolute path to the file the source was read from.
   *
   * @return {Object}
   *         The [ESTree](https://github.com/estree/estree/blob/master/spec.md)
   *         AST `program` node.
   */
  parse: null,

  /**
   * @property {Object}
   *
   * Options to pass to the AST parser (babel).
   */
  parserOptions: null,

  /**
   * @property {Object.<String, String>}
   *
   * A map of relative directory paths and namespace strings to flag all modules
   * found in those directories with those namespaces.
   *
   * For example, to group all files under `lib/core/**.js` with the `Core`
   * namespace, you would use:
   *
   *     {
   *       "lib/core": "Core"
   *     }
   *
   * > **NOTE**
   * >
   * > This will NOT override any explicit `@namespace` tag found in a module
   * > docstring.
   */
  namespaceDirMap: {},

  moduleMap: {},

  /**
   * @property {Boolean}
   *
   * This option changes the behavior of the @return tag in that it allows you
   * to name the return value which is necessary if you want to document complex
   * return types.
   *
   * For example, with this option turned on, you can do something like this:
   *
   *     @return {Object} foo
   *             Optional description of foo goes here.
   *
   *     @return {String} foo.bar
   *             Optional description of foo.bar goes here.
   *
   * However, if you turn this off, we will consider "foo" and "foo.bar" to be
   * part of the description for their respective tags.
   */
  namedReturnTags: true,

  /**
   * @property {Array.<String>}
   *
   * A list of types to consider "built-in" and to avoid linking to.
   *
   * This list will be munged along with the following built-in types:
   *
   * ```javascript
   * [
   *   'Error',
   *   'String',
   *   'Array',
   *   'Number',
   *   'RegExp',
   *   'Object',
   *   'Boolean',
   *   'Date',
   *   'Function',
   *   'Symbol',
   *   'Promise',
   *   'Map',
   *   'Set',
   *   'WeakMap',
   *   'WeakSet',
   *   'Buffer',
   *   'Uint16Array',
   *   'ArrayBuffer',
   *   'DataView',
   *   'Int8Array',
   *   'Uint8Array',
   *   'Uint8ClampedArray',
   *   'Uint32Array',
   *   'Int32Array',
   *   'Float32Array',
   *   'Int16Array',
   *   'Float64Array',
   *   'Any',
   *   'Mixed',
   *   'void'
   * ]
   * ```
   */
  builtInTypes: [],

  docstringProcessors: [],
  tagProcessors: [],

  /**
   * @property {Object.<String, String>}
   *
   * Alias custom tags to pre-defined Megadoc tags.
   *
   * @example
   *
   * Treat all `@returns` tags as `@return` and `@module` as @class`:
   *
   *     tagAliases = {
   *       'returns': 'return',
   *       'module': 'class',
   *     }
   *
   */
  tagAliases: {},

  /**
   * @property {Boolean}
   *
   * By default, Megadoc will generate a page for every namespace. That page
   * contains an "index" of all the modules, functions, and entities found
   * within that namespace. However, these pages are not accessible by default
   * in the sidebar (the namespace names will not be anchors, but text) unless
   * you turn this option on, in which case namespaces listed in the sidebar
   * will become links and the user gets to view those namespace pages.
   */
  linkToNamespacesInBrowser: false,

  hideBlankParameters: true,
  hideBlankReturns: true,
  hidePrivateSymbols: true,
  expandReturnedFunctionSignature: true,

  showTypeDefsInBrowser: false,
  showTypeDefPropertiesInBrowser: true,
};