const React = require('react');
const LinkOutlet = require('./LinkOutlet');
const SidebarHeader = require('components/SidebarHeader');

const SidebarHeaderLinkOutlet = React.createClass({
  propTypes: {
    $outletOptions: React.PropTypes.object.isRequired,
  },

  render() {
    const { $outletOptions } = this.props

    return (
      <SidebarHeader>
        <LinkOutlet $outletOptions={Object.assign({
          className: "sidebar-link class-browser__entry-link"
        }, $outletOptions)} />
      </SidebarHeader>
    )
  },
});

module.exports = SidebarHeaderLinkOutlet