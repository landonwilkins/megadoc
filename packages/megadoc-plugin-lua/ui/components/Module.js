const React = require('react');
const HighlightedText = require('components/HighlightedText');
const ModuleHeader = require('../components/ModuleHeader');
const FunctionSignature = require('../components/FunctionSignature');
const FunctionParams = require('../components/FunctionParams');
const FunctionReturns = require('../components/FunctionReturns');
const ExampleTags = require('../components/ExampleTags');
const { object, } = React.PropTypes;

const Module = React.createClass({
  propTypes: {
    documentNode: object,
  },

  render() {
    const { documentNode } = this.props;
    const { entities } = documentNode;
    const functions = entities.filter(e => e.properties.ctx.type === 'function');
    const description = documentNode.properties.description;

    return (
      <div>
        <ModuleHeader
          doc={documentNode.properties}
          anchorId={documentNode.meta.anchor}
        />

        <HighlightedText>
          {description}
        </HighlightedText>

        <div>
          {functions.map(this.renderFunction)}
        </div>
      </div>
    );
  },

  renderFunction(documentNode) {
    const doc = documentNode.properties;

    return (
      <div key={documentNode.uid} className="lua-function">
        <ModuleHeader
          level="2"
          doc={doc}
          anchorId={documentNode.meta.anchor}
        />

        <HighlightedText>{doc.description}</HighlightedText>

        <FunctionSignature doc={doc} />
        <FunctionParams doc={doc} />
        <FunctionReturns doc={doc} />
        <ExampleTags doc={doc} />
      </div>
    );
  }
});

module.exports = Module;
