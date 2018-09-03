const Page = require('./page');

class HomePage extends Page {
    constructor() {
        super();
    }

    /**
     * ACTIONS
     */
    open() {
        super.open();
    }
}

module.exports = new HomePage();