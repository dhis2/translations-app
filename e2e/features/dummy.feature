Feature: DUMMY FEATURE
    Accessing Google

    Scenario: Access Google Page
        Given I am on homepage
        When I try to search for "things"
        Then I should see the search results
