var fs = require('fs-extra');
var path = require('path');
var Logger = require('../../lib/Logger');
var UI_DIR = path.resolve(__dirname, '..', '..', 'ui');
var extend = require('lodash').extend;
var template = require('lodash').template;

function generateHTMLIndex(publicPath, scripts) {
  return template(fs.readFileSync(path.join(UI_DIR, 'app', 'index.tmpl.html'), 'utf-8'))({
    scripts: scripts.map(function(script) {
      return path.join(publicPath, script);
    })
  });
}

module.exports = function(config, scriptLoader, utils, done) {
  var console = new Logger('ui writer');
  var outputDir = utils.assetPath(config.outputDir);
  var runtimeConfig = extend({}, config);

  var scripts = [
    'config.js',
    'vendor.js',
    'main.js',
    'styles.js'
  ].concat(config.scripts).concat(config.pluginScripts);

  if (config.readme) {
    runtimeConfig.readme = fs.readFileSync(utils.assetPath(config.readme), 'utf-8');
  }

  fs.writeFileSync(path.resolve(outputDir, 'index.html'), generateHTMLIndex(config.publicPath, scripts));

  // copy the pre-compiled webpack bundles
  fs.copySync(path.join(UI_DIR, 'dist'), outputDir);

  // write the runtime config file
  utils.writeAsset('config.js', 'window.CONFIG=' + JSON.stringify(runtimeConfig) + ';');

  done();
};
