const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const dhis2Page = require('../pages/dhis2.page.js');
const homePage = require('../pages/home.page');

const DEFAULT_WAIT_TIME = 5000;
const SEARCH_TERM = 'alt';

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

    // ************************************************************
    // Scenario: I want to see available filters and search input
    // ************************************************************
    Then(/^an Object selection is displayed$/, () => {
        browser.element('#select-object-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a Filter By selection is displayed$/, () => {
        browser.element('#select-filter-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a Target locale selection is displayed$/, () => {
        browser.element('#select-locale-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a Search input is displayed$/, () => {
        browser.element('#select-search-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    // **************************************************************
    // Scenario: I want to see Object items that could be translated
    // **************************************************************
    Then(/^a list of items is displayed$/, () => {
        browser.element('#translation-list-container').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^pagination is displayed$/, () => {
        browser.element('ul.data-table-pager--buttons').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('li.data-table-pager--page-info').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('li.data-table-pager--previous-page').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('li.data-table-pager--next-page').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^first object item of the list is open for translation$/, () => {
        const firstCardGrids = browser.elements('#translation-list-container div[class^=MuiPaperroot]').value[0]
            .elements('div[class^=MuiGridcontainer]').value;
        expect(firstCardGrids.length).to.equal(2);
    });

    Then(/^save action for open property should be displayed$/, () => {
        browser.element('#translation-list-container div[class^=MuiPaperroot] button').waitForVisible(DEFAULT_WAIT_TIME);
    });

    // **************************************************************
    // Scenario: I want to search object items by term
    // **************************************************************
    Then(/^I select the search input$/, () => {
        browser.element('#select-search-id').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#select-search-id').element('<input>').click();
    });

    Then(/^I write the search term$/, () => {
        browser.element('#select-search-id').element('<input>').setValue(SEARCH_TERM);
    });

    Then(/^I press Enter$/, () => {
        browser.keys('Enter');
        browser.pause(DEFAULT_WAIT_TIME);
    });

    Then(/^Displayed result items contain the search term$/, () => {
        browser.element('#translation-list-container').waitForVisible(DEFAULT_WAIT_TIME);
        const visibleResults = browser.elements('#translation-list-container div[class^=MuiPaperroot]').value;
        for (let item of visibleResults) {
            const itemName = item.elements('div[class^=MuiGridcontainer').value[0].getText();
            expect(itemName.trim().toLowerCase().includes(SEARCH_TERM)).to.equal(true);
        }
    });

    // **************************************************************
    // Scenario: I want to filter items
    // **************************************************************
    Then(/^I select the (.+) filter$/, (filter) => {
        this.selectedFilter = filter;
        browser.element('#select-filter-id').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#select-filter-id').element('div[role=button]').click();
        browser.element('div[role=document]').waitForVisible(DEFAULT_WAIT_TIME);
        const filterOptions = browser.elements('div[role=document] ul li').value;
        for (let option of filterOptions) {
            if (option.getAttribute('data-value') === filter) {
                option.click();
                break;
            }
        }
        browser.pause(DEFAULT_WAIT_TIME);
    });

    Then(/^I only see current results for selected filter$/, () => {
        if(browser.isVisible('#translation-list-container')) {
            const visibleResults = browser.elements('#translation-list-container div[class^=MuiPaperroot]').value;
            for (let item of visibleResults) {
                if(this.selectedFilter === 'TRANSLATED') {
                    const isTranslated = item.elements('div[class^=MuiGridcontainer').value[0].getCssProperty('color').parsed.hex === '#1c9d17';
                    expect(isTranslated).to.equal(true);
                } else if (this.selectedFilter === 'PARTIAL_TRANSLATED') {
                    const isPartialTranslated = item.elements('div[class^=MuiGridcontainer').value[0].getCssProperty('color').parsed.hex === '#ff9800';
                    expect(isPartialTranslated).to.equal(true);
                } else if (this.selectedFilter === 'UNTRANSLATED') {
                    const isUnTranslated = item.elements('div[class^=MuiGridcontainer').value[0].getCssProperty('color').parsed.hex === '#000000';
                    expect(isUnTranslated).to.equal(true);
                }
            }
        }
    });

    // **************************************************************
    // Scenario: I want to translate an object property
    // **************************************************************
    Then(/^I select the object type (.+)$/, (object) => {
        browser.element('#select-object-id').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#select-object-id').element('div[role=button]').click();
        browser.element('div[role=document]').waitForVisible(DEFAULT_WAIT_TIME);
        const objectOptions = browser.elements('div[role=document] ul li').value;
        for (let option of objectOptions) {
            if (option.getAttribute('data-value') === object) {
                option.click();
                break;
            }
        }
        browser.pause(DEFAULT_WAIT_TIME);
    });

    Then(/^I select the target locale (.+)$/, (locale) => {
        browser.element('#select-locale-id').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#select-locale-id').element('div[role=button]').click();
        browser.element('div[role=document]').waitForVisible(DEFAULT_WAIT_TIME);
        const locales = browser.elements('div[role=document] ul li').value;
        for (let selectLocale of locales) {
            if (selectLocale.getAttribute('data-value') === locale) {
                selectLocale.click();
                break;
            }
        }
        browser.pause(DEFAULT_WAIT_TIME);
    });

    Then(/^I translate the (.+) of (.+) to (.+)$/, (property, object, translation) => {
        const firstCardGrids = browser.elements('#translation-list-container div[class^=MuiPaperroot]').value[0]
            .elements('div[class^=MuiGridcontainer]').value;
        firstCardGrids[1].element('<input>').setValue(translation);
    });

    Then(/^I save my translation$/, () => {
        const save = browser.elements('#translation-list-container div[class^=MuiPaperroot]').value[0]
            .element('<button>');
        save.click();
    });

    Then(/^I should see the success alert$/, () => {
        browser.waitForVisible('#feedback-snackbar');
    });

    // **************************************************************
    // Scenario: Translate an object property with an existing translation for the same locale
    // **************************************************************
    Then(/^I see a translation for (.+) with an existing translation (.+) for (.+)$/, (object, translation, property) => {
        const selectedObject = browser.element('#select-object-id').element('<input>').getAttribute('value');
        const selectedPropertyTranslation = browser.elements('#translation-list-container div[class^=MuiPaperroot]')
            .element(`#${property}`).element('<input>').getAttribute('value');
        expect(selectedObject).to.equal(object);
        expect(selectedPropertyTranslation).to.equal(translation);
    });

    // **************************************************************
    // Scenario: Translate an object property with an existing translation for another locale
    // **************************************************************

});