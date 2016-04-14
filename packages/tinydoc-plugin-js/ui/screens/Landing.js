const React = require('react');
const scrollToTop = require('utils/scrollToTop');
const Document = require('components/Document');
const Outlet = require('components/Outlet');

const Landing = React.createClass({
  propTypes: {
    routeName: React.PropTypes.string,
  },

  componentDidMount() {
    scrollToTop();
  },

  render() {
    return (
      <Outlet
        name="CJS::Landing"
        props={{ url: `/${this.props.routeName}` }}
      >
        <Document>Hi! Is JavaScript time!</Document>
      </Outlet>
    );
  }
});

module.exports = Landing;