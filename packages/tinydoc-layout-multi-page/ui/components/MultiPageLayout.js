const React = require("react");
const Banner = require('./Banner');
const Footer = require('components/Footer');
const Outlet = require('components/Outlet');
const TwoColumnLayout = require('components/TwoColumnLayout');
const OutletManager = require('core/OutletManager');
const classSet = require('utils/classSet');
const RouteHandler = require('components/RouteHandler');

const { node } = React.PropTypes;

const MultiPageLayout = React.createClass({
  propTypes: {
    children: node
  },

  render() {
    const hasSidebarElements = OutletManager
      .getElements('MultiPageLayout::Sidebar')
      .filter(x => x.match(this.props))
      .length > 0
    ;

    const className = classSet({
      'root': true,
      'root--with-multi-page-layout': true,
      'root--with-two-column-layout': hasSidebarElements
    });

    return (
      <div className={className}>
        <Banner />

        <div className="root__screen">
          {hasSidebarElements ?
            this.renderTwoColumnLayout() :
            this.renderSingleColumnLayout()
          }
        </div>

      </div>
    );
  },

  renderTwoColumnLayout() {
    return (
      <TwoColumnLayout>
        <TwoColumnLayout.LeftColumn>
          <Outlet name="MultiPageLayout::Sidebar" props={this.props} />
        </TwoColumnLayout.LeftColumn>

        <TwoColumnLayout.RightColumn>
          <div>
            <Outlet name="MultiPageLayout::Content" props={this.props}>
              <RouteHandler />
            </Outlet>

            <Footer />
          </div>
        </TwoColumnLayout.RightColumn>
      </TwoColumnLayout>
    );
  },

  renderSingleColumnLayout() {
    return (
      <Outlet name="MultiPageLayout::Content" props={this.props}>
        <div>
          <RouteHandler />
          <Footer />
        </div>
      </Outlet>
    );
  },

  reload() {
    this.forceUpdate();
  },
});

module.exports = MultiPageLayout;