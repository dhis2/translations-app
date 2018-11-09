Feature: Translation
  As a user of DHIS2
  I want to be able to translate the objects in the system

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Translations page

  Scenario: I want to see available filters and search input
    Then an Object selection is displayed
    And a Filter By selection is displayed
    And a Target locale selection is displayed
    And a Search input is displayed

  Scenario: I want to see Object items that could be translated
    Then a list of items is displayed
    And pagination is displayed
    And first object item of the list is open for translation
    And save action for open property should be displayed

  Scenario: I want to search object items by term
    Then I select the search input
    And I write the search term
    And I press Enter
    And Displayed result items contain the search term

  Scenario Outline: I want to filter items
    Then I select the <filter> filter
    And I only see current results for selected filter
    Examples:
      | filter              |
      | TRANSLATED          |
      | PARTIAL_TRANSLATED  |
      | UN_TRANSLATED       |

  Scenario Outline: I want to translate an object property
    And I select the object type <object_type>
    And I select the target locale <locale>
    And I translate the <property> of <object_type> to <translation>
    And I save my translation
    Then I should see the success alert
    Examples:
      | locale | object_type | property | translation |
      | fr     | category    | name     | Catégorie   |

  Scenario Outline: Translate an object property with an existing translation for the same locale
    And I select the object type <object_type>
    And I select the target locale <locale>
    And I see a translation for <object_type> with an existing translation <translated_name> for <property>
    And I translate the <property> of <object_type> to <translated_name>
    And I save my translation
    Then I should see the success alert
    Examples:
      | locale | object_type | property | translated_name |
      | fr     | category    | name     | Catégorie       |

  Scenario Outline: Translate an object property with an existing translation for another locale
    And I select the object type <object_type>
    And I select the target locale <locale>
    And I see a translation for <object_type> with an existing translation <translated_name> for <property>
    And I select the target locale <new_locale>
    And I translate the <property> of <object_type> to <new_translated_name>
    And I save my translation
    Then I select the target locale <locale>
    And I see a translation for <object_type> with an existing translation <translated_name> for <property>
    And I select the target locale <new_locale>
    And I see a translation for <object_type> with an existing translation <new_translated_name> for <property>
    Examples:
      | locale | new_locale | object_type | property | translated_name | new_translated_name |
      | fr     | pt         | category    | name     | Catégorie       | Categoria           |