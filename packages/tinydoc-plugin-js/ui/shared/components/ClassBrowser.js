const React = require("react");
const Link = require('components/Link');
const Database = require('core/Database');
const classSet = require('utils/classSet');
const Storage = require('core/Storage');
const Checkbox = require('components/Checkbox');
const HotItemIndicator = require('components/HotItemIndicator');
const { findWhere, sortBy } = require('lodash');
const isItemHot = require('utils/isItemHot');
const K = require('constants');
const PRIVATE_VISIBILITY_KEY = K.CFG_CLASS_BROWSER_SHOW_PRIVATE;
const JumperMixin = require('mixins/JumperMixin');
const orderAwareSort = require('utils/orderAwareSort');

var ClassBrowser = React.createClass({
  mixins: [
    JumperMixin(function(props) {
      if (props.activeModuleId) {
        return this.refs[props.activeModuleId];
      }
      else {
        return false;
      }
    }, -50, '.resizable-panel__content')
  ],

  propTypes: {
    routeName: React.PropTypes.string.isRequired,
    activeModuleId: React.PropTypes.string,
    activeEntityId: React.PropTypes.string,
    withControls: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      withControls: true
    };
  },

  shouldComponentUpdate: function(nextProps) {
    return (
      nextProps.routeName !== this.props.routeName ||
      nextProps.activeModuleId !== this.props.activeModuleId ||
      nextProps.activeEntityId !== this.props.activeEntityId
    );
  },

  render() {
    const rootDocuments = tinydoc.corpus.get(this.props.routeName).documents;
    const genericNamespace = {
      id: '__general__',
      title: '[General]',
      documents: []
    };

    const namespaces = rootDocuments.reduce(function(list, node) {
      if (node.documents.length) {
        list.push(node);
      }
      else {
        list[0].documents.push(node);
      }

      return list;
    }, [ genericNamespace ]).sort(function(a, b) {
      if (a.id === '__general__') {
        return 1;
      }
      else {
        return a.id > b.id ? 1 : -1;
      }
    });

    const shouldDisplayName = namespaces.length > 1;

    return (
      <nav className="class-browser__listing">
        {namespaces.map(this.renderNamespace.bind(null, shouldDisplayName))}

        {this.props.withControls && (
          <div className="class-browser__controls">
            <Checkbox
              checked={!!Storage.get(PRIVATE_VISIBILITY_KEY)}
              onChange={this.togglePrivateVisibility}
              children="Show private"
            />
          </div>
        )}
      </nav>
    );
  },

  renderNamespace(shouldDisplayName, ns) {
    if (ns.documents.length === 0) {
      return null;
    }

    const hasSelfDocument = !!ns.properties;

    return (
      <div key={ns.id} className="class-browser__category">
        {shouldDisplayName && (
          <h3 className="class-browser__category-name">
            {hasSelfDocument ? (
              <Link
                to={ns.meta.href}
                children={ns.title}
              />
            ) : (
              ns.title
            )}
          </h3>
        )}

        {hasSelfDocument && this.props.activeModuleId === ns.id && (
          this.renderModuleEntities(ns.entities)
        )}

        {sortBy(ns.documents, 'id').map(this.renderModule)}
      </div>
    );
  },

  renderModule(docNode) {
    const doc = docNode.properties;
    const { routeName } = this.props;
    const { id } = doc;
    const isActive = this.props.activeModuleId === docNode.id;
    const className = classSet({
      'class-browser__entry': true,
      'class-browser__entry--active': isActive
    });

    const isPrivate = doc.isPrivate;

    if (isPrivate && !Storage.get(PRIVATE_VISIBILITY_KEY)) {
      return null;
    }

    return (
      <div key={docNode.uid} className={className}>
        <Link
          ref={id}
          to={docNode.meta.href}
          className="class-browser__entry-link"
        >
          {doc.name}

          {isPrivate && (
            <span className="class-browser__entry-link--private"> (private)</span>
          )}

          {doc.git && isItemHot(doc.git.lastCommittedAt) && <HotItemIndicator />}
        </Link>

        {isActive && this.renderModuleEntities(docNode)}
      </div>
    );
  },

  renderModuleEntities(documentNode) {
    if (!documentNode.entities || !documentNode.entities.length) {
      return null;
    }

    const moduleDoc = documentNode.properties;
    const docs = documentNode.entities.map(x => x.properties);
    const methodDocs = documentNode.entities.filter(function(x) {
      return x.properties.ctx.type === K.TYPE_FUNCTION;
    });

    const propertyDocs = documentNode.entities.filter(function(x) {
      return !!findWhere(x.properties.tags, { type: 'property' });
    });

    return (
      <ul className="class-browser__methods">
        {orderAwareSort(moduleDoc, methodDocs, 'id').map(this.renderEntity)}
        {orderAwareSort(moduleDoc, propertyDocs, 'id').map(this.renderEntity)}
      </ul>
    );
  },

  renderEntity(node) {
    return (
      <li key={node.uid} className="class-browser__methods-entity">
        <Link
          to={node.meta.href}
          children={(node.properties.ctx.symbol || '') + node.properties.name}
          title={node.title}
        />
      </li>
    );
  },

  togglePrivateVisibility() {
    Storage.set(PRIVATE_VISIBILITY_KEY, !Storage.get(PRIVATE_VISIBILITY_KEY));
  }
});

module.exports = ClassBrowser;