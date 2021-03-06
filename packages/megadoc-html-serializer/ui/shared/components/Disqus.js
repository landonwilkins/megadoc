/* global DISQUS:true */

var React = require('react');

var DOM = React.DOM;
var DISQUS_CONFIG = [
  'shortname', 'identifier', 'title', 'url', 'category_id'
];

// Convert underscore to camelCase
function camelCase(str) {
  return str.replace(/(_.{1})/g, function (match) {
    return match[1].toUpperCase();
  });
}

var disqusAdded = false;

// Stolen from https://github.com/mzabriskie/react-disqus-thread because of the
// (not merged as of yet) fix in
// https://github.com/mzabriskie/react-disqus-thread/pull/9/files
//
var ReactDisqusThread = React.createClass({
  displayName: 'DisqusThread',

  propTypes: {
    /*
     * `shortname` tells the Disqus service your forum's shortname,
     * which is the unique identifier for your website as registered
     * on Disqus. If undefined , the Disqus embed will not load.
     */
    shortname: React.PropTypes.string.isRequired,

    /*
     * `identifier` tells the Disqus service how to identify the
     * current page. When the Disqus embed is loaded, the identifier
     * is used to look up the correct thread. If disqus_identifier
     * is undefined, the page's URL will be used. The URL can be
     * unreliable, such as when renaming an article slug or changing
     * domains, so we recommend using your own unique way of
     * identifying a thread.
     */
    identifier: React.PropTypes.string,

    /*
     * `title` tells the Disqus service the title of the current page.
     * This is used when creating the thread on Disqus for the first time.
     * If undefined, Disqus will use the <title> attribute of the page.
     * If that attribute could not be used, Disqus will use the URL of the page.
     */
    title: React.PropTypes.string,

    /*
     * `url` tells the Disqus service the URL of the current page.
     * If undefined, Disqus will take the window.location.href.
     * This URL is used to look up or create a thread if disqus_identifier
     * is undefined. In addition, this URL is always saved when a thread is
     * being created so that Disqus knows what page a thread belongs to.
     */
    url: React.PropTypes.string,

    /*
     * `categoryId` tells the Disqus service the category to be used for
     * the current page. This is used when creating the thread on Disqus
     * for the first time.
     */
    categoryId: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      shortname: null,
      identifier: null,
      title: null,
      url: null,
      categoryId: null
    };
  },

  addDisqusScript: function () {
    if (disqusAdded) {
      return;
    }

    var child = this.disqus = document.createElement('script');
    var parent = document.getElementsByTagName('head')[0] ||
                 document.getElementsByTagName('body')[0];

    child.async = true;
    child.type = 'text/javascript';
    child.src = '//' + this.props.shortname + '.disqus.com/embed.js';

    parent.appendChild(child);

    disqusAdded = true;
  },

  removeDisqusScript: function () {
    if (this.disqus && this.disqus.parentNode) {
      this.disqus.parentNode.removeChild(this.disqus);
      this.disqus = null;
    }
  },

  componentDidMount: function() {
    if (this.props.identifier) {
      this.loadDisqus();
    }
  },

  componentDidUpdate: function(prevProps) {
    if (this.props.identifier !== prevProps.identifier) {
      this.loadDisqus();
    }
  },

  loadDisqus: function() {
    const { props } = this;

    DISQUS_CONFIG.filter((prop) => !!props[camelCase(prop)]).forEach((prop) => {
      window['disqus_' + prop] = props[camelCase(prop)];
    });

    if (typeof DISQUS !== "undefined") {
      DISQUS.reset({ reload: true });
    }
    else {
      this.addDisqusScript();
    }
  },

  componentWillUnmount() {
    this.removeDisqusScript();
  },

  render: function () {
    return (
      DOM.div(this.props,
        DOM.div({id: "disqus_thread"}),
        DOM.noscript(null,
          DOM.span(null,
            'Please enable JavaScript to view the ',
            DOM.a({href: "http://disqus.com/?ref_noscript"},
              'comments powered by Disqus.'
            )
          )
        ),

        DOM.a(
          {
            href: "http://disqus.com",
            className: "dsq-brlink"
          },
          'blog comments powered by ',
          DOM.span({className: "logo-disqus"}, 'Disqus')
        )
      )
    );
  }
});

/**
 * Renders a small [disqus](http://disqus.com) comment box.
 */
var Disqus = React.createClass({
  propTypes: {
    identifier: React.PropTypes.string,
    title: React.PropTypes.string,
    categoryId: React.PropTypes.string,
    pathname: React.PropTypes.string.isRequired,
    config: React.PropTypes.shape({
      enabled: React.PropTypes.bool,
      shortname: React.PropTypes.string,
      baseUrl: React.PropTypes.string,
    })
  },

  render: function() {
    const { config } = this.props;
    const currentPath = this.props.pathname;

    if (!currentPath || this.isDisabled()) {
      return null;
    }

    return (
      <ReactDisqusThread
        shortname={config.shortname}
        identifier={this.props.identifier}
        title={this.props.title || document.title}
        url={config.baseUrl + '/' + currentPath}
        categoryId={this.props.categoryId}
      />
    );
  },

  isDisabled() {
    return !this.props.config || this.props.config.enabled === false;
  }
});

module.exports = Disqus;