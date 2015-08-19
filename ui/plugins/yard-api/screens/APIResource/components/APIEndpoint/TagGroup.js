/* eslint "camelcase":0 */
var React = require('react');
var { where } = require('lodash');

var TagGroup = React.createClass({
  render() {
    var tags = where(this.props.tags, { tag_name: this.props.tagName });
    var Renderer = this.props.renderer;

    if (tags.length === 0) {
      return null;
    }

    return (
      <div className={this.props.className}>
        {this.props.children}

        {tags.map(function(tag, i) {
          return <Renderer key={i} {...tag} />;
        })}
      </div>
    );
  }
});

module.exports = TagGroup;