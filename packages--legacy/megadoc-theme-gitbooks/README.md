# megadoc-theme-gitbooks

A theme plugin after [gitbooks.io](https://gitbooks.io).

A screenshot:

![a screenshot showing the theme](screenshots/lua_cliargs_netlify.png)

Or a demo, if you're lucky and it's still running: http://lua-cliargs.netlify.com/

## Usage

```bash
npm install --save megadoc-theme-gitbooks
```

And in your `megadoc.conf.js`:

```javascript
exports.plugins = [
  require('megadoc-theme-gitbooks')()
];

// you should probably turn on the collapsible sidebar setting:
exports.collapsibleSidebar = true;

// and restrict the sidebar resizing:
exports.resizableSidebar = false;
```

That's it!

