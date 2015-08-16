var React = require('react');
var Gravatar = require('components/Gravatar');
var { sortBy } = require('lodash');

var Superstars = React.createClass({
  render: function() {
    var people = sortBy(this.props.people, 'superStarIndex').reverse().slice(0, 4);
    var superStar = people.slice(0, 1)[0];

    return (
      <div>
        {this.renderPerson(superStar)}

        {people.slice(1).map(this.renderPerson)}
      </div>
    );
  },

  renderPerson(person) {
    console.log(person);

    return (
      <div className="superstars__superstar">
        <Gravatar
          email={person.email}
          title={person.name}
          size={person.isSuperstar ? "196" : "128"}
        />

        <span className="superstars__superstar-name">
          {person.name}
        </span>

        <span className="superstars__superstar-stats">
          {person.commitCount} committed <br />
          {person.reviewCount} reviewed
        </span>

      </div>
    );
  }
});

module.exports = Superstars;