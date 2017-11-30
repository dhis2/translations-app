const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const homePage = require('../pages/home.page');

defineSupportCode(({ Given, When, Then }) => {
  Given(/^I am on homepage$/, () => {
    homePage.open();
  });

  When(/^I try to search for "([^"]*)?"$/, (query) => {
    homePage.search(query);
  });

  Then(/^I should see the search results$/, () => {
    expect(homePage.isResultStatsVisible()).to.be.true;
  });
});
