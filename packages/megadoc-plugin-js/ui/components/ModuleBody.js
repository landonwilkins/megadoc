const React = require('react');
const { findWhere, where } = require("lodash");
const Outlet = require('components/Outlet');
const HighlightedText = require('components/HighlightedText');
const Doc = require('./Doc');
const SeeTag = require('./Tags/SeeTag');
const DocGroup = require('./DocGroup');
const PropertyTag = require('./Tags/PropertyTag');
const ExampleTag = require('./Tags/ExampleTag');
const orderAwareSort = require('../utils/orderAwareSort');
const DocClassifier = require('../utils/DocClassifier');
const K = require('../constants');
const { string, object, arrayOf } = React.PropTypes;

const ModuleBody = React.createClass({
  propTypes: {
    documentNode: object,
    doc: object,
    moduleDocs: arrayOf(object),
    focusedEntity: string,
  },

  render() {
    const { documentNode } = this.props;
    const doc = documentNode.properties;
    const moduleDocs = documentNode.entities.map(x => x.properties);
    const renderableType = DocClassifier.getDisplayType(documentNode);

    return (
      <div>
        {hasDetailedDescription(documentNode) && [
          <h2 key="description-header" className="doc-group__header">
            Detailed Description
          </h2>,

          <HighlightedText key="description">
            {doc.description}
          </HighlightedText>
        ]}

        {renderableType === 'Factory' && (
          this.renderConstructor(doc, "Instance Constructor Documentation")
        )}

        {renderableType === 'Class' && (
          this.renderConstructor(doc, "Constructor Documentation")
        )}

        {renderableType === 'Function' && (
          this.renderConstructor(doc, "Signature")
        )}

        {this.renderExamples(doc)}
        {this.renderStaticMethods(doc, moduleDocs)}
        {this.renderProperties(
          doc,
          moduleDocs,
          (scope) => !isStaticProperty(scope),
          "Instance Property Documentation"
        )}

        {this.renderProperties(
          doc,
          moduleDocs,
          isStaticProperty,
          "Static Property Documentation"
        )}

        {this.renderMethods(doc, moduleDocs)}
        {this.renderAdditionalResources(doc)}
      </div>
    );
  },

  renderConstructor(doc, title) {
    return (
      <div>
        <h2 className="doc-group__header">{title}</h2>

        <Doc
          withDescription={false}
          withExamples={false}
          withAdditionalResources={false}
          collapsible={false}
          doc={doc}
        />
      </div>
    );
  },

  renderExamples(doc) {
    const tags = where(doc.tags, { type: 'example' });

    return (
      <Outlet name="CJS::ExampleTags" elementProps={{tags}}>
        {tags.length === 1 && (this.renderExampleTag(tags[0]))}

        {tags.length > 1 && (
          <DocGroup label="Examples" alwaysGroup={false}>
            {tags.map(this.renderExampleTag)}
          </DocGroup>
        )}
      </Outlet>
    );
  },

  renderExampleTag(tag) {
    return (
      <Outlet
        key={tag.string}
        name="CJS::ExampleTag"
        elementProps={{
          tag,
          documentNode: this.props.documentNode
        }}
        firstMatchingElement
      >
        <ExampleTag string={tag.string} typeInfo={tag.typeInfo} />
      </Outlet>
    );
  },

  renderAdditionalResources(doc) {
    const tags = where(doc.tags, { type: 'see' });

    if (!tags.length) {
      return null;
    }

    return (
      <DocGroup label="Additional resources" className="class-view__sees" tagName="ul">
        {tags.map(this.renderSeeTag)}
      </DocGroup>
    );
  },

  renderSeeTag(tag) {
    return (
      <SeeTag key={tag.string} string={tag.string} />
    );
  },

  renderProperties(doc, moduleDocs, scope = null, title = 'Properties') {
    const propertyDocs = orderAwareSort(
      doc,
      moduleDocs.filter(function(entityDoc) {

        return (
          (scope ? scope(entityDoc.ctx.scope) : true) &&
          (
            entityDoc.ctx.type === K.TYPE_LITERAL ||
            entityDoc.tags.some(x => x.type === 'property')
          )
        );
      }),
      'id'
    );

    if (!propertyDocs.length) {
      return null;
    }

    return (
      <DocGroup label={title} tagName="ul" className="js-doc-entity__property-tags">
        {propertyDocs.map(this.renderProperty)}
      </DocGroup>
    );
  },

  renderProperty(doc) {
    const tag = (
      findWhere(doc.tags, { type: 'property' }) ||
      findWhere(doc.tags, { type: 'type' }) || {
        typeInfo: {
          name: doc.name,
          types: [ doc.ctx.type ]
        }
      }
    );

    return (
      <PropertyTag
        key={doc.id}
        typeInfo={tag.typeInfo}
        anchor={this.getEntityAnchor(doc)}
        doc={doc}
      />
    );
  },

  renderStaticMethods(doc, moduleDocs) {
    const staticMethodDocs = orderAwareSort(
      doc,
      moduleDocs.filter(DocClassifier.isStaticMethod),
      'id'
    );

    if (!staticMethodDocs.length) {
      return null;
    }

    return (
      <DocGroup label="Static Method Documentation" tagName="ul" className="class-view__method-list">
        {staticMethodDocs.map(this.renderStaticMethod)}
      </DocGroup>
    );
  },

  renderStaticMethod(doc) {
    return (
      <Doc
        key={doc.id}
        doc={doc}
        anchor={this.getEntityAnchor(doc)}
      />
    );
  },

  renderMethods(doc, moduleDocs) {
    const methodDocs = orderAwareSort(
      doc,
      moduleDocs.filter(DocClassifier.isMethod),
      'id'
    );

    if (!methodDocs.length) {
      return null;
    }

    return (
      <DocGroup label="Instance Method Documentation" tagName="ul" className="class-view__method-list">
        {methodDocs.map(this.renderMethod)}
      </DocGroup>
    );
  },

  renderMethod(doc) {
    return (
      <Doc
        key={doc.id}
        doc={doc}
        anchor={this.getEntityAnchor(doc)}
      />
    );
  },

  getEntityAnchor(doc) {
    return this.props.documentNode.entities.filter(x => x.properties === doc)[0].meta.anchor;
  },
});

function isStaticProperty(scope) {
  return [
    K.SCOPE_PROTOTYPE,
    K.SCOPE_INSTANCE
  ].indexOf(scope) === -1 || scope ;
}

function hasDetailedDescription(node) {
  return node.properties.description && (
    node.properties.description.replace(/(^\<p\>|\<\/p\>\n?$)/g, '') !== node.summary
  );
}

module.exports = ModuleBody;