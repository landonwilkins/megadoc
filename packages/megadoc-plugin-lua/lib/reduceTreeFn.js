module.exports = function reduceTreeFn(context, documents) {
  return [{
    type: 'SET_NAMESPACE_ATTRIBUTES',
    data: {
      title: context.options.title
    }
  }].concat(
    documents.filter(x => x.properties.receiver).map(function(document) {
      return {
        type: 'CHANGE_NODE_PARENT',
        data: {
          uid: document.uid,
          parentUid: documents.filter(x => x.id === document.properties.receiver).map(x => x.uid)[0],
        }
      }
    })
  );
};
