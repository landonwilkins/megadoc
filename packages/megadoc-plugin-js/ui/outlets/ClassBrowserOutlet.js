const React = require('react');
const ClassBrowser = require('../components/ClassBrowser');
const { object, } = React.PropTypes;

megadoc.outlets.add('CJS::ClassBrowser', {
  key: 'CJS::ClassBrowser',
  component: React.createClass({
    propTypes: {
      documentNode: object,
      namespaceNode: object,
      documentEntityNode: object,
    },

    render() {
      const { documentNode } = this.props;

      return (
        <div>
          <ClassBrowser
            namespaceNode={this.props.namespaceNode}
            documentNode={this.props.documentNode}
            documentEntityNode={this.props.documentEntityNode}
            withControls={false}
          />
        </div>
      );
    }
  }),
});