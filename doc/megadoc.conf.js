var path = require('path');
var config = {
  assetRoot: path.resolve(__dirname, '..'),

  title: 'megadoc',
  outputDir: '/srv/http/docs/megadoc',
  useHashLocation: true,
  publicPath: '',
  stylesheet: 'doc/theme.less',
  disqus: false,
  showSettingsLinkInBanner: false,
  tooltipPreviews: false,
  corpus: {
    indexByFilepath: true,
  },

  alias: {
    'md__megadoc-plugin-markdown/readme': 'megadoc-plugin-markdown',
    'md__megadoc-plugin-js/readme': 'megadoc-plugin-js',
    'md__megadoc-plugin-git/readme': 'megadoc-plugin-git',
    'md__megadoc-plugin-lua/readme': 'megadoc-plugin-lua',
    'md__megadoc-plugin-yard-api/readme': 'megadoc-plugin-yard-api',
  },

  layoutOptions: {
    rewrite: {
      '/articles/readme.html': '/index.html',
      '/articles/changes.html': '/changes.html',
    },

    bannerLinks: [
      {
        text: 'Usage',
        href: '/usage/readme',
      },

      {
        text: 'Plugins',
        href: '/plugins',
        links: [
          {
            text: 'Git',
            href: '/plugins/megadoc-plugin-git/readme.html',
          },

          {
            text: 'JavaScript',
            href: '/plugins/megadoc-plugin-js/readme.html',
          },
          {
            text: 'JavaScript React',
            href: '/plugins/megadoc-plugin-react/readme.html',
          },

          {
            text: 'Markdown',
            href: '/plugins/megadoc-plugin-markdown/readme.html',
          },

          {
            text: 'Lua',
            href: '/plugins/megadoc-plugin-lua/readme.html',
          },

          {
            text: 'YARD-API',
            href: '/plugins/megadoc-plugin-yard-api/readme.html',
          },

          {
            text: 'Reference Graph',
            href: '/plugins/megadoc-plugin-reference-graph/readme.html',
          },

          {
            text: 'Theme - Qt',
            href: '/plugins/megadoc-theme-qt/readme.html',
          },

          {
            text: 'Theme - gitbooks.io',
            href: '/plugins/megadoc-theme-qt/readme.html',
          },
        ]
      },

      {
        text: 'Developers',
        links: [
          {
            text: 'Plugins',
            href: '/dev/plugins/readme.html',
          },

          {
            text: 'API',
            href: '/dev/api',
          },

          {
            text: 'Corpus',
            href: '/dev/corpus/readme.html',
          },
        ]
      },

      {
        text: 'Changes',
        href: '/changes',
      },

    ],

    customLayouts: [
      {
        match: { by: 'url', on: '^/changes.html' },
        regions: [
          {
            name: 'Layout::Content',
            options: { framed: true },
            outlets: [
              { name: 'Markdown::Document' }
            ]
          },
          {
            name: 'Layout::Sidebar',
            outlets: [
              { name: 'Markdown::DocumentTOC' }
            ]
          }

        ]
      },
      {
        match: { by: 'url', on: '/dev/corpus/(?!api)' },
        regions: [
          {
            name: 'Layout::Content',
            options: { framed: true },
            outlets: [
              { name: 'Markdown::Document' }
            ]
          },
          {
            name: 'Layout::Sidebar',
            outlets: [
              { name: 'Markdown::Browser', using: 'md__corpus' },
              { name: 'Layout::SidebarHeader', options: { text: 'API' } },
              { name: 'CJS::ClassBrowser', using: 'js__corpus' },
            ]
          }

        ]
      },
      {
        match: { by: 'url', on: '/dev/corpus/api' },
        regions: [
          {
            name: 'Layout::Content',
            options: { framed: true },
            outlets: [
              { name: 'CJS::Module' }
            ]
          },
          {
            name: 'Layout::Sidebar',
            outlets: [
              { name: 'Markdown::Browser', using: 'md__corpus' },
              { name: 'Layout::SidebarHeader', options: { text: 'API' } },
              { name: 'CJS::ClassBrowser', using: 'js__corpus' },
            ]
          }

        ]
      },
      {
        match: { by: 'url', on: '/dev/plugins' },
        regions: [
          {
            name: 'Layout::Content',
            options: { framed: true },
            outlets: [
              { name: 'Markdown::Document' }
            ]
          },
          {
            name: 'Layout::Sidebar',
            outlets: [
              { name: 'Markdown::Browser' }
            ]
          }

        ]
      }
    ]
  },

};

config.plugins = [
  require('megadoc-plugin-js')({
    id: 'core-js',
    url: '/dev/api',
    title: 'API',

    source: [
      'lib/**/*.js',
      'ui/**/*.js',
    ],

    exclude: [
      /\.test\.js$/,
      'ui/app/vendor',
    ],

    useDirAsNamespace: false,

    namespaceDirMap: {
      'lib': 'Core',
      'lib/utils': 'Core.Utils',
      'ui/': 'Core.UI',
    }
  }),

  require('megadoc-plugin-markdown')({
    title: 'Documents',
    source: [ 'README.md', 'CHANGES.md' ],
  }),

  // @url: /usage
  require('megadoc-plugin-markdown')({
    id: 'md__usage',
    baseURL: '/usage',
    source: [ 'doc/usage/**/*.md' ],
    title: 'Usage',
    fullFolderTitles: false,
  }),

  // @url: /dev/plugins
  require('megadoc-plugin-markdown')({
    id: 'md__plugins',
    baseURL: '/dev/plugins',
    source: [ 'doc/dev/**/*.md', 'doc/dev-cookbook/**/*.md' ],
    title: 'Plugin Development',
    fullFolderTitles: false,
    discardIdPrefix: 'dev-',
  }),

  // @url: /dev/corpus
  require('megadoc-plugin-markdown')({
    id: 'md__corpus',
    title: 'Corpus',
    source: 'packages/megadoc-corpus/README.md',
    baseURL: '/dev/corpus',
    // outlet: 'CJS::Landing',
    // anchorableHeadings: false
  }),

  require('megadoc-plugin-js')({
    id: 'js__corpus',
    url: '/dev/corpus/api',
    title: 'Corpus',
    useDirAsNamespace: false,
    inferModuleIdFromFileName: true,

    source: [
      'packages/megadoc-corpus/defs/*.js',
      'packages/megadoc-corpus/lib/**/*.js',
    ],

    exclude: [ /\.test\.js$/ ],
  }),

  require('megadoc-theme-qt')({}),

];

[
  'megadoc-plugin-git',
  'megadoc-plugin-js',
  'megadoc-plugin-lua',
  'megadoc-plugin-markdown',
  'megadoc-plugin-react',
  'megadoc-plugin-reference-graph',
  'megadoc-plugin-yard-api',
  'megadoc-theme-gitbooks',
  'megadoc-theme-qt',
].forEach(function(pluginName) {
  var url = '/plugins/' + pluginName;

  config.plugins.push(require('megadoc-plugin-js')({
    id: 'js__' + pluginName,
    url: url,
    title: pluginName,
    useDirAsNamespace: false,
    inferModuleIdFromFileName: true,
    // namespaceDirMap: {
    //   'lib': pluginName,
    //   'ui': pluginName,
    // },
    source: [
      'packages/' + pluginName + '/lib/**/*.js',
      'packages/' + pluginName + '/ui/**/*.js',
    ],

    exclude: [ /\.test\.js$/, /vendor/ ],
  }));

  config.plugins.push(require('megadoc-plugin-markdown')({
    id: 'md__' + pluginName,
    title: pluginName,
    source: [ 'packages/' + pluginName + '/**/*.md' ],
    exclude: /node_modules/,
    baseURL: url,
    // outlet: 'CJS::Landing',
    // anchorableHeadings: false
  }));

  config.layoutOptions.customLayouts.push({
    match: { by: 'url', on: url },
    regions: [
      {
        name: 'Layout::Sidebar',
        outlets: [
          { name: 'Markdown::Browser', using: 'md__' + pluginName },
          { name: 'Layout::SidebarHeader', options: { text: 'API' } },
          { name: 'CJS::ClassBrowser', using: 'js__' + pluginName },
        ]
      },
      {
        name: 'Layout::Content',
        options: { framed: true },
        outlets: [
          {
            name: 'Markdown::Document',
            match: { by: 'namespace', on: [ 'md__' + pluginName ] },
          },
          {
            name: 'CJS::Module',
            match: { by: 'namespace', on: [ 'js__' + pluginName ] },
          }
        ]
      },
      // {
      //   name: 'Layout::Content',
      //   match: { by: 'namespace', on: [ 'js__' + pluginName ] },
      //   options: { framed: true },
      //   outlets: [
      //     { name: 'CJS::Module' }
      //   ]
      // },
    ]
  })
})

module.exports = config;