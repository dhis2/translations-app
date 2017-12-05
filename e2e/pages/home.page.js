const Page = require('./page');

class HomePage extends Page {
  constructor() {
    super();

    this.targetLocaleDropdownSelector = 'div[id*=\'TargetLocale\']';
    this.objectTypeDropdownSelector = 'div[id*=\'SelectanObjectType\']';
  }

  /**
  * ELEMENTS
  */
  get targetLocaleDrodown() {
    return browser.element(this.targetLocaleDropdownSelector);
  }

  get objectTypeDrodown() {
    return browser.element(this.objectTypeDropdownSelector);
  }

  /**
  * ACTIONS
  */
  open() {
    super.open();
  }

  openTargetLocalesList() {
    browser.waitForExist(this.targetLocaleDropdownSelector, 5000);
    this.targetLocaleDrodown.click();
  }

  areLocalesAvailable(locales) {
    for (let locale of locales) {
      browser.element('div[data-reactroot]:not(.app-wrapper)').waitForVisible('div=' + locale, 5000);
    }
  }

  selectTargetLocale(locale) {
    this.openTargetLocalesList();
    browser.element('div[data-reactroot]:not(.app-wrapper)').waitForVisible('div=' + locale, 5000);
    browser.element('div[data-reactroot]:not(.app-wrapper)').click('div=' + locale);
    // FIXME it would be better to use waitFor... but not working. It seems to exist a delay
    browser.pause(1000);
  }

  isSelectObjectTypeAlertVisible() {
    return browser.waitForVisible('span=Select an Object Type', 5000);
  }

  openObjectTypesList() {
    browser.waitForExist(this.objectTypeDropdownSelector, 5000);
    this.objectTypeDrodown.click();
  }

  selectObjectType(objectType) {
    this.openObjectTypesList();
    browser.element('div[data-reactroot]:not(.app-wrapper)').waitForVisible('div=' + objectType, 5000);
    browser.element('div[data-reactroot]:not(.app-wrapper)').click('div=' + objectType);
    // FIXME it would be better to use waitFor... but not working. It seems to exist a delay
    browser.pause(1000);
  }

  isTranslationsListVisible() {
    return browser.waitForVisible('.translations > div > div', 1000);
  }

  isSuccessAlertVisible() {
    return browser.waitForVisible('span=Saved', 1000);
  }

  setInputValueForFirstPropertyOfFirstProject(value) {
    browser.waitForExist('.translations input:first-of-type', 5000);
    browser.clearElement('.translations input:first-of-type')
    browser.element('.translations input:first-of-type').setValue(value);
  }

  clickSaveForFirstObject() {
    browser.element('.translations button:first-of-type').click();
  }
}

module.exports = new HomePage();
