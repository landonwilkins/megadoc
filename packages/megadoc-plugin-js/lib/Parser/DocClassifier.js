var K = require('./constants');

function isModule(doc) {
  return doc.isModule();
}

function isEntity(doc) {
  return !doc.isModule();
}

function isMember(doc) {
  var ctx = doc.nodeInfo.ctx;

  return !doc.docstring.hasTag('static') && (
    ctx.scope === K.SCOPE_FACTORY_EXPORTS ||
    ctx.scope === K.SCOPE_INSTANCE ||
    ctx.scope === K.SCOPE_PROTOTYPE
  );
}

function isStaticMember(doc) {
  return (
    doc.nodeInfo.ctx.scope === K.SCOPE_UNSCOPED ||
    doc.docstring.hasTag('static')
  );
}

function isMethod(doc) {
  var ctx = doc.nodeInfo.ctx;

  return isOfType(ctx.type, K.TYPE_FUNCTION) && isMember(doc);
}

function isStaticMethod(doc) {
  return isOfType(doc.nodeInfo.ctx.type, K.TYPE_FUNCTION) && isStaticMember(doc);
}

exports.isModule = isModule;
exports.isEntity = isEntity;
exports.isMethod = isMethod;
exports.isStaticMethod = isStaticMethod;
exports.isMember = isMember;
exports.isStaticMember = isStaticMember;

function isOfType(type, expectedType) {
  return typeof type === 'string' ? type === expectedType : type.name === expectedType;
}