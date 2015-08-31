var { keys } = Object;
var delegate;
var pendingCallbacks = [];

function withDelegate(callback) {
  if (delegate) { callback(delegate); }
  else {
    pendingCallbacks.push(callback);
  }
}

/**
 * Update the query string to reflect the new given key/value pairs. This
 * will trigger a re-transition of the current route.
 *
 * @param  {Object} newQuery
 *         The query parameters.
 */
exports.updateQuery = function(newQuery) {
  var routes = delegate.getRoutes();
  var currentRouteName = routes[routes.length-1].name;
  var query = exports.adjustQuery(newQuery);

  delegate.replaceWith(currentRouteName, delegate.getParams(), query);
};

exports.adjustQuery = function(newQuery) {
  var query = delegate.getQuery();

  keys(newQuery).forEach(function(key) {
    query[key] = newQuery[key];
  });

  return query;
};

exports.getQueryItem = function(item) {
  if (delegate) {
    return delegate.getQuery()[item];
  }
};

exports.assignDelegate = function(inDelegate) {
  delegate = inDelegate;

  pendingCallbacks.forEach(function(callback) {
    callback(inDelegate);
  });

  pendingCallbacks = [];
};

exports.makeHref = function(name, params, query) {
  return delegate.makeHref(name, params, query);
};

exports.goToNotFound = function() {
  withDelegate(function(d) {
    d.replaceWith('404');
  });
};

exports.transitionTo = function(path, params, query) {
  withDelegate(function(d) {
    d.transitionTo(path, params, query);
  });
};

exports.getCurrentRoute = function() {
  if (delegate) {
    return delegate.getPath();
  }
};