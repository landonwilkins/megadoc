const React = require("react");
const Doc = require('../Doc');

const { shape, string, object } = React.PropTypes;

const CallbackTag = React.createClass({
  propTypes: {
    string: string,
    typeInfo: shape({
      name: string,
      description: string,
    }),
    document: object.isRequired,
  },

  render() {
    return (
      <div className="callback-tag">
        <Doc doc={this.props.document} />
      </div>
    );
  }
});

module.exports = CallbackTag;