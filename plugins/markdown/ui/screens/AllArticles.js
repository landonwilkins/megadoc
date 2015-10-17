const React = require('react');
const HighlightedText = require('components/HighlightedText');
const Database = require('core/Database');

const { string } = React.PropTypes;

const AllArticles = React.createClass({
  propTypes: {
    routeName: string,
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    const articles = Database.for(this.props.routeName).getArticles();

    return (
      <div>
        {articles.map(this.renderArticle)}
      </div>
    );
  },

  renderArticle(article) {
    return (
      <div key={article.id} className="doc-content">
        <HighlightedText>{article.source}</HighlightedText>
      </div>
    );
  },

});

module.exports = AllArticles;