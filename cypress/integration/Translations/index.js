import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.visit('/')
    cy.get('#translation-list-container').should('be.visible')
})

// Scenario: I want to see available filters and search input

Then('an Object selection is displayed', () => {
    cy.get('#select-object-id').should('be.visible')
})

Then('a Filter By selection is displayed', () => {
    cy.get('#select-filter-id').should('be.visible')
})

Then('a Target locale selection is displayed', () => {
    cy.get('#select-locale-id').should('be.visible')
})

Then('a Search input is displayed', () => {
    cy.get('#select-search-id').should('be.visible')
})

// Scenario: I want to see Object items that could be translated

Then('a list of items is displayed', () => {
    cy.get('#translation-list-container').should('be.visible')
})

Then('pagination is displayed', () => {
    cy.getWithDataTest('{pagination}').should('be.visible')
})

Then('save action for open property should be displayed', () => {
    cy.getWithDataTest('{save-btn}').should('be.visible')
})

// Scenario: I want to search object items by term

const searchTerm = 'alt'

Given('I select the search input and enter the search term', () => {
    cy.get('#select-search-id').click().type(searchTerm).type('{enter}')
})

Then('Displayed result items contain the search term', () => {
    cy.get('#translation-list-container').should('be.visible')
    cy.getWithDataTest('{item}').should($items => {
        const texts = $items.get().map(elem => elem.textContent.toLowerCase())
        const allTextsContainSearchTerm = texts.every(t =>
            t.includes(searchTerm)
        )
        expect(allTextsContainSearchTerm).to.equal(true)
    })
})

// Scenario: I want to translate an object property

Then(/^I select the object type (.+)$/, object => {
    cy.get('#select-object-id div[role=button]').click()
    cy.get('div[role=document]').should('be.visible')
    Cypress.$('div[role=document] ul li').each((i, objectOption) => {
        if (objectOption.getAttribute('data-value') === object) {
            cy.wrap(objectOption).click()
        }
    })
    cy.get('#translation-list-container').should('be.visible')
})

Then(/^I select the target locale (.+)$/, locale => {
    cy.get('#select-locale-id div[role=button]').click({ force: true })
    cy.get('div[role=document]').should('be.visible')
    Cypress.$('div[role=document] ul li').each((i, selectLocale) => {
        if (selectLocale.getAttribute('data-value') === locale) {
            cy.wrap(selectLocale).click()
        }
    })
    cy.get('#translation-list-container').should('be.visible')
})

Then(
    /^I translate the (.+) of (.+) to (.+)$/,
    (property, object, translation) => {
        cy.get('#translation-list-container input')
            .first()
            .type(translation, { force: true })
    }
)

Then(/^I save my translation$/, () => {
    cy.getWithDataTest('{save-btn}').first().click({ force: true })
})
