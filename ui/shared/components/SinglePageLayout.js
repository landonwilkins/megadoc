const React = require('react');
const Outlet = require('components/Outlet');
const TwoColumnLayout = require('components/TwoColumnLayout');
const config = require('config');
const Link = require('components/Link');
const Footer = require('components/Footer');

const { arrayOf, shape, string, node } = React.PropTypes;

const SinglePageLayout = React.createClass({
  propTypes: {
    routes: arrayOf(shape({ name: string })),
    children: node,
  },

  render() {
    // TODO: this is really weird
    const internal = this.isInternalRoute(this.props.routes);

    return (
      <div className="root root--with-single-page-layout">
        <TwoColumnLayout>
          <TwoColumnLayout.LeftColumn>
            <div className="single-page-layout__sidebar">
              <Outlet
                name="SinglePageLayout::Sidebar"
                props={this.props}
              />

              <hr />

              {config.allowUserSettings && (
                <Link to="settings">Settings</Link>
              )}
            </div>
          </TwoColumnLayout.LeftColumn>

          <TwoColumnLayout.RightColumn>
            <div className="single-page-layout__content">
              {internal && this.props.children}

              {!internal && (
                <Outlet
                  name="SinglePageLayout::ContentPanel"
                  props={this.props}
                />
              )}

              <Footer />
            </div>
          </TwoColumnLayout.RightColumn>
        </TwoColumnLayout>
      </div>
    );
  },

  isInternalRoute(routes) {
    return [ 'settings' ].indexOf(routes[routes.length-1].name) > -1;
  }
});

module.exports = SinglePageLayout;
