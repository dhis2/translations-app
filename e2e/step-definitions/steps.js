const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const homePage = require('../pages/home.page');

defineSupportCode(({ Given, When, Then }) => {
  Given(/^that I am logged in to the Sierra Leone DHIS2$/, () => {
    homePage.open();
    expect(homePage.title).to.equal('Translations');
  });

  Given(/^that I have the necessary permissions to access the Translations App$/, () => {
    expect(homePage.title).to.equal('Translations');
  });

  When(/^I open the target locales list from the app$/, () => {
    homePage.openTargetLocalesList();
  });

  Then(/^I should see all available locales in the system.$/, () => {
    // FIXME List was not defined yet
    homePage.areLocalesAvailable(['English', 'French']);
  });

  When(/^I do not select the object type$/, () => {

  });

  Then(/^I should see the alert to select an object type.$/, () => {
    homePage.isSelectObjectTypeAlertVisible();
  });

  Then(/^I should see a list of objects to translate.$/, () => {
    homePage.isTranslationsListVisible();
  });

  When(/^I select the target locale (.+)$/, (locale) => {
    homePage.selectTargetLocale(locale);
  });

  When(/^I select the object type (.+)$/, (object) => {
    homePage.selectObjectType(object);
  });

  When(/^I translate the (.+) of (.+) to (.+)$/, (property, object, translation) => {
    this.object = object;
    homePage.setInputValueFor(property, object, translation);
  });

  When(/^I save my translation$/, () => {
    homePage.clickSaveFor(this.object);
  });

  Then(/^I should see the success alert.$/, () => {
    homePage.isSuccessAlertVisible();
  });

  When(/^I see a translation for (.+) with an existing translation to (.+) for (.+)$/, (object, translation, property) => {
    this.object = object;
    let currentValue = homePage.getInputValueFor(property, object, translation);
    expect(currentValue).to.equal(translation);
  });

  Then(/^I should see a translation for (.+) with an existing translation to (.+) for (.+)$/, (object, translation, property) => {
    this.object = object;
    let currentValue = homePage.getInputValueFor(property, object, translation);
    expect(currentValue).to.equal(translation);
  });
});
