var catharsis = require('catharsis');
var K = require('./constants');
var CATHARSIS_OPTIONS = { jsdoc: true, useCache: false };

module.exports = function parseTypeString(typeString) {
  return reduceCatharsis(catharsis.parse(typeString, CATHARSIS_OPTIONS));
};

/**
 * @typedef {TagTypeInfo}
 * @property {String} name
 * @property {?Boolean} nullable
 * @property {?Boolean} optional
 * @property {?Boolean} repeatable
 * @property {?Array.<TagTypeInfo>} elements
 * @property {?Array.<TagTypeInfo>} params
 * @property {?TagTypeInfo} returnValue
 * @property {?TagTypeInfo} key
 * @property {?TagTypeInfo} value
 */
function reduceCatharsis(typeInfo) {
  var info = {};

  if (typeInfo.type === 'NameExpression') {
    info.name = typeInfo.name;

    if (typeInfo.nullable) {
      info.nullable = true;
    }
    else if (typeInfo.nullable === false) {
      info.nullable = false;
    }

    if (typeInfo.optional) {
      info.optional = true;
    }
    else if (typeInfo.optional === false) {
      info.optional = false;
    }

    if (typeInfo.repeatable) {
      info.repeatable = true;
    }
  }
  else if (typeInfo.type === 'TypeApplication') {
    info = reduceCatharsis(typeInfo.expression);

    if (typeInfo.applications) {
      info.elements = typeInfo.applications.map(reduceCatharsis);
    }
  }
  else if (typeInfo.type === 'TypeUnion') {
    info.name = K.TYPE_UNION;
    info.elements = typeInfo.elements.map(reduceCatharsis);
  }
  else if (typeInfo.type === 'FunctionType') {
    info.name = K.TYPE_FUNCTION;

    if (typeInfo.params && typeInfo.params.length) {
      info.params = typeInfo.params.map(reduceCatharsis);
    }

    if (typeInfo.result) {
      info.returnType = reduceCatharsis(typeInfo.result);
    }
  }
  else if (typeInfo.type === 'AllLiteral') {
    info.name = K.TYPE_ALL_LITERAL;
  }
  else if (typeInfo.type === 'UnknownLiteral') {
    info.name = K.TYPE_UNKNOWN_LITERAL;
  }
  else if (typeInfo.type === 'RecordType') {
    info.name = K.TYPE_OBJECT;
    info.elements = typeInfo.fields.map(reduceCatharsis);
  }
  else if (typeInfo.type === 'FieldType') {
    info.name = K.TYPE_OBJECT_PROPERTY;
    info.key = reduceCatharsis(typeInfo.key);
    info.value = reduceCatharsis(typeInfo.value);
  }

  return info;
}