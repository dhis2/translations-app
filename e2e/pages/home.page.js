const Page = require('./page');

class HomePage extends Page {
  constructor() {
    super();

    this.searchInputSelector = '#lst-ib';
    this.resultsSelector = '#resultStats';
  }

  /**
  * ELEMENTS
  */
  get searchInput() {
    return browser.element(this.searchInputSelector);
  }

  /**
  * ACTIONS
  */
  open() {
    super.open();
  }

  isResultStatsVisible() {
    return browser.waitForVisible(this.resultsSelector, 5000);
  }

  search(query) {
    browser.setValue(this.searchInputSelector, query);
    browser.keys('\uE007');
  }
}

module.exports = new HomePage();
