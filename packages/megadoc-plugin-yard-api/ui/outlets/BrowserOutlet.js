const React = require('react');
const Component = require('../components/ClassBrowser');
const { shape, object } = React.PropTypes;

const BrowserOutlet = React.createClass({
  propTypes: {
    namespaceNode: shape({
      config: object,
    }),
  },

  render() {
    return (
      <Component config={this.props.namespaceNode.config} {...this.props} />
    );
  }
});

module.exports = BrowserOutlet