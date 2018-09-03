const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const dhis2Page = require('../pages/dhis2.page.js');
const homePage = require('../pages/home.page');

defineSupportCode(({ Given, When, Then }) => {
    Given(/^that I am logged in to the Sierra Leone DHIS2$/, () => {
        dhis2Page.open();
        if (!dhis2Page.isLoggedIn()) {
            dhis2Page.submitLoginForm('admin', 'district');
        }
        expect(dhis2Page.isLoggedIn()).to.equal(true);
    });

    When(/^I open Translations page$/, () => {
        homePage.open();
    });

    When(/^I open the target locales list from the app$/, () => {
    });

    Then(/^I should see all available locales in the system.$/, () => {
    });

    When(/^I do not select the object type$/, () => {

    });

    Then(/^I should see the alert to select an object type.$/, () => {
    });

    Then(/^I should see a list of objects to translate.$/, () => {
    });

    When(/^I select the target locale (.+)$/, (locale) => {
    });

    When(/^I select the object type (.+)$/, (object) => {
    });

    When(/^I translate the (.+) of (.+) to (.+)$/, (property, object, translation) => {
    });

    When(/^I save my translation$/, () => {
    });

    Then(/^I should see the success alert.$/, () => {
    });

    When(/^I see a translation for (.+) with an existing translation to (.+) for (.+)$/, (object, translation, property) => {
    });

    Then(/^I should see a translation for (.+) with an existing translation to (.+) for (.+)$/, (object, translation, property) => {
    });
});