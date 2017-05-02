require('babel-register')({
    ignore: function (path) {
        if (/node_modules\/d2-ui/.test(path)) {
            return false;
        }

        if (/node_modules/.test(path)) {
            return true;
        }
        return false;
    }
});

/* istanbul ignore next */
global.chai = require('chai');
global.sinon = require('sinon');

// Chai plugins
global.chai.use(require('sinon-chai'));

global.expect = global.chai.expect;

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};
