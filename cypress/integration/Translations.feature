Feature: Translation
  As a user of DHIS2
  I want to be able to translate the objects in the system

  Scenario: I want to see available filters and search input
    Then an Object selection is displayed
    And a Filter By selection is displayed
    And a Target locale selection is displayed
    And a Search input is displayed

  Scenario: I want to see Object items that could be translated
    Then a list of items is displayed
    And pagination is displayed
    And save action for open property should be displayed

  Scenario: I want to search object items by term
    Given I select the search input and enter the search term
    Then Displayed result items contain the search term

  Scenario Outline: I want to translate an object property
    Given I select the object type <object_type>
    And I select the target locale <locale>
    And I translate the <property> of <object_type> to <translation>
    And I save my translation
    Examples:
      | locale | object_type | property | translation |
      | fr     | category    | name     | Catégorie   |
