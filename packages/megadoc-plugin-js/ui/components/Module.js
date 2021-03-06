const React = require('react');
const HasTitle = require('mixins/HasTitle');
const ModuleHeader = require('./ModuleHeader');
const Outlet = require('components/Outlet');

const Module = React.createClass({
  mixins: [
    HasTitle(function() {
      return this.props.documentNode.properties.name;
    })
  ],

  propTypes: {
    namespaceNode: React.PropTypes.object.isRequired,
    documentNode: React.PropTypes.object.isRequired,
    documentEntityNode: React.PropTypes.object,
  },

  childContextTypes: {
    config: React.PropTypes.object
  },

  getChildContext() {
    return {
      config: this.props.namespaceNode.config
    }
  },

  render() {
    const { documentNode, namespaceNode } = this.props;
    const { config } = namespaceNode;
    const moduleNode = documentNode.type === 'DocumentEntity' ?
      documentNode.parentNode :
      documentNode
    ;

    const legacyParams = {
      moduleId: moduleNode.id,
      entity: documentNode.type === 'DocumentEntity' ? documentNode.id : undefined,
    };

    return (
      <div className="class-view">
        <ModuleHeader
          documentNode={moduleNode}
          showSourcePaths={config.showSourcePaths}
          showNamespace={config.showNamespaceInModuleHeader}
          generateAnchor={false}
        />

        <Outlet
          name="JS::ModuleBody"
          elementProps={{
            params: legacyParams,
            query: {},
            documentNode,
            documentEntityNode: this.props.documentEntityNode,
            namespaceNode,
          }}
        />
      </div>
    );
  }
});

module.exports = Module;