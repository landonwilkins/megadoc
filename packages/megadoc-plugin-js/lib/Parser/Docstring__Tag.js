var K = require('./constants');
var TypeInfo = require('./Docstring__TagTypeInfo');
var assert = require('assert');

var TypeAliases = {
  'returns': 'return'
};

/**
 * @param {Object} commentNode
 * @param {Object} options
 * @param {Object} options.customTags
 * @param {Boolean} [options.namedReturnTags=true]
 *
 * @param {String} filePath
 */
function Tag(commentNode, options, filePath) {
  var customTags = options.customTags;

  if (commentNode.errors && commentNode.errors.length) {
    throw new Error(commentNode.errors[0]);
  }

  /**
   * @property {String}
   *           The type of this tag. This is always present.
   */
  this.type = TypeAliases[commentNode.tag] || commentNode.tag;

  /**
   * @property {String}
   *           The raw text.
   */
  this.string = String(commentNode.description || '');

  /**
   * @property {String}
   *           Module namepath pointed to by @alias.
   */
  this.alias = null;

  /**
   * @property {String} visibility
   */
  this.visibility = null;

  /**
   * @property {String}
   *           Module namepath pointed to by @memberOf.
   */
  this.explicitReceiver = null;

  /**
   * @property {String}
   *           Name of the module that is lent to by the enclosing doc.
   *
   *           Available only for @lends tags.
   */
  this.lendReceiver = null;

  this.mixinTargets = [];

  /**
   * @property {String}
   *           Available on @property, @type, @param, and @live_example tags.
   */
  this.typeInfo = {
    /**
     * @property {String}
     */
    name: null,

    /**
     * @property {String}
     */
    description: null,

    /**
     * @property {Boolean}
     */
    isOptional: null,

    /**
     * @property {String}
     */
    defaultValue: null,

    /**
     * @property {TagTypeInfo} typeInfo.type
     */
    type: null
  };

  switch(this.type) {
    case 'property':
    case 'param':
    case 'return':
    case 'throws':
    case 'example':
    case 'interface':
      this.typeInfo = TypeInfo(commentNode);

      // fixup for return tags when we're not expecting them to be named
      if (this.type === 'return' && this.typeInfo.name && options.namedReturnTags === false) {
        this.typeInfo.description = this.typeInfo.name + ' ' + this.typeInfo.description;
        delete this.typeInfo.name;
      }

      break;

    case 'type':
      // console.assert(commentNode.types.length === 1,
      //   "Expected @type tag to contain only a single type, but it contained %d.",
      //   commentNode.types.length
      // );
      this.typeInfo = TypeInfo(commentNode);
      // this.string = this.string.replace(commentNode.string, '');

      break;

    // if it was marked @method, treat it as such (not stupid "property" type
    // on object modules)
    case 'method':
      this.typeInfo = TypeInfo(commentNode);
      this.typeInfo.type = { name: K.TYPE_FUNCTION };

      break;

    case 'protected':
      this.visibility = K.VISIBILITY_PROTECTED;
      break;

    case 'private':
      this.visibility = K.VISIBILITY_PRIVATE;
      break;

    case 'memberOf':
      this.explicitReceiver = commentNode.name;

      // @memberOf's "parent" property (which is the target class name) will be
      // present in the string so we remove it:
      this.string = this.string.replace(this.explicitReceiver, '');

      break;

    case 'module':
      if (commentNode.name.trim().length > 0) {
        this.typeInfo.name = commentNode.name.trim();
      }
      break;

    case 'namespace':
      if (commentNode.name.trim().length > 0) {
        this.typeInfo.name = commentNode.name.trim();
      }

      break;

    case 'name':
      this.typeInfo.name = commentNode.name;
      break;

    case 'alias':
      this.alias = commentNode.name;
      // this.alias = this.string.split('\n')[0].trim();

      // // same deal with @memberOf
      // this.string = this.string.replace(this.alias, '');

      break;

    case 'lends':
      this.lendReceiver = commentNode.name;
      break;

    case 'mixes':
      this.mixinTargets = [ commentNode.name ];
      break;

    case 'see':
      this.string = commentNode.name;
      break;
  }

  if (customTags && customTags.hasOwnProperty(this.type)) {
    this.useCustomTagDefinition(commentNode, customTags[this.type], filePath);
  }

  return this;
}

Tag.prototype.adjustString = function(newString) {
  this.string = newString;
};

Tag.prototype.toJSON = function() {
  return Object.keys(this).reduce(function(json, key) {
    if (this[key] !== null && typeof this[key] !== 'function') {
      json[key] = this[key];
    }

    return json;
  }.bind(this), {});
};

Tag.prototype.useCustomTagDefinition = function(commentNode, customTag, filePath) {
  var customAttributes = customTag.attributes || [];

  if (customTag.withTypeInfo) {
    this.typeInfo = TypeInfo(commentNode);
  }

  if (customTag.process instanceof Function) {
    customTag.process(createCustomTagAPI(this, customAttributes), filePath);
  }
};

function createCustomTagAPI(tag, attrWhitelist) {
  var api = tag.toJSON();

  api.setCustomAttribute = function(name, value) {
    assert(attrWhitelist.indexOf(name) > -1,
      "Unrecognized custom attribute '" + name + "'. Make sure you " +
      "you specify it in the @attributes array for the customTag."
    );

    tag[name] = value;
  };

  return api;
}

module.exports = Tag;

// function renamePrimitiveType(type) {
//   if (type === 'Function') {
//     return 'function';
//   }
//   else {
//     return type;
//   }
// }
