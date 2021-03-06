const path = require('path');
const root = path.resolve(__dirname, '..');

exports.configureFnPath = path.resolve(__dirname, './configureFn.js');
exports.parseFnPath = path.resolve(__dirname, './parseFn.js');
exports.refineFnPath = path.resolve(__dirname, './refineFn.js');
exports.reduceFnPath = path.resolve(__dirname, './reduceFn.js');
exports.reduceTreeFnPath = path.resolve(__dirname, './reduceTreeFn.js');
exports.renderFnPath = path.resolve(__dirname, './renderFn.js');

exports.serializerOptions = {
  html: {
    styleSheets: [
      path.join(root, 'ui', 'css', 'index.less'),
    ],

    pluginScripts: [
      path.join(root, 'dist', 'megadoc-plugin-markdown.js')
    ],

    defaultLayouts: require('./defaultLayouts'),
  }
};