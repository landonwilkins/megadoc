const Storage = require('core/Storage');
const K = require('constants');

Storage.register(K.CFG_CLASS_BROWSER_EXPAND_ALL, false);

tinydoc.use(function YARDAPIPlugin(api) {
  api.registerRoutes([
    {
      name: 'api',
      path: 'api',
      handler: require('./screens/Root')
    },

    {
      name: 'api.landing',
      default: true,
      handler: require('./screens/Landing'),
      parent: 'api'
    },

    {
      name: 'api.resource',
      handler: require('./screens/APIResource'),
      parent: 'api',
      path: 'resources/:resourceId',
      ignoreScrollBehavior: true,
    },

    {
      name: 'api.resource.object',
      parent: 'api.resource',
      path: 'objects/:objectId',
      ignoreScrollBehavior: true,
    },

    {
      name: 'api.resource.endpoint',
      parent: 'api.resource',
      path: 'endpoints/:endpointId',
      ignoreScrollBehavior: true,
    },

  ]);

  api.registerOutletElement('navigation', require('./outlets/Navigation'));
});