var React = require('react');
var ColorSchemeSwitcher = require("components/ColorSchemeSwitcher");
var Checkbox = require("components/Checkbox");
var Storage = require('core/Storage');
var { CFG_SYNTAX_HIGHLIGHTING } = require('constants');

var Settings = React.createClass({
  render: function() {
    return (
      <div className="settings">
        <h1>Settings</h1>

        <p>
          <Checkbox
            onChange={this.toggleHighlighting}
            checked={this.isHighlightingEnabled()}
          >
            Enable syntax highlighting
          </Checkbox>
        </p>

        <fieldset>
          <legend><strong>Accessibility: Color Scheme</strong></legend>

          <p>Choose your preferred color palette for easier reading.</p>

          <ColorSchemeSwitcher />
        </fieldset>

        <div className="settings__controls">
          <button className="btn" onClick={this.reset}>Reset settings</button>
        </div>
      </div>
    );
  },

  isHighlightingEnabled() {
    return Storage.get(CFG_SYNTAX_HIGHLIGHTING);
  },

  toggleHighlighting() {
    Storage.set(CFG_SYNTAX_HIGHLIGHTING, !this.isHighlightingEnabled());
  },

  reset() {
    Storage.clear();
  }
});

module.exports = Settings;