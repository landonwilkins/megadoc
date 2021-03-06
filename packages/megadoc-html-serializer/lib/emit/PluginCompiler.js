const webpack = require('webpack');
const path = require('path');
const generateCustomWebpackConfig = require('../../webpack/common');
const publicModules = require('../../webpack/publicModules');

exports.compile = function(scripts, outputFilePath, { optimize, sourceMaps, verbose }, done) {
  var id = path.basename(outputFilePath, path.extname(outputFilePath));

  if (!scripts.length) {
    return done();
  }

  var webpackConfig = generateCustomWebpackConfig({
    entry: scripts,
    devtool: sourceMaps ? 'inline-source-map' : false,

    output: {
      path: path.dirname(outputFilePath),
      filename: path.basename(outputFilePath),
      jsonpFunction: 'webpackJsonp_Plugin_' + id,
      library: id,
      libraryTarget: 'commonjs',
    },

    plugins: [
      new webpack.NoErrorsPlugin()
    ],

    externals: ExternalMap(publicModules, 'var')
  });

  if (optimize) {
    console.log('Plugin "%s" bundle will be optimized.', id);
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  if (sourceMaps) {
    console.log('Plugin "%s" bundle will contain inline source maps.', id);
  }

  if (verbose) {
    console.log('Compiling plugin "%s" of %d scripts: %s.',
      id,
      scripts.length,
      JSON.stringify(scripts, null, 2)
    );
  }

  webpack(webpackConfig, function(err, stats) {
    if (err) {
      console.log('Plugin compilation failure:', err);
      return done(err);
    }

    var jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      return done(jsonStats.errors);
    }

    jsonStats.warnings.forEach(function(message) {
      console.warn(message);
    });

    if (verbose) {
      console.log('Plugin "%s" was compiled successfully.', id);
      // console.log(stats.toString({ chunks: true }))
    }

    done();
  });
};

function ExternalMap(map, libraryTarget) {
  return Object.keys(map).reduce(function(adjustedMap, key) {
    adjustedMap[key] = libraryTarget + ' ' + map[key];
    return adjustedMap;
  }, {})
}