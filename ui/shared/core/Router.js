/**
 * @namespace UI.Core
 *
 * Routing APIs for the app.
 */
let Router = exports;
let instance;

Router.setInstance = function(_instance) {
  instance = _instance;
};

if (process.env.NODE_ENV === 'development') {
  Router.getInstance = function() {
    console.warn('You are using a development-only method.');
    return instance;
  };
}

/**
 * Update the query string to reflect the new given key/value pairs. This
 * will trigger a re-transition of the current route.
 *
 * @param  {Object} newQuery
 *         The query parameters.
 */
Router.updateQuery = function(newQuery) {
  var routes = instance.getCurrentRoutes();
  var currentRouteName = routes[routes.length-1].name;
  var query = instance.getCurrentQuery();

  Object.keys(newQuery).forEach(function(key) {
    query[key] = newQuery[key];

    if (query[key] === null) {
      delete query[key];
    }
  });

  instance.replaceWith(currentRouteName, instance.getCurrentParams(), query);
};

Router.goToNotFound = function() {
  instance.replaceWith('404');
};

Router.transitionTo = function(path, params, query) {
  instance.transitionTo(path, params, query);
};

Router.replaceWith = function(path, params, query) {
  instance.replaceWith(path, params, query);
};

Router.getQueryItem = function(item) {
  if (instance) {
    return instance.getCurrentQuery()[item];
  }
};

Router.makeHref = function(name, params, query) {
  return instance.makeHref(name, params, query);
};

Router.generateAnchorId = function({ routeName, params }) {
  return instance.makeHref(routeName, Object.keys(params).reduce(function(encoded, key) {
    encoded[key] = encodeURIComponent(params[key]);
    return encoded;
  }, {})).replace(/^#/, '');
};

Router.getCurrentPath = function() {
  if (instance) {
    return instance.getCurrentPath();
  }
};

Router.isActive = function(routeName) {
  return instance && instance.isRunning && instance.isActive(routeName);
};

Router.isRunning = function() {
  return instance && instance.isRunning;
};

Router.getParamItem = function(item) {
  if (instance) {
    return instance.getCurrentParams()[item];
  }
};

module.exports = Router;
