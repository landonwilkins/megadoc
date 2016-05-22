var assert = require('assert');
var TestUtils = require('../../TestUtils');
var K = require('../../constants');
var findWhere = require('lodash').findWhere;
var parseInline = TestUtils.parseInline;

describe('CJS::Parser - Function modules', function() {
  it('parses static methods', function() {
    var doc;
    var docs = parseInline(function() {;
      // /** @module */
      // var DragonHunter = function() {
      // };
      //
      // /**
      //  * Do something.
      //  */
      // DragonHunter.someFunction = function() {};
    });

    assert.equal(docs.length, 2);

    doc = findWhere(docs, { id: 'DragonHunter.someFunction' });

    assert.ok(doc);
    assert.equal(doc.typeInfo.name, K.TYPE_FUNCTION);
    assert.equal(doc.receiver, 'DragonHunter');
  });

  it('parses static properties', function() {
    var doc;
    var docs = parseInline(function() {;
      // /** @module */
      // var DragonHunter = function() {
      // };
      //
      // /**
      //  * Do something.
      //  */
      // DragonHunter.SOME_PROP = 'a';
    });

    assert.equal(docs.length, 2);

    doc = findWhere(docs, { id: 'DragonHunter.SOME_PROP' });

    assert.ok(doc);
    assert.equal(doc.typeInfo.name, K.TYPE_LITERAL);
    assert.equal(doc.receiver, 'DragonHunter');
  });

  it('works with an unrecognized context node', function() {
    var doc;
    var docs = parseInline(function() {;
      // /** @module */
      // var DragonHunter = function() {
      // };
      //
      // /**
      //  * Do something.
      //  */
      // DragonHunter.SOME_PROP = SOME_IDENTIFIER;
    });

    assert.equal(docs.length, 2);

    doc = findWhere(docs, { id: 'DragonHunter.SOME_PROP' });

    assert.ok(doc);
    assert.equal(doc.typeInfo.name, K.TYPE_UNKNOWN);
    assert.equal(doc.receiver, 'DragonHunter');
  });
});
